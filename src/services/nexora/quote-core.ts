import { createHash, randomUUID } from "node:crypto";
import {
  budgetOptions,
  projectTypes,
  quoteSchema,
} from "@/domain/nexora-quote";
import type {
  QuoteInput,
  QuoteMode,
  QuoteReply,
  QuoteEmailPreview,
  QuoteFieldErrors,
} from "@/domain/nexora-quote";

export interface QuoteReceipt {
  fingerprint: string;
  createdAt: number;
  expiresAt: number;
  internalId?: string;
  confirmationId?: string;
}

export interface QuoteStore {
  get(id: string): Promise<QuoteReceipt | null>;
  create(id: string, receipt: QuoteReceipt): Promise<boolean>;
  save(id: string, receipt: QuoteReceipt): Promise<void>;
  lock(id: string, owner: string): Promise<boolean>;
  unlock(id: string, owner: string): Promise<void>;
}

export interface QuoteDependencies {
  mode: QuoteMode;
  origins: string[];
  store?: QuoteStore;
  verifyChallenge?: (token: string, hostname: string) => Promise<boolean>;
  limit?: (
    kind: "ip" | "email",
    identifier: string,
  ) => Promise<{ success: boolean; reset: number }>;
  send?: (
    kind: "internal" | "confirmation",
    input: QuoteInput,
    preview: QuoteEmailPreview,
  ) => Promise<string>;
  now?: () => number;
  clientIp?: string;
}

export function buildQuoteEmails(input: QuoteInput) {
  const projectType = projectTypes.find(
    (item) => item.value === input.projectType,
  )!.label;
  const budget = budgetOptions.find(
    (item) => item.value === input.budget,
  )!.label;
  return {
    internal: {
      subject: "Nueva consulta de presupuesto | Nexora",
      text: [
        `Solicitud: ${input.requestId}`,
        `Nombre: ${input.name}`,
        `Email: ${input.email}`,
        `Empresa: ${input.company || "No indicada"}`,
        `Proyecto: ${projectType}`,
        `Presupuesto: ${budget}`,
        `Inicio: ${input.startTime || "A conversar"}`,
        "",
        input.description || "Sin descripción adicional.",
        "",
        "Consentimiento: aceptado para responder esta consulta y enviar su confirmación.",
        "Versión del consentimiento: nexora-2026-10.",
      ].join("\n"),
    },
    confirmation: {
      subject: "Recibimos tu consulta | Nexora Software Studio",
      text: [
        "Hola,",
        "",
        "Recibimos tu consulta en Nexora Software Studio.",
        "Vamos a revisar la información y responderte para conversar sobre los próximos pasos.",
        "",
        `Referencia: ${input.requestId}`,
        "",
        "Enrique Manterola",
        "Nexora Software Studio",
        "",
        "Este correo confirma una consulta. No te suscribe a comunicaciones comerciales.",
      ].join("\n"),
    },
  };
}

function fingerprint(input: QuoteInput) {
  const content = {
    projectType: input.projectType,
    budget: input.budget,
    description: input.description,
    name: input.name,
    email: input.email,
    company: input.company,
    startTime: input.startTime,
    consent: input.consent,
  };
  return createHash("sha256").update(JSON.stringify(content)).digest("hex");
}

function response(
  body: QuoteReply,
  status = 200,
  headers: Record<string, string> = {},
) {
  return Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store", ...headers },
  });
}

export async function handleQuote(
  request: Request,
  dependencies: QuoteDependencies,
): Promise<Response> {
  const { mode } = dependencies;
  const fail = (message: string, status: number, errors?: QuoteFieldErrors) =>
    response({ mode, status: "error", message, errors }, status);
  const origin = request.headers.get("origin");
  if (!origin || !dependencies.origins.includes(origin))
    return fail("El origen de la solicitud no está permitido.", 403);
  if (!request.headers.get("content-type")?.startsWith("application/json"))
    return fail("La solicitud debe enviarse como JSON.", 415);
  if (Number(request.headers.get("content-length")) > 16384)
    return fail("La solicitud es demasiado grande.", 413);
  let raw: unknown;
  try {
    const text = await request.text();
    if (Buffer.byteLength(text, "utf8") > 16384)
      return fail("La solicitud es demasiado grande.", 413);
    raw = JSON.parse(text);
  } catch {
    return fail("No pudimos leer la solicitud.", 400);
  }
  const result = quoteSchema.safeParse(raw);
  if (!result.success) {
    const errors: QuoteFieldErrors = {};
    for (const issue of result.error.issues) {
      const key = issue.path[0] as keyof QuoteFieldErrors;
      if (key && !errors[key]) errors[key] = issue.message;
    }
    return fail("Revisá los campos indicados.", 400, errors);
  }
  const input = result.data;
  if (input.website) return fail("No pudimos validar la solicitud.", 400);
  const previews = buildQuoteEmails(input);
  if (mode === "test")
    return response({
      mode,
      status: "test",
      message: "Modo de prueba: no se enviaron correos",
      requestId: input.requestId,
      previews,
    });
  if (
    mode !== "live" ||
    !dependencies.store ||
    !dependencies.limit ||
    !dependencies.verifyChallenge ||
    !dependencies.send
  )
    return fail("Las solicitudes no están disponibles en este momento.", 503);

  const { store, limit, verifyChallenge, send } = dependencies;
  const now = dependencies.now || Date.now;
  const digest = fingerprint(input);
  const owner = randomUUID();
  let locked = false;
  let received = false;
  try {
    const ip = dependencies.clientIp || "local";
    const ipLimit = await limit("ip", ip);
    if (!ipLimit.success)
      return response(
        {
          mode,
          status: "error",
          message: "Alcanzaste el límite de consultas. Esperá unos minutos.",
        },
        429,
        {
          "Retry-After": String(
            Math.max(1, Math.ceil((ipLimit.reset - now()) / 1000)),
          ),
        },
      );
    let receipt = await store.get(input.requestId);
    if (receipt && receipt.fingerprint !== digest)
      return fail("La consulta cambió. Iniciá un nuevo envío.", 409);
    if (receipt?.confirmationId)
      return response({
        mode,
        status: "complete",
        message:
          "Nexora recibió tu solicitud y su confirmación fue aceptada por el servicio de correo.",
        requestId: input.requestId,
      });
    if (
      !input.turnstileToken ||
      !(await verifyChallenge(input.turnstileToken, new URL(origin).hostname))
    )
      return fail(
        "La verificación venció o no es válida. Volvé a intentarlo.",
        400,
        { turnstileToken: "Completá la verificación nuevamente." },
      );
    locked = await store.lock(input.requestId, owner);
    if (!locked)
      return fail(
        "Esta solicitud ya se está procesando. Esperá un momento.",
        409,
      );
    receipt = await store.get(input.requestId);
    if (receipt && receipt.fingerprint !== digest)
      return fail("La consulta cambió. Iniciá un nuevo envío.", 409);
    if (receipt?.confirmationId)
      return response({
        mode,
        status: "complete",
        message: "Tu solicitud ya fue recibida y confirmada.",
        requestId: input.requestId,
      });
    if (!receipt) {
      const emailLimit = await limit("email", input.email.toLowerCase());
      if (!emailLimit.success)
        return response(
          {
            mode,
            status: "error",
            message:
              "Este email alcanzó el límite de consultas. Intentá más tarde.",
          },
          429,
          {
            "Retry-After": String(
              Math.max(1, Math.ceil((emailLimit.reset - now()) / 1000)),
            ),
          },
        );
      receipt = {
        fingerprint: digest,
        createdAt: now(),
        expiresAt: now() + 23 * 3600_000,
      };
      if (!(await store.create(input.requestId, receipt)))
        return fail("Esta solicitud ya se está procesando.", 409);
    }
    if (receipt.expiresAt <= now())
      return fail(
        "El plazo de reintento venció. Contactanos indicando la referencia de la consulta.",
        409,
      );
    received = !!receipt.internalId;
    if (!receipt.internalId) {
      receipt.internalId = await send("internal", input, previews.internal);
      received = true;
      await store.save(input.requestId, receipt);
    }
    try {
      receipt.confirmationId = await send(
        "confirmation",
        input,
        previews.confirmation,
      );
      await store.save(input.requestId, receipt);
    } catch {
      return response(
        {
          mode,
          status: "partial",
          message:
            "Nexora recibió tu solicitud. La confirmación por email quedó pendiente; podés reintentar solamente esa confirmación.",
          requestId: input.requestId,
        },
        202,
      );
    }
    return response({
      mode,
      status: "complete",
      message:
        "Nexora recibió tu solicitud y su confirmación fue aceptada por el servicio de correo.",
      requestId: input.requestId,
    });
  } catch {
    if (received)
      return response(
        {
          mode,
          status: "partial",
          message:
            "Nexora recibió tu solicitud. No pudimos completar la confirmación por email. Conservá esta referencia para reintentar.",
          requestId: input.requestId,
        },
        202,
      );
    return fail(
      "No pudimos completar el envío. Tus datos siguen en el formulario para reintentar.",
      503,
    );
  } finally {
    if (locked)
      await store.unlock(input.requestId, owner).catch(() => undefined);
  }
}
