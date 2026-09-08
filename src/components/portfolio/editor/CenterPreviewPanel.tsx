'use client'

import React from 'react'
import { usePortfolioStore } from '@/features/portfolio/usePortfolioStore'
import { PortfolioRenderer } from '@/components/portfolio/templates/PortfolioRenderer'
import { Monitor, Tablet, Smartphone } from 'lucide-react'

interface CenterPreviewPanelProps {
  username: string
}

export function CenterPreviewPanel({ username }: CenterPreviewPanelProps) {
  const content = usePortfolioStore((s) => s.content)
  const template = usePortfolioStore((s) => s.template)
  const theme = usePortfolioStore((s) => s.theme)
  const devicePreview = usePortfolioStore((s) => s.devicePreview)
  const setDevicePreview = usePortfolioStore((s) => s.setDevicePreview)

  if (!content) return null

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Device Toolbar */}
      <div className="h-10 border-b border-border bg-card/60 px-4 flex items-center justify-between text-xs flex-shrink-0">
        <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-lg">
          <button
            onClick={() => setDevicePreview('desktop')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all ${
              devicePreview === 'desktop' ? 'bg-card text-foreground font-bold shadow-xs' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Monitor className="h-3.5 w-3.5" /> Desktop
          </button>
          <button
            onClick={() => setDevicePreview('tablet')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all ${
              devicePreview === 'tablet' ? 'bg-card text-foreground font-bold shadow-xs' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Tablet className="h-3.5 w-3.5" /> Tablet
          </button>
          <button
            onClick={() => setDevicePreview('mobile')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all ${
              devicePreview === 'mobile' ? 'bg-card text-foreground font-bold shadow-xs' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Smartphone className="h-3.5 w-3.5" /> Mobile
          </button>
        </div>

        <div className="text-muted-foreground text-xs font-mono">
          {devicePreview === 'desktop' && '1280px × Auto'}
          {devicePreview === 'tablet' && '768px × Auto'}
          {devicePreview === 'mobile' && '375px × Auto'}
        </div>
      </div>

      {/* Frame Container */}
      <div
        data-lenis-prevent
        tabIndex={0}
        className="flex-1 p-6 overflow-y-auto outline-none flex justify-center bg-muted/40"
      >
        <div
          className={`transition-all duration-300 bg-background shadow-xl rounded-2xl overflow-hidden border border-border/80 h-fit min-h-full ${
            devicePreview === 'desktop'
              ? 'w-full max-w-5xl'
              : devicePreview === 'tablet'
              ? 'w-[768px]'
              : 'w-[375px]'
          }`}
        >
          <PortfolioRenderer content={content} template={template} theme={theme} />
        </div>
      </div>
    </div>
  )
}
