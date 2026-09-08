'use client'

import React, { useState } from 'react'
import { usePortfolioStore } from '@/features/portfolio/usePortfolioStore'
import { PortfolioRenderer } from '@/components/portfolio/templates/PortfolioRenderer'
import { Monitor, Tablet, Smartphone, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react'

interface CenterPreviewPanelProps {
  username: string
}

export function CenterPreviewPanel({ username }: CenterPreviewPanelProps) {
  const content = usePortfolioStore((s) => s.content)
  const template = usePortfolioStore((s) => s.template)
  const theme = usePortfolioStore((s) => s.theme)
  const devicePreview = usePortfolioStore((s) => s.devicePreview)
  const setDevicePreview = usePortfolioStore((s) => s.setDevicePreview)
  const [zoom, setZoom] = useState<number>(100)

  if (!content) return null

  const zoomIn = () => setZoom((prev) => Math.min(prev + 10, 120))
  const zoomOut = () => setZoom((prev) => Math.max(prev - 10, 60))
  const resetZoom = () => setZoom(100)

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Device & Canvas Control Toolbar */}
      <div className="h-10 border-b border-border bg-card/80 px-4 flex items-center justify-between text-xs flex-shrink-0 z-10 backdrop-blur-md">
        {/* Device Switcher */}
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

        {/* Canvas Zoom Controls & Dimensions */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-muted/50 px-2 py-0.5 rounded-lg border border-border/50 text-[11px] font-mono">
            <button
              onClick={zoomOut}
              disabled={zoom <= 60}
              className="p-1 hover:text-foreground text-muted-foreground disabled:opacity-30"
              title="Zoom Out"
            >
              <ZoomOut className="h-3 w-3" />
            </button>
            <span className="w-9 text-center font-bold">{zoom}%</span>
            <button
              onClick={zoomIn}
              disabled={zoom >= 120}
              className="p-1 hover:text-foreground text-muted-foreground disabled:opacity-30"
              title="Zoom In"
            >
              <ZoomIn className="h-3 w-3" />
            </button>
            {zoom !== 100 && (
              <button
                onClick={resetZoom}
                className="p-1 hover:text-primary text-muted-foreground ml-0.5"
                title="Reset Zoom (100%)"
              >
                <RotateCcw className="h-3 w-3" />
              </button>
            )}
          </div>

          <div className="text-muted-foreground text-xs font-mono hidden sm:block">
            {devicePreview === 'desktop' && '1280px × Auto'}
            {devicePreview === 'tablet' && '768px × Auto'}
            {devicePreview === 'mobile' && '375px × Auto'}
          </div>
        </div>
      </div>

      {/* Frame Container */}
      <div
        data-lenis-prevent
        tabIndex={0}
        className="flex-1 p-6 overflow-y-auto outline-none flex justify-center bg-muted/40 relative"
      >
        <div
          style={{
            transform: zoom !== 100 ? `scale(${zoom / 100})` : undefined,
            transformOrigin: 'top center',
          }}
          className={`transition-all duration-300 bg-background shadow-2xl rounded-2xl overflow-hidden border border-border/80 h-fit min-h-full ${
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
