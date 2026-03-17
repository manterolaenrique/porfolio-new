import MainLayout from '@/components/layout/MainLayout'
import HeroSection from '@/components/sections/HeroSection'
import AboutSection from '@/components/sections/AboutSection'
import FeaturedProjectsSection from '@/components/sections/FeaturedProjectsSection'
import CommercialProfileSection from '@/components/sections/CommercialProfileSection'
import ContactSection from '@/components/sections/ContactSection'
import { getHero, getAbout, getFeaturedProjects, getCommercialProfile } from '@/services/cms'

export const revalidate = 3600 // Revalidar cada hora

export default async function HomePage() {
  // Fetch data from Sanity
  const [hero, about, projects, commercialProfile] = await Promise.all([
    getHero(),
    getAbout(),
    getFeaturedProjects(),
    getCommercialProfile(),
  ])

  return (
    <MainLayout>
      {hero && <HeroSection data={hero} />}
      {about && <AboutSection data={about} />}
      {projects && projects.length > 0 && (
        <FeaturedProjectsSection projects={projects} />
      )}
      {commercialProfile && commercialProfile.isEnabled && (
        <CommercialProfileSection data={commercialProfile} />
      )}
      <ContactSection />
    </MainLayout>
  )
}
