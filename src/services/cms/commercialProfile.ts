import { client } from './sanityClient'
import type { CommercialProfile } from '@/domain/models'

const COMMERCIAL_PROFILE_QUERY = `
  *[_type == "commercialProfile"][0] {
    sectionTitle,
    sectionSubtitle,
    anchorId,
    introNarrative,
    showTransformationRoute,
    transformationRouteTitle,
    "transformationRoutePhases": transformationRoutePhases | order(order asc) {
      title,
      subtitle,
      body,
      glow,
      order
    },
    showDecisionHub,
    decisionHubTitle,
    decisionHubSubtitle,
    decisionHubClientTypes,
    decisionHubStages,
    decisionHubPriorities,
    "experienceItems": experienceItems | order(order asc) {
      title,
      description,
      order
    },
    "preSalesCapabilities": preSalesCapabilities | order(order asc) {
      title,
      description,
      order
    },
    evolutionStatement,
    targetRoles,
    ctaLabel,
    ctaHref,
    isEnabled,
    order
  }
`

export async function getCommercialProfile(): Promise<CommercialProfile | null> {
  try {
    const profile = await client.fetch<CommercialProfile>(COMMERCIAL_PROFILE_QUERY)
    return profile
  } catch (error) {
    console.error('Error fetching commercial profile:', error)
    return null
  }
}