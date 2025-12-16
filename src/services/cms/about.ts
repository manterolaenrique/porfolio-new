import { client } from './sanityClient'
import type { About } from '@/domain/models'

const ABOUT_QUERY = `
  *[_type == "about" && _id == "about"][0] {
    title,
    intro,
    body,
    yearsExperience,
    currentCity,
    highlightedKeywords,
    "skillGroups": *[_type == "skillGroup"] | order(order asc) {
      _id,
      title,
      icon,
      order,
      "skills": skills[]-> {
        _id,
        name,
        level,
        category,
        icon,
        isHighlighted
      }
    }
  }
`

export async function getAbout(): Promise<About | null> {
  try {
    const about = await client.fetch<About>(ABOUT_QUERY)
    return about
  } catch (error) {
    console.error('Error fetching about:', error)
    return null
  }
}
