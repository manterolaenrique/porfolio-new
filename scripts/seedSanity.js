/**
 * Simple seed script for Sanity (Node.js)
 * Usage: node scripts/seedSanity.js
 * Requires SANITY_WRITE_TOKEN env var with write permissions.
 */
const { createClient } = require('@sanity/client')
const { Readable } = require('stream')

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-01-01'
const writeToken = process.env.SANITY_WRITE_TOKEN

if (!projectId || !dataset) {
  console.error('ERROR: Falta NEXT_PUBLIC_SANITY_PROJECT_ID o NEXT_PUBLIC_SANITY_DATASET en las variables de entorno')
  process.exit(1)
}

if (!writeToken) {
  console.error('ERROR: Falta SANITY_WRITE_TOKEN en las variables de entorno. Crea un token con permisos de escritura en el panel de Sanity (Settings -> API) y expórtalo como SANITY_WRITE_TOKEN')
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token: writeToken,
  useCdn: false,
})

// Pequeña imagen placeholder (1x1 PNG) embebida en base64 para evitar validaciones de avatar/thumbnail
const PLACEHOLDER_PNG_BASE64 = '\
iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8Pw8AAn8B9p4gWgAAAABJRU5ErkJggg=='

async function uploadPlaceholder() {
  try {
    const buffer = Buffer.from(PLACEHOLDER_PNG_BASE64, 'base64')
    // Subir directamente el buffer (client admite Buffer para assets)
    const res = await client.assets.upload('image', buffer, { filename: 'placeholder.png' })
    // devolver referencia usable en documentos
    return { _type: 'image', asset: { _type: 'reference', _ref: res._id } }
  } catch (err) {
    console.error('Error subiendo placeholder a Sanity:', err)
    throw err
  }
}

async function run() {
  try {
    console.log('Seeding Sanity...')

  // Site settings
    await client.createOrReplace({
      _id: 'siteSettings',
      _type: 'siteSettings',
      title: 'Enrique Manterola',
      description: 'Portfolio profesional de Enrique Manterola',
      language: 'es',
      theme: 'dark',
      primaryColor: '#6C5CE7',
    })

    // Hero
    await client.createOrReplace({
      _id: 'hero',
      _type: 'hero',
      name: 'Enrique Manterola',
      highlightSurname: true,
      role: 'Full Stack Developer',
      stackSummary: ['React', 'Next.js', 'TypeScript', 'Node.js'],
      shortPitch: 'Construyo productos digitales con foco en la experiencia y rendimiento.',
      // avatar omitted - subir desde Studio o assets/ si lo deseas
      showParticles: true,
      showParallax: true,
    })

    // Example social links
    const github = await client.createIfNotExists({ _id: 'social-github', _type: 'socialLink', label: 'GitHub', type: 'github', url: 'https://github.com', icon: 'FaGithub' })
    const linkedin = await client.createIfNotExists({ _id: 'social-linkedin', _type: 'socialLink', label: 'LinkedIn', type: 'linkedin', url: 'https://linkedin.com', icon: 'FaLinkedin' })

    // Example skills and groups
    const skillReact = await client.createIfNotExists({ _id: 'skill-react', _type: 'skill', name: 'React', level: 'expert', category: 'framework', icon: 'SiReact', isHighlighted: true })
    const skillTS = await client.createIfNotExists({ _id: 'skill-ts', _type: 'skill', name: 'TypeScript', level: 'expert', category: 'language', icon: 'SiTypescript', isHighlighted: true })

    const frontendGroup = await client.createIfNotExists({
      _id: 'skillgroup-frontend',
      _type: 'skillGroup',
      title: 'Frontend',
      order: 1,
      skills: [{ _ref: skillReact._id || skillReact._id }, { _ref: skillTS._id || skillTS._id }],
    })

    // About
    await client.createOrReplace({
      _id: 'about',
      _type: 'about',
      title: 'Sobre Mí',
      intro: 'Soy un desarrollador apasionado por crear productos digitales.',
      body: [
        { _type: 'block', children: [{ _type: 'span', text: 'Me especializo en construir interfaces robustas y accesibles.' }] },
      ],
      yearsExperience: 6,
      currentCity: 'Santiago, Chile',
      highlightedKeywords: ['React', 'TypeScript', 'Next.js'],
      skillGroups: [{ _ref: frontendGroup._id || frontendGroup._id }],
    })

    // Example project
    await client.create({
      _type: 'project',
      title: 'Proyecto Ejemplo',
      slug: { current: 'proyecto-ejemplo' },
      shortDescription: 'Un proyecto de ejemplo para demostrar el portfolio.',
      longDescription: [{ _type: 'block', children: [{ _type: 'span', text: 'Descripción larga del proyecto.' }] }],
      // thumbnail omitted - subir desde Studio o assets/ si lo deseas
      technologies: ['React', 'Next.js', 'Sanity'],
      isFeatured: true,
      order: 1,
    })

    console.log('Seeding finished')
  } catch (err) {
    console.error('Seeding error', err)
    process.exit(1)
  }
}

run()
