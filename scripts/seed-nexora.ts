import { getCliClient } from "sanity/cli";
import { existsSync, createReadStream } from "node:fs";
import path from "node:path";
import {
  defaultServices,
  defaultSettings,
  developmentProjects,
} from "../src/services/nexora/defaults";

async function main() {
  if (process.env.NEXT_PUBLIC_SANITY_DATASET !== "development")
    throw new Error("Seed restricted to development");
  const client = getCliClient({ apiVersion: "2025-01-01" }).withConfig({
    dataset: "development",
    useCdn: false,
  });
  if (!client.config().token)
    throw new Error("Use sanity exec --with-user-token");
  const technical = await client.fetch<Array<{ _id: string; slug: string }>>(
    '*[_type == "project"]{_id,"slug":slug.current}',
  );
  const transaction = client.transaction();
  transaction.createIfNotExists({
    _id: "nexoraSettings",
    _type: "nexoraSettings",
    ...defaultSettings,
  });
  defaultServices.forEach((service, order) => {
    const { id, slug, ...fields } = service;
    transaction.createIfNotExists({
      _id: `nexora-service-${id}`,
      _type: "nexoraService",
      ...fields,
      slug: { _type: "slug", current: slug },
      order,
      isActive: true,
    });
  });
  developmentProjects.forEach((project, order) => {
    const source = technical.find((item) => item.slug === project.slug);
    if (!source) return;
    const {
      id: _id,
      image: _image,
      gallery: _gallery,
      technologies: _technologies,
      demoUrl: _demoUrl,
      codeUrl: _codeUrl,
      slug,
      ...commercial
    } = project;
    transaction.createIfNotExists({
      _id: `nexora-project-${slug}`,
      _type: "nexoraProject",
      ...commercial,
      slug: { _type: "slug", current: slug },
      technicalProject: { _type: "reference", _ref: source._id },
      order,
      isActive: true,
    });
  });
  await transaction.commit();
  for (const project of developmentProjects) {
    const source = technical.find((item) => item.slug === project.slug);
    const file = path.resolve(".cache/nexora/mobile", `${project.slug}.png`);
    if (!source || !existsSync(file)) continue;
    const existing = await client.fetch<string | null>(
      "coalesce(*[_id == $id][0].devicePreviews.mobile.asset._ref, null)",
      { id: source._id },
    );
    if (existing) continue;
    const asset = await client.assets.upload("image", createReadStream(file), {
      filename: `${project.slug}-mobile.png`,
    });
    await client
      .patch(source._id)
      .setIfMissing({ devicePreviews: {} })
      .set({
        "devicePreviews.mobile": {
          _type: "image",
          asset: { _type: "reference", _ref: asset._id },
        },
      })
      .commit();
  }
  const count = await client.fetch<number>(
    'count(*[_type == "nexoraProject"])',
  );
  console.log(
    "Destino verificado:",
    client.config().projectId,
    client.config().dataset,
    "proyectos comerciales:",
    count,
  );
  console.log(
    "Documentos Nexora creados si faltaban, solo en development. Imagenes y datos tecnicos vinculados por referencia.",
  );
}
main().catch((error) => {
  console.error("No se pudo preparar Nexora en development.", {
    statusCode: error?.statusCode,
    message: String(error?.message || "Error desconocido")
      .replace(/(?:sk|sanity)[A-Za-z0-9_-]{20,}/g, "[redacted]")
      .slice(0, 500),
  });
  process.exitCode = 1;
});
