'use client'

import React from 'react'
import Link from 'next/link'
import SectionTitle from '@/components/ui/SectionTitle'
import ProjectsGrid from '@/components/sections/ProjectsGrid'
import { Project } from '@/domain/models'
import { FiArrowLeft } from 'react-icons/fi'

interface AllProjectsSectionProps {
  projects: Project[]
}

const AllProjectsSection: React.FC<AllProjectsSectionProps> = ({ projects }) => {
  return (
    <section className="py-20 bg-brand-bgSoft dark:bg-brand-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb / Back Link */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-brand-primary hover:text-brand-primarySoft transition-colors"
          >
            <FiArrowLeft />
            Volver a Home
          </Link>
        </div>

        <SectionTitle
          title="Todos los Proyectos"
          subtitle="Explorar mi portafolio completo de trabajos"
        />

        {projects.length > 0 ? (
          <ProjectsGrid projects={projects} showFeaturedBadge={true} />
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-brand-muted dark:text-gray-400">
              No hay proyectos disponibles por el momento.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}

export default AllProjectsSection
