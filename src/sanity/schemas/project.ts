import { defineType } from 'sanity'

export default defineType({
  name: 'project',
  title: 'Proyecto',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Título',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'shortDescription',
      title: 'Descripción Corta',
      type: 'text',
      rows: 3,
      description: 'Descripción breve para la tarjeta',
      validation: (Rule) => Rule.required().max(150),
    },
    {
      name: 'longDescription',
      title: 'Descripción Detallada',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H3', value: 'h3' },
            { title: 'H4', value: 'h4' },
          ],
          lists: [
            { title: 'Bullet', value: 'bullet' },
            { title: 'Numbered', value: 'number' },
          ],
          marks: {
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' },
              { title: 'Code', value: 'code' },
            ],
          },
        },
      ],
    },
    {
      name: 'thumbnail',
      title: 'Imagen Principal',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'gallery',
      title: 'Galería de Imágenes',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true,
          },
        },
      ],
    },
    {
      name: 'technologies',
      title: 'Tecnologías',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Stack tecnológico usado en el proyecto',
      validation: (Rule) => Rule.required().min(1),
    },
    {
      name: 'role',
      title: 'Rol en el Proyecto',
      type: 'string',
      description: 'Ej: Full Stack Developer, Frontend Lead',
    },
    {
      name: 'isFeatured',
      title: '¿Proyecto Destacado?',
      type: 'boolean',
      initialValue: false,
      description: 'Los proyectos destacados aparecen primero',
    },
    {
      name: 'demoUrl',
      title: 'URL Demo',
      type: 'url',
      description: 'Link al proyecto en vivo',
    },
    {
      name: 'codeUrl',
      title: 'URL Código',
      type: 'url',
      description: 'Link al repositorio (GitHub, GitLab, etc)',
    },
    {
      name: 'order',
      title: 'Orden',
      type: 'number',
      description: 'Orden de visualización (menor = primero)',
      validation: (Rule) => Rule.required(),
    },
  ],
  orderings: [
    {
      title: 'Orden ascendente',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
    {
      title: 'Destacados primero',
      name: 'featuredFirst',
      by: [
        { field: 'isFeatured', direction: 'desc' },
        { field: 'order', direction: 'asc' },
      ],
    },
  ],
  preview: {
    select: {
      title: 'title',
      media: 'thumbnail',
      featured: 'isFeatured',
    },
    prepare({ title, media, featured }) {
      return {
        title: featured ? `⭐ ${title}` : title,
        media,
      }
    },
  },
})
