import { create } from 'zustand'
import type {
  PortfolioContent,
  PortfolioThemeId,
  PortfolioTemplateId,
  MotionLevel,
  PortfolioSite,
} from '@/types'
import { savePortfolioContentAction } from './actions'

interface PortfolioStoreState {
  portfolioId: string | null
  title: string
  theme: PortfolioThemeId
  template: PortfolioTemplateId
  motionLevel: MotionLevel
  content: PortfolioContent | null
  devicePreview: 'desktop' | 'tablet' | 'mobile'
  saveStatus: 'saved' | 'saving' | 'unsaved'
  activeSection: string

  // Methods
  initialize: (portfolio: PortfolioSite) => void
  setDevicePreview: (device: 'desktop' | 'tablet' | 'mobile') => void
  setActiveSection: (section: string) => void
  setTheme: (theme: PortfolioThemeId) => void
  setTemplate: (template: PortfolioTemplateId) => void
  setMotionLevel: (level: MotionLevel) => void
  updateHero: (hero: Partial<PortfolioContent['hero']>) => void
  updateAbout: (about: Partial<PortfolioContent['about']>) => void
  updateContact: (contact: Partial<PortfolioContent['contact']>) => void
  updateExperienceItem: (index: number, item: Partial<NonNullable<PortfolioContent['experience']>[0]>) => void
  addExperienceItem: () => void
  deleteExperienceItem: (index: number) => void
  updateProjectItem: (index: number, item: Partial<NonNullable<PortfolioContent['projects']>[0]>) => void
  addProjectItem: () => void
  deleteProjectItem: (index: number) => void
  updateEducationItem: (index: number, item: Partial<NonNullable<PortfolioContent['education']>[0]>) => void
  addEducationItem: () => void
  deleteEducationItem: (index: number) => void
  updateSkillGroup: (index: number, item: Partial<NonNullable<PortfolioContent['skills']>[0]>) => void
  addSkillGroup: () => void
  deleteSkillGroup: (index: number) => void
  updateCertificationItem: (index: number, item: Partial<NonNullable<PortfolioContent['certifications']>[0]>) => void
  addCertificationItem: () => void
  deleteCertificationItem: (index: number) => void
  reorderSections: (newOrder: string[]) => void
  toggleSectionVisibility: (sectionId: string, hidden: boolean) => void
  save: () => Promise<void>
}

let saveTimeout: NodeJS.Timeout | null = null

export const usePortfolioStore = create<PortfolioStoreState>((set, get) => ({
  portfolioId: null,
  title: '',
  theme: 'indigo',
  template: 'modern',
  motionLevel: 'smooth',
  content: null,
  devicePreview: 'desktop',
  saveStatus: 'saved',
  activeSection: 'hero',

  initialize: (portfolio: PortfolioSite) => {
    set({
      portfolioId: portfolio.id,
      title: portfolio.title,
      theme: portfolio.theme || 'indigo',
      template: portfolio.template || 'modern',
      motionLevel: portfolio.motion_level || 'smooth',
      content: portfolio.content,
      saveStatus: 'saved',
    })
  },

  setDevicePreview: (device) => set({ devicePreview: device }),
  setActiveSection: (section) => set({ activeSection: section }),

  setTheme: (theme) => {
    set({ theme, saveStatus: 'unsaved' })
    get().save()
  },

  setTemplate: (template) => {
    set({ template, saveStatus: 'unsaved' })
    get().save()
  },

  setMotionLevel: (motionLevel) => {
    set({ motionLevel, saveStatus: 'unsaved' })
    get().save()
  },

  updateHero: (heroData) => {
    const { content } = get()
    if (!content) return
    const newContent = { ...content, hero: { ...content.hero, ...heroData } }
    set({ content: newContent, saveStatus: 'unsaved' })
    get().save()
  },

  updateAbout: (aboutData) => {
    const { content } = get()
    if (!content) return
    const newContent = { ...content, about: { ...content.about, ...aboutData } }
    set({ content: newContent, saveStatus: 'unsaved' })
    get().save()
  },

  updateContact: (contactData) => {
    const { content } = get()
    if (!content) return
    const newContent = { ...content, contact: { ...content.contact, ...contactData } }
    set({ content: newContent, saveStatus: 'unsaved' })
    get().save()
  },

  updateExperienceItem: (index, itemData) => {
    const { content } = get()
    if (!content) return
    const list = [...(content.experience || [])]
    if (list[index]) {
      list[index] = { ...list[index], ...itemData }
      set({ content: { ...content, experience: list }, saveStatus: 'unsaved' })
      get().save()
    }
  },

  addExperienceItem: () => {
    const { content } = get()
    if (!content) return
    const newItem = {
      id: Math.random().toString(36).substring(2, 9),
      role: 'Software Engineer',
      company: 'Company Name',
      period: '2023 - Present',
      location: 'Remote',
      description: 'Spearheaded key initiatives and delivered core product features.',
      bullets: ['Improved feature delivery velocity and system reliability.'],
    }
    const list = [...(content.experience || []), newItem]
    set({ content: { ...content, experience: list }, saveStatus: 'unsaved' })
    get().save()
  },

  deleteExperienceItem: (index) => {
    const { content } = get()
    if (!content) return
    const list = (content.experience || []).filter((_, i) => i !== index)
    set({ content: { ...content, experience: list }, saveStatus: 'unsaved' })
    get().save()
  },

  updateProjectItem: (index, itemData) => {
    const { content } = get()
    if (!content) return
    const list = [...(content.projects || [])]
    if (list[index]) {
      list[index] = { ...list[index], ...itemData }
      set({ content: { ...content, projects: list }, saveStatus: 'unsaved' })
      get().save()
    }
  },

  addProjectItem: () => {
    const { content } = get()
    if (!content) return
    const newItem = {
      id: Math.random().toString(36).substring(2, 9),
      title: 'New Project Title',
      tagline: 'High impact web application',
      description: 'A full-stack application built to solve real-world problems.',
      technologies: ['React', 'TypeScript', 'Node.js'],
      github_url: '',
      live_url: '',
    }
    const list = [...(content.projects || []), newItem]
    set({ content: { ...content, projects: list }, saveStatus: 'unsaved' })
    get().save()
  },

  deleteProjectItem: (index) => {
    const { content } = get()
    if (!content) return
    const list = (content.projects || []).filter((_, i) => i !== index)
    set({ content: { ...content, projects: list }, saveStatus: 'unsaved' })
    get().save()
  },

  updateEducationItem: (index, itemData) => {
    const { content } = get()
    if (!content) return
    const list = [...(content.education || [])]
    if (list[index]) {
      list[index] = { ...list[index], ...itemData }
      set({ content: { ...content, education: list }, saveStatus: 'unsaved' })
      get().save()
    }
  },

  addEducationItem: () => {
    const { content } = get()
    if (!content) return
    const newItem = {
      id: Math.random().toString(36).substring(2, 9),
      institution: 'University / College',
      degree: 'B.Sc.',
      field: 'Computer Science',
      period: '2019 - 2023',
    }
    const list = [...(content.education || []), newItem]
    set({ content: { ...content, education: list }, saveStatus: 'unsaved' })
    get().save()
  },

  deleteEducationItem: (index) => {
    const { content } = get()
    if (!content) return
    const list = (content.education || []).filter((_, i) => i !== index)
    set({ content: { ...content, education: list }, saveStatus: 'unsaved' })
    get().save()
  },

  updateSkillGroup: (index, itemData) => {
    const { content } = get()
    if (!content) return
    const list = [...(content.skills || [])]
    if (list[index]) {
      list[index] = { ...list[index], ...itemData }
      set({ content: { ...content, skills: list }, saveStatus: 'unsaved' })
      get().save()
    }
  },

  addSkillGroup: () => {
    const { content } = get()
    if (!content) return
    const newItem = {
      id: Math.random().toString(36).substring(2, 9),
      category: 'Core Technologies',
      skills: ['JavaScript', 'TypeScript', 'React'],
    }
    const list = [...(content.skills || []), newItem]
    set({ content: { ...content, skills: list }, saveStatus: 'unsaved' })
    get().save()
  },

  deleteSkillGroup: (index) => {
    const { content } = get()
    if (!content) return
    const list = (content.skills || []).filter((_, i) => i !== index)
    set({ content: { ...content, skills: list }, saveStatus: 'unsaved' })
    get().save()
  },

  updateCertificationItem: (index, itemData) => {
    const { content } = get()
    if (!content) return
    const list = [...(content.certifications || [])]
    if (list[index]) {
      list[index] = { ...list[index], ...itemData }
      set({ content: { ...content, certifications: list }, saveStatus: 'unsaved' })
      get().save()
    }
  },

  addCertificationItem: () => {
    const { content } = get()
    if (!content) return
    const newItem = {
      id: Math.random().toString(36).substring(2, 9),
      title: 'Professional Certification',
      issuer: 'Issuing Organization',
      date: '2023',
    }
    const list = [...(content.certifications || []), newItem]
    set({ content: { ...content, certifications: list }, saveStatus: 'unsaved' })
    get().save()
  },

  deleteCertificationItem: (index) => {
    const { content } = get()
    if (!content) return
    const list = (content.certifications || []).filter((_, i) => i !== index)
    set({ content: { ...content, certifications: list }, saveStatus: 'unsaved' })
    get().save()
  },

  reorderSections: (newOrder) => {
    const { content } = get()
    if (!content) return
    set({ content: { ...content, section_order: newOrder }, saveStatus: 'unsaved' })
    get().save()
  },

  toggleSectionVisibility: (sectionId, hidden) => {
    const { content } = get()
    if (!content) return
    const hiddenMap = { ...content.hidden_sections, [sectionId]: hidden }
    set({ content: { ...content, hidden_sections: hiddenMap }, saveStatus: 'unsaved' })
    get().save()
  },

  save: async () => {
    if (saveTimeout) clearTimeout(saveTimeout)
    saveTimeout = setTimeout(async () => {
      const state = get()
      if (!state.portfolioId || !state.content) return
      set({ saveStatus: 'saving' })
      const res = await savePortfolioContentAction({
        portfolioId: state.portfolioId,
        content: state.content,
        theme: state.theme,
        template: state.template,
        motionLevel: state.motionLevel,
      })
      if (res.success) {
        set({ saveStatus: 'saved' })
      } else {
        set({ saveStatus: 'unsaved' })
      }
    }, 1200)
  },
}))
