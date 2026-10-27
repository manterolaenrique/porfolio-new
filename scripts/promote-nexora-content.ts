import { getCliClient } from "sanity/cli";
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { normalizeWhatsappNumber } from "../src/domain/nexora-whatsapp";

type Doc = Record<string, unknown> & {
  _id: string;
  _type: string;
  _rev?: string;
};
type Ref = { _type: "reference"; _ref: string };
const projectId = "qw8437rq";
const contentTypes = ["nexoraSettings", "nexoraService", "nexoraProject"];
const folder = path.resolve(".cache/nexora-release");

async function main() {
  const apply = process.argv.includes("--apply");
  const base = getCliClient({ apiVersion: "2025-01-01" });
  if (base.config().projectId !== projectId || !base.config().token)
    throw new Error("Proyecto o sesión CLI incorrectos");
  const source = base.withConfig({
    dataset: "development",
    useCdn: false,
    perspective: "raw",
  });
  const target = base.withConfig({
    dataset: "production",
    useCdn: false,
    perspective: "raw",
  });
  const docs = await source.fetch<Doc[]>(
    '*[_type in $types && !(_id in path("drafts.**")) && !(_id in path("versions.**"))]',
    { types: contentTypes },
  );
  const sourceContact = await source.getDocument<Doc>("contactInfo");
  const targetContact = await target.getDocument<Doc>("contactInfo");
  const phone = sourceContact?.whatsappNumber;
  if (
    typeof phone !== "string" ||
    !normalizeWhatsappNumber(phone) ||
    !targetContact?._rev
  )
    throw new Error("Falta contacto publicado o WhatsApp válido");
  if (
    targetContact.whatsappNumber &&
    normalizeWhatsappNumber(String(targetContact.whatsappNumber)) !==
      normalizeWhatsappNumber(phone)
  )
    throw new Error(
      "El WhatsApp de producción tiene otro valor; se conserva y debe revisarse antes de promover",
    );
  if (
    docs.filter((doc) => doc._type === "nexoraSettings").length !== 1 ||
    !docs.some((doc) => doc._type === "nexoraProject")
  )
    throw new Error("Contenido comercial incompleto");

  const ids = new Set(docs.map((doc) => doc._id));
  const existing = await target.getDocuments<Doc>([...ids]);
  const technicalSources: Doc[] = [];
  const technicalTargets: Doc[] = [];
  const referenceMap = new Map<string, string>();
  for (const doc of docs) {
    const reference = doc.technicalProject as Ref | undefined;
    if (!reference?._ref) continue;
    const original = await source.getDocument<Doc>(reference._ref);
    if (!original) throw new Error("Referencia técnica DEV inexistente");
    const slug = (original.slug as { current?: string } | undefined)?.current;
    const found = await target.fetch<Doc | null>(
      '*[_type == "project" && (_id == $id || slug.current == $slug) && !(_id in path("drafts.**"))][0]',
      { id: original._id, slug: slug || "" },
    );
    if (!found?._rev)
      throw new Error(
        "No existe el proyecto técnico correspondiente en producción",
      );
    referenceMap.set(original._id, found._id);
    if (!technicalSources.some((item) => item._id === original._id)) {
      technicalSources.push(original);
      technicalTargets.push(found);
    }
  }
  const preview = (doc: Doc) =>
    (doc.devicePreviews as { mobile?: { asset?: Ref } } | undefined)?.mobile;
  const mobileToAdd = technicalSources.filter(
    (doc, i) =>
      preview(doc)?.asset?._ref && !preview(technicalTargets[i])?.asset?._ref,
  );
  console.log(
    JSON.stringify(
      {
        mode: apply ? "APPLY" : "DRY_RUN",
        projectId,
        source: "development",
        target: "production",
        commercialDocuments: docs.length,
        newDocuments: existing.filter((doc) => !doc).length,
        linkedProjects: technicalTargets.length,
        mobilePreviewsToAdd: mobileToAdd.length,
        setWhatsapp: !targetContact.whatsappNumber,
      },
      null,
      2,
    ),
  );
  if (!apply) return;

  mkdirSync(folder, { recursive: true });
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  writeFileSync(
    path.join(folder, `production-targets-before-${timestamp}.json`),
    JSON.stringify(
      { targetContact, technicalTargets, commercialDocuments: existing },
      null,
      2,
    ),
  );
  const assetMap = new Map<string, string>();
  async function transferAsset(id: string) {
    if (assetMap.has(id)) return assetMap.get(id)!;
    if (await target.getDocument(id)) {
      assetMap.set(id, id);
      return id;
    }
    const asset = await source.getDocument<{
      url: string;
      originalFilename?: string;
      mimeType?: string;
    }>(id);
    if (!asset?.url) throw new Error("Asset de origen inexistente");
    const response = await fetch(asset.url, {
      signal: AbortSignal.timeout(30000),
    });
    if (!response.ok)
      throw new Error("No se pudo recuperar un recurso de origen");
    const result = await target.assets.upload(
      id.startsWith("image-") ? "image" : "file",
      Buffer.from(await response.arrayBuffer()),
      { filename: asset.originalFilename, contentType: asset.mimeType },
    );
    assetMap.set(id, result._id);
    return result._id;
  }
  async function resolve(value: unknown): Promise<unknown> {
    if (Array.isArray(value)) return Promise.all(value.map(resolve));
    if (!value || typeof value !== "object") return value;
    const object = value as Record<string, unknown>;
    if (object._type === "reference" && typeof object._ref === "string") {
      if (/^(image|file)-/.test(object._ref))
        return { ...object, _ref: await transferAsset(object._ref) };
      if (referenceMap.has(object._ref))
        return { ...object, _ref: referenceMap.get(object._ref) };
      if (!ids.has(object._ref) && !(await target.getDocument(object._ref)))
        throw new Error("Referencia de destino no resuelta");
    }
    return Object.fromEntries(
      await Promise.all(
        Object.entries(object).map(async ([key, item]) => [
          key,
          await resolve(item),
        ]),
      ),
    );
  }
  const transaction = target.transaction();
  for (const original of docs) {
    const document = Object.fromEntries(
      Object.entries(original).filter(
        ([key]) =>
          ![
            "_rev",
            "_createdAt",
            "_updatedAt",
            "_originalId",
            "_system",
          ].includes(key),
      ),
    );
    transaction.createIfNotExists((await resolve(document)) as Doc);
  }
  for (let i = 0; i < technicalSources.length; i++) {
    const mobile = preview(technicalSources[i]);
    if (!mobile?.asset?._ref || preview(technicalTargets[i])?.asset?._ref)
      continue;
    const resolved = await resolve(mobile);
    transaction.patch(technicalTargets[i]._id, (patch) =>
      patch
        .ifRevisionId(technicalTargets[i]._rev!)
        .setIfMissing({ devicePreviews: {} })
        .setIfMissing({ "devicePreviews.mobile": resolved }),
    );
  }
  if (!targetContact.whatsappNumber)
    transaction.patch("contactInfo", (patch) =>
      patch
        .ifRevisionId(targetContact._rev!)
        .setIfMissing({ whatsappNumber: phone }),
    );
  await transaction.commit({ visibility: "sync" });
  const result = {
    appliedAt: new Date().toISOString(),
    projectId,
    source: "development",
    target: "production",
    commercialDocumentIds: [...ids],
    transferredAssets: [...assetMap.values()],
    technicalProjectIds: technicalTargets.map((doc) => doc._id),
    whatsappConfigured: true,
  };
  writeFileSync(
    path.join(folder, "content-promotion.json"),
    JSON.stringify(result, null, 2),
  );
  console.log(
    "Contenido Nexora promovido. Documentos existentes conservados; solo se añadieron capturas móviles faltantes y WhatsApp.",
  );
}
main().catch((error) => {
  console.error(
    "Promoción de contenido detenida:",
    String(error?.message || "Error").slice(0, 300),
  );
  process.exitCode = 1;
});
