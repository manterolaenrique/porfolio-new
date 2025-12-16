import { SanityImageSource } from '@sanity/image-url/lib/types/types'

export interface SiteSettings {
  title: string
  description: string
  language: string
  theme: 'light' | 'dark'
  primaryColor: string
  favicon?: SanityImageSource
  ogImage?: SanityImageSource
}

export interface CTAButton {
  label: string
  href: string
}

export interface SocialLink {
  _id: string
  label: string
  type: 'github' | 'linkedin' | 'twitter' | 'email' | 'website' | 'other'
  url: string
  icon?: string
}

export interface Hero {
  name: string
  highlightSurname: boolean
  role: string
  stackSummary: string[]
  shortPitch: string
  avatar: SanityImageSource
  ctaPrimary: CTAButton
  ctaSecondary?: CTAButton
  socialLinks: SocialLink[]
  showParticles: boolean
  showParallax: boolean
}

export interface About {
  title: string
  intro: string
  body: any[] // Portable Text
  yearsExperience: number
  currentCity?: string
  highlightedKeywords: string[]
  skillGroups: SkillGroup[]
}

export interface SkillGroup {
  _id: string
  title: string
  icon?: string
  order: number
  skills: Skill[]
}

export interface Skill {
  _id: string
  name: string
  level?: 'basic' | 'intermediate' | 'advanced' | 'expert'
  category: 'language' | 'framework' | 'tool' | 'database' | 'cloud' | 'other'
  icon?: string
  isHighlighted: boolean
}

export interface Project {
  _id: string
  title: string
  slug: string
  shortDescription: string
  longDescription?: any[] // Portable Text
  thumbnail: SanityImageSource
  gallery?: SanityImageSource[]
  technologies: string[]
  role?: string
  isFeatured: boolean
  demoUrl?: string
  codeUrl?: string
  order: number
}
export interface ContactInfo {
  _id?: string
  headline: string
  subtitle: string
  cvFile: {
    asset: {
      url: string
      filename: string
      size: number
    }
  }
  cvTitle: string
  cvPreviewImage?: {
    asset?: {
      url: string
      _id: string
    }
    hotspot?: {
      x: number
      y: number
      height: number
      width: number
    }
    crop?: {
      top: number
      bottom: number
      left: number
      right: number
    }
  }
  primaryEmail: string
  linkedinUrl: string
  githubUsername?: string
  enableGithubStats?: boolean
  timezone: string
  businessHoursStart: string
  businessHoursEnd: string
  showQRCode?: boolean
  fullName: string
}

export interface GithubStats {
  username: string
  publicRepos: number
  followers: number
  contributions30days: number
  profileUrl: string
  avatarUrl?: string
}

export interface ContactGroup {
  _id: string
  title: string
  subtitle?: string
  order: number
  displayType: 'row' | 'full-width'
  cards: string[]
}

export interface ContactCard {
  _id: string
  type: 'email' | 'github' | 'linkedin' | 'cv' | 'timezone' | 'qr'
  order: number
  enabled: boolean
}