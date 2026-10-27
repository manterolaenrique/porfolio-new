import type {
  NexoraProject,
  NexoraService,
  NexoraSettings,
} from "@/domain/nexora";

export const defaultSettings: NexoraSettings = {
  title: "Nexora Software Studio",
  tagline: "De tu idea a un producto digital real.",
  introduction:
    "Diseño y desarrollo aplicaciones web, plataformas SaaS y soluciones a medida. Un vínculo directo entre tu negocio y quien construye el software.",
  aboutTitle: "Ingeniería directa. Decisiones con contexto.",
  aboutBody: [
    "Nexora es el espacio donde conecto desarrollo de software, entendimiento del negocio y comunicación directa.",
    "Cada proyecto empieza por comprender el problema. A partir de ahí definimos un alcance viable, construimos por etapas y compartimos avances para tomar decisiones con información.",
  ],
  founderName: "Enrique Manterola",
  founderRole: "Fundador y desarrollador Full Stack",
  githubUrl: "https://github.com/manterolaenrique",
  linkedinUrl: "https://www.linkedin.com/in/enrique-manterola-8bb572189/",
  description:
    "Desarrollo web, plataformas SaaS, sistemas a medida e integraciones. Nexora Software Studio, por Enrique Manterola.",
};

export const defaultServices: NexoraService[] = [
  {
    id: "web",
    slug: "aplicaciones-web",
    title: "Aplicaciones web",
    icon: "code",
    projectType: "web",
    summary:
      "Experiencias web claras, rápidas y adaptadas a la forma de trabajar de tus usuarios.",
    deliverables: [
      "Diseño responsive",
      "Frontend y backend",
      "Accesibilidad y rendimiento",
      "Documentación de entrega",
    ],
  },
  {
    id: "saas",
    slug: "plataformas-saas",
    title: "Plataformas SaaS",
    icon: "cloud",
    projectType: "saas",
    summary:
      "Productos digitales con una base preparada para evolucionar junto a tu negocio.",
    deliverables: [
      "Arquitectura multi-tenant",
      "Usuarios y permisos",
      "Pagos e integraciones",
      "Paneles de administración",
    ],
  },
  {
    id: "custom",
    slug: "sistemas-a-medida",
    title: "Sistemas a medida",
    icon: "layers",
    projectType: "custom",
    summary:
      "Herramientas que acompañan tus procesos, con el alcance y la complejidad que necesitan.",
    deliverables: [
      "Relevamiento funcional",
      "Flujos de trabajo",
      "Datos y reportes",
      "Migración e integración",
    ],
  },
  {
    id: "automation",
    slug: "automatizacion-integraciones",
    title: "Automatización e integraciones",
    icon: "workflow",
    projectType: "automation",
    summary:
      "Conectá tus herramientas y reducí tareas repetitivas con procesos trazables.",
    deliverables: [
      "Integración de APIs",
      "Webhooks y sincronización",
      "Validación de datos",
      "Registro de errores",
    ],
  },
  {
    id: "maintenance",
    slug: "mantenimiento-evolucion",
    title: "Mantenimiento y evolución",
    icon: "maintenance",
    projectType: "other",
    summary:
      "Mejoras continuas y soporte técnico para aplicaciones que ya están en marcha.",
    deliverables: [
      "Diagnóstico técnico",
      "Corrección de problemas",
      "Mejoras incrementales",
      "Seguimiento de cambios",
    ],
  },
];

// Verified public portfolio snapshot. Only used when explicitly enabled in DEV.
export const developmentProjects: NexoraProject[] = [
  {
    id: "digitalflow",
    slug: "digitalflow",
    title: "DigitalFlow",
    category: "saas",
    summary:
      "SaaS multi-tenant para vender productos digitales, cobrar con Mercado Pago y gestionar entregas, clientes y analytics.",
    problem:
      "Reunir la venta, el cobro y la entrega de productos digitales dentro de un mismo flujo de trabajo.",
    solution:
      "Una plataforma con separación por negocio, gestión de clientes y conexión con servicios de pago y entrega.",
    features: [
      "Gestión de productos digitales",
      "Cobros con Mercado Pago",
      "Entregas mediante Google Drive",
      "Administración de clientes y analytics",
    ],
    results: [],
    technologies: [
      "Next.js",
      "React",
      "TypeScript",
      "Supabase",
      "PostgreSQL",
      "Mercado Pago",
      "Google Drive API",
      "Tailwind CSS",
      "Zod",
    ],
    image: "/nexora/digitalflow.png",
    gallery: [],
    demoUrl: "https://digitalflow-pagos.vercel.app/",
    codeUrl: "https://github.com/manterolaenrique/digitalflow-pagos",
  },
  {
    id: "guitarra",
    slug: "herramientas-de-guitarra",
    title: "Herramientas de Guitarra",
    category: "tool",
    summary:
      "Suite interactiva para guitarristas con escalas, acordes, progresiones, círculo de quintas y afinador con micrófono en tiempo real.",
    problem:
      "Consultar recursos de teoría y afinación en una experiencia web integrada.",
    solution:
      "Herramientas visuales e interactivas para explorar el instrumento y trabajar con audio desde el navegador.",
    features: [
      "Escalas y acordes",
      "Progresiones armónicas",
      "Círculo de quintas",
      "Afinador con micrófono",
    ],
    results: [],
    technologies: [
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Web Audio API",
      "Framer Motion",
    ],
    image: "/nexora/guitarra.png",
    gallery: [],
    demoUrl: "https://guitar-app-git.vercel.app/",
    codeUrl: "https://github.com/manterolaenrique/guitar-app-git",
  },
  {
    id: "bandas",
    slug: "sitio-para-bandas-musicales",
    title: "Sitio para Bandas Musicales",
    category: "web",
    summary:
      "Plataforma PWA para bandas con dashboard privado, autenticación, editor visual, demos y permisos por roles.",
    problem:
      "Administrar la presencia digital de una banda con contenidos editables y acceso organizado.",
    solution:
      "Una aplicación web progresiva con panel privado y herramientas de edición integradas.",
    features: [
      "Dashboard privado",
      "Autenticación",
      "Editor visual",
      "Permisos por roles",
    ],
    results: [],
    technologies: [
      "Next.js",
      "React",
      "TypeScript",
      "Supabase",
      "Sanity",
      "PWA",
      "Zod",
      "Resend",
    ],
    image: "/nexora/bandas.png",
    gallery: [],
    demoUrl: "https://web-bands-v2.vercel.app/",
    codeUrl: "https://github.com/manterolaenrique/web-bands",
  },
];
