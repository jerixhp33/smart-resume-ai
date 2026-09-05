'use client'

import React, { useState } from 'react'
import { FileText, FileType2, FileJson, FileDown, X, Check, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { toast } from '@/components/ui/toast'
import { cn } from '@/utils/cn'
import { generatePlainText } from '@/lib/export/text-generator'
import { generateDOCX } from '@/lib/export/docx-generator'
import { saveAs } from 'file-saver'
import type { ResumeData, TemplateId } from '@/types'
import { useResumeStore } from '@/features/resume/store'

interface ExportModalProps {
  open: boolean
  onClose: () => void
  resumeId: string
  resumeName: string
  templateId: TemplateId
}

const FORMATS = [
  {
    id: 'pdf',
    label: 'PDF',
    description: 'ATS-optimized PDF with your chosen template styling',
    icon: FileDown,
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
    borderColor: 'hover:border-red-500/40',
  },
  {
    id: 'docx',
    label: 'DOCX',
    description: 'Editable Word document for further tweaks',
    icon: FileType2,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    borderColor: 'hover:border-blue-500/40',
  },
  {
    id: 'txt',
    label: 'Plain Text',
    description: 'Raw text for online application form paste',
    icon: FileText,
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10',
    borderColor: 'hover:border-yellow-500/40',
  },
  {
    id: 'json',
    label: 'JSON',
    description: 'Machine-readable data backup of your resume',
    icon: FileJson,
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
    borderColor: 'hover:border-green-500/40',
  },
] as const

type FormatId = typeof FORMATS[number]['id']

export function ExportModal({ open, onClose, resumeId, resumeName, templateId }: ExportModalProps) {
  const [loadingFormat, setLoadingFormat] = useState<FormatId | null>(null)
  const [completedFormats, setCompletedFormats] = useState<Set<FormatId>>(new Set())

  const safeName = resumeName.replace(/\s+/g, '-')

  async function handleExport(formatId: FormatId) {
    const { data } = useResumeStore.getState()
    setLoadingFormat(formatId)

    try {
      switch (formatId) {
        case 'pdf': {
          const res = await fetch('/api/pdf/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ resumeId, resumeData: data, templateId }),
          })
          if (!res.ok) {
            const err = await res.json()
            throw new Error(err.error)
          }
          const blob = await res.blob()
          saveAs(blob, `${safeName}.pdf`)
          break
        }

        case 'docx': {
          const blob = await generateDOCX(data)
          saveAs(blob, `${safeName}.docx`)
          break
        }

        case 'txt': {
          const text = generatePlainText(data)
          const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
          saveAs(blob, `${safeName}.txt`)
          break
        }

        case 'json': {
          const json = JSON.stringify(data, null, 2)
          const blob = new Blob([json], { type: 'application/json;charset=utf-8' })
          saveAs(blob, `${safeName}.json`)
          break
        }
      }

      setCompletedFormats(prev => new Set([...prev, formatId]))
      toast({ title: `${formatId.toUpperCase()} exported!`, variant: 'success' })
    } catch (err) {
      toast({ title: `${formatId.toUpperCase()} export failed`, description: String(err), variant: 'error' })
    } finally {
      setLoadingFormat(null)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileDown className="h-5 w-5 text-primary" />
            Export Resume
          </DialogTitle>
        </DialogHeader>

        <p className="text-sm text-muted-foreground -mt-1">
          Choose a format to download <span className="font-medium text-foreground">{resumeName}</span>
        </p>

        <div className="grid grid-cols-2 gap-3 mt-2">
          {FORMATS.map(fmt => {
            const Icon = fmt.icon
            const isLoading = loadingFormat === fmt.id
            const isComplete = completedFormats.has(fmt.id)
            const isDisabled = loadingFormat !== null && loadingFormat !== fmt.id

            return (
              <button
                key={fmt.id}
                onClick={() => handleExport(fmt.id)}
                disabled={isDisabled || isLoading}
                className={cn(
                  'relative flex flex-col items-center gap-2 p-4 rounded-xl border border-border bg-card transition-all text-center group',
                  fmt.borderColor,
                  isDisabled ? 'opacity-40 cursor-not-allowed' : 'hover:shadow-md hover:-translate-y-0.5 cursor-pointer',
                  isComplete && 'border-green-500/40'
                )}
              >
                <div className={cn('p-2.5 rounded-lg', fmt.bgColor)}>
                  {isLoading ? (
                    <Loader2 className={cn('h-5 w-5 animate-spin', fmt.color)} />
                  ) : isComplete ? (
                    <Check className="h-5 w-5 text-green-500" />
                  ) : (
                    <Icon className={cn('h-5 w-5', fmt.color)} />
                  )}
                </div>
                <span className="text-sm font-semibold">{fmt.label}</span>
                <span className="text-xs text-muted-foreground leading-snug">{fmt.description}</span>
              </button>
            )
          })}
        </div>

        <p className="text-xs text-muted-foreground text-center mt-1">
          All exports use your current resume data. Nothing leaves your browser except PDF.
        </p>
      </DialogContent>
    </Dialog>
  )
}
