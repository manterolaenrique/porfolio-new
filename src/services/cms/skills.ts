import { client } from './sanityClient'
import type { SkillGroup } from '@/domain/models'

const SKILLS_BY_GROUP_QUERY = `
  *[_type == "skillGroup"] | order(order asc) {
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
`

export async function getSkillsByGroup(): Promise<SkillGroup[]> {
  try {
    const groups = await client.fetch<SkillGroup[]>(SKILLS_BY_GROUP_QUERY)
    return groups || []
  } catch (error) {
    console.error('Error fetching skills by group:', error)
    return []
  }
}
