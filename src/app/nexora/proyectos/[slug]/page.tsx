import Link from "next/link";
import { notFound } from "next/navigation";
import { FiArrowLeft, FiArrowUpRight, FiCheck, FiGithub } from "react-icons/fi";
import { getNexoraProject } from "@/services/nexora/content";
import Mockup from "@/components/nexora/Mockup";
import { ContactCTA } from "@/components/nexora/Sections";
import styles from "../../nexora.module.css";

export const revalidate = 3600;
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const project = await getNexoraProject(slug);
  return {
    title: project?.title || "Proyecto no encontrado",
    description: project?.summary,
    alternates: { canonical: `/nexora/proyectos/${slug}` },
  };
}
export default async function ProjectDetail({ params }: Props) {
  const { slug } = await params;
  const project = await getNexoraProject(slug);
  if (!project) notFound();
  return (
    <>
      <section className={styles.section}>
        <div className={styles.detailTop}>
          <Link href="/nexora/proyectos" className={styles.textLink}>
            <FiArrowLeft aria-hidden /> Volver a proyectos
          </Link>
        </div>
        <span className={styles.eyebrow}>Detalle de proyecto</span>
        <h1>{project.title}</h1>
        <p className={styles.heroPitch}>{project.summary}</p>
        <div className={styles.heroActions}>
          {project.demoUrl && (
            <a
              className={styles.primary}
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Ver demo <FiArrowUpRight aria-hidden />
            </a>
          )}
          {project.codeUrl && (
            <a
              className={styles.secondary}
              href={project.codeUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FiGithub aria-hidden /> Repositorio
            </a>
          )}
        </div>
        <div className={styles.detailImage}>
          <Mockup
            title={project.title}
            image={project.image}
            mobileImage={project.mobileImage}
            priority
          />
        </div>
        <div className={styles.twoColumns}>
          <div className={styles.prose}>
            <span className={styles.eyebrow}>El punto de partida</span>
            <h2>El problema</h2>
            <p>{project.problem}</p>
          </div>
          <div className={styles.prose}>
            <span className={styles.eyebrow}>La construcción</span>
            <h2>La solución</h2>
            <p>{project.solution}</p>
          </div>
        </div>
      </section>
      <section className={styles.section} style={{ paddingTop: 0 }}>
        <div className={styles.sectionHeading}>
          <h2>Funcionalidades</h2>
        </div>
        <div className={styles.detailFeatureGrid}>
          {project.features.map((feature) => (
            <div className={styles.detailFeature} key={feature}>
              <FiCheck aria-hidden />
              {feature}
            </div>
          ))}
        </div>
        <div className={styles.sectionHeading} style={{ marginTop: 36 }}>
          <h2>Base técnica</h2>
        </div>
        <div className={styles.tags}>
          {project.technologies.map((technology) => (
            <span key={technology}>{technology}</span>
          ))}
        </div>
        {project.results.length > 0 && (
          <>
            <div className={styles.sectionHeading} style={{ marginTop: 36 }}>
              <h2>Resultados</h2>
            </div>
            <ul className={styles.checkList}>
              {project.results.map((result) => (
                <li key={result}>
                  <FiCheck aria-hidden />
                  {result}
                </li>
              ))}
            </ul>
          </>
        )}
        {project.recommendation && (
          <blockquote className={styles.quote}>
            <p>{project.recommendation.text}</p>
            <cite>
              {[
                project.recommendation.author,
                project.recommendation.role,
                project.recommendation.company,
              ]
                .filter(Boolean)
                .join(" · ")}
            </cite>
          </blockquote>
        )}
      </section>
      <ContactCTA />
    </>
  );
}
