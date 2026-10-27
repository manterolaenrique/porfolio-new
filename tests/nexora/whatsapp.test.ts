import { test } from "node:test";
import assert from "node:assert/strict";
import {
  buildWhatsappMessage,
  buildWhatsappUrl,
  normalizeWhatsappNumber,
  whatsappQuoteSchema,
} from "../../src/domain/nexora-whatsapp";
import { evaluate, parse } from "groq-js";
import { NEXORA_QUERY } from "../../src/services/nexora/query";

const quote = {
  projectType: "saas",
  budget: "defined",
  description: "Gestión de turnos & cobros + informes\nEn español: áéíóú 😊",
  name: "Ana Pérez",
  email: "",
  company: "Mi empresa",
  startTime: "El próximo mes",
  consent: true,
};
test("WhatsApp message contains chosen labels and optional details without requiring email or an amount", () => {
  const parsed = whatsappQuoteSchema.parse(quote);
  const text = buildWhatsappMessage(parsed);
  assert.match(text, /Tipo de proyecto: SaaS/);
  assert.match(text, /Presupuesto: Tengo un presupuesto/);
  assert.ok(text.includes(quote.description));
  assert.ok(text.includes("Nombre: Ana Pérez"));
  assert.ok(text.includes("Empresa: Mi empresa"));
  assert.ok(text.includes("Plazo de inicio: El próximo mes"));
  assert.ok(!text.includes("Email:"));
  assert.ok(!text.includes("undefined"));
});
test("message URL safely preserves accents, newlines, symbols and the full description", () => {
  const message = buildWhatsappMessage(
    whatsappQuoteSchema.parse({
      ...quote,
      description: "á&?+#\n".repeat(200),
      email: "ana@example.com",
    }),
  );
  const url = new URL(buildWhatsappUrl("+1 (202) 555-0123", message)!);
  assert.equal(url.origin, "https://wa.me");
  assert.equal(url.pathname, "/12025550123");
  assert.equal(url.searchParams.get("text"), message);
  assert.equal([...url.searchParams].length, 1);
});
test("rejects invalid destination, invalid nonempty email, missing consent and overlong description", () => {
  for (const phone of [
    undefined,
    "",
    "000000000",
    "123",
    "https://evil.example",
    "1".repeat(16),
    "123<script>456789",
  ])
    assert.equal(normalizeWhatsappNumber(phone), null);
  assert.equal(buildWhatsappUrl(undefined), null);
  assert.equal(
    whatsappQuoteSchema.safeParse({ ...quote, consent: false }).success,
    false,
  );
  assert.equal(
    whatsappQuoteSchema.safeParse({ ...quote, email: "invalid" }).success,
    false,
  );
  assert.equal(
    whatsappQuoteSchema.safeParse({ ...quote, description: "x".repeat(2001) })
      .success,
    false,
  );
  assert.equal(
    whatsappQuoteSchema.safeParse({
      ...quote,
      description: "x".repeat(2000),
      email: "   ",
    }).success,
    true,
  );
});
test("optional empty answers are omitted from the prepared message", () => {
  const text = buildWhatsappMessage(
    whatsappQuoteSchema.parse({
      ...quote,
      company: "",
      startTime: "",
      description: "",
    }),
  );
  assert.ok(!text.includes("Empresa:"));
  assert.ok(!text.includes("Plazo de inicio:"));
  assert.ok(!text.includes("Mi idea:"));
});
test("Nexora reads WhatsApp from the canonical portfolio contact without copying it into Nexora settings", async () => {
  const documents = [
    { _id: "nexoraSettings", _type: "nexoraSettings" },
    {
      _id: "contactInfo",
      _type: "contactInfo",
      whatsappNumber: "+1 202 555 0123",
    },
  ];
  const result = await (
    await evaluate(parse(NEXORA_QUERY), { dataset: documents })
  ).get();
  assert.equal(result.settings.whatsappNumber, "+1 202 555 0123");
});
