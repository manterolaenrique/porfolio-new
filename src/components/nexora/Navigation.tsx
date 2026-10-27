"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FiArrowUpRight, FiMenu, FiTerminal, FiX } from "react-icons/fi";
import styles from "@/app/nexora/nexora.module.css";

const links = [
  { href: "/nexora", label: "Inicio" },
  { href: "/nexora/servicios", label: "Servicios" },
  { href: "/nexora/proyectos", label: "Proyectos" },
  { href: "/nexora/nosotros", label: "Sobre Nexora" },
  { href: "/nexora/contacto", label: "Contacto" },
];

export default function Navigation() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const button = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        button.current?.focus();
      }
    };
    document.addEventListener("keydown", escape);
    return () => document.removeEventListener("keydown", escape);
  }, [open]);
  const active = (href: string) =>
    href === "/nexora" ? pathname === href : pathname.startsWith(href);
  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <Link
          href="/nexora"
          className={styles.brand}
          aria-label="Nexora Software Studio, inicio"
        >
          <FiTerminal aria-hidden size={24} />
          <span>
            <strong>Nexora</strong>
            <small>Software Studio</small>
          </span>
        </Link>
        <nav className={styles.desktopNav} aria-label="Navegación de Nexora">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={active(link.href) ? "page" : undefined}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className={styles.headerActions}>
          <Link href="/" className={styles.portfolioLink}>
            Portfolio <FiArrowUpRight aria-hidden />
          </Link>
          <button
            ref={button}
            type="button"
            className={styles.menuButton}
            aria-expanded={open}
            aria-controls="nexora-menu"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            onClick={() => setOpen(!open)}
          >
            {open ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>
      {open && (
        <nav
          id="nexora-menu"
          className={styles.mobileNav}
          aria-label="Navegación móvil de Nexora"
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              aria-current={active(link.href) ? "page" : undefined}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
