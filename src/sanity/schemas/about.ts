import { defineType } from 'sanity'

export default defineType({
  name: 'about',
  title: 'Sobre Mí',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Título de la Sección',
      type: 'string',
      initialValue: 'Sobre Mí',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'intro',
      title: 'Introducción',
      type: 'text',
      description: 'Párrafo introductorio breve',
      rows: 3,
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'body',
      title: 'Contenido Principal',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H3', value: 'h3' },
            { title: 'H4', value: 'h4' },
            { title: 'Quote', value: 'blockquote' },
          ],
          marks: {
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' },
              { title: 'Code', value: 'code' },
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [
                  {
                    name: 'href',
                    type: 'url',
                    title: 'URL',
                  },
                ],
              },
            ],
          },
        },
      ],
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'yearsExperience',
      title: 'Años de Experiencia',
      type: 'number',
      validation: (Rule) => Rule.required().positive(),
    },
    {
      name: 'currentCity',
      title: 'Ciudad Actual',
      type: 'string',
      description: 'Ej: Santiago, Chile',
    },
    {
      name: 'highlightedKeywords',
      title: 'Palabras Clave Destacadas',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Keywords que se resaltarán visualmente en el texto',
    },
    {
      name: 'skillGroups',
      title: 'Grupos de Skills',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'skillGroup' }],
        },
      ],
    },
  ],
})
