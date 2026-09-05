'use client'

import React, { useState } from 'react'
import { Plus, Briefcase, ChevronRight, Calendar, Building2, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import { toast } from '@/components/ui/toast'
import type { JobApplication, ApplicationStatus } from '@/types'
import { formatDate } from '@/utils/format'
import { cn } from '@/utils/cn'
import { v4 as uuidv4 } from 'uuid'
import { KanbanBoard } from './KanbanBoard'

const COLUMNS: { status: ApplicationStatus; label: string; color: string }[] = [
  { status: 'wishlist', label: '🔖 Wishlist', color: 'border-slate-300' },
  { status: 'applied', label: '📤 Applied', color: 'border-blue-300' },
  { status: 'assessment', label: '📝 Assessment', color: 'border-yellow-300' },
  { status: 'interview', label: '🎤 Interview', color: 'border-orange-300' },
  { status: 'offer', label: '🎉 Offer', color: 'border-green-300' },
]

const STATUS_BADGE: Record<ApplicationStatus, { label: string; variant: 'default' | 'success' | 'warning' | 'destructive' | 'secondary' }> = {
  wishlist: { label: 'Wishlist', variant: 'secondary' },
  applied: { label: 'Applied', variant: 'default' },
  assessment: { label: 'Assessment', variant: 'warning' },
  interview: { label: 'Interview', variant: 'warning' },
  offer: { label: 'Offer', variant: 'success' },
  rejected: { label: 'Rejected', variant: 'destructive' },
  withdrawn: { label: 'Withdrawn', variant: 'secondary' },
}

interface ApplicationsClientProps {
  initialApplications: JobApplication[]
  resumes: { id: string; name: string }[]
}

export function ApplicationsClient({ initialApplications, resumes }: ApplicationsClientProps) {
  const [applications, setApplications] = useState(initialApplications)
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedApp, setSelectedApp] = useState<JobApplication | null>(null)
  const [view, setView] = useState<'kanban' | 'list'>('kanban')
  const supabase = getSupabaseBrowserClient()

  // Stats
  const stats = {
    applied: applications.filter(a => a.status === 'applied').length,
    interview: applications.filter(a => a.status === 'interview').length,
    offer: applications.filter(a => a.status === 'offer').length,
    rejected: applications.filter(a => a.status === 'rejected').length,
  }

  async function updateStatus(id: string, status: ApplicationStatus) {
    setApplications(prev => prev.map(a => a.id === id ? { ...a, status } : a))
    await supabase.from('job_applications').update({ status }).eq('id', id)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Job Applications</h1>
          <p className="text-sm text-muted-foreground mt-1">Track your job search pipeline</p>
        </div>
        <Button onClick={() => setShowAddModal(true)} icon={<Plus className="h-4 w-4" />}>
          Add Application
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Applied', value: stats.applied, color: 'text-blue-600' },
          { label: 'Interviews', value: stats.interview, color: 'text-orange-600' },
          { label: 'Offers', value: stats.offer, color: 'text-green-600' },
          { label: 'Rejected', value: stats.rejected, color: 'text-red-600' },
        ].map(stat => (
          <div key={stat.label} className="bg-card border border-border rounded-xl p-4">
            <p className={cn('text-2xl font-bold', stat.color)}>{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* View toggle */}
      <div className="flex rounded-lg bg-muted p-1 w-fit">
        {(['kanban', 'list'] as const).map(v => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={cn(
              'px-4 py-1.5 text-sm font-medium rounded-md transition-all capitalize',
              view === v ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground'
            )}
          >
            {v}
          </button>
        ))}
      </div>

      {/* Kanban view */}
      {view === 'kanban' && (
        <KanbanBoard 
          applications={applications} 
          onStatusChange={updateStatus} 
          onAppClick={setSelectedApp} 
        />
      )}

      {/* List view */}
      {view === 'list' && (
        <div className="border border-border rounded-xl overflow-hidden">
          {applications.length === 0 ? (
            <div className="p-12 text-center">
              <Briefcase className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">No applications yet. Start tracking your job search!</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {applications.map(app => {
                const statusInfo = STATUS_BADGE[app.status]
                return (
                  <button
                    key={app.id}
                    onClick={() => setSelectedApp(app)}
                    className="w-full flex items-center gap-4 px-4 py-3 hover:bg-muted/50 transition-colors text-left"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{app.position}</p>
                      <p className="text-xs text-muted-foreground">{app.company}</p>
                    </div>
                    <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
                    {app.application_date && (
                      <span className="text-xs text-muted-foreground hidden sm:block w-20 text-right flex-shrink-0">
                        {formatDate(app.application_date, 'dd MMM yyyy')}
                      </span>
                    )}
                    <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  </button>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* Add application modal */}
      {showAddModal && (
        <AddApplicationModal
          resumes={resumes}
          onClose={() => setShowAddModal(false)}
          onAdd={(app) => {
            setApplications(prev => [app, ...prev])
            setShowAddModal(false)
          }}
        />
      )}

      {/* Application detail modal */}
      {selectedApp && (
        <ApplicationDetailModal
          application={selectedApp}
          onClose={() => setSelectedApp(null)}
          onStatusChange={(id, status) => {
            updateStatus(id, status)
            setSelectedApp(prev => prev ? { ...prev, status } : null)
          }}
        />
      )}
    </div>
  )
}

// ── Add Application Modal ─────────────────────────────────
function AddApplicationModal({
  resumes,
  onClose,
  onAdd,
}: {
  resumes: { id: string; name: string }[]
  onClose: () => void
  onAdd: (app: JobApplication) => void
}) {
  const supabase = getSupabaseBrowserClient()
  const [company, setCompany] = useState('')
  const [position, setPosition] = useState('')
  const [jobUrl, setJobUrl] = useState('')
  const [status, setStatus] = useState<ApplicationStatus>('wishlist')
  const [saving, setSaving] = useState(false)

  async function handleSave() {
    if (!company.trim() || !position.trim()) {
      toast({ title: 'Company and position are required', variant: 'warning' })
      return
    }
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data, error } = await supabase.from('job_applications').insert({
      user_id: user.id,
      company: company.trim(),
      position: position.trim(),
      job_url: jobUrl.trim() || null,
      status,
      application_date: status === 'applied' ? new Date().toISOString().split('T')[0] : null,
    }).select().single()

    setSaving(false)
    if (error || !data) {
      toast({ title: 'Failed to add application', variant: 'error' })
    } else {
      toast({ title: 'Application added!', variant: 'success' })
      onAdd(data as JobApplication)
    }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Application</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          <Input label="Company" placeholder="Google" value={company} onChange={e => setCompany(e.target.value)} required />
          <Input label="Position" placeholder="Software Engineer" value={position} onChange={e => setPosition(e.target.value)} required />
          <Input label="Job URL (optional)" placeholder="https://careers.google.com/..." value={jobUrl} onChange={e => setJobUrl(e.target.value)} />
          <div>
            <label className="block text-sm font-medium mb-1.5">Status</label>
            <select value={status} onChange={e => setStatus(e.target.value as ApplicationStatus)} className="w-full h-10 border border-input rounded-lg px-3 bg-background text-sm">
              {Object.entries(STATUS_BADGE).map(([s, info]) => (
                <option key={s} value={s}>{info.label}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-3 pt-1">
            <Button variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
            <Button className="flex-1" loading={saving} onClick={handleSave}>Add Application</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ── Application Detail Modal ──────────────────────────────
function ApplicationDetailModal({
  application,
  onClose,
  onStatusChange,
}: {
  application: JobApplication
  onClose: () => void
  onStatusChange: (id: string, status: ApplicationStatus) => void
}) {
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{application.position}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          <div className="flex items-center gap-3">
            <Building2 className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{application.company}</span>
          </div>
          {application.job_url && (
            <a href={application.job_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-primary hover:underline">
              <ExternalLink className="h-4 w-4" /> View Job Posting
            </a>
          )}
          <div>
            <label className="block text-sm font-medium mb-1.5">Update Status</label>
            <div className="flex flex-wrap gap-2">
              {COLUMNS.map(col => (
                <button
                  key={col.status}
                  onClick={() => onStatusChange(application.id, col.status)}
                  className={cn(
                    'px-3 py-1.5 rounded-full text-xs font-medium border transition-all',
                    application.status === col.status
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'border-border hover:border-primary/40'
                  )}
                >
                  {col.label}
                </button>
              ))}
              <button
                onClick={() => onStatusChange(application.id, 'rejected')}
                className={cn(
                  'px-3 py-1.5 rounded-full text-xs font-medium border transition-all',
                  application.status === 'rejected'
                    ? 'bg-destructive text-destructive-foreground border-destructive'
                    : 'border-border hover:border-destructive/40 text-destructive'
                )}
              >
                ❌ Rejected
              </button>
            </div>
          </div>
          {application.notes && (
            <div>
              <p className="text-sm font-medium mb-1">Notes</p>
              <p className="text-sm text-muted-foreground">{application.notes}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

