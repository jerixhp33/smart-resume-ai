'use client'
// Education Section
import React, { useState } from 'react'
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import { useResumeStore } from '@/features/resume/store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createEmptyEducation } from '@/utils/defaultResumeData'
import type { EducationItem } from '@/types'
import { cn } from '@/utils/cn'

export function EducationSection() {
  const { data, updateData } = useResumeStore()
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const items = data.education ?? []

  function addItem() {
    const newItem = createEmptyEducation()
    updateData(d => ({ ...d, education: [...(d.education ?? []), newItem] }))
    setExpandedId(newItem.id)
  }

  function updateItem(id: string, field: string, value: string | boolean) {
    updateData(d => ({
      ...d,
      education: (d.education ?? []).map((e: EducationItem) =>
        e.id === id ? { ...e, [field]: value } : e
      ),
    }))
  }

  function removeItem(id: string) {
    updateData(d => ({ ...d, education: (d.education ?? []).filter((e: EducationItem) => e.id !== id) }))
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-1">Education</h2>
        <p className="text-sm text-muted-foreground">List your degrees and certifications, newest first.</p>
      </div>

      {items.length === 0 ? (
        <div className="border-2 border-dashed border-border rounded-xl p-8 text-center">
          <p className="text-sm text-muted-foreground mb-4">No education entries yet.</p>
          <Button onClick={addItem} variant="outline" icon={<Plus className="h-4 w-4" />}>Add Education</Button>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((edu: EducationItem, i: number) => (
            <div key={edu.id} className={cn('border border-border rounded-xl overflow-hidden', expandedId === edu.id && 'ring-2 ring-primary/20')}>
              <div className="flex items-center gap-2 px-4 py-3 bg-card">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{edu.degree || `Education ${i + 1}`}
                    {edu.institution && <span className="text-muted-foreground font-normal"> · {edu.institution}</span>}
                  </p>
                  {edu.start_date && <p className="text-xs text-muted-foreground">{edu.start_date} — {edu.is_current ? 'Present' : (edu.end_date ?? '—')}</p>}
                </div>
                <button onClick={() => removeItem(edu.id)} className="h-7 w-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors"><Trash2 className="h-3.5 w-3.5" /></button>
                <button onClick={() => setExpandedId(expandedId === edu.id ? null : edu.id)} className="h-7 w-7 rounded-md flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors">
                  {expandedId === edu.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
              </div>
              {expandedId === edu.id && (
                <div className="px-4 pb-4 pt-2 space-y-4 bg-card border-t border-border/50">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input label="Degree / Qualification" placeholder="Bachelor of Technology" value={edu.degree ?? ''} onChange={e => updateItem(edu.id, 'degree', e.target.value)}
                        enableAI
                        onAIChange={val => updateItem(edu.id, 'degree', val)} />
                    <Input label="Field of Study" placeholder="Computer Science" value={edu.field_of_study ?? ''} onChange={e => updateItem(edu.id, 'field_of_study', e.target.value)}
                        enableAI
                        onAIChange={val => updateItem(edu.id, 'field_of_study', val)} />
                  </div>
                  <Input label="Institution" placeholder="IIT Delhi" value={edu.institution ?? ''} onChange={e => updateItem(edu.id, 'institution', e.target.value)}
                        enableAI
                        onAIChange={val => updateItem(edu.id, 'institution', val)} />
                  <div className="grid grid-cols-3 gap-4">
                    <Input label="Start" type="month" value={edu.start_date ?? ''} onChange={e => updateItem(edu.id, 'start_date', e.target.value)} />
                    <Input label="End" type="month" value={edu.end_date ?? ''} onChange={e => updateItem(edu.id, 'end_date', e.target.value)} disabled={edu.is_current} />
                    <div className="flex items-end pb-1">
                      <label className="flex items-center gap-2 cursor-pointer text-sm">
                        <input type="checkbox" checked={edu.is_current ?? false} onChange={e => updateItem(edu.id, 'is_current', e.target.checked)} className="accent-primary" />
                        <span className="text-muted-foreground text-xs">Ongoing</span>
                      </label>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="GPA (optional)" placeholder="8.5/10 or 3.9/4.0" value={edu.gpa ?? ''} onChange={e => updateItem(edu.id, 'gpa', e.target.value)} />
                    <Input label="Location (optional)" placeholder="New Delhi, India" value={edu.location ?? ''} onChange={e => updateItem(edu.id, 'location', e.target.value)}
                        enableAI
                        onAIChange={val => updateItem(edu.id, 'location', val)} />
                  </div>
                </div>
              )}
            </div>
          ))}
          <Button variant="outline" onClick={addItem} className="w-full gap-2" icon={<Plus className="h-4 w-4" />}>Add Education</Button>
        </div>
      )}
    </div>
  )
}
