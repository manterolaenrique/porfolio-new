import { client } from './sanityClient'
import type { Project } from '@/domain/models'

const PROJECTS_BASE_QUERY = `
  {
    _id,
    title,
    "slug": slug.current,
    shortDescription,
    longDescription,
    thumbnail,
    gallery,
    technologies,
    role,
    isFeatured,
    demoUrl,
    codeUrl,
    order
  }
`

const FEATURED_PROJECTS_QUERY = `
  *[_type == "project" && isFeatured == true] | order(order asc) ${PROJECTS_BASE_QUERY}
`

const ALL_PROJECTS_QUERY = `
  *[_type == "project"] | order(isFeatured desc, order asc) ${PROJECTS_BASE_QUERY}
`

const PROJECT_BY_SLUG_QUERY = `
  *[_type == "project" && slug.current == $slug][0] ${PROJECTS_BASE_QUERY}
`

export async function getFeaturedProjects(): Promise<Project[]> {
  try {
    const projects = await client.fetch<Project[]>(FEATURED_PROJECTS_QUERY)
    return projects || []
  } catch (error) {
    console.error('Error fetching featured projects:', error)
    return []
  }
}

export async function getAllProjects(): Promise<Project[]> {
  try {
    const projects = await client.fetch<Project[]>(ALL_PROJECTS_QUERY)
    return projects || []
  } catch (error) {
    console.error('Error fetching all projects:', error)
    return []
  }
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  try {
    const project = await client.fetch<Project>(PROJECT_BY_SLUG_QUERY, { slug })
    return project
  } catch (error) {
    console.error('Error fetching project by slug:', error)
    return null
  }
}
