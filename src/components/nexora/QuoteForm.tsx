"use client";

import { useRef, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import {
  budgetOptions,
  projectTypes,
  quoteStepOneSchema,
} from "@/domain/nexora-quote";
import type { QuoteFieldErrors } from "@/domain/nexora-quote";
import {
  buildWhatsappMessage,
  buildWhatsappUrl,
  normalizeWhatsappNumber,
  whatsappQuoteSchema,
} from "@/domain/nexora-whatsapp";
import styles from "@/app/nexora/nexora.module.css";

export default function QuoteForm({
  initialType = "",
  whatsappNumber,
  whatsappIcon,
}: {
  initialType?: string;
  whatsappNumber?: string;
  whatsappIcon?: ReactNode;
}) {
  const [step, setStep] = useState(1);
  const [values, setValues] = useState({
    projectType: initialType,
    budget: "",
    description: "",
    name: "",
    email: "",
    company: "",
    startTime: "",
    consent: false,
  });
  const [errors, setErrors] = useState<QuoteFieldErrors>({});
  const [preparedUrl, setPreparedUrl] = useState<string | null>(null);
  const form = useRef<HTMLFormElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const available = !!normalizeWhatsappNumber(whatsappNumber);
  // Consent does not affect the preview; it is checked before opening WhatsApp.
  const previewData = whatsappQuoteSchema.safeParse({
    ...values,
    consent: true,
  });
  const preview = previewData.success
    ? buildWhatsappMessage(previewData.data)
    : null;

  function update(field: keyof typeof values, value: string | boolean) {
    setValues((previous) => ({ ...previous, [field]: value }));
    setErrors((previous) => ({ ...previous, [field]: undefined }));
    setPreparedUrl(null);
  }
  function showErrors(fields: QuoteFieldErrors) {
    setErrors(fields);
    requestAnimationFrame(() =>
      form.current
        ?.querySelector<HTMLElement>(`[name="${Object.keys(fields)[0]}"]`)
        ?.focus(),
    );
  }
  function submit(event: FormEvent) {
    event.preventDefault();
    const parsed = (
      step === 1 ? quoteStepOneSchema : whatsappQuoteSchema
    ).safeParse(values);
    if (!parsed.success) {
      const fields: QuoteFieldErrors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof QuoteFieldErrors;
        if (!fields[key]) fields[key] = issue.message;
      }
      showErrors(fields);
      return;
    }
    setErrors({});
    if (step === 1) {
      setStep(2);
      requestAnimationFrame(() => heading.current?.focus());
      return;
    }
    const complete = whatsappQuoteSchema.parse(values);
    const url = buildWhatsappUrl(
      whatsappNumber,
      buildWhatsappMessage(complete),
    );
    if (!url) return;
    setPreparedUrl(url);
    // Synchronous user gesture: no API, mail or automatic message is sent.
    window.open(url, "_blank", "noopener,noreferrer");
  }
  const error = (field: keyof QuoteFieldErrors) =>
    errors[field] ? (
      <span id={`error-${field}`} className={styles.error}>
        {errors[field]}
      </span>
    ) : null;
  const attributes = (field: keyof QuoteFieldErrors) => ({
    "aria-invalid": !!errors[field],
    "aria-describedby": errors[field] ? `error-${field}` : undefined,
  });

  return (
    <form ref={form} onSubmit={submit} className={styles.form} noValidate>
      <div className={styles.stepIndicator} aria-label={`Paso ${step} de 2`}>
        <span aria-current={step === 1 ? "step" : undefined}>
          01 · Tu proyecto
        </span>
        <span aria-current={step === 2 ? "step" : undefined}>
          02 · Tu mensaje
        </span>
      </div>
      <h2 ref={heading} tabIndex={-1} className={styles.formHeading}>
        {step === 1 ? "Dale forma a tu idea." : "Revisá tu consulta."}
      </h2>
      <p className={styles.formIntro}>
        {step === 1
          ? "Contame qué necesitás. Al terminar vas a poder enviarme la consulta por WhatsApp."
          : "Sumá tus datos y revisá el mensaje. Podés volver al paso anterior para ajustar tu idea."}
      </p>
      {step === 1 ? (
        <>
          <fieldset className={styles.field}>
            <legend className={styles.fieldLabel}>
              ¿Qué necesitás desarrollar? *
            </legend>
            <div className={styles.choices}>
              {projectTypes.map((item) => (
                <label className={styles.choice} key={item.value}>
                  <input
                    type="radio"
                    name="projectType"
                    value={item.value}
                    checked={values.projectType === item.value}
                    onChange={() => update("projectType", item.value)}
                    required
                    {...attributes("projectType")}
                  />
                  {item.label}
                </label>
              ))}
            </div>
            {error("projectType")}
          </fieldset>
          <fieldset className={styles.field}>
            <legend className={styles.fieldLabel}>Presupuesto *</legend>
            <div className={styles.choices}>
              {budgetOptions.map((item) => (
                <label className={styles.choice} key={item.value}>
                  <input
                    type="radio"
                    name="budget"
                    value={item.value}
                    checked={values.budget === item.value}
                    onChange={() => update("budget", item.value)}
                    required
                    {...attributes("budget")}
                  />
                  {item.label}
                </label>
              ))}
            </div>
            {error("budget")}
          </fieldset>
          <label className={styles.field}>
            <span className={styles.fieldLabel}>
              Contanos tu idea{" "}
              <span className={styles.optional}>(opcional)</span>
            </span>
            <textarea
              name="description"
              rows={5}
              maxLength={2000}
              value={values.description}
              onChange={(event) => update("description", event.target.value)}
              {...attributes("description")}
            />
            <span className={styles.counter}>
              {values.description.length}/2.000
            </span>
            {error("description")}
          </label>
        </>
      ) : (
        <>
          <label className={styles.field}>
            <span className={styles.fieldLabel}>Nombre *</span>
            <input
              name="name"
              autoComplete="name"
              maxLength={100}
              value={values.name}
              onChange={(event) => update("name", event.target.value)}
              required
              {...attributes("name")}
            />
            {error("name")}
          </label>
          <label className={styles.field}>
            <span className={styles.fieldLabel}>
              Empresa <span className={styles.optional}>(opcional)</span>
            </span>
            <input
              name="company"
              autoComplete="organization"
              maxLength={160}
              value={values.company}
              onChange={(event) => update("company", event.target.value)}
              {...attributes("company")}
            />
            {error("company")}
          </label>
          <label className={styles.field}>
            <span className={styles.fieldLabel}>
              Email <span className={styles.optional}>(opcional)</span>
            </span>
            <input
              name="email"
              type="email"
              autoComplete="email"
              maxLength={254}
              value={values.email}
              onChange={(event) => update("email", event.target.value)}
              {...attributes("email")}
            />
            {error("email")}
          </label>
          <label className={styles.field}>
            <span className={styles.fieldLabel}>
              ¿Cuándo te gustaría empezar?{" "}
              <span className={styles.optional}>(opcional)</span>
            </span>
            <input
              name="startTime"
              maxLength={120}
              placeholder="Por ejemplo: el próximo mes"
              value={values.startTime}
              onChange={(event) => update("startTime", event.target.value)}
              {...attributes("startTime")}
            />
            {error("startTime")}
          </label>
          {preview && (
            <section
              className={styles.messagePreview}
              aria-label="Vista previa del mensaje"
            >
              <h3>Así llegará tu consulta</h3>
              <pre>{preview}</pre>
            </section>
          )}
          <label className={styles.consent}>
            <input
              type="checkbox"
              name="consent"
              checked={values.consent}
              onChange={(event) => update("consent", event.target.checked)}
              required
              {...attributes("consent")}
            />
            <span>
              Acepto compartir estos datos con Nexora por WhatsApp para
              responder mi consulta. <a href="#privacidad">Ver privacidad</a>.
            </span>
          </label>
          {error("consent")}
          <p className={styles.formIntro}>
            El mensaje se prepara aquí. Podés revisarlo y editarlo en WhatsApp
            antes de enviarlo.
          </p>
        </>
      )}
      {!available && (
        <p role="status" className={styles.error}>
          El contacto por WhatsApp estará disponible en breve. Podés preparar tu
          consulta mientras tanto.
        </p>
      )}
      {preparedUrl && (
        <div role="status" className={styles.feedback}>
          <p>Mensaje preparado. El envío se completa en WhatsApp.</p>
          <a
            className={styles.textLink}
            href={preparedUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Abrir WhatsApp con mi mensaje {whatsappIcon}
          </a>
        </div>
      )}
      <div className={styles.formActions}>
        {step === 2 && (
          <button
            type="button"
            className={styles.secondary}
            onClick={() => {
              setStep(1);
              setErrors({});
              setPreparedUrl(null);
              requestAnimationFrame(() => heading.current?.focus());
            }}
          >
            Volver
          </button>
        )}
        <button
          className={styles.primary}
          type="submit"
          disabled={step === 2 && !available}
        >
          {step === 1 ? "Continuar" : <>Enviar por WhatsApp {whatsappIcon}</>}
        </button>
      </div>
    </form>
  );
}
