"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FiArrowUpRight, FiGrid } from "react-icons/fi";
import type { NexoraProject, NexoraProjectCategory } from "@/domain/nexora";
import { InteractiveCard, Reveal } from "./Motion";
import styles from "@/app/nexora/nexora.module.css";

export const categoryLabels = {
  saas: "SaaS",
  tool: "Herramientas",
  web: "Web / PWA",
  custom: "A medida",
};

export default function ProjectGrid({
  projects,
  filters = false,
}: {
  projects: NexoraProject[];
  filters?: boolean;
}) {
  const [category, setCategory] = useState<NexoraProjectCategory | "all">(
    "all",
  );
  const visible =
    category === "all"
      ? projects
      : projects.filter((project) => project.category === category);
  return (
    <>
      {filters && (
        <div
          className={styles.filters}
          role="group"
          aria-label="Filtrar proyectos"
        >
          <button
            type="button"
            aria-pressed={category === "all"}
            onClick={() => setCategory("all")}
          >
            <FiGrid aria-hidden /> Todos <span>{projects.length}</span>
          </button>
          {Object.entries(categoryLabels).map(([key, label]) => (
            <button
              key={key}
              type="button"
              aria-pressed={category === key}
              onClick={() => setCategory(key as NexoraProjectCategory)}
            >
              {label}
              <span>
                {projects.filter((project) => project.category === key).length}
              </span>
            </button>
          ))}
        </div>
      )}
      {visible.length ? (
        <div className={styles.projectGrid}>
          {visible.map((project, index) => (
            <Reveal key={project.id} delay={index * 0.06}>
              <InteractiveCard className={styles.projectCard}>
                <Link
                  href={`/nexora/proyectos/${project.slug}`}
                  className={styles.projectImage}
                  aria-label={`Ver ${project.title}`}
                >
                  <Image
                    src={project.image}
                    alt={`Captura de ${project.title}`}
                    fill
                    sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 400px"
                  />
                </Link>
                <div className={styles.projectBody}>
                  <span className={styles.eyebrow}>
                    {categoryLabels[project.category] || "Software"}
                  </span>
                  <h3>
                    <Link href={`/nexora/proyectos/${project.slug}`}>
                      {project.title}
                    </Link>
                  </h3>
                  <p>{project.summary}</p>
                  <div className={styles.tags}>
                    {project.technologies.slice(0, 4).map((technology) => (
                      <span key={technology}>{technology}</span>
                    ))}
                  </div>
                  <Link
                    className={styles.textLink}
                    href={`/nexora/proyectos/${project.slug}`}
                  >
                    Ver proyecto <FiArrowUpRight aria-hidden />
                  </Link>
                </div>
              </InteractiveCard>
            </Reveal>
          ))}
        </div>
      ) : (
        <div className={styles.empty} role="status">
          <FiGrid aria-hidden size={28} />
          <h3>No hay proyectos en esta categoría</h3>
          <p>Podés explorar las otras soluciones.</p>
          {category !== "all" && (
            <button
              type="button"
              className={styles.secondary}
              onClick={() => setCategory("all")}
            >
              Ver todos los proyectos
            </button>
          )}
        </div>
      )}
    </>
  );
}
