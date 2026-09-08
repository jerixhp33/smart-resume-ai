'use client'

import React, { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { usePortfolioStore } from '@/features/portfolio/usePortfolioStore'
import { PortfolioRenderer } from '@/components/portfolio/templates/PortfolioRenderer'
import { Monitor, Tablet, Smartphone, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react'

interface CenterPreviewPanelProps {
  username: string
}

function PreviewIframe({
  children,
  width,
  onHeightChange,
}: {
  children: React.ReactNode
  width: number
  onHeightChange: (h: number) => void
}) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [mountNode, setMountNode] = useState<HTMLElement | null>(null)

  useEffect(() => {
    const iframe = iframeRef.current
    if (!iframe) return
    const doc = iframe.contentDocument
    if (!doc) return

    doc.open()
    doc.write(`
      <!DOCTYPE html>
      <html class="dark">
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <style>
            html, body {
              margin: 0;
              padding: 0;
              background-color: transparent;
              overflow-x: hidden;
            }
          </style>
        </head>
        <body class="bg-background text-foreground antialiased selection:bg-primary/20 selection:text-primary min-h-screen">
          <div id="preview-root"></div>
        </body>
      </html>
    `)
    doc.close()

    const syncHead = () => {
      if (!doc || !doc.head) return
      // Sync all style and link tags from main window to iframe
      const styleNodes = Array.from(document.head.querySelectorAll('style, link[rel="stylesheet"]'))
      
      // Preserve existing meta
      const existingMeta = doc.head.querySelector('meta[name="viewport"]')
      doc.head.innerHTML = ''
      if (existingMeta) doc.head.appendChild(existingMeta)
      
      styleNodes.forEach((node) => {
        doc.head.appendChild(node.cloneNode(true))
      })
    }

    syncHead()

    const observer = new MutationObserver(() => syncHead())
    observer.observe(document.head, { childList: true, subtree: true })

    setMountNode(doc.getElementById('preview-root'))

    return () => {
      observer.disconnect()
    }
  }, [])

  useEffect(() => {
    if (!iframeRef.current || !mountNode) return
    const doc = iframeRef.current.contentDocument
    if (!doc) return

    const updateHeight = () => {
      const root = doc.getElementById('preview-root')
      const height = root ? root.scrollHeight : doc.body.scrollHeight
      if (height > 0) {
        onHeightChange(height)
      }
    }

    updateHeight()

    const resizeObserver = new ResizeObserver(updateHeight)
    if (doc.body) resizeObserver.observe(doc.body)
    if (doc.getElementById('preview-root')) {
      resizeObserver.observe(doc.getElementById('preview-root')!)
    }

    return () => resizeObserver.disconnect()
  }, [mountNode, children, onHeightChange])

  return (
    <iframe
      ref={iframeRef}
      style={{
        width: `${width}px`,
        height: '100%',
        border: 'none',
        display: 'block',
        pointerEvents: 'auto',
      }}
      title="Portfolio Device Viewport Preview"
    >
      {mountNode && createPortal(children, mountNode)}
    </iframe>
  )
}

export function CenterPreviewPanel({ username }: CenterPreviewPanelProps) {
  const content = usePortfolioStore((s) => s.content)
  const template = usePortfolioStore((s) => s.template)
  const theme = usePortfolioStore((s) => s.theme)
  const devicePreview = usePortfolioStore((s) => s.devicePreview)
  const setDevicePreview = usePortfolioStore((s) => s.setDevicePreview)
  
  const [zoom, setZoom] = useState<number>(100)
  const [frameHeight, setFrameHeight] = useState<number>(900)
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

  if (!content) return null

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
  const scaledHeight = frameHeight * finalScale

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
              disabled={zoom <= 50}
              className="p-1 hover:text-foreground text-muted-foreground disabled:opacity-30"
              title="Zoom Out"
            >
              <ZoomOut className="h-3 w-3" />
            </button>
            <span className="w-9 text-center font-bold">{Math.round(finalScale * 100)}%</span>
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

      {/* Frame Container */}
      <div
        ref={containerRef}
        data-lenis-prevent
        tabIndex={0}
        className="flex-1 p-6 overflow-y-auto outline-none flex justify-center bg-muted/40 relative"
      >
        <div
          style={{
            width: `${scaledWidth}px`,
            height: `${scaledHeight + 32}px`,
          }}
          className="relative transition-all duration-200 flex justify-center items-start"
        >
          <div
            style={{
              width: `${targetWidth}px`,
              height: `${frameHeight}px`,
              transform: `scale(${finalScale})`,
              transformOrigin: 'top center',
            }}
            className="transition-transform duration-200 bg-background shadow-2xl rounded-2xl overflow-hidden border border-border/80"
          >
            <PreviewIframe width={targetWidth} onHeightChange={setFrameHeight}>
              <PortfolioRenderer content={content} template={template} theme={theme} />
            </PreviewIframe>
          </div>
        </div>
      </div>
    </div>
  )
}

