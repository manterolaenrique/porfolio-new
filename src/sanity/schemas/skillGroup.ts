import { defineType } from 'sanity'

export default defineType({
  name: 'skillGroup',
  title: 'Grupo de Skills',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Título del Grupo',
      type: 'string',
      description: 'Ej: Frontend, Backend, DevOps',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'icon',
      title: 'Icono del Grupo',
      type: 'string',
      description: 'Nombre del icono de react-icons (ej: SiReact, SiPython, FaDatabase)',
    },
    {
      name: 'order',
      title: 'Orden',
      type: 'number',
      description: 'Orden de visualización (menor = primero)',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'skills',
      title: 'Skills',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'skill' }],
        },
      ],
    },
  ],
  preview: {
    select: {
      title: 'title',
      order: 'order',
    },
    prepare({ title, order }) {
      return {
        title: `${order}. ${title}`,
      }
    },
  },
})
