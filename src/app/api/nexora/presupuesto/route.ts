import {
  quoteConfiguration,
  quoteDependencies,
} from "@/services/nexora/quote-adapters";
import { handleQuote } from "@/services/nexora/quote-core";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function GET() {
  if (process.env.NEXORA_ENABLE_EMAIL_QUOTES !== "true")
    return Response.json(
      {
        channel: "whatsapp",
        message:
          "Las consultas se preparan en el formulario y se envían por WhatsApp.",
      },
      { status: 410, headers: { "Cache-Control": "no-store" } },
    );
  const { mode, siteKey } = quoteConfiguration();
  return Response.json(
    { mode, siteKey },
    { headers: { "Cache-Control": "no-store" } },
  );
}

export async function POST(request: Request) {
  if (process.env.NEXORA_ENABLE_EMAIL_QUOTES !== "true")
    return Response.json(
      {
        channel: "whatsapp",
        message:
          "El envío por correo está deshabilitado. Usá el formulario para preparar tu mensaje de WhatsApp.",
      },
      { status: 410, headers: { "Cache-Control": "no-store" } },
    );
  return handleQuote(request, quoteDependencies(request));
}
