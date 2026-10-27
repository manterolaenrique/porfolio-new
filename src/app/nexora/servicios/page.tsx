import { getNexoraContent } from "@/services/nexora/content";
import {
  ContactCTA,
  PageHeading,
  Process,
  Services,
} from "@/components/nexora/Sections";
import styles from "../nexora.module.css";
export const metadata = {
  title: "Servicios",
  alternates: { canonical: "/nexora/servicios" },
};
export const revalidate = 3600;
export default async function ServicesPage() {
  const { services } = await getNexoraContent();
  return (
    <>
      <PageHeading
        eyebrow="Qué construimos"
        title="Servicios de desarrollo de software"
        description="Un alcance claro, decisiones técnicas con contexto y entregables concretos para tu proyecto."
      />
      <section className={styles.section} style={{ paddingTop: 0 }}>
        <Services services={services} detailed />
      </section>
      <Process />
      <ContactCTA />
    </>
  );
}
