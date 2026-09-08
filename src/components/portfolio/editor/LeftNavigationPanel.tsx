'use client'

import React, { useState } from 'react'
import { usePortfolioStore } from '@/features/portfolio/usePortfolioStore'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Eye, EyeOff, Layout, User, Briefcase, GraduationCap, Code, FolderGit2, Award, Mail, ChevronUp, ChevronDown } from 'lucide-react'

const SECTIONS = [
  { id: 'hero', title: 'Hero Section', icon: User },
  { id: 'about', title: 'About Bio', icon: Layout },
  { id: 'projects', title: 'Projects', icon: FolderGit2 },
  { id: 'experience', title: 'Work Experience', icon: Briefcase },
  { id: 'skills', title: 'Skills & Tech', icon: Code },
  { id: 'education', title: 'Education', icon: GraduationCap },
  { id: 'contact', title: 'Contact & CTA', icon: Mail },
]

export function LeftNavigationPanel() {
  const content = usePortfolioStore((s) => s.content)
  const activeSection = usePortfolioStore((s) => s.activeSection)
  const setActiveSection = usePortfolioStore((s) => s.setActiveSection)
  const toggleSectionVisibility = usePortfolioStore((s) => s.toggleSectionVisibility)
  const updateHero = usePortfolioStore((s) => s.updateHero)
  const updateAbout = usePortfolioStore((s) => s.updateAbout)
  const updateContact = usePortfolioStore((s) => s.updateContact)
  const updateProjectItem = usePortfolioStore((s) => s.updateProjectItem)

  if (!content) return null

  const hiddenMap = content.hidden_sections || {}

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Section Selector Tabs */}
      <div className="p-3 border-b border-border bg-muted/20">
        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Sections</p>
        <div className="space-y-1">
          {SECTIONS.map(({ id, title, icon: Icon }) => {
            const isHidden = !!hiddenMap[id]
            const isActive = activeSection === id

            return (
              <div
                key={id}
                onClick={() => setActiveSection(id)}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                  isActive
                    ? 'bg-primary/10 text-primary font-bold'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="h-3.5 w-3.5" />
                  <span>{title}</span>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleSectionVisibility(id, !isHidden)
                  }}
                  className="p-1 hover:text-foreground text-muted-foreground rounded"
                >
                  {isHidden ? <EyeOff className="h-3.5 w-3.5 text-muted-foreground/60" /> : <Eye className="h-3.5 w-3.5 text-emerald-500" />}
                </button>
              </div>
            )
          })}
        </div>
      </div>

      {/* Editor Form for Active Section */}
      <div data-lenis-prevent className="flex-1 p-4 overflow-y-auto space-y-4">
        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Editing: {activeSection}</p>

        {activeSection === 'hero' && (
          <div className="space-y-3 text-xs">
            <div>
              <label className="font-semibold text-muted-foreground">Full Name</label>
              <Input
                value={content.hero.full_name || ''}
                onChange={(e) => updateHero({ full_name: e.target.value })}
                className="mt-1 h-8 text-xs"
              />
            </div>
            <div>
              <label className="font-semibold text-muted-foreground">Professional Title</label>
              <Input
                value={content.hero.title || ''}
                onChange={(e) => updateHero({ title: e.target.value })}
                className="mt-1 h-8 text-xs"
              />
            </div>
            <div>
              <label className="font-semibold text-muted-foreground">Hero Summary</label>
              <Textarea
                value={content.hero.summary || ''}
                onChange={(e) => updateHero({ summary: e.target.value })}
                className="mt-1 text-xs min-h-[80px]"
              />
            </div>
            <div>
              <label className="font-semibold text-muted-foreground">Availability Badge</label>
              <Input
                value={content.hero.availability || ''}
                onChange={(e) => updateHero({ availability: e.target.value })}
                className="mt-1 h-8 text-xs"
              />
            </div>
          </div>
        )}

        {activeSection === 'about' && (
          <div className="space-y-3 text-xs">
            <div>
              <label className="font-semibold text-muted-foreground">Biography Narrative</label>
              <Textarea
                value={content.about.biography || ''}
                onChange={(e) => updateAbout({ biography: e.target.value })}
                className="mt-1 text-xs min-h-[140px]"
              />
            </div>
            <div>
              <label className="font-semibold text-muted-foreground">Career Direction</label>
              <Input
                value={content.about.career_direction || ''}
                onChange={(e) => updateAbout({ career_direction: e.target.value })}
                className="mt-1 h-8 text-xs"
              />
            </div>
          </div>
        )}

        {activeSection === 'projects' && (
          <div className="space-y-4 text-xs">
            {content.projects.map((proj, idx) => (
              <div key={proj.id} className="p-3 border border-border rounded-xl space-y-2 bg-muted/10">
                <p className="font-bold text-xs text-primary">Project #{idx + 1}</p>
                <div>
                  <label className="text-[10px] font-semibold text-muted-foreground">Title</label>
                  <Input
                    value={proj.title || ''}
                    onChange={(e) => updateProjectItem(idx, { title: e.target.value })}
                    className="h-7 text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-muted-foreground">Description</label>
                  <Textarea
                    value={proj.description || ''}
                    onChange={(e) => updateProjectItem(idx, { description: e.target.value })}
                    className="text-xs min-h-[60px]"
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {activeSection === 'contact' && (
          <div className="space-y-3 text-xs">
            <div>
              <label className="font-semibold text-muted-foreground">Heading</label>
              <Input
                value={content.contact.heading || ''}
                onChange={(e) => updateContact({ heading: e.target.value })}
                className="mt-1 h-8 text-xs"
              />
            </div>
            <div>
              <label className="font-semibold text-muted-foreground">Email Address</label>
              <Input
                value={content.contact.email || ''}
                onChange={(e) => updateContact({ email: e.target.value })}
                className="mt-1 h-8 text-xs"
              />
            </div>
            <div>
              <label className="font-semibold text-muted-foreground">GitHub URL</label>
              <Input
                value={content.contact.github_url || ''}
                onChange={(e) => updateContact({ github_url: e.target.value })}
                className="mt-1 h-8 text-xs"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
