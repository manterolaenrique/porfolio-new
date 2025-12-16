import { getProjectBySlug } from '@/services/cms'
import { urlFor } from '@/services/cms'
import Image from 'next/image'
import { PortableText } from '@portabletext/react'
import Button from '@/components/ui/Button'
import { FiExternalLink, FiGithub } from 'react-icons/fi'

export const revalidate = 3600

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params
  const project = await getProjectBySlug(slug)

  if (!project) {
    return <div className="p-8">Proyecto no encontrado</div>
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-brand-text dark:text-white">{project.title}</h1>
        {project.role && <p className="text-brand-primary mt-2">{project.role}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <div className="relative w-full h-80 rounded-lg overflow-hidden">
            <Image
              src={urlFor(project.thumbnail).width(1200).height(800).url()}
              alt={project.title}
              fill
              className="object-cover"
            />
          </div>

          {project.gallery && project.gallery.length > 0 && (
            <div className="grid grid-cols-2 gap-4 mt-4">
              {project.gallery.map((img, i) => (
                <div key={i} className="relative h-40 rounded overflow-hidden">
                  <Image
                    src={urlFor(img).width(600).height(400).url()}
                    alt={`${project.title} - ${i + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="prose prose-lg dark:prose-invert max-w-none mb-6">
            {project.longDescription && <PortableText value={project.longDescription} />}
          </div>

          <div className="mb-6">
            <h3 className="font-semibold text-lg text-brand-text dark:text-white mb-2">Tecnologías</h3>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((t, i) => (
                <span key={i} className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-sm">{t}</span>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            {project.demoUrl && (
              <Button variant="primary" href={project.demoUrl} asLink>
                <FiExternalLink className="mr-2" /> Ver Demo
              </Button>
            )}
            {project.codeUrl && (
              <Button variant="outline" href={project.codeUrl} asLink>
                <FiGithub className="mr-2" /> Código
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
