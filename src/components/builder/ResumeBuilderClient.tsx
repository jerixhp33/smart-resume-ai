'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { useResumeStore } from '@/features/resume/store'
import { useAutosave } from '@/features/resume/useAutosave'
import { SectionNav } from './SectionNav'
import { ResumePreview } from './ResumePreview'
import { AIPanel } from './AIPanel'
import { AIFloatingToolbar } from './AIFloatingToolbar'
import { BuilderHeader } from './BuilderHeader'
import { PersonalSection } from './sections/PersonalSection'
import { SummarySection } from './sections/SummarySection'
import { ExperienceSection } from './sections/ExperienceSection'
import { EducationSection } from './sections/EducationSection'
import { SkillsSection } from './sections/SkillsSection'
import { ProjectsSection } from './sections/ProjectsSection'
import { CertificationsSection } from './sections/CertificationsSection'
import { LanguagesSection } from './sections/LanguagesSection'
import { VolunteerSection } from './sections/VolunteerSection'
import { ThemePanel } from './ThemePanel'
import type { Resume } from '@/types'
import { Toaster } from '@/components/ui/toast'

interface ResumeBuilderClientProps {
  resume: Resume
  versions: Array<{ id: string; version_number: number; description: string | null; created_at: string }>
  userId: string
}

const SECTIONS = [
  { id: 'personal', label: 'Personal Info' },
  { id: 'summary', label: 'Summary' },
  { id: 'experience', label: 'Experience' },
  { id: 'education', label: 'Education' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'certifications', label: 'Certifications' },
  { id: 'internships', label: 'Internships' },
  { id: 'languages', label: 'Languages' },
  { id: 'volunteer', label: 'Volunteer Work' },
  { id: 'theme', label: 'Design & Theme' },
]

export function ResumeBuilderClient({ resume, versions, userId }: ResumeBuilderClientProps) {
  const { initResume, activeSection, setActiveSection, previewVisible, setPreviewVisible } = useResumeStore()
  const { performSave } = useAutosave()
  const [mobileView, setMobileView] = useState<'editor' | 'preview'>('editor')

  // Initialize store with resume data
  useEffect(() => {
    initResume(resume)
  }, [resume.id]) // only reinit on resume change

  const renderSection = () => {
    switch (activeSection) {
      case 'personal': return <PersonalSection />
      case 'summary': return <SummarySection />
      case 'experience': return <ExperienceSection />
      case 'education': return <EducationSection />
      case 'skills': return <SkillsSection />
      case 'projects': return <ProjectsSection />
      case 'certifications': return <CertificationsSection />
      case 'internships': return <ExperienceSection isInternship />
      case 'languages': return <LanguagesSection />
      case 'volunteer': return <VolunteerSection />
      case 'theme': return <ThemePanel />
      default: return (
        <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">
          Select a section to edit
        </div>
      )
    }
  }

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden">
      {/* Global AI Floating Toolbar */}
      <AIFloatingToolbar />
      
      {/* Header */}
      <BuilderHeader
        resume={resume}
        versions={versions}
        onSave={performSave}
        mobileView={mobileView}
        onMobileViewChange={setMobileView}
      />

      {/* Body — 3-panel desktop, tabbed mobile */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* Left: Section navigation */}
        <aside className={`
          w-48 lg:w-56 flex-shrink-0 border-r border-border bg-card overflow-y-auto
          ${mobileView === 'editor' ? 'flex' : 'hidden'} lg:flex flex-col
        `}>
          <SectionNav
            sections={SECTIONS}
            activeSection={activeSection}
            onSelect={setActiveSection}
          />
        </aside>

        {/* Center: Editor */}
        <main className={`
          flex-1 overflow-y-auto bg-background min-w-0
          ${mobileView === 'editor' ? 'block' : 'hidden'} lg:block
        `}>
          <div className="max-w-2xl mx-auto p-4 sm:p-6">
            {renderSection()}
          </div>
        </main>

        {/* Right: Preview + AI panel */}
        <aside className={`
          w-80 md:w-96 lg:w-[380px] xl:w-[420px] flex-shrink-0 border-l border-border bg-card flex flex-col overflow-hidden
          ${mobileView === 'preview' ? 'flex' : 'hidden'} lg:flex
        `}>
          <div className="flex-1 overflow-y-auto">
            <ResumePreview />
          </div>
          <div className="border-t border-border flex-shrink-0 max-h-[45vh] overflow-y-auto">
            <AIPanel resumeId={resume.id} />
          </div>
        </aside>
      </div>

      <Toaster />
    </div>
  )
}
