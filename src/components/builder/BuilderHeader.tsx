'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Save, Download, ArrowLeft, LayoutTemplate, Clock, Check, WifiOff, AlertCircle, Eye, Edit3, History, Share2, Globe, Copy } from 'lucide-react'
import { useResumeStore } from '@/features/resume/store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { saveResumeVersion, toggleResumeSharing } from '@/features/resume/actions'
import { toast } from '@/components/ui/toast'
import { cn } from '@/utils/cn'
import { TEMPLATE_METADATA } from '@/templates/renderer'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ExportModal } from '@/components/builder/ExportModal'
import type { Resume } from '@/types'

interface BuilderHeaderProps {
  resume: Resume
  versions: Array<{ id: string; version_number: number; description: string | null; created_at: string }>
  onSave: () => Promise<void>
  mobileView: 'editor' | 'preview'
  onMobileViewChange: (v: 'editor' | 'preview') => void
}

export function BuilderHeader({ resume, versions, onSave, mobileView, onMobileViewChange }: BuilderHeaderProps) {
  const router = useRouter()
  const { resumeName, setResumeName, saveStatus, templateId, setTemplateId } = useResumeStore()
  const [showTemplates, setShowTemplates] = useState(false)
  const [showShareDialog, setShowShareDialog] = useState(false)
  const [editingName, setEditingName] = useState(false)
  const [savingVersion, setSavingVersion] = useState(false)
  const [showExportModal, setShowExportModal] = useState(false)
  
  // Local state for public share to avoid reloading the whole app
  const [isPublic, setIsPublic] = useState(resume.is_public)
  const [publicSlug, setPublicSlug] = useState(resume.public_slug)
  const [sharingLoading, setSharingLoading] = useState(false)

  const saveStatusConfig = {
    saved: { icon: Check, label: 'Saved', color: 'text-green-500' },
    saving: { icon: Clock, label: 'Saving…', color: 'text-muted-foreground' },
    unsaved: { icon: Save, label: 'Unsaved', color: 'text-amber-500' },
    error: { icon: AlertCircle, label: 'Save failed', color: 'text-destructive' },
    offline: { icon: WifiOff, label: 'Offline — saved locally', color: 'text-orange-500' },
  }

  const statusConfig = saveStatusConfig[saveStatus]
  const StatusIcon = statusConfig.icon

  async function handleSaveVersion() {
    setSavingVersion(true)
    const result = await saveResumeVersion({ resumeId: resume.id, description: `Manual save — v${versions.length + 1}` })
    setSavingVersion(false)
    if (result.success) {
      toast({ title: 'Version saved', variant: 'success' })
    } else {
      toast({ title: 'Failed to save version', variant: 'error' })
    }
  }

  async function handleDownload() {
    toast({ title: 'Generating PDF…', description: 'Please wait.' })
    try {
      const { data } = useResumeStore.getState()
      const res = await fetch('/api/pdf/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeId: resume.id, resumeData: data, templateId }),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error)
      }
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url; a.download = `${resumeName.replace(/\s+/g, '-')}.pdf`
      a.click(); URL.revokeObjectURL(url)
      toast({ title: 'PDF downloaded!', variant: 'success' })
    } catch (err) {
      toast({ title: 'PDF failed', description: String(err), variant: 'error' })
    }
  }

  return (
    <>
      <header className="flex items-center gap-3 px-4 py-3 border-b border-border bg-card flex-shrink-0 min-h-[56px]">
        {/* Back */}
        <button
          onClick={() => router.push('/resumes')}
          className="hidden sm:flex items-center gap-1.5 text-muted-foreground hover:text-foreground text-sm transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>

        {/* Resume name */}
        <div className="flex-1 min-w-0">
          {editingName ? (
            <input
              autoFocus
              value={resumeName}
              onChange={e => setResumeName(e.target.value)}
              onBlur={() => setEditingName(false)}
              onKeyDown={e => e.key === 'Enter' && setEditingName(false)}
              className="text-sm font-semibold bg-transparent border-b border-primary outline-none w-full max-w-xs"
            />
          ) : (
            <button
              onClick={() => setEditingName(true)}
              className="flex items-center gap-1.5 group min-w-0"
            >
              <span className="text-sm font-semibold truncate">{resumeName}</span>
              <Edit3 className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 flex-shrink-0" />
            </button>
          )}
        </div>

        {/* Save status */}
        <div className={cn('hidden sm:flex items-center gap-1.5 text-xs', statusConfig.color)}>
          <StatusIcon className="h-3.5 w-3.5" />
          <span>{statusConfig.label}</span>
        </div>

        {/* Mobile view toggle */}
        <div className="flex lg:hidden rounded-lg bg-muted p-0.5 text-xs">
          <button
            onClick={() => onMobileViewChange('editor')}
            className={cn('flex items-center gap-1 px-2.5 py-1 rounded-md transition-all', mobileView === 'editor' ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground')}
          >
            <Edit3 className="h-3 w-3" /> Edit
          </button>
          <button
            onClick={() => onMobileViewChange('preview')}
            className={cn('flex items-center gap-1 px-2.5 py-1 rounded-md transition-all', mobileView === 'preview' ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground')}
          >
            <Eye className="h-3 w-3" /> Preview
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowTemplates(true)} className="hidden sm:flex gap-1.5">
            <LayoutTemplate className="h-3.5 w-3.5" />
            <span className="hidden md:inline">{templateId.replace('-', ' ')}</span>
          </Button>
          <Button variant="outline" size="icon" onClick={handleSaveVersion} disabled={savingVersion} className="hidden sm:flex" title="Save version">
            <History className="h-3.5 w-3.5" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => setShowShareDialog(true)} className="gap-1.5 text-blue-600 border-blue-200 bg-blue-50 hover:bg-blue-100 hover:text-blue-700">
            <Share2 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Share</span>
          </Button>
          <Button size="sm" onClick={() => setShowExportModal(true)} className="gap-1.5">
            <Download className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Export</span>
          </Button>
        </div>
      </header>

      {/* Template selector dialog */}
      <Dialog open={showTemplates} onOpenChange={setShowTemplates}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Choose a Template</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mt-2 max-h-[60vh] overflow-y-auto pr-1">
            {TEMPLATE_METADATA.map(tmpl => (
              <button
                key={tmpl.id}
                onClick={() => { setTemplateId(tmpl.id); setShowTemplates(false) }}
                className={cn(
                  'flex flex-col items-start gap-2 p-3 rounded-xl border-2 text-left transition-all',
                  templateId === tmpl.id
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/40'
                )}
              >
                <div className="w-full h-20 bg-muted rounded-lg flex items-center justify-center">
                  <div className="w-12 h-16 bg-white rounded shadow-sm border border-border/50 flex flex-col p-1 gap-1">
                    <div className="h-1 w-8 bg-gray-800 rounded-full" />
                    <div className="h-0.5 w-5 bg-gray-400 rounded-full" />
                    <div className="h-px w-full bg-gray-200 my-0.5" />
                    {[6, 8, 5, 7].map((w, i) => (
                      <div key={i} className="h-0.5 rounded-full bg-gray-200" style={{ width: `${w * 10}%` }} />
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold">{tmpl.name}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-2">{tmpl.description}</p>
                  {tmpl.is_ats_optimized && (
                    <span className="inline-block mt-1 text-[10px] font-semibold text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-950/30 px-1.5 py-0.5 rounded">ATS ✓</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Share dialog */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Share to Web Portfolio</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center p-6 text-center space-y-4">
            <div className="h-16 w-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-2">
              <Globe className="h-8 w-8" />
            </div>
            {isPublic && publicSlug ? (
              <>
                <h3 className="font-semibold text-lg">Your resume is live!</h3>
                <p className="text-sm text-muted-foreground">Anyone with the link can view your mobile-friendly portfolio.</p>
                <div className="flex w-full mt-4 gap-2">
                  <Input readOnly value={(typeof window !== 'undefined' ? window.location.origin : '') + '/p/' + publicSlug} className="text-sm" />
                  <Button onClick={() => {
                    navigator.clipboard.writeText(window.location.origin + '/p/' + publicSlug)
                    toast({ title: 'Link copied!', variant: 'success' })
                  }}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <Button variant="ghost" size="sm" className="text-destructive mt-4" disabled={sharingLoading} onClick={async () => {
                  setSharingLoading(true)
                  await toggleResumeSharing(resume.id, false)
                  setIsPublic(false)
                  setPublicSlug(null)
                  setSharingLoading(false)
                  toast({ title: 'Unpublished' })
                }}>
                  Stop sharing
                </Button>
              </>
            ) : (
              <>
                <h3 className="font-semibold text-lg">Publish your resume</h3>
                <p className="text-sm text-muted-foreground">Get a beautiful, responsive public link to share on LinkedIn or with recruiters. It updates automatically when you save.</p>
                <Button className="w-full mt-4" disabled={sharingLoading} onClick={async () => {
                  setSharingLoading(true)
                  const res = await toggleResumeSharing(resume.id, true)
                  if (res.slug) {
                    setIsPublic(true)
                    setPublicSlug(res.slug)
                    toast({ title: 'Published successfully!', variant: 'success' })
                  }
                  setSharingLoading(false)
                }}>
                  Publish to Web
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <ExportModal
        open={showExportModal}
        onClose={() => setShowExportModal(false)}
        resumeId={resume.id}
        resumeName={resumeName}
        templateId={templateId}
      />
    </>
  )
}
