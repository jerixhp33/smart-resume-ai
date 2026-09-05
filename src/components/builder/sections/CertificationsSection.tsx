'use client'

import React, { useState } from 'react'
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import { useResumeStore } from '@/features/resume/store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createEmptyCertification } from '@/utils/defaultResumeData'
import type { CertificationItem, AchievementItem } from '@/types'
import { cn } from '@/utils/cn'
import { v4 as uuidv4 } from 'uuid'

// ── Certifications ────────────────────────────────────────
export function CertificationsSection() {
  const { data, updateData } = useResumeStore()
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const items = data.certifications ?? []

  function addItem() {
    const newItem = createEmptyCertification()
    updateData(d => ({ ...d, certifications: [...(d.certifications ?? []), newItem] }))
    setExpandedId(newItem.id)
  }

  function updateItem(id: string, field: string, value: string) {
    updateData(d => ({
      ...d,
      certifications: (d.certifications ?? []).map((c: CertificationItem) =>
        c.id === id ? { ...c, [field]: value } : c
      ),
    }))
  }

  function removeItem(id: string) {
    updateData(d => ({ ...d, certifications: (d.certifications ?? []).filter((c: CertificationItem) => c.id !== id) }))
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-1">Certifications</h2>
        <p className="text-sm text-muted-foreground">
          Add professional certifications, courses, and credentials. Include only certifications you actually hold.
        </p>
      </div>

      {items.length === 0 ? (
        <div className="border-2 border-dashed border-border rounded-xl p-8 text-center">
          <p className="text-sm text-muted-foreground mb-4">No certifications added yet.</p>
          <Button onClick={addItem} variant="outline" icon={<Plus className="h-4 w-4" />}>Add Certification</Button>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((cert: CertificationItem, index: number) => {
            const isExpanded = expandedId === cert.id
            return (
              <div key={cert.id} className={cn('border border-border rounded-xl overflow-hidden', isExpanded && 'ring-2 ring-primary/20')}>
                <div className="flex items-center gap-2 px-4 py-3 bg-card">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{cert.name || `Certification ${index + 1}`}</p>
                    {cert.issuer && <p className="text-xs text-muted-foreground">{cert.issuer}{cert.date ? ` · ${cert.date}` : ''}</p>}
                  </div>
                  <button onClick={() => removeItem(cert.id)} className="h-7 w-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                  <button onClick={() => setExpandedId(isExpanded ? null : cert.id)} className="h-7 w-7 rounded-md flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors">
                    {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>
                </div>

                {isExpanded && (
                  <div className="px-4 pb-4 pt-2 space-y-4 bg-card border-t border-border/50">
                    <Input label="Certification Name" placeholder="AWS Certified Solutions Architect" value={cert.name ?? ''} onChange={e => updateItem(cert.id, 'name', e.target.value)}
                        enableAI
                        onAIChange={val => updateItem(cert.id, 'name', val)} required />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input label="Issuing Organization" placeholder="Amazon Web Services" value={cert.issuer ?? ''} onChange={e => updateItem(cert.id, 'issuer', e.target.value)}
                        enableAI
                        onAIChange={val => updateItem(cert.id, 'issuer', val)} />
                      <Input label="Issue Date" type="month" value={cert.date ?? ''} onChange={e => updateItem(cert.id, 'date', e.target.value)} />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input label="Expiry Date (optional)" type="month" value={cert.expiry_date ?? ''} onChange={e => updateItem(cert.id, 'expiry_date', e.target.value)} />
                      <Input label="Credential ID (optional)" placeholder="ABC-12345" value={cert.credential_id ?? ''} onChange={e => updateItem(cert.id, 'credential_id', e.target.value)} />
                    </div>
                    <Input label="Credential URL (optional)" placeholder="https://verify.credential.com/..." value={cert.credential_url ?? ''} onChange={e => updateItem(cert.id, 'credential_url', e.target.value)} />
                  </div>
                )}
              </div>
            )
          })}

          <Button variant="outline" onClick={addItem} className="w-full gap-2" icon={<Plus className="h-4 w-4" />}>
            Add Certification
          </Button>
        </div>
      )}
    </div>
  )
}

// ── Achievements ──────────────────────────────────────────
export function AchievementsSection() {
  const { data, updateData } = useResumeStore()
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const items = data.achievements ?? []

  function addItem() {
    const newItem: AchievementItem = { id: uuidv4(), title: '', description: '', date: '', hidden: false }
    updateData(d => ({ ...d, achievements: [...(d.achievements ?? []), newItem] }))
    setExpandedId(newItem.id)
  }

  function updateItem(id: string, field: string, value: string) {
    updateData(d => ({
      ...d,
      achievements: (d.achievements ?? []).map((a: AchievementItem) =>
        a.id === id ? { ...a, [field]: value } : a
      ),
    }))
  }

  function removeItem(id: string) {
    updateData(d => ({ ...d, achievements: (d.achievements ?? []).filter((a: AchievementItem) => a.id !== id) }))
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-1">Achievements & Awards</h2>
        <p className="text-sm text-muted-foreground">
          Highlight honours, awards, scholarships, competitions, or recognitions you've genuinely received.
        </p>
      </div>

      {items.length === 0 ? (
        <div className="border-2 border-dashed border-border rounded-xl p-8 text-center">
          <p className="text-sm text-muted-foreground mb-4">No achievements added yet.</p>
          <Button onClick={addItem} variant="outline" icon={<Plus className="h-4 w-4" />}>Add Achievement</Button>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((ach: AchievementItem, index: number) => {
            const isExpanded = expandedId === ach.id
            return (
              <div key={ach.id} className={cn('border border-border rounded-xl overflow-hidden', isExpanded && 'ring-2 ring-primary/20')}>
                <div className="flex items-center gap-2 px-4 py-3 bg-card">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{ach.title || `Achievement ${index + 1}`}</p>
                    {ach.date && <p className="text-xs text-muted-foreground">{ach.date}</p>}
                  </div>
                  <button onClick={() => removeItem(ach.id)} className="h-7 w-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                  <button onClick={() => setExpandedId(isExpanded ? null : ach.id)} className="h-7 w-7 rounded-md flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors">
                    {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>
                </div>

                {isExpanded && (
                  <div className="px-4 pb-4 pt-2 space-y-4 bg-card border-t border-border/50">
                    <Input label="Achievement Title" placeholder="Winner — National Coding Championship 2023" value={ach.title ?? ''} onChange={e => updateItem(ach.id, 'title', e.target.value)}
                        enableAI
                        onAIChange={val => updateItem(ach.id, 'title', val)} required />
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">Description (optional)</label>
                      <textarea
                        value={ach.description ?? ''}
                        onChange={e => updateItem(ach.id, 'description', e.target.value)}
                        placeholder="Competed against 2,000+ participants. Built an AI-powered scheduling system."
                        rows={2}
                        className="w-full text-sm border border-input rounded-lg px-3 py-2.5 bg-background resize-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none placeholder:text-muted-foreground"
                      />
                    </div>
                    <Input label="Date (optional)" type="month" value={ach.date ?? ''} onChange={e => updateItem(ach.id, 'date', e.target.value)} />
                  </div>
                )}
              </div>
            )
          })}

          <Button variant="outline" onClick={addItem} className="w-full gap-2" icon={<Plus className="h-4 w-4" />}>
            Add Achievement
          </Button>
        </div>
      )}
    </div>
  )
}
