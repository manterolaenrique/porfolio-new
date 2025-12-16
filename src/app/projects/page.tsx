import MainLayout from '@/components/layout/MainLayout'
import AllProjectsSection from '@/components/sections/AllProjectsSection'
import { getAllProjects } from '@/services/cms'

export const revalidate = 3600 // Revalidar cada hora

export const metadata = {
  title: 'Todos los Proyectos',
  description: 'Explora mi portafolio completo de proyectos y trabajos realizados',
}

export default async function ProjectsPage() {
  const projects = await getAllProjects()

  return (
    <MainLayout>
      <AllProjectsSection projects={projects} />
    </MainLayout>
  )
}
