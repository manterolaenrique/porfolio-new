import Link from "next/link";
import {
  FiArrowUpRight,
  FiCheck,
  FiCloud,
  FiCode,
  FiGitMerge,
  FiLayers,
  FiRefreshCw,
} from "react-icons/fi";
import type { NexoraService } from "@/domain/nexora";
import { InteractiveCard, Reveal } from "./Motion";
import styles from "@/app/nexora/nexora.module.css";

const icons = {
  code: FiCode,
  cloud: FiCloud,
  layers: FiLayers,
  workflow: FiGitMerge,
  maintenance: FiRefreshCw,
};

export function PageHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className={styles.pageHeading}>
      <Reveal>
        <span className={styles.eyebrow}>{eyebrow}</span>
        <h1>{title}</h1>
        <p>{description}</p>
      </Reveal>
    </div>
  );
}

export function Services({
  services,
  detailed = false,
}: {
  services: NexoraService[];
  detailed?: boolean;
}) {
  if (!services.length)
    return (
      <div className={styles.empty}>
        <p>Estamos actualizando los servicios disponibles.</p>
        <Link className={styles.textLink} href="/nexora/contacto">
          Consultar por un proyecto <FiArrowUpRight aria-hidden />
        </Link>
      </div>
    );
  return (
    <div className={styles.serviceGrid}>
      {services.map((service, index) => {
        const Icon = icons[service.icon] || FiCode;
        return (
          <Reveal key={service.id} delay={index * 0.05}>
            <InteractiveCard className={styles.serviceCard}>
              <Icon className={styles.serviceIcon} size={26} aria-hidden />
              <h3>{service.title}</h3>
              <p>{service.summary}</p>
              {detailed && (
                <ul className={styles.checkList}>
                  {(service.deliverables || []).map((item) => (
                    <li key={item}>
                      <FiCheck aria-hidden />
                      {item}
                    </li>
                  ))}
                </ul>
              )}
              <Link
                className={styles.textLink}
                href={`/nexora/contacto?tipo=${service.projectType}`}
              >
                Consultar <FiArrowUpRight aria-hidden />
              </Link>
            </InteractiveCard>
          </Reveal>
        );
      })}
    </div>
  );
}

export function Process() {
  const steps = [
    ["Entender", "Conversamos sobre el problema, las personas y el contexto."],
    ["Definir", "Acordamos prioridades, alcance y próximos pasos."],
    ["Construir", "Diseñamos y desarrollamos con avances visibles."],
    ["Evolucionar", "Entregamos, documentamos y planificamos mejoras."],
  ];
  return (
    <section className={styles.section}>
      <div className={styles.sectionHeading}>
        <span className={styles.eyebrow}>Forma de trabajo</span>
        <h2>Del problema a una solución útil.</h2>
      </div>
      <div className={styles.processGrid}>
        {steps.map(([title, body], index) => (
          <Reveal key={title} delay={index * 0.07}>
            <div className={styles.processStep}>
              <span className={styles.stepNumber}>0{index + 1}</span>
              <h3>{title}</h3>
              <p>{body}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function ContactCTA() {
  return (
    <section className={styles.ctaBand}>
      <Reveal>
        <span className={styles.eyebrow}>Tu próximo proyecto</span>
        <h2>Conversemos sobre lo que querés construir.</h2>
        <p>
          Armá tu consulta y conversemos por WhatsApp sobre el próximo paso.
        </p>
        <Link className={styles.primary} href="/nexora/contacto">
          Preparar mi consulta <FiArrowUpRight aria-hidden />
        </Link>
      </Reveal>
    </section>
  );
}
