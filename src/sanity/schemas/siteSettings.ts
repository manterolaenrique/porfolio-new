import { defineType } from 'sanity'

export default defineType({
  name: 'siteSettings',
  title: 'Configuración del Sitio',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Título del Sitio',
      type: 'string',
      description: 'Usado en meta tags y SEO',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'description',
      title: 'Descripción',
      type: 'text',
      description: 'Descripción meta para SEO',
      validation: (Rule) => Rule.required().max(160),
    },
    {
      name: 'language',
      title: 'Idioma',
      type: 'string',
      initialValue: 'es',
      options: {
        list: [
          { title: 'Español', value: 'es' },
          { title: 'English', value: 'en' },
        ],
      },
    },
    {
      name: 'theme',
      title: 'Tema',
      type: 'string',
      initialValue: 'dark',
      options: {
        list: [
          { title: 'Claro', value: 'light' },
          { title: 'Oscuro', value: 'dark' },
        ],
      },
    },
    {
      name: 'primaryColor',
      title: 'Color Principal',
      type: 'string',
      description: 'Código HEX del color principal',
      initialValue: '#6C5CE7',
    },
    {
      name: 'favicon',
      title: 'Favicon',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'ogImage',
      title: 'Imagen Open Graph',
      type: 'image',
      description: 'Imagen para compartir en redes sociales (1200x630px)',
      options: {
        hotspot: true,
      },
    },
  ],
})
