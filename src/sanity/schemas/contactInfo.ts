import { defineType } from 'sanity'

export default defineType({
  name: 'contactInfo',
  title: 'Información de Contacto',
  type: 'document',

  fields: [
    // === HEADER ===
    {
      name: 'headline',
      title: 'Encabezado Principal',
      type: 'string',
      description: 'Título principal de la sección',
      initialValue: '¿Interesado en trabajar conmigo?',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'subtitle',
      title: 'Subtítulo',
      type: 'text',
      description: 'Texto descriptivo debajo del título',
      initialValue: 'Descarga mi CV o contáctame por tus medios preferidos.',
      validation: (Rule) => Rule.required(),
    },

    // === DESCARGA CV ===
    {
      name: 'cvFile',
      title: 'Archivo CV (PDF)',
      type: 'file',
      options: {
        accept: 'application/pdf',
      },
      description: 'Documento PDF del CV',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'cvTitle',
      title: 'Título CV',
      type: 'string',
      description: 'Texto mostrado en el botón',
      initialValue: 'Mi CV Actualizado',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'cvPreviewImage',
      title: 'Imagen de Vista Previa del CV',
      type: 'image',
      description: 'Imagen PNG/JPG de la primera página del CV. Si no se proporciona, se mostrará una animación placeholder.',
      options: {
        hotspot: true,
      },
    },

    // === CONTACTO DIRECTO ===
    {
      name: 'primaryEmail',
      title: 'Email Principal',
      type: 'string',
      description: 'Email de contacto principal',
      validation: (Rule) => Rule.required().email(),
    },
    {
      name: 'linkedinUrl',
      title: 'URL LinkedIn',
      type: 'string',
      description: 'URL completa del perfil LinkedIn',
      validation: (Rule) =>
        Rule.required().uri({ scheme: ['https'] }),
    },

    // === GITHUB (Para Stats) ===
    {
      name: 'githubUsername',
      title: 'Usuario GitHub',
      type: 'string',
      description: 'Username para obtener estadísticas (ej: torvalds)',
    },
    {
      name: 'enableGithubStats',
      title: 'Mostrar Estadísticas GitHub',
      type: 'boolean',
      description: 'Mostrar card con stats de GitHub (requiere username)',
      initialValue: true,
    },

    // === TIMEZONE ===
    {
      name: 'timezone',
      title: 'Zona Horaria',
      type: 'string',
      description: 'Zona horaria para mostrar hora actual',
      initialValue: 'America/Argentina/Buenos_Aires',
      options: {
        list: [
          {
            title: 'América/Argentina/Buenos Aires (UTC -3)',
            value: 'America/Argentina/Buenos_Aires',
          },
          {
            title: 'América/México/México City (UTC -6)',
            value: 'America/Mexico_City',
          },
          {
            title: 'América/Nueva York (UTC -5)',
            value: 'America/New_York',
          },
          {
            title: 'Europa/Madrid (UTC +1)',
            value: 'Europe/Madrid',
          },
          {
            title: 'Europa/Londres (UTC +0)',
            value: 'Europe/London',
          },
          {
            title: 'Asia/Tokio (UTC +9)',
            value: 'Asia/Tokyo',
          },
        ],
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'businessHoursStart',
      title: 'Hora Inicio Laboral',
      type: 'string',
      description: 'Hora en formato 24h (ej: 09:00)',
      initialValue: '09:00',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'businessHoursEnd',
      title: 'Hora Fin Laboral',
      type: 'string',
      description: 'Hora en formato 24h (ej: 17:00)',
      initialValue: '17:00',
      validation: (Rule) => Rule.required(),
    },

    // === QR CODE ===
    {
      name: 'showQRCode',
      title: 'Mostrar Código QR',
      type: 'boolean',
      description: 'Mostrar card con código QR de contacto',
      initialValue: true,
    },
    {
      name: 'fullName',
      title: 'Nombre Completo',
      type: 'string',
      description: 'Nombre para generar vCard en QR (ej: Enrique Manterola)',
      validation: (Rule) => Rule.required(),
    },
  ],

  preview: {
    select: {
      title: 'headline',
      subtitle: 'primaryEmail',
    },
    prepare(selection) {
      return {
        title: selection.title,
        subtitle: `Email: ${selection.subtitle}`,
      }
    },
  },
})
