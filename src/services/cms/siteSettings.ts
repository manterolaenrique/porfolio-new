import { client } from './sanityClient'
import type { SiteSettings } from '@/domain/models'

const SITE_SETTINGS_QUERY = `
  *[_type == "siteSettings" && _id == "siteSettings"][0] {
    title,
    description,
    language,
    theme,
    primaryColor,
    favicon,
    ogImage
  }
`

export async function getSiteSettings(): Promise<SiteSettings | null> {
  try {
    const settings = await client.fetch<SiteSettings>(SITE_SETTINGS_QUERY)
    return settings
  } catch (error) {
    console.error('Error fetching site settings:', error)
    return null
  }
}
