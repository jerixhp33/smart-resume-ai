'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { MoreHorizontal, Edit, Copy, Download, Trash2, Eye, ScanSearch } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/toast'
import { formatRelativeTime, formatATSScore } from '@/utils/format'
import { deleteResume, duplicateResume } from '@/features/resume/actions'
import { cn } from '@/utils/cn'

interface ResumeCardProps {
  resume: {
    id: string
    name: string
    template_id: string
    ats_score: number | null
    updated_at: string
    is_public: boolean
    public_slug: string | null
    public_views: number
  }
}

export function ResumeCard({ resume }: ResumeCardProps) {
  const router = useRouter()
  const [deleting, setDeleting] = useState(false)
  const [duplicating, setDuplicating] = useState(false)

  async function handleDelete() {
    if (!confirm('Delete this resume? This cannot be undone.')) return
    setDeleting(true)
    const result = await deleteResume(resume.id)
    if (result.error) {
      toast({ title: 'Error', description: result.error, variant: 'error' })
      setDeleting(false)
    } else {
      toast({ title: 'Resume deleted', variant: 'success' })
    }
  }

  async function handleDuplicate() {
    setDuplicating(true)
    const result = await duplicateResume(resume.id)
    setDuplicating(false)
    if ('error' in result && result.error) {
      toast({ title: 'Could not duplicate', description: String(result.error), variant: 'error' })
    } else if ('resumeId' in result) {
      toast({ title: 'Resume duplicated!', variant: 'success' })
      router.push(`/builder/${result.resumeId}`)
    }
  }

  async function handleDownload() {
    toast({ title: 'Generating PDF…', description: 'This may take a few seconds.' })
    try {
      const res = await fetch('/api/pdf/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeId: resume.id }),
      })
      if (!res.ok) throw new Error()
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${resume.name.replace(/\s+/g, '-')}.pdf`
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      toast({ title: 'PDF generation failed', description: 'Please try again.', variant: 'error' })
    }
  }

  const atsInfo = resume.ats_score !== null ? formatATSScore(resume.ats_score) : null

  return (
    <div className={cn('bg-card border border-border rounded-xl overflow-hidden hover:shadow-md hover:border-primary/20 transition-all group', deleting && 'opacity-50 pointer-events-none')}>
      {/* Preview area */}
      <div className="h-32 bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center relative overflow-hidden">
        {/* Simplified resume preview */}
        <div className="w-20 h-28 bg-white rounded shadow-sm border border-border/50 flex flex-col p-1.5 gap-1 transform group-hover:scale-105 transition-transform">
          <div className="h-1.5 w-10 bg-gray-800 rounded-full" />
          <div className="h-0.5 w-7 bg-gray-400 rounded-full" />
          <div className="h-px w-full bg-gray-200 my-0.5" />
          {[8, 6, 7, 5].map((w, i) => (
            <div key={i} className="h-0.5 rounded-full bg-gray-200" style={{ width: `${w * 10}%` }} />
          ))}
          <div className="h-px w-full bg-gray-200 my-0.5" />
          {[9, 5, 8].map((w, i) => (
            <div key={i} className="h-0.5 rounded-full bg-gray-200" style={{ width: `${w * 10}%` }} />
          ))}
        </div>

        {/* Template badge */}
        <div className="absolute top-2 left-2">
          <Badge variant="secondary" className="text-[10px] py-0">
            {resume.template_id.replace('-', ' ')}
          </Badge>
        </div>

        {/* Actions overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
          <Link href={`/builder/${resume.id}`}>
            <Button size="sm" className="h-7 text-xs shadow-sm">
              <Edit className="h-3 w-3" /> Edit
            </Button>
          </Link>
        </div>
      </div>

      {/* Card body */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <Link href={`/builder/${resume.id}`} className="font-medium text-sm truncate hover:text-primary transition-colors">
            {resume.name}
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="h-7 w-7 rounded-md flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors flex-shrink-0">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Resume options</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem asChild>
                <Link href={`/builder/${resume.id}`} className="flex items-center gap-2">
                  <Edit className="h-3.5 w-3.5" /> Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2" onClick={handleDuplicate} disabled={duplicating}>
                <Copy className="h-3.5 w-3.5" /> Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2" onClick={handleDownload}>
                <Download className="h-3.5 w-3.5" /> Download PDF
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/analyzer?resumeId=${resume.id}`} className="flex items-center gap-2">
                  <ScanSearch className="h-3.5 w-3.5" /> Analyze
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="gap-2 text-destructive focus:text-destructive" onClick={handleDelete} disabled={deleting} destructive>
                <Trash2 className="h-3.5 w-3.5" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {atsInfo ? (
              <div className="flex items-center gap-1.5">
                <div className={cn('flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full', atsInfo.bg, atsInfo.color)}>
                  {resume.ats_score}/100
                </div>
                <span className={cn('text-xs hidden sm:inline-block', atsInfo.color)}>{atsInfo.label}</span>
              </div>
            ) : (
              <span className="text-xs text-muted-foreground">Not analyzed</span>
            )}
            
            {resume.is_public && (
              <Badge variant="secondary" className="text-[10px] gap-1 px-1.5 py-0 bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200">
                <Eye className="h-3 w-3" />
                {resume.public_views || 0} views
              </Badge>
            )}
          </div>
          <span className="text-xs text-muted-foreground">
            {formatRelativeTime(resume.updated_at)}
          </span>
        </div>
      </div>
    </div>
  )
}
