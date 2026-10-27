import { getNexoraContent } from "@/services/nexora/content";
import { ContactCTA, PageHeading } from "@/components/nexora/Sections";
import ProjectGrid from "@/components/nexora/ProjectGrid";
import styles from "../nexora.module.css";
export const metadata = {
  title: "Proyectos",
  alternates: { canonical: "/nexora/proyectos" },
};
export const revalidate = 3600;
export default async function ProjectsPage() {
  const { projects } = await getNexoraContent();
  return (
    <>
      <PageHeading
        eyebrow="Productos y proyectos"
        title="Software que podés explorar."
        description="Aplicaciones web, plataformas y herramientas interactivas. Conocé el problema, la solución y la base técnica de cada proyecto."
      />
      <section className={styles.section} style={{ paddingTop: 0 }}>
        <ProjectGrid projects={projects} filters />
      </section>
      <ContactCTA />
    </>
  );
}
