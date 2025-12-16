import { getContactInfo } from '@/services/cms'
import { getGithubStats } from '@/services/github'
import ContactSectionClient from './ContactSectionClient'

export const revalidate = 3600 // Revalidate every hour

export default async function ContactSection() {
  const contactInfo = await getContactInfo()
  
  // 🔍 DEBUG: Verificar qué retorna Sanity
  console.log('📋 [ContactSection] contactInfo recibida:', {
    hasContactInfo: !!contactInfo,
    hasCvPreviewImage: !!contactInfo?.cvPreviewImage,
    cvPreviewImageData: contactInfo?.cvPreviewImage,
  })

  // Default data if not configured in Sanity yet
  const displayData = contactInfo || {
    headline: '¿Interesado en trabajar conmigo?',
    subtitle: '⚠️ Completa la configuración en Sanity Studio para ver esta sección',
    cvFile: {
      asset: {
        url: '#',
        filename: 'CV.pdf',
        size: 0,
      },
    },
    cvTitle: 'Mi CV',
    cvPreviewImage: undefined,
    primaryEmail: 'contacto@ejemplo.com',
    linkedinUrl: 'https://linkedin.com',
    enableGithubStats: false,
    timezone: 'America/Argentina/Buenos_Aires',
    businessHoursStart: '09:00',
    businessHoursEnd: '17:00',
    showQRCode: true,
    fullName: 'Tu Nombre',
  }

  // Fetch GitHub stats if enabled
  let githubStats = null
  if (
    displayData.enableGithubStats &&
    displayData.githubUsername
  ) {
    githubStats = await getGithubStats(displayData.githubUsername)
  }

  return (
    <ContactSectionClient
      contactInfo={displayData}
      githubStats={githubStats}
    />
  )
}
