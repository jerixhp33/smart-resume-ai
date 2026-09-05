'use client'

import React from 'react'
import { cn } from '@/utils/cn'
import { CheckCircle2 } from 'lucide-react'
import { useResumeStore } from '@/features/resume/store'

interface Section {
  id: string
  label: string
}

interface SectionNavProps {
  sections: Section[]
  activeSection: string
  onSelect: (id: string) => void
}

export function SectionNav({ sections, activeSection, onSelect }: SectionNavProps) {
  const { data } = useResumeStore()

  function isSectionComplete(id: string): boolean {
    switch (id) {
      case 'personal': return !!(data.personal?.full_name && data.personal?.email)
      case 'summary': return !!(data.summary && data.summary.length > 20)
      case 'experience': return (data.experience?.length ?? 0) > 0
      case 'education': return (data.education?.length ?? 0) > 0
      case 'skills': return (data.skills?.some(s => s.skills.length > 0)) ?? false
      case 'projects': return (data.projects?.length ?? 0) > 0
      case 'certifications': return (data.certifications?.length ?? 0) > 0
      case 'achievements': return (data.achievements?.length ?? 0) > 0
      case 'internships': return (data.internships?.length ?? 0) > 0
      default: return false
    }
  }

  return (
    <div className="flex flex-col py-3 px-2 gap-0.5">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 mb-2">
        Resume Sections
      </p>
      {sections.map(section => {
        const complete = isSectionComplete(section.id)
        const isActive = activeSection === section.id
        return (
          <button
            key={section.id}
            onClick={() => onSelect(section.id)}
            className={cn(
              'flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm text-left transition-all w-full group',
              isActive
                ? 'bg-primary/10 text-primary font-medium'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            )}
          >
            <div className={cn(
              'h-1.5 w-1.5 rounded-full flex-shrink-0 transition-colors',
              isActive ? 'bg-primary' : complete ? 'bg-green-500' : 'bg-muted-foreground/30'
            )} />
            <span className="flex-1">{section.label}</span>
            {complete && !isActive && (
              <CheckCircle2 className="h-3.5 w-3.5 text-green-500 flex-shrink-0 opacity-70" />
            )}
          </button>
        )
      })}
    </div>
  )
}
