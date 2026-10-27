import type { NexoraProject } from "@/domain/nexora";

export const NEXORA_QUERY = `{
  "settings": *[_type == "nexoraSettings" && _id == "nexoraSettings"][0]{..., "whatsappNumber": *[_type == "contactInfo" && _id == "contactInfo"][0].whatsappNumber},
  "services": *[_type == "nexoraService" && isActive != false] | order(order asc) {
    "id": _id, title, "slug": slug.current, summary, deliverables, icon, projectType
  },
  "projects": *[_type == "nexoraProject" && isActive != false && (!defined(technicalProject._ref) || defined(technicalProject->_id))] | order(order asc) {
    "id": _id, title, "slug": slug.current, category, status, summary, problem, solution,
    "features": coalesce(features, []), "results": coalesce(results, []),
    "technicalProjectId": technicalProject._ref,
    "image": select(defined(technicalProject._ref) => technicalProject->thumbnail.asset->url, standalone.thumbnail.asset->url),
    "mobileImage": select(defined(technicalProject._ref) => technicalProject->devicePreviews.mobile.asset->url, standalone.mobileImage.asset->url),
    "gallery": select(defined(technicalProject._ref) => technicalProject->gallery[].asset->url, standalone.gallery[].asset->url),
    "technologies": select(defined(technicalProject._ref) => technicalProject->technologies, standalone.technologies),
    "demoUrl": select(defined(technicalProject._ref) => technicalProject->demoUrl, standalone.demoUrl),
    "codeUrl": select(defined(technicalProject._ref) => technicalProject->codeUrl, standalone.codeUrl),
    recommendation { text, author, role, company }
  }
}`;

export function normalizeNexoraProjects(
  projects: NexoraProject[],
): NexoraProject[] {
  return projects
    .filter((project) => !!project.slug && !!project.image)
    .map((project) => ({
      ...project,
      features: project.features || [],
      results: project.results || [],
      gallery: (project.gallery || []).filter(Boolean),
      technologies: project.technologies || [],
      recommendation:
        project.recommendation?.text?.trim() &&
        project.recommendation.author?.trim()
          ? project.recommendation
          : undefined,
    }));
}
