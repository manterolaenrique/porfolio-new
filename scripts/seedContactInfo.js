/**
 * Seed script for contactInfo document in Sanity
 * Run: npx sanity exec scripts/seedContactInfo.js --dataset production
 */

import sanityClient from 'part:@sanity/base/client'

const client = sanityClient.withConfig({ dataset: 'production' })

async function seedContactInfo() {
  try {
    // Check if contactInfo already exists
    const existing = await client.fetch(
      '*[_type == "contactInfo"][0]'
    )

    const contactData = {
      _type: 'contactInfo',
      headline: '¿Interesado en trabajar conmigo?',
      subtitle: 'Descarga mi CV o contáctame por tus medios preferidos.',
      cvTitle: 'Mi CV Actualizado',
      primaryEmail: 'contacto@enriquemanterola.com',
      linkedinUrl: 'https://linkedin.com/in/enriquemanterola',
      githubUsername: 'enriquemanterola',
      enableGithubStats: true,
      timezone: 'America/Argentina/Buenos_Aires',
      businessHoursStart: '09:00',
      businessHoursEnd: '17:00',
      showQRCode: true,
      fullName: 'Enrique Manterola',
      // Note: cvFile must be added manually via Sanity Studio
      // as it requires uploading a PDF file
    }

    if (existing) {
      // Update existing
      const updated = await client
        .patch(existing._id)
        .set(contactData)
        .commit()

      console.log('✓ ContactInfo document updated:', updated._id)
    } else {
      // Create new
      const created = await client.create({
        _id: 'contactInfo',
        ...contactData,
      })

      console.log('✓ ContactInfo document created:', created._id)
    }
  } catch (error) {
    console.error('✗ Error seeding contactInfo:', error)
  }
}

seedContactInfo()
