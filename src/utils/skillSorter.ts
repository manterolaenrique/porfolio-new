import { Skill } from '@/domain/models'

const LEVEL_ORDER = {
  'expert': 0,
  'advanced': 1,
  'intermediate': 2,
  'basic': 3,
} as const

/**
 * Ordena skills por nivel de expertise (descendente)
 * Expert → Advanced → Intermediate → Basic
 */
export const sortSkillsByLevel = (skills: Skill[]): Skill[] => {
  return [...skills].sort((a, b) => {
    const levelA = LEVEL_ORDER[a.level || 'basic']
    const levelB = LEVEL_ORDER[b.level || 'basic']
    return levelA - levelB
  })
}

/**
 * Formatea lista de skills como string separado por comas
 */
export const formatSkillsList = (skills: Skill[]): string => {
  return skills.map(s => s.name).join(', ')
}

/**
 * Agrupa skills por categoría
 */
export const getSkillsByCategory = (
  skills: Skill[]
): Record<string, Skill[]> => {
  return skills.reduce(
    (acc, skill) => {
      const category = skill.category || 'other'
      if (!acc[category]) {
        acc[category] = []
      }
      acc[category].push(skill)
      return acc
    },
    {} as Record<string, Skill[]>
  )
}
