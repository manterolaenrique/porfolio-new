import { defineType } from 'sanity'

export default defineType({
  name: 'skill',
  title: 'Skill',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Nombre',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'level',
      title: 'Nivel',
      type: 'string',
      options: {
        list: [
          { title: 'Básico', value: 'basic' },
          { title: 'Intermedio', value: 'intermediate' },
          { title: 'Avanzado', value: 'advanced' },
          { title: 'Experto', value: 'expert' },
        ],
      },
      description: 'Opcional - nivel de competencia',
    },
    {
      name: 'category',
      title: 'Categoría',
      type: 'string',
      options: {
        list: [
          { title: 'Lenguaje', value: 'language' },
          { title: 'Framework / Lirerías', value: 'framework' },
          { title: 'Herramienta', value: 'tool' },
          { title: 'Base de Datos', value: 'database' },
          { title: 'Cloud', value: 'cloud' },
          { title: 'DevOps', value: 'devops' },
          { title: 'Librerías / Frameworks UI', value: 'frameworkUI' },
        ],
      },
    },
    {
      name: 'icon',
      title: 'Icono',
      type: 'string',
      description: 'Nombre del icono de react-icons (ej: SiReact, SiTypescript)',
    },
    {
      name: 'isHighlighted',
      title: '¿Destacar?',
      type: 'boolean',
      initialValue: false,
      description: 'Si está activado, se mostrará con estilo destacado',
    },
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'level',
      highlighted: 'isHighlighted',
    },
    prepare({ title, subtitle, highlighted }) {
      return {
        title: highlighted ? `⭐ ${title}` : title,
        subtitle,
      }
    },
  },
})
