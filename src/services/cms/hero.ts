import { client } from './sanityClient'
import type { Hero } from '@/domain/models'

const HERO_QUERY = `
  *[_type == "hero" && _id == "hero"][0] {
    name,
    highlightSurname,
    role,
    stackSummary,
    shortPitch,
    avatar,
    ctaPrimary,
    ctaSecondary,
    "socialLinks": socialLinks[]-> {
      _id,
      label,
      type,
      url,
      icon
    },
    showParticles,
    showParallax
  }
`

const PORTFOLIO_HERO_COPY = {
  role: 'Preventa técnica y soluciones Full Stack',
  shortPitch:
    'Conecto necesidades de negocio con soluciones técnicas claras, viables y escalables.',
  ctaPrimary: {
    label: 'Ver proyectos',
    href: '#projects',
  },
  ctaSecondary: {
    label: 'Contactarme',
    href: '#contact',
  },
}

export async function getHero(): Promise<Hero | null> {
  try {
    const hero = await client.fetch<Hero>(HERO_QUERY)
    if (!hero) return hero

    return {
      ...hero,
      ...PORTFOLIO_HERO_COPY,
    }
  } catch (error) {
    console.error('Error fetching hero:', error)
    return null
  }
}
