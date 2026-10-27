import type { Metadata } from "next";
import Link from "next/link";
import QuoteForm from "@/components/nexora/QuoteForm";
import { PageHeading } from "@/components/nexora/Sections";
import { projectTypes } from "@/domain/nexora-quote";
import { buildWhatsappUrl } from "@/domain/nexora-whatsapp";
import { FaWhatsapp } from "react-icons/fa";
import { getNexoraContent } from "@/services/nexora/content";
import styles from "../nexora.module.css";

export const metadata: Metadata = {
  title: "Contacto y presupuesto",
  alternates: { canonical: "/nexora/contacto" },
};
export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ tipo?: string }>;
}) {
  const [{ settings }, params] = await Promise.all([
    getNexoraContent(),
    searchParams,
  ]);
  const initialType = projectTypes.some((item) => item.value === params.tipo)
    ? params.tipo
    : "";
  const whatsappNumber = settings.whatsappNumber;
  const directWhatsapp = buildWhatsappUrl(whatsappNumber);
  return (
    <>
      <PageHeading
        eyebrow="Contacto"
        title="Hablemos de tu próximo proyecto."
        description="Armá tu consulta en dos pasos y abrí WhatsApp con el mensaje listo para revisar y enviar. Conversemos sobre tu idea y los próximos pasos."
      />
      <section className={styles.section}>
        <div className={`${styles.container} ${styles.contactLayout}`}>
          <QuoteForm
            initialType={initialType}
            whatsappNumber={whatsappNumber}
            whatsappIcon={<FaWhatsapp aria-hidden />}
          />
          <aside className={styles.contactAside}>
            <span className={styles.eyebrow}>De la idea al producto</span>
            <h2>Conversá directamente con quien lo desarrolla.</h2>
            <p>
              {settings.founderName}
              <br />
              {settings.founderRole}
            </p>
            <p>
              Contame tu idea por WhatsApp. Primero entendemos el problema y
              después definimos una solución viable.
            </p>
            {directWhatsapp && (
              <a
                className={styles.textLink}
                href={directWhatsapp}
                target="_blank"
                rel="noopener noreferrer"
              >
                Conversar por WhatsApp <FaWhatsapp aria-hidden />
              </a>
            )}
            <Link className={styles.textLink} href="/nexora/proyectos">
              Conocer proyectos
            </Link>
            <div id="privacidad" className={styles.privacy}>
              <h3>Privacidad de tu consulta</h3>
              <p>
                El mensaje se arma en tu navegador. Al abrir WhatsApp, los datos
                que elegiste incluir pasan a ese servicio para preparar el chat.
                Vos revisás el texto y decidís cuándo enviarlo.
              </p>
              <p>
                El sitio no guarda esta consulta en Sanity ni la envía por
                correo. Usaremos el mensaje que compartas para conversar sobre
                tu proyecto. No implica una suscripción comercial.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
