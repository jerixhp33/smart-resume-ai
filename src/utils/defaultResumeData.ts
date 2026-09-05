import type { ResumeData } from '@/types'
import { v4 as uuidv4 } from 'uuid'

export function createDefaultResumeData(overrides?: Partial<ResumeData>): ResumeData {
  return {
    personal: {
      full_name: '',
      professional_title: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      github: '',
      portfolio: '',
      other_links: [],
    },
    summary: '',
    experience: [],
    internships: [],
    education: [],
    skills: [
      { id: uuidv4(), name: 'Technical Skills', skills: [], hidden: false },
    ],
    projects: [],
    certifications: [],
    achievements: [],
    languages: [],
    volunteer_work: [],
    publications: [],
    custom_sections: [],
    ...overrides,
  }
}

export function createEmptyExperience() {
  return {
    id: uuidv4(),
    company: '',
    position: '',
    location: '',
    start_date: '',
    end_date: null,
    is_current: false,
    description: '',
    bullets: [''],
    hidden: false,
  }
}

export function createEmptyEducation() {
  return {
    id: uuidv4(),
    institution: '',
    degree: '',
    field_of_study: '',
    location: '',
    start_date: '',
    end_date: null,
    is_current: false,
    gpa: '',
    achievements: [],
    hidden: false,
  }
}

export function createEmptyProject() {
  return {
    id: uuidv4(),
    name: '',
    description: '',
    technologies: [],
    url: '',
    github_url: '',
    start_date: '',
    end_date: null,
    bullets: [],
    hidden: false,
  }
}

export function createEmptyCertification() {
  return {
    id: uuidv4(),
    name: '',
    issuer: '',
    date: '',
    expiry_date: null,
    credential_url: '',
    credential_id: '',
    hidden: false,
  }
}

export function createEmptyLanguage() {
  return {
    id: uuidv4(),
    language: '',
    proficiency: 'conversational' as const,
    hidden: false,
  }
}

export function createEmptyVolunteer() {
  return {
    id: uuidv4(),
    organization: '',
    role: '',
    start_date: '',
    end_date: null,
    is_current: false,
    description: '',
    hidden: false,
  }
}
