import { defineType } from 'sanity'

export default defineType({
  name: 'commercialProfile',
  title: 'Perfil Comercial Técnico',
  type: 'document',
  fields: [
    {
      name: 'sectionTitle',
      title: 'Título de la Sección',
      type: 'string',
      initialValue: 'Del código al impacto',
      validation: (Rule) => Rule.required().min(6).max(80),
    },
    {
      name: 'sectionSubtitle',
      title: 'Subtítulo',
      type: 'text',
      rows: 2,
      description: 'Texto breve que contextualiza el perfil híbrido.',
      validation: (Rule) => Rule.max(180),
    },
    {
      name: 'anchorId',
      title: 'Anchor ID',
      type: 'string',
      description: 'Identificador HTML para navegación por anclas. Ej: business-vision',
      initialValue: 'business-vision',
      validation: (Rule) => Rule.required().regex(/^[a-z0-9-]+$/, {
        name: 'anchor-id',
        invert: false,
      }),
    },
    {
      name: 'introNarrative',
      title: 'Introducción Personal',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [{ title: 'Normal', value: 'normal' }],
          lists: [],
          marks: {
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' },
            ],
            annotations: [],
          },
        },
      ],
      validation: (Rule) => Rule.required().min(1),
    },
    {
      name: 'experienceItems',
      title: 'Experiencia Comercial Real',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'title',
              title: 'Título',
              type: 'string',
              validation: (Rule) => Rule.required().max(80),
            },
            {
              name: 'description',
              title: 'Descripción',
              type: 'text',
              rows: 3,
              validation: (Rule) => Rule.required().max(220),
            },
            {
              name: 'order',
              title: 'Orden',
              type: 'number',
              validation: (Rule) => Rule.required().min(1),
            },
          ],
          preview: {
            select: {
              title: 'title',
              subtitle: 'description',
            },
          },
        },
      ],
      validation: (Rule) => Rule.required().min(4),
    },
    {
      name: 'preSalesCapabilities',
      title: 'Conexión con Ventas Técnicas / Preventa',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'title',
              title: 'Capacidad',
              type: 'string',
              validation: (Rule) => Rule.required().max(90),
            },
            {
              name: 'description',
              title: 'Valor para negocio',
              type: 'text',
              rows: 3,
              validation: (Rule) => Rule.required().max(220),
            },
            {
              name: 'order',
              title: 'Orden',
              type: 'number',
              validation: (Rule) => Rule.required().min(1),
            },
          ],
          preview: {
            select: {
              title: 'title',
              subtitle: 'description',
            },
          },
        },
      ],
      validation: (Rule) => Rule.required().min(3),
    },
    {
      name: 'showTransformationRoute',
      title: 'Mostrar Ruta de Transformación',
      type: 'boolean',
      initialValue: true,
      description: 'Activa o desactiva el bloque de evolución Código -> Negocio -> Preventa -> Impacto.',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'transformationRouteTitle',
      title: 'Título Ruta de Transformación',
      type: 'string',
      initialValue: 'Ruta de transformación',
      hidden: ({ parent }) => parent?.showTransformationRoute === false,
      validation: (Rule) => Rule.max(70),
    },
    {
      name: 'transformationRoutePhases',
      title: 'Fases de Transformación',
      type: 'array',
      hidden: ({ parent }) => parent?.showTransformationRoute === false,
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'title',
              title: 'Título',
              type: 'string',
              validation: (Rule) => Rule.required().max(40),
            },
            {
              name: 'subtitle',
              title: 'Subtítulo',
              type: 'string',
              validation: (Rule) => Rule.required().max(80),
            },
            {
              name: 'body',
              title: 'Descripción',
              type: 'text',
              rows: 3,
              validation: (Rule) => Rule.required().max(220),
            },
            {
              name: 'glow',
              title: 'Tema visual (glow)',
              type: 'string',
              options: {
                list: [
                  { title: 'Primario', value: 'from-brand-primary/30 to-transparent' },
                  { title: 'Secundario', value: 'from-brand-secondary/25 to-transparent' },
                  { title: 'Primario suave', value: 'from-brand-primarySoft/25 to-transparent' },
                ],
              },
            },
            {
              name: 'order',
              title: 'Orden',
              type: 'number',
              validation: (Rule) => Rule.required().min(1),
            },
          ],
          preview: {
            select: {
              title: 'title',
              subtitle: 'subtitle',
            },
          },
        },
      ],
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const parent = context?.parent as { showTransformationRoute?: boolean } | undefined
          if (parent?.showTransformationRoute === false) return true
          if (!Array.isArray(value) || value.length < 3) return 'Cargá al menos 3 fases para la ruta de transformación'
          return true
        }),
    },
    {
      name: 'showDecisionHub',
      title: 'Mostrar Mesa de Decisión Comercial',
      type: 'boolean',
      initialValue: true,
      description: 'Activa o desactiva la mesa interactiva de decisión comercial.',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'decisionHubTitle',
      title: 'Título Mesa de Decisión',
      type: 'string',
      initialValue: 'Mesa de decisión comercial (20s)',
      hidden: ({ parent }) => parent?.showDecisionHub === false,
      validation: (Rule) => Rule.max(80),
    },
    {
      name: 'decisionHubSubtitle',
      title: 'Subtítulo Mesa de Decisión',
      type: 'text',
      rows: 2,
      hidden: ({ parent }) => parent?.showDecisionHub === false,
      initialValue: 'Elegí contexto y obtené una recomendación de enfoque para este escenario.',
      validation: (Rule) => Rule.max(180),
    },
    {
      name: 'decisionHubClientTypes',
      title: 'Opciones: Tipo de Cliente',
      type: 'array',
      hidden: ({ parent }) => parent?.showDecisionHub === false,
      of: [{ type: 'string' }],
      initialValue: ['Startup', 'PyME', 'Corporativo'],
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const parent = context?.parent as { showDecisionHub?: boolean } | undefined
          if (parent?.showDecisionHub === false) return true
          if (!Array.isArray(value) || value.length < 2) return 'Definí al menos 2 opciones de tipo de cliente'
          return true
        }),
    },
    {
      name: 'decisionHubStages',
      title: 'Opciones: Etapa',
      type: 'array',
      hidden: ({ parent }) => parent?.showDecisionHub === false,
      of: [{ type: 'string' }],
      initialValue: ['Discovery', 'Propuesta', 'Entrega'],
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const parent = context?.parent as { showDecisionHub?: boolean } | undefined
          if (parent?.showDecisionHub === false) return true
          if (!Array.isArray(value) || value.length < 2) return 'Definí al menos 2 opciones de etapa'
          return true
        }),
    },
    {
      name: 'decisionHubPriorities',
      title: 'Opciones: Prioridad',
      type: 'array',
      hidden: ({ parent }) => parent?.showDecisionHub === false,
      of: [{ type: 'string' }],
      initialValue: ['Velocidad', 'Reducir riesgo', 'Claridad técnica'],
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const parent = context?.parent as { showDecisionHub?: boolean } | undefined
          if (parent?.showDecisionHub === false) return true
          if (!Array.isArray(value) || value.length < 2) return 'Definí al menos 2 prioridades'
          return true
        }),
    },
    {
      name: 'evolutionStatement',
      title: 'Declaración Profesional de Evolución',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required().min(30).max(220),
    },
    {
      name: 'targetRoles',
      title: 'Roles Objetivo',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Roles para reforzar posicionamiento híbrido.',
      options: {
        list: [
          { title: 'Sales Engineer', value: 'Sales Engineer' },
          { title: 'Pre-Sales', value: 'Pre-Sales' },
          { title: 'Consultor Comercial IT', value: 'Consultor Comercial IT' },
          { title: 'Business Developer (base técnica)', value: 'Business Developer (base técnica)' },
        ],
      },
      validation: (Rule) => Rule.required().min(1),
    },
    {
      name: 'ctaLabel',
      title: 'Texto CTA (opcional)',
      type: 'string',
      description: 'Ej: Mi enfoque estratégico',
      validation: (Rule) => Rule.max(50),
    },
    {
      name: 'ctaHref',
      title: 'Destino CTA (opcional)',
      type: 'string',
      description: 'Puede ser ancla (#contact) o URL completa.',
      validation: (Rule) =>
        Rule.custom((value) => {
          if (!value) return true
          if (typeof value !== 'string') return 'Debe ser texto'
          const isAnchor = /^#[a-z0-9-]+$/.test(value)
          const isUrl = /^https?:\/\//.test(value)
          return isAnchor || isUrl || 'Debe ser una ancla (#seccion) o URL válida'
        }),
    },
    {
      name: 'isEnabled',
      title: '¿Mostrar sección?',
      type: 'boolean',
      initialValue: true,
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'order',
      title: 'Orden',
      type: 'number',
      description: 'Orden de visualización de la sección en la home.',
      initialValue: 4,
      validation: (Rule) => Rule.required().min(1),
    },
  ],
  preview: {
    select: {
      title: 'sectionTitle',
      subtitle: 'sectionSubtitle',
      enabled: 'isEnabled',
    },
    prepare({ title, subtitle, enabled }) {
      return {
        title: enabled ? title : `⏸️ ${title}`,
        subtitle,
      }
    },
  },
})