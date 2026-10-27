import { z } from "zod";
import {
  budgetOptions,
  projectTypes,
  quoteContactSchema,
  quoteStepOneSchema,
} from "./nexora-quote";

export const whatsappContactSchema = quoteContactSchema.extend({
  email: z
    .string()
    .trim()
    .max(254)
    .refine(
      (value) => !value || z.string().email().safeParse(value).success,
      "Ingresá un email válido o dejá el campo vacío.",
    )
    .default(""),
});
export const whatsappQuoteSchema = quoteStepOneSchema.merge(
  whatsappContactSchema,
);
export type WhatsappQuote = z.infer<typeof whatsappQuoteSchema>;

export function normalizeWhatsappNumber(
  value: string | undefined,
): string | null {
  if (!value?.trim() || !/^\+?[\d\s().-]+$/.test(value.trim())) return null;
  const digits = value.replace(/\D/g, "");
  return /^[1-9]\d{6,14}$/.test(digits) ? digits : null;
}

export const whatsappGreeting =
  "Hola Enrique, vengo desde Nexora y me gustaría conversar sobre un proyecto.";

export function buildWhatsappMessage(input: WhatsappQuote): string {
  const project = projectTypes.find(
    (item) => item.value === input.projectType,
  )!.label;
  const budget = budgetOptions.find(
    (item) => item.value === input.budget,
  )!.label;
  return [
    whatsappGreeting,
    "",
    `Tipo de proyecto: ${project}`,
    `Presupuesto: ${budget}`,
    ...(input.description.trim()
      ? ["", "Mi idea:", input.description.trim()]
      : []),
    "",
    `Nombre: ${input.name.trim()}`,
    ...(input.company.trim() ? [`Empresa: ${input.company.trim()}`] : []),
    ...(input.email.trim() ? [`Email: ${input.email.trim()}`] : []),
    ...(input.startTime.trim()
      ? [`Plazo de inicio: ${input.startTime.trim()}`]
      : []),
  ].join("\n");
}

export function buildWhatsappUrl(
  number: string | undefined,
  message = whatsappGreeting,
): string | null {
  const normalized = normalizeWhatsappNumber(number);
  return normalized
    ? `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`
    : null;
}
