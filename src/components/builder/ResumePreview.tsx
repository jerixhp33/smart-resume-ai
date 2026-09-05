'use client'

import React, { useRef, useEffect } from 'react'
import { useResumeStore } from '@/features/resume/store'
import { renderResumeHTML } from '@/templates/renderer'

export function ResumePreview() {
  const { data, templateId } = useResumeStore()
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    const html = renderResumeHTML(data, templateId)
    const iframe = iframeRef.current
    if (!iframe) return

    const doc = iframe.contentDocument || iframe.contentWindow?.document
    if (!doc) return

    doc.open()
    doc.write(html)
    doc.close()
  }, [data, templateId])

  return (
    <div className="flex flex-col h-full">
      {/* Preview header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-muted/30">
        <p className="text-xs font-medium text-muted-foreground">Live Preview</p>
        <div className="flex items-center gap-1.5">
          <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
          <span className="text-xs text-muted-foreground">A4</span>
        </div>
      </div>

      {/* A4 preview */}
      <div className="flex-1 overflow-auto bg-muted/20 p-4 flex justify-center">
        <div className="w-full max-w-[400px]">
          {/* A4 aspect ratio container: 210mm x 297mm ≈ 0.707 aspect */}
          <div className="relative w-full" style={{ paddingBottom: '141.4%' }}>
            <iframe
              ref={iframeRef}
              title="Resume Preview"
              className="absolute inset-0 w-full h-full bg-white shadow-lg rounded border border-border/50"
              sandbox="allow-same-origin"
              aria-label="Live resume preview"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
