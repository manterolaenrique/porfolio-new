"use client";

import Image from "next/image";
import { useState } from "react";
import { FiMonitor, FiSmartphone } from "react-icons/fi";
import styles from "@/app/nexora/nexora.module.css";

export default function Mockup({
  image,
  mobileImage,
  title,
  priority = false,
}: {
  image: string;
  mobileImage?: string;
  title: string;
  priority?: boolean;
}) {
  const [mode, setMode] = useState<"desktop" | "mobile">("desktop");
  return (
    <div className={styles.mockup}>
      <div className={styles.mockupBar}>
        <span>{title}</span>
        <div
          className={styles.deviceSwitch}
          role="group"
          aria-label={`Vista de ${title}`}
        >
          <button
            type="button"
            title="Vista desktop"
            aria-label="Vista desktop"
            aria-pressed={mode === "desktop"}
            onClick={() => setMode("desktop")}
          >
            <FiMonitor aria-hidden />
          </button>
          <button
            type="button"
            title="Vista mobile"
            aria-label="Vista mobile"
            aria-pressed={mode === "mobile"}
            onClick={() => setMode("mobile")}
          >
            <FiSmartphone aria-hidden />
          </button>
        </div>
      </div>
      <div className={styles.mockupViewport} data-device={mode}>
        <div
          key={mode}
          className={mode === "mobile" ? styles.phone : styles.desktopScreen}
        >
          <Image
            src={mode === "mobile" && mobileImage ? mobileImage : image}
            alt={`${title}, ${mode === "mobile" && !mobileImage ? "vista adaptada de la captura desktop" : `captura ${mode}`}`}
            fill
            sizes="(max-width: 700px) 100vw, 1100px"
            priority={priority}
            className={
              mode === "mobile" ? styles.phoneImage : styles.productImage
            }
          />
        </div>
        {mode === "mobile" && !mobileImage && (
          <span className={styles.adapted}>Vista adaptada</span>
        )}
      </div>
    </div>
  );
}
