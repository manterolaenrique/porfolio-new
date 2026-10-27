import Link from "next/link";
import { FiArrowUpRight, FiCheck } from "react-icons/fi";
import { getNexoraContent } from "@/services/nexora/content";
import { ContactCTA, PageHeading, Process } from "@/components/nexora/Sections";
import styles from "../nexora.module.css";
export const metadata = {
  title: "Sobre Nexora",
  alternates: { canonical: "/nexora/nosotros" },
};
export const revalidate = 3600;
export default async function AboutNexora() {
  const { settings } = await getNexoraContent();
  return (
    <>
      <PageHeading
        eyebrow="Sobre Nexora"
        title={settings.aboutTitle}
        description="Un estudio de software con comunicación directa y una base técnica sólida."
      />
      <section className={styles.section} style={{ paddingTop: 0 }}>
        <div className={styles.twoColumns}>
          <div className={styles.prose}>
            {settings.aboutBody.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <div className={styles.founder}>
              <span className={styles.monogram} aria-hidden>
                EM
              </span>
              <div>
                <h3>{settings.founderName}</h3>
                <p>{settings.founderRole}</p>
                <Link href="/" className={styles.textLink}>
                  Conocer mi portfolio <FiArrowUpRight aria-hidden />
                </Link>
              </div>
            </div>
          </div>
          <div>
            <h2>Cómo encaro cada proyecto.</h2>
            <ul className={styles.checkList} style={{ marginTop: 28 }}>
              {[
                "Entender el contexto antes de elegir tecnología.",
                "Definir un alcance y prioridades compartidas.",
                "Construir código mantenible y documentado.",
                "Mostrar avances y conversar sobre las decisiones.",
              ].map((item) => (
                <li key={item}>
                  <FiCheck aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      <Process />
      <ContactCTA />
    </>
  );
}
