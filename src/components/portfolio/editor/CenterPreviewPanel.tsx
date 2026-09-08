'use client'

import React, { useState, useEffect, useRef } from 'react'
import { usePortfolioStore } from '@/features/portfolio/usePortfolioStore'
import { PortfolioRenderer } from '@/components/portfolio/templates/PortfolioRenderer'
import { Monitor, Tablet, Smartphone, ZoomIn, ZoomOut, RotateCcw, Loader2 } from 'lucide-react'

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
  const [containerWidth, setContainerWidth] = useState<number>(1000)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return
    const updateContainerWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth)
      }
    }
    updateContainerWidth()
    const ro = new ResizeObserver(updateContainerWidth)
    ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [])

  const zoomIn = () => setZoom((prev) => Math.min(prev + 10, 120))
  const zoomOut = () => setZoom((prev) => Math.max(prev - 10, 50))
  const resetZoom = () => setZoom(100)

  const targetWidth = devicePreview === 'desktop' ? 1280 : devicePreview === 'tablet' ? 768 : 375
  const padding = 48 // 24px padding on left and right
  const availableWidth = Math.max(300, containerWidth - padding)

  // Calculate fit scale so desktop (1280px) and tablet (768px) fit inside panel without clipping
  const fitScale = availableWidth < targetWidth ? availableWidth / targetWidth : 1
  const finalScale = fitScale * (zoom / 100)

  const scaledWidth = targetWidth * finalScale

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Device & Canvas Control Toolbar */}
      <div className="h-10 border-b border-border bg-card/80 px-4 flex items-center justify-between text-xs flex-shrink-0 z-10 backdrop-blur-md">
        {/* Device Switcher */}
        <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-lg">
          <button
            onClick={() => setDevicePreview('desktop')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all cursor-pointer ${
              devicePreview === 'desktop' ? 'bg-card text-foreground font-bold shadow-xs' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Monitor className="h-3.5 w-3.5" /> Desktop
          </button>
          <button
            onClick={() => setDevicePreview('tablet')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all cursor-pointer ${
              devicePreview === 'tablet' ? 'bg-card text-foreground font-bold shadow-xs' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Tablet className="h-3.5 w-3.5" /> Tablet
          </button>
          <button
            onClick={() => setDevicePreview('mobile')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all cursor-pointer ${
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
              disabled={zoom <= 50}
              className="p-1 hover:text-foreground text-muted-foreground disabled:opacity-30 cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="h-3 w-3" />
            </button>
            <span className="w-9 text-center font-bold">{Math.round(finalScale * 100)}%</span>
            <button
              onClick={zoomIn}
              disabled={zoom >= 120}
              className="p-1 hover:text-foreground text-muted-foreground disabled:opacity-30 cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="h-3 w-3" />
            </button>
            {zoom !== 100 && (
              <button
                onClick={resetZoom}
                className="p-1 hover:text-primary text-muted-foreground ml-0.5 cursor-pointer"
                title="Reset Zoom"
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

      {/* Direct Interactive Canvas Container */}
      <div
        ref={containerRef}
        data-lenis-prevent
        tabIndex={0}
        className="flex-1 p-6 overflow-y-auto outline-none flex justify-center bg-muted/40 relative"
      >
        {!content ? (
          <div className="flex flex-col items-center justify-center p-12 text-muted-foreground space-y-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-xs font-medium">Initializing live portfolio preview...</p>
          </div>
        ) : (
          <div
            style={{
              width: `${scaledWidth}px`,
            }}
            className="relative transition-all duration-200 flex justify-center items-start pb-12"
          >
            <div
              style={{
                width: `${targetWidth}px`,
                transform: `scale(${finalScale})`,
                transformOrigin: 'top center',
              }}
              className="transition-transform duration-200 bg-background shadow-2xl rounded-2xl overflow-hidden border border-border/80 min-h-[850px] relative"
            >
              <PortfolioRenderer content={content} template={template} theme={theme} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
