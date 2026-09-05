'use client'

import React, { useState } from 'react'
import { Plus, Trash2, X } from 'lucide-react'
import { useResumeStore } from '@/features/resume/store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { improveText } from '@/features/ai/actions'
import type { SkillCategory } from '@/types'
import { v4 as uuidv4 } from 'uuid'

export function SkillsSection() {
  const { data, updateData } = useResumeStore()
  const [newSkillInputs, setNewSkillInputs] = useState<Record<string, string>>({})
  const categories = data.skills ?? []

  function addCategory() {
    const newCat: SkillCategory = { id: uuidv4(), name: 'New Category', skills: [] }
    updateData(d => ({ ...d, skills: [...(d.skills ?? []), newCat] }))
  }

  function updateCategory(id: string, field: string, value: string) {
    updateData(d => ({
      ...d,
      skills: (d.skills ?? []).map(c => c.id === id ? { ...c, [field]: value } : c),
    }))
  }

  function removeCategory(id: string) {
    updateData(d => ({ ...d, skills: (d.skills ?? []).filter(c => c.id !== id) }))
  }

  async function addSkill(catId: string) {
    const skill = newSkillInputs[catId]?.trim()
    if (!skill) return
    updateData(d => ({
      ...d,
      skills: (d.skills ?? []).map(c =>
        c.id === catId ? { ...c, skills: [...c.skills, skill] } : c
      ),
    }))
    setNewSkillInputs(prev => ({ ...prev, [catId]: '' }))

    try {
      const response = await improveText({ text: skill, instruction: 'grammar' })
      if (response.result && response.result.improved !== skill) {
        updateData(d => ({
          ...d,
          skills: (d.skills ?? []).map(c =>
            c.id === catId ? {
              ...c,
              skills: c.skills.map(s => s === skill ? response.result!.improved : s)
            } : c
          ),
        }))
      }
    } catch (e) {
      // Background autocorrect fail is non-critical
    }
  }

  function removeSkill(catId: string, skillIndex: number) {
    updateData(d => ({
      ...d,
      skills: (d.skills ?? []).map(c =>
        c.id === catId ? { ...c, skills: c.skills.filter((_, i) => i !== skillIndex) } : c
      ),
    }))
  }

  function handleKeyDown(e: React.KeyboardEvent, catId: string) {
    if (e.key === 'Enter') { e.preventDefault(); addSkill(catId) }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-1">Skills</h2>
        <p className="text-sm text-muted-foreground">
          Organize your skills into categories. ATS systems scan for specific keywords — be precise.
        </p>
      </div>

      <div className="space-y-4">
        {categories.map(cat => (
          <div key={cat.id} className="border border-border rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-2">
              <input
                value={cat.name}
                onChange={e => updateCategory(cat.id, 'name', e.target.value)}
                className="flex-1 text-sm font-semibold bg-transparent border-b border-transparent hover:border-input focus:border-primary outline-none py-0.5 transition-colors"
                placeholder="Category name (e.g. Programming Languages)"
              />
              <button
                onClick={() => removeCategory(cat.id)}
                className="h-6 w-6 rounded flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Skill tags */}
            <div className="flex flex-wrap gap-2 min-h-[28px]">
              {cat.skills.map((skill, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 bg-muted text-foreground text-xs font-medium px-2.5 py-1 rounded-full"
                >
                  {skill}
                  <button
                    onClick={() => removeSkill(cat.id, i)}
                    className="text-muted-foreground hover:text-destructive transition-colors"
                    aria-label={`Remove ${skill}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>

            {/* Add skill input */}
            <div className="flex gap-2">
              <input
                value={newSkillInputs[cat.id] ?? ''}
                onChange={e => setNewSkillInputs(prev => ({ ...prev, [cat.id]: e.target.value }))}
                onKeyDown={e => handleKeyDown(e, cat.id)}
                placeholder="Type a skill and press Enter…"
                className="flex-1 text-sm border border-input rounded-lg px-3 py-2 bg-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none placeholder:text-muted-foreground"
              />
              <Button
                size="sm"
                variant="outline"
                onClick={() => addSkill(cat.id)}
                disabled={!newSkillInputs[cat.id]?.trim()}
              >
                <Plus className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        ))}

        <Button
          variant="outline"
          onClick={addCategory}
          className="w-full gap-2"
          icon={<Plus className="h-4 w-4" />}
        >
          Add Skill Category
        </Button>
      </div>

      <div className="bg-muted/50 rounded-xl p-4 text-xs text-muted-foreground space-y-1.5">
        <p className="font-semibold text-foreground">💡 Suggested categories:</p>
        <div className="flex flex-wrap gap-2">
          {['Programming Languages', 'Frameworks & Libraries', 'Databases', 'Cloud & DevOps', 'Tools', 'Soft Skills'].map(s => (
            <button
              key={s}
              onClick={() => {
                const newCat: SkillCategory = { id: uuidv4(), name: s, skills: [] }
                updateData(d => ({ ...d, skills: [...(d.skills ?? []), newCat] }))
              }}
              className="px-2.5 py-1 rounded-full bg-muted border border-border hover:border-primary/40 hover:bg-primary/5 transition-all text-xs"
            >
              + {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
