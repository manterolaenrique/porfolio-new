import Link from "next/link";
import { FiArrowUpRight } from "react-icons/fi";
import { getNexoraContent } from "@/services/nexora/content";
import { Reveal } from "@/components/nexora/Motion";
import Mockup from "@/components/nexora/Mockup";
import ProjectGrid from "@/components/nexora/ProjectGrid";
import { ContactCTA, Process, Services } from "@/components/nexora/Sections";
import styles from "./nexora.module.css";

export const revalidate = 3600;
export const metadata = { alternates: { canonical: "/nexora" } };

export default async function NexoraHome() {
  const { settings, services, projects } = await getNexoraContent();
  return (
    <>
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <Reveal>
            <span className={styles.eyebrow}>
              Ingeniería de software, de principio a fin
            </span>
          </Reveal>
          <Reveal delay={0.08}>
            <h1>{settings.title}</h1>
          </Reveal>
          <Reveal delay={0.16}>
            <p className={styles.heroPitch}>
              <strong>{settings.tagline}</strong>
              <br />
              {settings.introduction}
            </p>
          </Reveal>
          <Reveal delay={0.24}>
            <div className={styles.heroActions}>
              <Link href="/nexora/contacto" className={styles.primary}>
                Hablemos de tu proyecto <FiArrowUpRight aria-hidden />
              </Link>
              <Link href="/nexora/proyectos" className={styles.secondary}>
                Ver proyectos <FiArrowUpRight aria-hidden />
              </Link>
            </div>
          </Reveal>
          {projects[0] && (
            <Reveal delay={0.32}>
              <Mockup
                image={projects[0].image}
                mobileImage={projects[0].mobileImage}
                title={projects[0].title}
                priority
              />
            </Reveal>
          )}
        </div>
      </section>
      <section className={styles.section}>
        <div className={styles.sectionHeading}>
          <span className={styles.eyebrow}>Servicios</span>
          <h2>Soluciones para cada etapa.</h2>
          <p>
            Desde una primera aplicación hasta la evolución de un sistema
            existente.
          </p>
        </div>
        <Services services={services} />
      </section>
      <section className={styles.section}>
        <div className={styles.sectionHeadingRow}>
          <div className={styles.sectionHeading}>
            <span className={styles.eyebrow}>Software en acción</span>
            <h2>Proyectos para explorar.</h2>
          </div>
          <Link href="/nexora/proyectos" className={styles.textLink}>
            Todos los proyectos <FiArrowUpRight aria-hidden />
          </Link>
        </div>
        <ProjectGrid projects={projects.slice(0, 3)} />
      </section>
      <Process />
      <ContactCTA />
    </>
  );
}
