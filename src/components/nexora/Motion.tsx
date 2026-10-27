"use client";

import { useEffect, useRef, type ReactNode } from "react";
import {
  motion,
  useAnimation,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import styles from "@/app/nexora/nexora.module.css";

export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const element = useRef<HTMLDivElement>(null);
  const controls = useAnimation();
  const reduced = useReducedMotion();
  useEffect(() => {
    if (reduced || !element.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          void controls.start({
            opacity: [0.65, 1],
            y: [16, 0],
            transition: { duration: 0.45, delay, ease: "easeOut" },
          });
          observer.disconnect();
        }
      },
      { threshold: 0.08 },
    );
    observer.observe(element.current);
    return () => observer.disconnect();
  }, [controls, delay, reduced]);
  return (
    <motion.div
      ref={element}
      className={className}
      initial={false}
      animate={controls}
    >
      {children}
    </motion.div>
  );
}

export function InteractiveCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const element = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(x, { stiffness: 200, damping: 25 });
  const rotateY = useSpring(y, { stiffness: 200, damping: 25 });
  const frame = useRef<number | null>(null);
  useEffect(
    () => () => {
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    },
    [],
  );
  return (
    <motion.div
      ref={element}
      className={`${styles.interactiveCard} ${className}`}
      style={{ rotateX, rotateY, transformPerspective: 1000 }}
      onPointerMove={(event) => {
        if (reduced || event.pointerType !== "mouse" || !element.current)
          return;
        const bounds = element.current.getBoundingClientRect();
        const px = event.clientX - bounds.left;
        const py = event.clientY - bounds.top;
        if (frame.current !== null) cancelAnimationFrame(frame.current);
        frame.current = requestAnimationFrame(() => {
          x.set((0.5 - py / bounds.height) * 10);
          y.set((px / bounds.width - 0.5) * 10);
          element.current?.style.setProperty("--pointer-x", `${px}px`);
          element.current?.style.setProperty("--pointer-y", `${py}px`);
        });
      }}
      onPointerLeave={() => {
        if (frame.current !== null) cancelAnimationFrame(frame.current);
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}
