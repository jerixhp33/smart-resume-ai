'use client'

import React, { useState } from 'react'
import { Plus, Trash2, GripVertical, ChevronDown, ChevronUp } from 'lucide-react'
import { useResumeStore } from '@/features/resume/store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { createEmptyVolunteer } from '@/utils/defaultResumeData'
import type { VolunteerItem } from '@/types'
import { cn } from '@/utils/cn'

export function VolunteerSection() {
  const { data, updateData } = useResumeStore()
  const volunteer_work = data.volunteer_work ?? []
  const [expandedId, setExpandedId] = useState<string | null>(null)

  function addVolunteer() {
    const newItem = createEmptyVolunteer()
    updateData(d => ({
      ...d,
      volunteer_work: [...(d.volunteer_work ?? []), newItem],
    }))
    setExpandedId(newItem.id)
  }

  function updateVolunteer(id: string, field: string, value: unknown) {
    updateData(d => ({
      ...d,
      volunteer_work: (d.volunteer_work ?? []).map((item: VolunteerItem) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }))
  }

  function removeVolunteer(id: string) {
    if (!confirm('Remove this entry?')) return
    updateData(d => ({
      ...d,
      volunteer_work: (d.volunteer_work ?? []).filter((item: VolunteerItem) => item.id !== id),
    }))
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-1">Volunteer Work</h2>
        <p className="text-sm text-muted-foreground">
          Highlight your community involvement and volunteer roles.
        </p>
      </div>

      {volunteer_work.length === 0 ? (
        <div className="border-2 border-dashed border-border rounded-xl p-8 text-center">
          <p className="text-sm text-muted-foreground mb-4">
            No volunteer work added yet.
          </p>
          <Button variant="outline" onClick={addVolunteer}>
            <Plus className="h-4 w-4 mr-2" /> Add Volunteer Work
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {volunteer_work.map((item, index) => {
            const isExpanded = expandedId === item.id
            return (
              <div key={item.id} className="group bg-card border border-border rounded-xl overflow-hidden transition-all hover:border-primary/30">
                {/* Header (Collapsed View) */}
                <div 
                  className={cn(
                    "flex items-center gap-3 p-4 cursor-pointer select-none",
                    isExpanded && "border-b border-border bg-muted/20"
                  )}
                  onClick={() => setExpandedId(isExpanded ? null : item.id)}
                >
                  <div className="text-muted-foreground/40 hover:text-foreground cursor-grab active:cursor-grabbing" onClick={e => e.stopPropagation()}>
                    <GripVertical className="h-5 w-5" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm truncate">
                      {item.role || '(Not specified)'}
                    </h3>
                    <p className="text-xs text-muted-foreground truncate">
                      {item.organization || 'Organization'} • {item.start_date || 'Start'} – {item.is_current ? 'Present' : (item.end_date || 'End')}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => { e.stopPropagation(); removeVolunteer(item.id); }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <div className="h-8 w-8 flex items-center justify-center text-muted-foreground">
                      {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </div>
                  </div>
                </div>

                {/* Expanded Form */}
                {isExpanded && (
                  <div className="p-4 space-y-4 bg-muted/5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input
                        label="Organization"
                        placeholder="e.g. Red Cross"
                        value={item.organization}
                        onChange={e => updateVolunteer(item.id, 'organization', e.target.value)}
                      />
                      <Input
                        label="Role / Title"
                        placeholder="e.g. Volunteer Coordinator"
                        value={item.role}
                        onChange={e => updateVolunteer(item.id, 'role', e.target.value)}
                      />
                      <Input
                        label="Start Date"
                        placeholder="e.g. MM/YYYY"
                        value={item.start_date}
                        onChange={e => updateVolunteer(item.id, 'start_date', e.target.value)}
                      />
                      <div className="space-y-2">
                        <Input
                          label="End Date"
                          placeholder="e.g. MM/YYYY"
                          value={item.end_date || ''}
                          onChange={e => updateVolunteer(item.id, 'end_date', e.target.value)}
                          disabled={item.is_current}
                        />
                        <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
                          <input
                            type="checkbox"
                            className="rounded border-border"
                            checked={item.is_current}
                            onChange={e => updateVolunteer(item.id, 'is_current', e.target.checked)}
                          />
                          I currently volunteer here
                        </label>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Textarea
                        label="Description"
                        placeholder="Describe your contributions and impact..."
                        value={item.description}
                        onChange={e => updateVolunteer(item.id, 'description', e.target.value)}
                        rows={4}
                      />
                    </div>
                  </div>
                )}
              </div>
            )
          })}

          <Button variant="outline" className="w-full border-dashed" onClick={addVolunteer}>
            <Plus className="h-4 w-4 mr-2" /> Add Volunteer Work
          </Button>
        </div>
      )}
    </div>
  )
}
