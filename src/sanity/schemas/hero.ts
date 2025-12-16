import { defineType } from 'sanity'

export default defineType({
  name: 'hero',
  title: 'Hero',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Nombre',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'highlightSurname',
      title: '¿Resaltar Apellido?',
      type: 'boolean',
      initialValue: false,
      description: 'Si está activado, el apellido se mostrará con color destacado',
    },
    {
      name: 'role',
      title: 'Rol/Posición',
      type: 'string',
      description: 'Ej: Full Stack Developer',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'stackSummary',
      title: 'Stack Técnico',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Lista de tecnologías para el efecto typing',
      validation: (Rule) => Rule.required().min(3),
    },
    {
      name: 'shortPitch',
      title: 'Pitch Corto',
      type: 'text',
      description: 'Descripción breve de tu propuesta de valor',
      rows: 3,
      validation: (Rule) => Rule.required().max(200),
    },
    {
      name: 'avatar',
      title: 'Foto de Perfil',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'ctaPrimary',
      title: 'CTA Principal',
      type: 'object',
      fields: [
        {
          name: 'label',
          title: 'Texto',
          type: 'string',
          validation: (Rule) => Rule.required(),
        },
        {
          name: 'href',
          title: 'Enlace',
          type: 'string',
          validation: (Rule) => Rule.required(),
        },
      ],
    },
    {
      name: 'ctaSecondary',
      title: 'CTA Secundario',
      type: 'object',
      fields: [
        {
          name: 'label',
          title: 'Texto',
          type: 'string',
        },
        {
          name: 'href',
          title: 'Enlace',
          type: 'string',
        },
      ],
    },
    {
      name: 'socialLinks',
      title: 'Redes Sociales',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'socialLink' }],
        },
      ],
    },
    {
      name: 'showParticles',
      title: '¿Mostrar Partículas de Fondo?',
      type: 'boolean',
      initialValue: true,
    },
    {
      name: 'showParallax',
      title: '¿Activar Parallax en Avatar?',
      type: 'boolean',
      initialValue: true,
    },
  ],
})
