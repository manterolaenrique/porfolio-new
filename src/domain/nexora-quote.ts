import { z } from "zod";

export const projectTypes = [
  { value: "web", label: "Web" },
  { value: "saas", label: "SaaS" },
  { value: "custom", label: "Sistema a medida" },
  { value: "automation", label: "Automatización / integración" },
  { value: "other", label: "Otro" },
] as const;

export const budgetOptions = [
  { value: "unknown", label: "Aún no lo sé" },
  { value: "defined", label: "Tengo un presupuesto" },
  { value: "discuss", label: "Prefiero conversarlo" },
] as const;

export const quoteStepOneSchema = z.object({
  projectType: z.enum(["web", "saas", "custom", "automation", "other"], {
    errorMap: () => ({ message: "Elegí un tipo de proyecto." }),
  }),
  budget: z.enum(["unknown", "defined", "discuss"], {
    errorMap: () => ({ message: "Elegí una opción de presupuesto." }),
  }),
  description: z
    .string()
    .trim()
    .max(2000, "La descripción admite hasta 2.000 caracteres.")
    .default(""),
});

export const quoteContactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Ingresá tu nombre.")
    .max(100, "El nombre es demasiado largo."),
  email: z.string().trim().email("Ingresá un email válido.").max(254),
  company: z.string().trim().max(160).default(""),
  startTime: z.string().trim().max(120).default(""),
  consent: z.literal(true, {
    errorMap: () => ({
      message: "Necesitamos tu consentimiento para responder la consulta.",
    }),
  }),
});

export const quoteSchema = quoteStepOneSchema
  .merge(quoteContactSchema)
  .extend({
    requestId: z.string().uuid(),
    website: z.string().max(500).default(""),
    turnstileToken: z.string().max(2048).default(""),
  })
  .strict();

export type QuoteInput = z.infer<typeof quoteSchema>;
export type QuoteField = keyof QuoteInput;
export type QuoteMode = "test" | "live" | "unavailable";
export type QuoteFieldErrors = Partial<Record<QuoteField, string>>;
export interface QuoteEmailPreview {
  subject: string;
  text: string;
}
export interface QuoteReply {
  mode: QuoteMode;
  status: "test" | "complete" | "partial" | "error";
  message: string;
  requestId?: string;
  errors?: QuoteFieldErrors;
  previews?: { internal: QuoteEmailPreview; confirmation: QuoteEmailPreview };
}
