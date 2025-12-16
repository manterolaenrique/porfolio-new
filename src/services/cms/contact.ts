import { client } from './sanityClient'
import type { ContactInfo } from '@/domain/models'

const CONTACT_INFO_QUERY = `
  *[_type == "contactInfo" && _id == "contactInfo"][0] {
    _id,
    headline,
    subtitle,
    cvFile {
      asset-> {
        url,
        filename,
        size
      }
    },
    cvTitle,
    cvPreviewImage,
    primaryEmail,
    linkedinUrl,
    githubUsername,
    enableGithubStats,
    timezone,
    businessHoursStart,
    businessHoursEnd,
    showQRCode,
    fullName
  }
`

export async function getContactInfo(): Promise<ContactInfo | null> {
  try {
    const contact = await client.fetch<ContactInfo>(CONTACT_INFO_QUERY)
    
    console.log('🔗 [getContactInfo] Datos de Sanity:', {
      id: contact?._id,
      hasCvPreviewImage: !!contact?.cvPreviewImage,
      cvPreviewImageValue: contact?.cvPreviewImage,
    })
    
    return contact
  } catch (error) {
    console.error('❌ Error fetching contact info:', error)
    return null
  }
}
