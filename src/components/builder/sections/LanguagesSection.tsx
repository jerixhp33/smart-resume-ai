'use client'

import React from 'react'
import { Plus, Trash2, GripVertical } from 'lucide-react'
import { useResumeStore } from '@/features/resume/store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createEmptyLanguage } from '@/utils/defaultResumeData'
import type { LanguageItem } from '@/types'

const PROFICIENCIES = [
  { value: 'native', label: 'Native / Bilingual' },
  { value: 'fluent', label: 'Fluent' },
  { value: 'professional', label: 'Professional Working' },
  { value: 'conversational', label: 'Conversational' },
  { value: 'basic', label: 'Basic / Beginner' },
] as const

export function LanguagesSection() {
  const { data, updateData } = useResumeStore()
  const languages = data.languages ?? []

  function addLanguage() {
    updateData(d => ({
      ...d,
      languages: [...(d.languages ?? []), createEmptyLanguage()],
    }))
  }

  function updateLanguage(id: string, field: string, value: string) {
    updateData(d => ({
      ...d,
      languages: (d.languages ?? []).map((item: LanguageItem) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }))
  }

  function removeLanguage(id: string) {
    updateData(d => ({
      ...d,
      languages: (d.languages ?? []).filter((item: LanguageItem) => item.id !== id),
    }))
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-1">Languages</h2>
        <p className="text-sm text-muted-foreground">
          List languages you speak and your proficiency level.
        </p>
      </div>

      {languages.length === 0 ? (
        <div className="border-2 border-dashed border-border rounded-xl p-8 text-center">
          <p className="text-sm text-muted-foreground mb-4">
            No languages added yet.
          </p>
          <Button variant="outline" onClick={addLanguage}>
            <Plus className="h-4 w-4 mr-2" /> Add Language
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {languages.map((item, index) => (
            <div key={item.id} className="group relative bg-card border border-border rounded-xl p-4 transition-all hover:border-primary/30 hover:shadow-sm flex items-start gap-3">
              <div className="mt-2.5 text-muted-foreground/40 hover:text-foreground cursor-grab active:cursor-grabbing">
                <GripVertical className="h-5 w-5" />
              </div>
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Language"
                  placeholder="e.g. Spanish, French, Mandarin"
                  value={item.language}
                  onChange={e => updateLanguage(item.id, 'language', e.target.value)}
                />
                
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground">Proficiency</label>
                  <select
                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={item.proficiency}
                    onChange={e => updateLanguage(item.id, 'proficiency', e.target.value)}
                  >
                    {PROFICIENCIES.map(p => (
                      <option key={p.value} value={p.value}>
                        {p.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="mt-6 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeLanguage(item.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}

          <Button variant="outline" className="w-full border-dashed" onClick={addLanguage}>
            <Plus className="h-4 w-4 mr-2" /> Add Language
          </Button>
        </div>
      )}
    </div>
  )
}
