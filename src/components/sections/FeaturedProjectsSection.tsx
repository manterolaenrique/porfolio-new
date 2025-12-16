'use client'

import React from 'react'
import Link from 'next/link'
import SectionTitle from '@/components/ui/SectionTitle'
import Button from '@/components/ui/Button'
import ProjectsGrid from '@/components/sections/ProjectsGrid'
import { Project } from '@/domain/models'
import { FiArrowRight } from 'react-icons/fi'

interface FeaturedProjectsSectionProps {
  projects: Project[]
}

const FeaturedProjectsSection: React.FC<FeaturedProjectsSectionProps> = ({
  projects,
}) => {
  return (
    <section id="projects" className="py-20 bg-brand-bgSoft dark:bg-brand-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title="Proyectos Destacados"
          subtitle="Una selección de mis trabajos más recientes y destacados"
        />

        <ProjectsGrid projects={projects} showFeaturedBadge={true} />

        {/* Ver Todos Button */}
        <div className="mt-12 flex justify-center">
          <Link href="/projects">
            <Button variant="primary" className="flex items-center gap-2">
              Ver Todos los Proyectos
              <FiArrowRight />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}

export default FeaturedProjectsSection
