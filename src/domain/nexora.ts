export type NexoraProjectCategory = "saas" | "tool" | "web" | "custom";

export interface NexoraProject {
  id: string;
  title: string;
  slug: string;
  category: NexoraProjectCategory;
  status?: "published" | "in-development" | "archived";
  summary: string;
  problem: string;
  solution: string;
  features: string[];
  results: string[];
  technologies: string[];
  image: string;
  mobileImage?: string;
  gallery: string[];
  demoUrl?: string;
  codeUrl?: string;
  technicalProjectId?: string;
  recommendation?: {
    text: string;
    author: string;
    role?: string;
    company?: string;
  };
}

export interface NexoraService {
  id: string;
  title: string;
  slug: string;
  summary: string;
  deliverables: string[];
  icon: "code" | "layers" | "cloud" | "workflow" | "maintenance";
  projectType: "web" | "saas" | "custom" | "automation" | "other";
}

export interface NexoraSettings {
  title: string;
  tagline: string;
  introduction: string;
  aboutTitle: string;
  aboutBody: string[];
  founderName: string;
  founderRole: string;
  email?: string;
  whatsappNumber?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  description: string;
}

export interface NexoraContent {
  settings: NexoraSettings;
  services: NexoraService[];
  projects: NexoraProject[];
  source: "sanity" | "development-snapshot" | "empty";
}
