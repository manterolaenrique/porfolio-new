import { defineType } from 'sanity'

export default defineType({
  name: 'socialLink',
  title: 'Red Social',
  type: 'document',
  fields: [
    {
      name: 'label',
      title: 'Nombre',
      type: 'string',
      description: 'Ej: GitHub, LinkedIn, Twitter',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'type',
      title: 'Tipo',
      type: 'string',
      options: {
        list: [
          { title: 'GitHub', value: 'github' },
          { title: 'LinkedIn', value: 'linkedin' },
          { title: 'Twitter/X', value: 'twitter' },
          { title: 'Email', value: 'email' },
          { title: 'Website', value: 'website' },
          { title: 'Otro', value: 'other' },
        ],
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'url',
      title: 'URL',
      type: 'string',
      description: 'URL completa (https://...) o email (mailto:...)',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'icon',
      title: 'Icono',
      type: 'string',
      description: 'Nombre del icono de react-icons (ej: FaGithub, FaLinkedin)',
    },
  ],
  preview: {
    select: {
      title: 'label',
      subtitle: 'type',
    },
  },
})
