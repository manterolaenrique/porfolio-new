import Link from "next/link";
import styles from "./nexora.module.css";
export default function NotFound() {
  return (
    <section className={styles.section}>
      <span className={styles.eyebrow}>404</span>
      <h1>No encontramos este proyecto.</h1>
      <p>Podés volver al catálogo y explorar las soluciones disponibles.</p>
      <Link className={styles.primary} href="/nexora/proyectos">
        Ver proyectos
      </Link>
    </section>
  );
}
