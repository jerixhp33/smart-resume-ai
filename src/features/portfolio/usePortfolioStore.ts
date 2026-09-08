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
  updateExperienceItem: (index: number, item: Partial<PortfolioContent['experience'][0]>) => void
  updateProjectItem: (index: number, item: Partial<PortfolioContent['projects'][0]>) => void
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
    const newExp = [...content.experience]
    if (newExp[index]) {
      newExp[index] = { ...newExp[index], ...itemData }
    }
    set({ content: { ...content, experience: newExp }, saveStatus: 'unsaved' })
    get().save()
  },

  updateProjectItem: (index, itemData) => {
    const { content } = get()
    if (!content) return
    const newProj = [...content.projects]
    if (newProj[index]) {
      newProj[index] = { ...newProj[index], ...itemData }
    }
    set({ content: { ...content, projects: newProj }, saveStatus: 'unsaved' })
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
