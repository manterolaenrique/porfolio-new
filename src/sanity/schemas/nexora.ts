import { defineField, defineType } from "sanity";

export const nexoraSettings = defineType({
  name: "nexoraSettings",
  title: "Nexora: configuración",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Marca",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "tagline",
      title: "Mensaje principal",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "introduction", title: "Presentación", type: "text" }),
    defineField({
      name: "aboutTitle",
      title: "Título institucional",
      type: "string",
    }),
    defineField({
      name: "aboutBody",
      title: "Sobre Nexora",
      type: "array",
      of: [{ type: "text" }],
    }),
    defineField({ name: "founderName", title: "Fundador", type: "string" }),
    defineField({
      name: "founderRole",
      title: "Rol del fundador",
      type: "string",
    }),
    defineField({
      name: "email",
      title: "Email público",
      type: "string",
      validation: (rule) => rule.email(),
    }),
    defineField({ name: "githubUrl", title: "GitHub", type: "url" }),
    defineField({ name: "linkedinUrl", title: "LinkedIn", type: "url" }),
    defineField({
      name: "description",
      title: "Descripción SEO",
      type: "text",
      validation: (rule) => rule.max(200),
    }),
  ],
  preview: { select: { title: "title" } },
});

export const nexoraService = defineType({
  name: "nexoraService",
  title: "Servicio Nexora",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Título",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "summary",
      title: "Resumen",
      type: "text",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "deliverables",
      title: "Entregables",
      type: "array",
      of: [{ type: "string" }],
      validation: (rule) => rule.min(1),
    }),
    defineField({
      name: "icon",
      title: "Icono",
      type: "string",
      options: { list: ["code", "layers", "cloud", "workflow", "maintenance"] },
    }),
    defineField({
      name: "projectType",
      title: "Tipo de consulta",
      type: "string",
      options: { list: ["web", "saas", "custom", "automation", "other"] },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "order",
      title: "Orden",
      type: "number",
      initialValue: 0,
    }),
    defineField({
      name: "isActive",
      title: "Visible",
      type: "boolean",
      initialValue: true,
    }),
  ],
});

export const nexoraProject = defineType({
  name: "nexoraProject",
  title: "Proyecto comercial Nexora",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Título comercial",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug Nexora",
      type: "slug",
      options: { source: "title" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "category",
      title: "Categoría",
      type: "string",
      options: {
        list: [
          { title: "SaaS", value: "saas" },
          { title: "Herramienta", value: "tool" },
          { title: "Web / PWA", value: "web" },
          { title: "A medida", value: "custom" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "technicalProject",
      title: "Proyecto técnico relacionado",
      type: "reference",
      to: [{ type: "project" }],
      description:
        "Las imágenes, tecnologías y enlaces se leen del proyecto relacionado. No se copian.",
    }),
    defineField({
      name: "status",
      title: "Estado comercial",
      type: "string",
      options: {
        list: [
          { title: "Publicado", value: "published" },
          { title: "En desarrollo", value: "in-development" },
          { title: "Archivado", value: "archived" },
        ],
      },
    }),
    defineField({
      name: "standalone",
      title: "Datos de producto independiente",
      type: "object",
      hidden: ({ document }) => !!document?.technicalProject,
      fields: [
        defineField({
          name: "thumbnail",
          title: "Imagen principal",
          type: "image",
          options: { hotspot: true },
        }),
        defineField({
          name: "mobileImage",
          title: "Captura móvil real (opcional)",
          type: "image",
        }),
        defineField({
          name: "gallery",
          title: "Galería",
          type: "array",
          of: [{ type: "image" }],
        }),
        defineField({
          name: "technologies",
          title: "Tecnologías",
          type: "array",
          of: [{ type: "string" }],
        }),
        defineField({ name: "demoUrl", title: "Demo", type: "url" }),
        defineField({ name: "codeUrl", title: "Repositorio", type: "url" }),
      ],
      validation: (rule) =>
        rule.custom((value, context) => {
          if (context.document?.technicalProject) return true;
          const data = value as
            | { thumbnail?: unknown; technologies?: unknown[] }
            | undefined;
          return data?.thumbnail && data.technologies?.length
            ? true
            : "Sin proyecto técnico, cargá una imagen y las tecnologías del producto.";
        }),
    }),
    defineField({
      name: "summary",
      title: "Resumen comercial",
      type: "text",
      validation: (rule) => rule.required().max(500),
    }),
    defineField({ name: "problem", title: "Problema", type: "text" }),
    defineField({ name: "solution", title: "Solución", type: "text" }),
    defineField({
      name: "features",
      title: "Funcionalidades",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "results",
      title: "Resultados verificables",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "recommendation",
      title: "Recomendación de este proyecto (opcional)",
      type: "object",
      description:
        "Se muestra únicamente en el detalle de este proyecto. No se publica como testimonio general.",
      fields: [
        defineField({
          name: "text",
          title: "Texto",
          type: "text",
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: "author",
          title: "Autor",
          type: "string",
          validation: (rule) => rule.required(),
        }),
        defineField({ name: "role", title: "Rol", type: "string" }),
        defineField({ name: "company", title: "Empresa", type: "string" }),
      ],
    }),
    defineField({
      name: "order",
      title: "Orden",
      type: "number",
      initialValue: 0,
    }),
    defineField({
      name: "isActive",
      title: "Visible",
      type: "boolean",
      initialValue: true,
    }),
  ],
});
