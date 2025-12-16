'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { PortableText } from '@portabletext/react'
import SectionTitle from '@/components/ui/SectionTitle'
import Card from '@/components/ui/Card'
import Tag from '@/components/ui/Tag'
import Button from '@/components/ui/Button'
import { Project } from '@/domain/models'
import { urlFor } from '@/services/cms'
import { FiExternalLink, FiGithub, FiX } from 'react-icons/fi'

interface ProjectsSectionProps {
  projects: Project[]
}

const ProjectsSection: React.FC<ProjectsSectionProps> = ({ projects }) => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  const getImageUrl = (source: any, w = 400, h = 300) => {
    try {
      return source ? urlFor(source).width(w).height(h).url() : null
    } catch (e) {
      return null
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  return (
    <section id="projects" className="py-20 bg-brand-bgSoft dark:bg-brand-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title="Proyectos Destacados"
          subtitle="Una selección de mis trabajos más recientes y destacados"
        />

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {projects.map((project) => (
            <motion.div key={project._id} variants={itemVariants}>
              <Card
                hover3D
                className="cursor-pointer h-full flex flex-col overflow-hidden"
                onClick={() => setSelectedProject(project)}
              >
                {/* Thumbnail */}
                <div className="relative h-48 overflow-hidden bg-gray-200 dark:bg-gray-800">
                  {getImageUrl(project.thumbnail, 400, 300) ? (
                    <Image
                      src={getImageUrl(project.thumbnail, 400, 300)!}
                      alt={project.title}
                      fill
                      className="object-cover transition-transform duration-300 hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-800">
                      <span className="text-sm text-gray-500">Sin imagen</span>
                    </div>
                  )}
                  {project.isFeatured && (
                    <div className="absolute top-4 right-4">
                      <Tag variant="primary">⭐ Destacado</Tag>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold text-brand-text dark:text-white mb-2">
                    {project.title}
                  </h3>
                  
                  {project.role && (
                    <p className="text-sm text-brand-primary mb-3">
                      {project.role}
                    </p>
                  )}

                  <p className="text-brand-muted dark:text-gray-400 mb-4 flex-1">
                    {project.shortDescription}
                  </p>

                  {/* Technologies */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.slice(0, 4).map((tech, index) => (
                      <Tag key={index} variant="neutral">
                        {tech}
                      </Tag>
                    ))}
                    {project.technologies.length > 4 && (
                      <Tag variant="neutral">+{project.technologies.length - 4}</Tag>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    {project.demoUrl && (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-2 text-brand-primary hover:text-brand-primarySoft transition-colors"
                      >
                        <FiExternalLink /> Demo
                      </a>
                    )}
                    {project.codeUrl && (
                      <a
                        href={project.codeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-2 text-brand-primary hover:text-brand-primarySoft transition-colors"
                      >
                        <FiGithub /> Código
                      </a>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Modal de Proyecto */}
        <AnimatePresence>
          {selectedProject && (
            <motion.div
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
            >
              <motion.div
                className="bg-white dark:bg-brand-surfaceDark rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="sticky top-0 bg-white dark:bg-brand-surfaceDark border-b border-brand-border dark:border-gray-700 p-6 flex justify-between items-start z-10">
                  <div>
                    <h2 className="text-3xl font-bold text-brand-text dark:text-white mb-2">
                      {selectedProject.title}
                    </h2>
                    {selectedProject.role && (
                      <p className="text-brand-primary">{selectedProject.role}</p>
                    )}
                  </div>
                  <button
                    onClick={() => setSelectedProject(null)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                    aria-label="Cerrar"
                  >
                    <FiX size={24} />
                  </button>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Main Image */}
                  <div className="relative h-64 md:h-96 rounded-lg overflow-hidden mb-6">
                    {getImageUrl(selectedProject.thumbnail, 800, 600) ? (
                      <Image
                        src={getImageUrl(selectedProject.thumbnail, 800, 600)!}
                        alt={selectedProject.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                        <span className="text-lg text-gray-500">Sin imagen</span>
                      </div>
                    )}
                  </div>

                  {/* Gallery */}
                  {selectedProject.gallery && selectedProject.gallery.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                      {selectedProject.gallery.map((image, index) => (
                        <div key={index} className="relative h-32 rounded-lg overflow-hidden">
                          {getImageUrl(image, 400, 300) ? (
                            <Image
                              src={getImageUrl(image, 400, 300)!}
                              alt={`${selectedProject.title} - ${index + 1}`}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-800">
                              <span className="text-xs text-gray-500">Sin imagen</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Description */}
                  {selectedProject.longDescription && (
                    <div className="prose prose-lg dark:prose-invert max-w-none mb-6">
                      <PortableText value={selectedProject.longDescription} />
                    </div>
                  )}

                  {/* Technologies */}
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold text-brand-text dark:text-white mb-3">
                      Tecnologías Utilizadas
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.technologies.map((tech, index) => (
                        <Tag key={index} variant="primary">
                          {tech}
                        </Tag>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-4">
                    {selectedProject.demoUrl && (
                      <Button
                        variant="primary"
                        href={selectedProject.demoUrl}
                        asLink
                      >
                        <FiExternalLink className="mr-2" />
                        Ver Demo
                      </Button>
                    )}
                    {selectedProject.codeUrl && (
                      <Button
                        variant="outline"
                        href={selectedProject.codeUrl}
                        asLink
                      >
                        <FiGithub className="mr-2" />
                        Ver Código
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}

export default ProjectsSection
