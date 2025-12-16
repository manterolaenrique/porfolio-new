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

export async function getHero(): Promise<Hero | null> {
  try {
    const hero = await client.fetch<Hero>(HERO_QUERY)
    return hero
  } catch (error) {
    console.error('Error fetching hero:', error)
    return null
  }
}
