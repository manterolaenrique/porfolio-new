/**
 * Seed script for commercialProfile document in Sanity
 * Usage: node scripts/seedCommercialProfile.js
 */
const fs = require('fs')
const path = require('path')
const { createClient } = require('@sanity/client')

function loadEnvFromFileIfExists() {
  const envPath = path.join(process.cwd(), '.env.local')
  if (!fs.existsSync(envPath)) return

  const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/)
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue

    const equalIndex = trimmed.indexOf('=')
    if (equalIndex <= 0) continue

    const key = trimmed.slice(0, equalIndex).trim()
    let value = trimmed.slice(equalIndex + 1).trim()

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }

    if (!process.env[key]) {
      process.env[key] = value
    }
  }
}

loadEnvFromFileIfExists()

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-01-01'
const writeToken = process.env.SANITY_WRITE_TOKEN || process.env.SANITY_API_WRITE_TOKEN

if (!projectId || !dataset) {
  console.error('ERROR: Falta NEXT_PUBLIC_SANITY_PROJECT_ID o NEXT_PUBLIC_SANITY_DATASET en variables de entorno')
  process.exit(1)
}

if (!writeToken) {
  console.error('ERROR: Falta SANITY_WRITE_TOKEN (o SANITY_API_WRITE_TOKEN) para poder escribir en Sanity')
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token: writeToken,
  useCdn: false,
})

const introNarrative = [
  {
    _type: 'block',
    style: 'normal',
    markDefs: [],
    children: [
      {
        _type: 'span',
        marks: [],
        text: 'Durante años construí soluciones desde el código, enfocándome en calidad técnica, experiencia de usuario y escalabilidad.',
      },
    ],
  },
  {
    _type: 'block',
    style: 'normal',
    markDefs: [],
    children: [
      {
        _type: 'span',
        marks: [],
        text: 'Con el tiempo entendí que la tecnología solo genera valor real cuando responde a problemas concretos de negocio y de clientes.',
      },
    ],
  },
  {
    _type: 'block',
    style: 'normal',
    markDefs: [],
    children: [
      {
        _type: 'span',
        marks: [],
        text: 'La experiencia de gestionar mi propio negocio me dio una perspectiva integral sobre decisiones comerciales, operación y rentabilidad. En 2026 decidí potenciar conscientemente ese diferencial para integrarlo con mi perfil Fullstack.',
      },
    ],
  },
]

const commercialProfileData = {
  _id: 'commercialProfile',
  _type: 'commercialProfile',
  sectionTitle: 'Del código al impacto',
  sectionSubtitle:
    'Evolucioné mi perfil para integrar desarrollo de software, visión de negocio y relación con clientes, sin perder mi base técnica.',
  anchorId: 'business-vision',
  introNarrative,
  experienceItems: [
    {
      _type: 'object',
      title: 'Gestión integral de negocio propio (4+ años)',
      description:
        'Lideré la operación comercial y estratégica, tomando decisiones sostenidas sobre crecimiento, eficiencia y experiencia del cliente.',
      order: 1,
    },
    {
      _type: 'object',
      title: 'Liderazgo de equipo y operación diaria',
      description:
        'Coordiné equipos de trabajo, definí prioridades y aseguré ejecución consistente en escenarios de alta demanda.',
      order: 2,
    },
    {
      _type: 'object',
      title: 'Ventas, atención y negociación',
      description:
        'Gestioné ventas directas, atención al cliente y negociación con proveedores para sostener márgenes y calidad de servicio.',
      order: 3,
    },
    {
      _type: 'object',
      title: 'Administración, finanzas y rentabilidad',
      description:
        'Controlé indicadores clave, costos, márgenes y resultados para respaldar decisiones con criterio financiero.',
      order: 4,
    },
  ],
  preSalesCapabilities: [
    {
      _type: 'object',
      title: 'Descubrimiento y relevamiento con clientes',
      description:
        'Trabajo sobre necesidades reales antes de proponer soluciones, alineando expectativas técnicas y objetivos de negocio.',
      order: 1,
    },
    {
      _type: 'object',
      title: 'Traducción negocio → requerimientos técnicos',
      description:
        'Transformo problemas comerciales en especificaciones accionables para producto y desarrollo.',
      order: 2,
    },
    {
      _type: 'object',
      title: 'Evaluación de viabilidad y puente con el equipo',
      description:
        'Valido alcance, esfuerzo y riesgos antes de comprometer soluciones, actuando como nexo entre cliente y equipo técnico.',
      order: 3,
    },
  ],
  showTransformationRoute: true,
  transformationRouteTitle: 'Ruta de transformación',
  transformationRoutePhases: [
    {
      _type: 'object',
      title: 'Código',
      subtitle: 'Base técnica sólida',
      body: 'Consolidé arquitectura, calidad y ejecución para entregar soluciones robustas y mantenibles.',
      glow: 'from-brand-primary/30 to-transparent',
      order: 1,
    },
    {
      _type: 'object',
      title: 'Negocio',
      subtitle: 'Decisiones con contexto',
      body: 'Incorporé visión comercial para priorizar por impacto real en clientes, márgenes y crecimiento.',
      glow: 'from-brand-secondary/25 to-transparent',
      order: 2,
    },
    {
      _type: 'object',
      title: 'Preventa',
      subtitle: 'Puente cliente-equipo',
      body: 'Conecto discovery, viabilidad técnica y propuesta de valor para reducir riesgos antes de ejecutar.',
      glow: 'from-brand-primarySoft/25 to-transparent',
      order: 3,
    },
    {
      _type: 'object',
      title: 'Impacto',
      subtitle: 'Resultado medible',
      body: 'Transformo conversaciones comerciales en soluciones concretas, con foco en adopción y resultados.',
      glow: 'from-brand-secondary/30 to-transparent',
      order: 4,
    },
  ],
  showDecisionHub: true,
  decisionHubTitle: 'Cómo abordo tu escenario en 20s',
  decisionHubSubtitle:
    'Seleccioná contexto, etapa y prioridad para ver un enfoque comercial-técnico adaptado.',
  decisionHubClientTypes: ['Startup', 'PyME', 'Corporativo'],
  decisionHubStages: ['Discovery', 'Propuesta', 'Entrega'],
  decisionHubPriorities: ['Velocidad', 'Reducir riesgo', 'Claridad técnica'],
  evolutionStatement:
    'No solo desarrollo software. Construyo soluciones entendiendo el negocio y a las personas detrás de él.',
  targetRoles: [
    'Sales Engineer',
    'Pre-Sales',
    'Consultor Comercial IT',
    'Business Developer (base técnica)',
  ],
  ctaLabel: 'Mi enfoque estratégico',
  ctaHref: '#contact',
  isEnabled: true,
  order: 4,
}

async function seedCommercialProfile() {
  try {
    await client.createOrReplace(commercialProfileData)
    console.log('✓ commercialProfile creado/actualizado con éxito')
  } catch (error) {
    console.error('✗ Error al cargar commercialProfile:', error)
    process.exit(1)
  }
}

seedCommercialProfile()