import Link from "next/link";
import type { Metadata } from "next";
import { Geist, Sora } from "next/font/google";
import { FiArrowUpRight, FiGithub, FiLinkedin } from "react-icons/fi";
import Navigation from "@/components/nexora/Navigation";
import { getNexoraContent } from "@/services/nexora/content";
import styles from "./nexora.module.css";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-nexora-sora",
  display: "swap",
});
const geist = Geist({
  subsets: ["latin"],
  variable: "--font-nexora-geist",
  display: "swap",
});
export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://henrymanterola.dev.ar",
  ),
  twitter: {
    card: "summary",
    title: "Nexora Software Studio",
    description: "De tu idea a un producto digital real.",
  },
  title: {
    default: "Nexora Software Studio",
    template: "%s | Nexora Software Studio",
  },
  description:
    "Desarrollo web, plataformas SaaS, sistemas a medida e integraciones. Ingeniería directa con Enrique Manterola.",
  openGraph: {
    title: "Nexora Software Studio",
    description: "De tu idea a un producto digital real.",
    type: "website",
    locale: "es_AR",
  },
};

export default async function NexoraLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { settings } = await getNexoraContent();
  return (
    <div className={`${styles.root} ${sora.variable} ${geist.variable}`}>
      <a href="#nexora-main" className={styles.skip}>
        Saltar al contenido
      </a>
      <Navigation />
      <main id="nexora-main">{children}</main>
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div>
            <Link href="/nexora" className={styles.brand}>
              <span>
                <strong>Nexora</strong>
                <small>Software Studio</small>
              </span>
            </Link>
            <p>{settings.tagline}</p>
            <Link className={styles.textLink} href="/">
              Portfolio de Enrique Manterola <FiArrowUpRight aria-hidden />
            </Link>
          </div>
          <nav className={styles.footerLinks} aria-label="Enlaces de Nexora">
            <Link href="/nexora/servicios">Servicios</Link>
            <Link href="/nexora/proyectos">Proyectos</Link>
            <Link href="/nexora/nosotros">Sobre Nexora</Link>
            <Link href="/nexora/contacto">Contacto</Link>
            {settings.githubUrl && (
              <a
                href={settings.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub de Enrique Manterola"
                title="GitHub"
              >
                <FiGithub size={20} />
              </a>
            )}
            {settings.linkedinUrl && (
              <a
                href={settings.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn de Enrique Manterola"
                title="LinkedIn"
              >
                <FiLinkedin size={20} />
              </a>
            )}
          </nav>
        </div>
        <div className={styles.footerCopyright}>
          Nexora Software Studio · Enrique Manterola
        </div>
      </footer>
    </div>
  );
}
