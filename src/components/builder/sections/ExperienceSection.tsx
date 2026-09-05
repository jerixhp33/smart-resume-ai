'use client'

import React, { useState } from 'react'
import { Plus, Trash2, ChevronDown, ChevronUp, GripVertical } from 'lucide-react'
import { useResumeStore } from '@/features/resume/store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { AIImproveButton } from '@/components/ai/AIImproveButton'
import { createEmptyExperience } from '@/utils/defaultResumeData'
import type { ExperienceItem, InternshipItem } from '@/types'
import { cn } from '@/utils/cn'

interface ExperienceSectionProps {
  isInternship?: boolean
}

export function ExperienceSection({ isInternship = false }: ExperienceSectionProps) {
  const { data, updateData } = useResumeStore()
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const items = isInternship ? (data.internships ?? []) : (data.experience ?? [])
  const sectionKey = isInternship ? 'internships' : 'experience'
  const label = isInternship ? 'Internship' : 'Experience'

  function addItem() {
    const newItem = createEmptyExperience()
    updateData(d => ({
      ...d,
      [sectionKey]: [...(d[sectionKey] ?? []), newItem],
    }))
    setExpandedId(newItem.id)
  }

  function updateItem(id: string, field: string, value: unknown) {
    updateData(d => ({
      ...d,
      [sectionKey]: (d[sectionKey] ?? []).map((item: ExperienceItem) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }))
  }

  function removeItem(id: string) {
    if (!confirm('Remove this entry?')) return
    updateData(d => ({
      ...d,
      [sectionKey]: (d[sectionKey] ?? []).filter((item: ExperienceItem) => item.id !== id),
    }))
  }

  function updateBullet(id: string, bulletIndex: number, value: string) {
    updateData(d => ({
      ...d,
      [sectionKey]: (d[sectionKey] ?? []).map((item: ExperienceItem) => {
        if (item.id !== id) return item
        const bullets = [...(item.bullets ?? [])]
        bullets[bulletIndex] = value
        return { ...item, bullets }
      }),
    }))
  }

  function addBullet(id: string) {
    updateData(d => ({
      ...d,
      [sectionKey]: (d[sectionKey] ?? []).map((item: ExperienceItem) =>
        item.id === id ? { ...item, bullets: [...(item.bullets ?? []), ''] } : item
      ),
    }))
  }

  function removeBullet(id: string, bulletIndex: number) {
    updateData(d => ({
      ...d,
      [sectionKey]: (d[sectionKey] ?? []).map((item: ExperienceItem) => {
        if (item.id !== id) return item
        const bullets = (item.bullets ?? []).filter((_, i) => i !== bulletIndex)
        return { ...item, bullets }
      }),
    }))
  }

  function acceptBulletImprovement(id: string, bulletIndex: number, improved: string) {
    updateBullet(id, bulletIndex, improved)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-1">{isInternship ? 'Internships' : 'Work Experience'}</h2>
        <p className="text-sm text-muted-foreground">
          List your {isInternship ? 'internships' : 'work history'} in reverse chronological order (newest first).
        </p>
      </div>

      {items.length === 0 ? (
        <div className="border-2 border-dashed border-border rounded-xl p-8 text-center">
          <p className="text-sm text-muted-foreground mb-4">
            No {label.toLowerCase()}s added yet.
          </p>
          <Button onClick={addItem} variant="outline" icon={<Plus className="h-4 w-4" />}>
            Add {label}
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item: ExperienceItem, index: number) => {
            const isExpanded = expandedId === item.id
            return (
              <div key={item.id} className={cn('border border-border rounded-xl overflow-hidden transition-all', isExpanded && 'ring-2 ring-primary/20')}>
                {/* Header */}
                <div className="flex items-center gap-2 px-4 py-3 bg-card">
                  <GripVertical className="h-4 w-4 text-muted-foreground/50 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {item.position || `${label} ${index + 1}`}
                      {item.company && <span className="text-muted-foreground font-normal"> at {item.company}</span>}
                    </p>
                    {item.start_date && (
                      <p className="text-xs text-muted-foreground">
                        {item.start_date} — {item.is_current ? 'Present' : (item.end_date ?? '—')}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => removeItem(item.id)}
                      className="h-7 w-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                      aria-label="Remove"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : item.id)}
                      className="h-7 w-7 rounded-md flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors"
                      aria-label={isExpanded ? 'Collapse' : 'Expand'}
                    >
                      {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Expanded form */}
                {isExpanded && (
                  <div className="px-4 pb-4 pt-2 space-y-4 bg-card border-t border-border/50">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input
                        label="Job Title / Role"
                        placeholder="Software Engineer"
                        value={item.position ?? ''}
                        onChange={e => updateItem(item.id, 'position', e.target.value)}
                        enableAI
                        onAIChange={val => updateItem(item.id, 'position', val)}
                        required
                      />
                      <Input
                        label="Company / Organization"
                        placeholder="Google"
                        value={item.company ?? ''}
                        onChange={e => updateItem(item.id, 'company', e.target.value)}
                        enableAI
                        onAIChange={val => updateItem(item.id, 'company', val)}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <Input
                        label="Start Date"
                        type="month"
                        value={item.start_date ?? ''}
                        onChange={e => updateItem(item.id, 'start_date', e.target.value)}
                      />
                      <Input
                        label="End Date"
                        type="month"
                        value={item.end_date ?? ''}
                        onChange={e => updateItem(item.id, 'end_date', e.target.value)}
                        disabled={item.is_current}
                      />
                      <div className="flex items-end pb-0.5">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={item.is_current ?? false}
                            onChange={e => updateItem(item.id, 'is_current', e.target.checked)}
                            className="rounded border-input h-4 w-4 accent-primary"
                          />
                          <span className="text-sm text-muted-foreground">Currently here</span>
                        </label>
                      </div>
                    </div>

                    <Input
                      label="Location (optional)"
                      placeholder="Bangalore, India"
                      value={item.location ?? ''}
                      onChange={e => updateItem(item.id, 'location', e.target.value)}
                        enableAI
                        onAIChange={val => updateItem(item.id, 'location', val)}
                    />

                    {/* Bullet points */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium">Key Responsibilities & Achievements</label>
                        <span className="text-xs text-muted-foreground">Use action verbs</span>
                      </div>

                      {(item.bullets ?? []).map((bullet: string, bi: number) => (
                        <div key={bi} className="space-y-1">
                          <div className="flex gap-2">
                            <span className="text-muted-foreground text-sm mt-2.5 flex-shrink-0">•</span>
                            <div className="flex-1">
                              <textarea
                                value={bullet}
                                onChange={e => updateBullet(item.id, bi, e.target.value)}
                                placeholder="Developed a feature that reduced load time by 30%"
                                rows={2}
                                className="w-full text-sm border border-input rounded-lg px-3 py-2 bg-background resize-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none placeholder:text-muted-foreground"
                              />
                              <div className="flex items-center justify-between mt-1">
                                <AIImproveButton
                                  text={bullet}
                                  onAccept={improved => acceptBulletImprovement(item.id, bi, improved)}
                                  context={`${item.position} at ${item.company}`}
                                  modes={['improve', 'ats', 'concise']}
                                />
                                <button
                                  onClick={() => removeBullet(item.id, bi)}
                                  className="text-xs text-muted-foreground hover:text-destructive transition-colors"
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => addBullet(item.id)}
                        className="text-xs text-muted-foreground"
                        icon={<Plus className="h-3 w-3" />}
                      >
                        Add bullet point
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}

          <Button
            variant="outline"
            onClick={addItem}
            className="w-full gap-2"
            icon={<Plus className="h-4 w-4" />}
          >
            Add {label}
          </Button>
        </div>
      )}
    </div>
  )
}
