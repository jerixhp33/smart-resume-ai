'use client'

import React, { useState } from 'react'
import { Plus, Trash2, ChevronDown, ChevronUp, X } from 'lucide-react'
import { useResumeStore } from '@/features/resume/store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { AIImproveButton } from '@/components/ai/AIImproveButton'
import { improveText } from '@/features/ai/actions'
import { createEmptyProject } from '@/utils/defaultResumeData'
import type { ProjectItem } from '@/types'
import { cn } from '@/utils/cn'
import { v4 as uuidv4 } from 'uuid'

export function ProjectsSection() {
  const { data, updateData } = useResumeStore()
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [techInput, setTechInput] = useState<Record<string, string>>({})
  const items = data.projects ?? []

  function addItem() {
    const newItem = createEmptyProject()
    updateData(d => ({ ...d, projects: [...(d.projects ?? []), newItem] }))
    setExpandedId(newItem.id)
  }

  function updateItem(id: string, field: string, value: unknown) {
    updateData(d => ({
      ...d,
      projects: (d.projects ?? []).map((p: ProjectItem) =>
        p.id === id ? { ...p, [field]: value } : p
      ),
    }))
  }

  function removeItem(id: string) {
    if (!confirm('Remove this project?')) return
    updateData(d => ({ ...d, projects: (d.projects ?? []).filter((p: ProjectItem) => p.id !== id) }))
  }

  async function addTech(id: string) {
    const tech = techInput[id]?.trim()
    if (!tech) return
    updateData(d => ({
      ...d,
      projects: (d.projects ?? []).map((p: ProjectItem) =>
        p.id === id ? { ...p, technologies: [...(p.technologies ?? []), tech] } : p
      ),
    }))
    setTechInput(prev => ({ ...prev, [id]: '' }))

    try {
      const response = await improveText({ text: tech, instruction: 'grammar' })
      if (response.result && response.result.improved !== tech) {
        updateData(d => ({
          ...d,
          projects: (d.projects ?? []).map((p: ProjectItem) =>
            p.id === id ? {
              ...p,
              technologies: (p.technologies ?? []).map(t => t === tech ? response.result!.improved : t)
            } : p
          ),
        }))
      }
    } catch (e) {
      // Background autocorrect fail is non-critical
    }
  }

  function removeTech(id: string, techIndex: number) {
    updateData(d => ({
      ...d,
      projects: (d.projects ?? []).map((p: ProjectItem) =>
        p.id === id
          ? { ...p, technologies: (p.technologies ?? []).filter((_, i) => i !== techIndex) }
          : p
      ),
    }))
  }

  function addBullet(id: string) {
    updateData(d => ({
      ...d,
      projects: (d.projects ?? []).map((p: ProjectItem) =>
        p.id === id ? { ...p, bullets: [...(p.bullets ?? []), ''] } : p
      ),
    }))
  }

  function updateBullet(id: string, bi: number, value: string) {
    updateData(d => ({
      ...d,
      projects: (d.projects ?? []).map((p: ProjectItem) => {
        if (p.id !== id) return p
        const bullets = [...(p.bullets ?? [])]
        bullets[bi] = value
        return { ...p, bullets }
      }),
    }))
  }

  function removeBullet(id: string, bi: number) {
    updateData(d => ({
      ...d,
      projects: (d.projects ?? []).map((p: ProjectItem) =>
        p.id === id ? { ...p, bullets: (p.bullets ?? []).filter((_, i) => i !== bi) } : p
      ),
    }))
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-1">Projects</h2>
        <p className="text-sm text-muted-foreground">
          Showcase personal, academic, or open-source projects. Great for freshers and engineers alike.
        </p>
      </div>

      {items.length === 0 ? (
        <div className="border-2 border-dashed border-border rounded-xl p-8 text-center">
          <p className="text-sm text-muted-foreground mb-4">No projects added yet.</p>
          <Button onClick={addItem} variant="outline" icon={<Plus className="h-4 w-4" />}>Add Project</Button>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((proj: ProjectItem, index: number) => {
            const isExpanded = expandedId === proj.id
            return (
              <div key={proj.id} className={cn('border border-border rounded-xl overflow-hidden transition-all', isExpanded && 'ring-2 ring-primary/20')}>
                <div className="flex items-center gap-2 px-4 py-3 bg-card">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{proj.name || `Project ${index + 1}`}</p>
                    {(proj.technologies ?? []).length > 0 && (
                      <p className="text-xs text-muted-foreground truncate">{proj.technologies!.slice(0, 4).join(', ')}</p>
                    )}
                  </div>
                  <button onClick={() => removeItem(proj.id)} className="h-7 w-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                  <button onClick={() => setExpandedId(isExpanded ? null : proj.id)} className="h-7 w-7 rounded-md flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors">
                    {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>
                </div>

                {isExpanded && (
                  <div className="px-4 pb-4 pt-2 space-y-4 bg-card border-t border-border/50">
                    <Input
                      label="Project Name"
                      placeholder="SmartResume AI"
                      value={proj.name ?? ''}
                      onChange={e => updateItem(proj.id, 'name', e.target.value)}
                        enableAI
                        onAIChange={val => updateItem(proj.id, 'name', val)}
                      required
                    />

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">Description</label>
                      <textarea
                        value={proj.description ?? ''}
                        onChange={e => updateItem(proj.id, 'description', e.target.value)}
                        placeholder="A web application that helps job seekers build ATS-optimized resumes using AI."
                        rows={3}
                        className="w-full text-sm border border-input rounded-lg px-3 py-2.5 bg-background resize-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none placeholder:text-muted-foreground"
                      />
                      <div className="mt-1">
                        <AIImproveButton
                          text={proj.description ?? ''}
                          onAccept={val => updateItem(proj.id, 'description', val)}
                          context={`Project: ${proj.name}`}
                          modes={['improve', 'ats', 'concise']}
                        />
                      </div>
                    </div>

                    {/* Technologies */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-foreground">Technologies Used</label>
                      <div className="flex flex-wrap gap-2">
                        {(proj.technologies ?? []).map((t, ti) => (
                          <span key={ti} className="inline-flex items-center gap-1 bg-primary/10 text-primary text-xs font-medium px-2.5 py-1 rounded-full">
                            {t}
                            <button onClick={() => removeTech(proj.id, ti)} aria-label={`Remove ${t}`}>
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <input
                          value={techInput[proj.id] ?? ''}
                          onChange={e => setTechInput(prev => ({ ...prev, [proj.id]: e.target.value }))}
                          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTech(proj.id) } }}
                          placeholder="e.g. React, Node.js, MongoDB"
                          className="flex-1 text-sm border border-input rounded-lg px-3 py-2 bg-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none placeholder:text-muted-foreground"
                        />
                        <Button size="sm" variant="outline" onClick={() => addTech(proj.id)}>
                          <Plus className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>

                    {/* Links */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input
                        label="Live URL (optional)"
                        placeholder="https://myproject.com"
                        value={proj.url ?? ''}
                        onChange={e => updateItem(proj.id, 'url', e.target.value)}
                      />
                      <Input
                        label="GitHub URL (optional)"
                        placeholder="https://github.com/user/repo"
                        value={proj.github_url ?? ''}
                        onChange={e => updateItem(proj.id, 'github_url', e.target.value)}
                      />
                    </div>

                    {/* Date range */}
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="Start Date"
                        type="month"
                        value={proj.start_date ?? ''}
                        onChange={e => updateItem(proj.id, 'start_date', e.target.value)}
                      />
                      <Input
                        label="End Date"
                        type="month"
                        value={proj.end_date ?? ''}
                        onChange={e => updateItem(proj.id, 'end_date', e.target.value)}
                      />
                    </div>

                    {/* Bullet points */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-foreground">Key Highlights (optional)</label>
                      {(proj.bullets ?? []).map((bullet, bi) => (
                        <div key={bi} className="flex gap-2">
                          <span className="text-muted-foreground text-sm mt-2.5">•</span>
                          <div className="flex-1">
                            <textarea
                              value={bullet}
                              onChange={e => updateBullet(proj.id, bi, e.target.value)}
                              placeholder="Built real-time collaboration feature serving 500+ users"
                              rows={2}
                              className="w-full text-sm border border-input rounded-lg px-3 py-2 bg-background resize-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none placeholder:text-muted-foreground"
                            />
                            <div className="flex justify-between mt-0.5">
                              <AIImproveButton
                                text={bullet}
                                onAccept={val => updateBullet(proj.id, bi, val)}
                                context={`Project: ${proj.name}`}
                                modes={['improve', 'ats']}
                              />
                              <button onClick={() => removeBullet(proj.id, bi)} className="text-xs text-muted-foreground hover:text-destructive transition-colors">
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                      <Button variant="ghost" size="sm" onClick={() => addBullet(proj.id)} className="text-xs" icon={<Plus className="h-3 w-3" />}>
                        Add highlight
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}

          <Button variant="outline" onClick={addItem} className="w-full gap-2" icon={<Plus className="h-4 w-4" />}>
            Add Project
          </Button>
        </div>
      )}
    </div>
  )
}
