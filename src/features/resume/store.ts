import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import type { ResumeData, Resume, TemplateId, ATSScanResult } from '@/types'
import { createDefaultResumeData } from '@/utils/defaultResumeData'

type SaveStatus = 'saved' | 'saving' | 'unsaved' | 'error' | 'offline'

interface ResumeBuilderState {
  // Resume metadata
  resumeId: string | null
  resumeName: string
  templateId: TemplateId
  isPublic: boolean

  // Resume content
  data: ResumeData

  // Active section
  activeSection: string

  // Save state
  saveStatus: SaveStatus
  lastSavedAt: Date | null
  isDirty: boolean

  // ATS state
  atsResult: ATSScanResult | null
  atsLoading: boolean

  // AI state
  aiLoading: boolean
  activeAIField: string | null

  // Preview
  previewVisible: boolean

  // Actions
  initResume: (resume: Resume) => void
  resetResume: () => void
  updateData: (updater: (data: ResumeData) => ResumeData) => void
  setResumeId: (id: string) => void
  setResumeName: (name: string) => void
  setTemplateId: (id: TemplateId) => void
  setActiveSection: (section: string) => void
  setSaveStatus: (status: SaveStatus) => void
  setLastSavedAt: (date: Date) => void
  setATSResult: (result: ATSScanResult | null) => void
  setATSLoading: (loading: boolean) => void
  setAILoading: (loading: boolean) => void
  setActiveAIField: (field: string | null) => void
  setPreviewVisible: (visible: boolean) => void
  markClean: () => void
}

export const useResumeStore = create<ResumeBuilderState>()(
  subscribeWithSelector((set) => ({
    resumeId: null,
    resumeName: 'My Resume',
    templateId: 'ats-classic',
    isPublic: false,
    data: createDefaultResumeData(),
    activeSection: 'personal',
    saveStatus: 'saved',
    lastSavedAt: null,
    isDirty: false,
    atsResult: null,
    atsLoading: false,
    aiLoading: false,
    activeAIField: null,
    previewVisible: true,

    initResume: (resume) =>
      set({
        resumeId: resume.id,
        resumeName: resume.name,
        templateId: resume.template_id as TemplateId,
        isPublic: resume.is_public,
        data: resume.data as ResumeData,
        isDirty: false,
        saveStatus: 'saved',
      }),

    resetResume: () =>
      set({
        resumeId: null,
        resumeName: 'My Resume',
        templateId: 'ats-classic',
        data: createDefaultResumeData(),
        isDirty: false,
        saveStatus: 'saved',
        atsResult: null,
        activeSection: 'personal',
      }),

    updateData: (updater) =>
      set((state) => ({
        data: updater(state.data),
        isDirty: true,
        saveStatus: 'unsaved',
      })),

    setResumeId: (id) => set({ resumeId: id }),
    setResumeName: (name) => set({ resumeName: name, isDirty: true, saveStatus: 'unsaved' }),
    setTemplateId: (id) => set({ templateId: id, isDirty: true }),
    setActiveSection: (section) => set({ activeSection: section }),
    setSaveStatus: (status) => set({ saveStatus: status }),
    setLastSavedAt: (date) => set({ lastSavedAt: date }),
    setATSResult: (result) => set({ atsResult: result }),
    setATSLoading: (loading) => set({ atsLoading: loading }),
    setAILoading: (loading) => set({ aiLoading: loading }),
    setActiveAIField: (field) => set({ activeAIField: field }),
    setPreviewVisible: (visible) => set({ previewVisible: visible }),
    markClean: () => set({ isDirty: false, saveStatus: 'saved', lastSavedAt: new Date() }),
  }))
)
