'use client'

import React, { useState, useEffect } from 'react'
import QRCode from 'qrcode'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from '@/components/ui/toast'
import { 
  Copy, 
  Check, 
  Share2, 
  QrCode as QrIcon, 
  Download,
  Mail,
  Loader2
} from 'lucide-react'
import { ResunioLogo } from '@/components/brand/ResunioLogo'

interface SharePortfolioModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  portfolioTitle?: string
  portfolioSummary?: string
  username: string
  accentColor?: string
  ogImage?: string
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
    </svg>
  )
}

function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  )
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.572-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.99c-.002 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
    </svg>
  )
}

// Canvas helper to cleanly wrap text across lines without cutting off words
function getWrappedLines(
  ctx: CanvasRenderingContext2D, 
  text: string, 
  maxWidth: number, 
  maxLines: number
): string[] {
  const words = text.trim().split(/\s+/)
  const lines: string[] = []
  let currentLine = ''

  for (let i = 0; i < words.length; i++) {
    const testLine = currentLine ? `${currentLine} ${words[i]}` : words[i]
    const metrics = ctx.measureText(testLine)
    if (metrics.width > maxWidth && currentLine) {
      lines.push(currentLine)
      currentLine = words[i]
      if (lines.length === maxLines - 1) {
        const remaining = words.slice(i).join(' ')
        let lastLine = remaining
        while (ctx.measureText(`${lastLine}...`).width > maxWidth && lastLine.length > 0) {
          lastLine = lastLine.slice(0, -1)
        }
        lines.push(`${lastLine}${lastLine.length < remaining.length ? '...' : ''}`)
        return lines
      }
    } else {
      currentLine = testLine
    }
  }

  if (currentLine && lines.length < maxLines) {
    lines.push(currentLine)
  }

  return lines
}

export function SharePortfolioModal({
  open,
  onOpenChange,
  portfolioTitle = 'My Professional Portfolio',
  portfolioSummary = 'Check out my interactive AI portfolio showcasing skills, projects, and career milestones.',
  username,
  accentColor = '#6366f1',
  ogImage,
}: SharePortfolioModalProps) {
  const [copied, setCopied] = useState(false)
  const [qrDataUrl, setQrDataUrl] = useState<string>('')
  const [generatingQr, setGeneratingQr] = useState(true)
  const [downloadingCard, setDownloadingCard] = useState(false)

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://resunio.ai'
  const shareUrl = `${origin}/portfolio/${username}`

  // Lock document scrollbars when modal is open
  useEffect(() => {
    if (!open) return

    const origBodyOverflow = document.body.style.overflow
    const origHtmlOverflow = document.documentElement.style.overflow

    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = origBodyOverflow
      document.documentElement.style.overflow = origHtmlOverflow
    }
  }, [open])

  useEffect(() => {
    if (!shareUrl) return
    setGeneratingQr(true)

    // High-Resolution 1200px QR Code for 4K Retina output
    QRCode.toDataURL(shareUrl, {
      width: 1200,
      margin: 2,
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
    })
      .then((url) => {
        setQrDataUrl(url)
        setGeneratingQr(false)
      })
      .catch((err) => {
        console.error('Failed to generate QR code:', err)
        setGeneratingQr(false)
      })
  }, [shareUrl])

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    toast({ title: 'Link Copied!', description: 'Portfolio URL copied to clipboard.', variant: 'success' })
    setTimeout(() => setCopied(false), 2000)
  }

  // Generate 3840×2016 4K Ultra HD Executive Matte Share Card
  const handleDownloadFullCard = () => {
    if (!qrDataUrl) return
    setDownloadingCard(true)

    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      setDownloadingCard(false)
      return
    }

    // 4K Ultra HD Dimensions (3840×2016 - 3.2x Retina HD scaling)
    const scaleFactor = 3.2
    canvas.width = 3840
    canvas.height = 2016

    const renderCanvas = (bgImg?: HTMLImageElement) => {
      ctx.save()
      ctx.scale(scaleFactor, scaleFactor)
      // 1. Matte Background Layering
      if (bgImg) {
        const imgRatio = bgImg.width / bgImg.height
        const canvasRatio = 1200 / 630
        let renderW = 1200
        let renderH = 630
        let offsetX = 0
        let offsetY = 0

        if (imgRatio > canvasRatio) {
          renderW = 630 * imgRatio
          offsetX = (1200 - renderW) / 2
        } else {
          renderH = 1200 / imgRatio
          offsetY = (630 - renderH) / 2
        }

        ctx.drawImage(bgImg, offsetX, offsetY, renderW, renderH)

        // Dark matte accent overlay gradient
        const grad = ctx.createLinearGradient(0, 0, 1200, 630)
        grad.addColorStop(0, `${accentColor}D9`)
        grad.addColorStop(0.55, '#0b0f19EE')
        grad.addColorStop(1, '#070912FA')
        ctx.fillStyle = grad
        ctx.fillRect(0, 0, 1200, 630)
      } else {
        const grad = ctx.createLinearGradient(0, 0, 1200, 630)
        grad.addColorStop(0, accentColor || '#6366f1')
        grad.addColorStop(0.5, '#1e1b4b')
        grad.addColorStop(1, '#070912')
        ctx.fillStyle = grad
        ctx.fillRect(0, 0, 1200, 630)

        // Ambient radial matte glow
        const glow = ctx.createRadialGradient(250, 180, 50, 250, 180, 500)
        glow.addColorStop(0, 'rgba(255, 255, 255, 0.12)')
        glow.addColorStop(1, 'rgba(255, 255, 255, 0)')
        ctx.fillStyle = glow
        ctx.fillRect(0, 0, 1200, 630)
      }

      // 2. Top Bar: Resunio Logo Pill & @Username Badge
      // Logo Chip (Top Left)
      ctx.fillStyle = 'rgba(255, 255, 255, 0.12)'
      ctx.beginPath()
      ctx.roundRect(60, 52, 285, 50, 16)
      ctx.fill()
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)'
      ctx.lineWidth = 1.5
      ctx.stroke()

      // Draw Vector 3D Ribbon R Logo Mark directly onto Canvas
      ctx.save()
      ctx.translate(74, 61)
      const scale = 32 / 512
      ctx.scale(scale, scale)

      const gradTop = ctx.createLinearGradient(0, 0, 512, 512)
      gradTop.addColorStop(0, '#38bdf8')
      gradTop.addColorStop(0.45, '#06b6d4')
      gradTop.addColorStop(1, '#2563eb')

      const gradLeg = ctx.createLinearGradient(0, 0, 512, 512)
      gradLeg.addColorStop(0, '#3b82f6')
      gradLeg.addColorStop(0.5, '#6366f1')
      gradLeg.addColorStop(1, '#a855f7')

      const gradFold = ctx.createLinearGradient(0, 512, 512, 0)
      gradFold.addColorStop(0, '#00f2fe')
      gradFold.addColorStop(1, '#38bdf8')

      ctx.translate(-49, 6)

      ctx.fillStyle = gradTop
      ctx.fill(new Path2D('M140 90 C140 60, 168 40, 215 40 H315 C380 40, 430 90, 430 160 C430 230, 380 275, 315 275 H240 V385 C240 410, 220 430, 195 430 H185 C160 430, 140 410, 140 385 V90 Z'))

      ctx.fillStyle = gradLeg
      ctx.fill(new Path2D('M210 220 L375 385 C395 405, 425 405, 445 385 L450 380 C470 360, 470 330, 450 310 L315 175 Z'))

      ctx.fillStyle = gradFold
      ctx.fill(new Path2D('M140 315 L265 440 C285 460, 315 460, 335 440 L345 430 C365 410, 365 380, 345 360 L205 220 Z'))

      ctx.save()
      ctx.translate(205, 98)
      ctx.fillStyle = '#ffffff'
      ctx.beginPath()
      ctx.roundRect(0, 0, 125, 98, 14)
      ctx.fill()

      ctx.fillStyle = '#0284c7'
      ctx.beginPath()
      ctx.arc(28, 28, 9, 0, Math.PI * 2)
      ctx.fill()

      ctx.beginPath()
      ctx.roundRect(46, 23, 56, 10, 5)
      ctx.fill()

      ctx.fillStyle = '#0f172a'
      ctx.beginPath()
      ctx.roundRect(24, 50, 78, 10, 5)
      ctx.fill()

      ctx.beginPath()
      ctx.roundRect(24, 68, 54, 10, 5)
      ctx.fill()
      ctx.restore()
      ctx.restore()

      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 19px system-ui, -apple-system, sans-serif'
      ctx.fillText('RESUNIO PORTFOLIO', 118, 85)

      // @Username Chip (Top Right)
      ctx.fillStyle = 'rgba(255, 255, 255, 0.12)'
      ctx.beginPath()
      ctx.roundRect(930, 52, 210, 50, 25)
      ctx.fill()
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)'
      ctx.stroke()

      ctx.fillStyle = 'rgba(255, 255, 255, 0.95)'
      ctx.font = '600 18px monospace'
      ctx.textAlign = 'center'
      ctx.fillText(`@${username}`, 1035, 84)
      ctx.textAlign = 'left'

      // 3. Main Body: Modern Impactful Typography
      const maxTextWidth = 730
      ctx.fillStyle = '#ffffff'
      ctx.font = '900 46px system-ui, -apple-system, sans-serif'
      
      const titleLines = getWrappedLines(ctx, portfolioTitle, maxTextWidth, 2)
      let currentY = 210
      titleLines.forEach((line) => {
        ctx.fillText(line, 60, currentY)
        currentY += 56
      })

      // Summary / Bio lines
      currentY += 12
      ctx.fillStyle = 'rgba(255, 255, 255, 0.88)'
      ctx.font = '400 22px system-ui, -apple-system, sans-serif'
      const summaryLines = getWrappedLines(ctx, portfolioSummary, maxTextWidth, 2)
      summaryLines.forEach((line) => {
        ctx.fillText(line, 60, currentY)
        currentY += 34
      })

      // 4. Bottom Footer: Domain Pill Badge
      const hostName = origin.replace(/^https?:\/\//, '')
      const displayUrl = `${hostName}/portfolio/${username}`
      ctx.font = '600 20px monospace'
      const textWidth = ctx.measureText(displayUrl).width

      ctx.fillStyle = 'rgba(255, 255, 255, 0.12)'
      ctx.beginPath()
      ctx.roundRect(60, 518, Math.max(380, textWidth + 54), 54, 16)
      ctx.fill()
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)'
      ctx.stroke()

      ctx.fillStyle = '#ffffff'
      ctx.fillText(displayUrl, 87, 552)

      // 5. Embedded Matte High-Res QR Code Card (Bottom Right)
      const qrBoxX = 870
      const qrBoxY = 305
      const qrBoxW = 270
      const qrBoxH = 275

      ctx.fillStyle = '#ffffff'
      ctx.beginPath()
      ctx.roundRect(qrBoxX, qrBoxY, qrBoxW, qrBoxH, 24)
      ctx.fill()

      const qrImg = new Image()
      qrImg.crossOrigin = 'anonymous'
      qrImg.src = qrDataUrl
      qrImg.onload = () => {
        ctx.drawImage(qrImg, qrBoxX + 30, qrBoxY + 22, 210, 210)

        ctx.fillStyle = '#334155'
        ctx.font = 'bold 12px system-ui, -apple-system, sans-serif'
        ctx.textAlign = 'center'
        ctx.fillText('SCAN TO VIEW PORTFOLIO', qrBoxX + qrBoxW / 2, qrBoxY + 254)
        ctx.textAlign = 'left'

        // Export ultra high quality 4K PNG
        ctx.restore()
        const a = document.createElement('a')
        a.href = canvas.toDataURL('image/png', 1.0)
        a.download = `resunio-portfolio-4k-${username}.png`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        setDownloadingCard(false)
        toast({ title: '4K Ultra HD Card Downloaded!', description: 'Ultra sharp 3840×2016 matte share card saved to device.', variant: 'success' })
      }
    }

    if (ogImage) {
      const bg = new Image()
      bg.crossOrigin = 'anonymous'
      bg.src = ogImage
      bg.onload = () => renderCanvas(bg)
      bg.onerror = () => renderCanvas()
    } else {
      renderCanvas()
    }
  }

  const shareText = `Check out my interactive AI portfolio: ${portfolioTitle}`

  const handleShareSocial = (platform: 'linkedin' | 'twitter' | 'whatsapp' | 'email') => {
    let url = ''
    const encodedUrl = encodeURIComponent(shareUrl)
    const encodedText = encodeURIComponent(shareText)

    switch (platform) {
      case 'linkedin':
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`
        break
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`
        break
      case 'whatsapp':
        url = `https://api.whatsapp.com/send?text=${encodedText}%20${encodedUrl}`
        break
      case 'email':
        url = `mailto:?subject=${encodeURIComponent(portfolioTitle)}&body=${encodedText}%20${encodedUrl}`
        break
    }

    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        data-share-modal-content
        className="max-w-md sm:max-w-lg p-6 gap-5 max-h-[85vh] overflow-y-auto overscroll-contain"
      >
        <DialogHeader className="space-y-1 text-left">
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Share2 className="h-5 w-5 text-primary" /> Share Portfolio
          </DialogTitle>
          <DialogDescription className="text-xs">
            Distribute your portfolio link to recruiters, LinkedIn connections, or social channels.
          </DialogDescription>
        </DialogHeader>

        {/* Visual Aesthetic Share Card Preview */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
              Executive Share Card Preview (1200×630 HD Matte)
            </p>
            <span className="text-[10px] font-semibold text-primary/80 bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">
              HD Matte Canvas Output
            </span>
          </div>
          
          <div
            className="rounded-2xl p-6 text-white shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[190px] border border-white/15 group"
            style={{ 
              background: `radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.12) 0%, transparent 60%), linear-gradient(135deg, ${accentColor}E6 0%, #0d121f 55%, #05070e 100%)`,
              boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.6), inset 0 1px 0 0 rgba(255, 255, 255, 0.2)' 
            }}
          >
            {ogImage && (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={ogImage}
                  alt="Share Background"
                  className="absolute inset-0 w-full h-full object-cover z-0 opacity-40 mix-blend-overlay filter contrast-125"
                />
                <div
                  className="absolute inset-0 z-0"
                  style={{ background: `linear-gradient(135deg, ${accentColor}CC 0%, #0c101cFA 60%, #05070e 100%)` }}
                />
              </>
            )}

            {/* Top Bar Badges */}
            <div className="flex justify-between items-center z-10">
              <span className="text-[11px] font-black uppercase tracking-wider text-white flex items-center gap-2 bg-white/10 backdrop-blur-2xl px-3 py-1.5 rounded-xl border border-white/20 shadow-md">
                <ResunioLogo size="sm" variant="mark" showBg={false} className="!h-4 !w-4 border-0 p-0 shadow-none filter drop-shadow" />
                RESUNIO PORTFOLIO
              </span>
              <span className="text-xs px-3 py-1 rounded-full bg-white/10 backdrop-blur-2xl font-mono text-white/95 border border-white/20 shadow-sm font-semibold">
                @{username}
              </span>
            </div>

            {/* Title & Summary */}
            <div className="space-y-2 z-10 my-4">
              <h3 className="text-xl sm:text-2xl font-black tracking-tight leading-tight text-white drop-shadow-md">
                {portfolioTitle}
              </h3>
              <p className="text-xs sm:text-sm font-normal text-white/85 line-clamp-2 leading-relaxed drop-shadow-sm max-w-[90%]">
                {portfolioSummary}
              </p>
            </div>

            {/* Bottom URL Badge */}
            <div className="flex justify-between items-center z-10 text-xs font-mono text-white/90 border-t border-white/15 pt-3">
              <span className="bg-black/30 backdrop-blur-md px-3 py-1 rounded-lg border border-white/15 shadow-xs font-medium text-white/95 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {origin.replace(/^https?:\/\//, '')}/portfolio/{username}
              </span>
              <span className="uppercase text-white/50 font-sans text-[10px] font-bold tracking-widest bg-white/5 px-2.5 py-1 rounded-md border border-white/10">
                Matte Finish 1200×630
              </span>
            </div>
          </div>
        </div>

        {/* Direct Link Input with Copy Button */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground">Portfolio Public Link</label>
          <div className="flex items-center gap-2">
            <Input
              value={shareUrl}
              readOnly
              className="bg-muted/40 font-mono text-xs focus-visible:ring-1"
            />
            <Button onClick={handleCopy} size="sm" className="gap-1.5 shrink-0">
              {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
              {copied ? 'Copied' : 'Copy'}
            </Button>
          </div>
        </div>

        {/* 1-Click Social Sharing Buttons */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Quick 1-Click Social Share
          </p>
          <div className="grid grid-cols-4 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleShareSocial('linkedin')}
              className="flex flex-col h-auto py-2.5 gap-1.5 hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:border-blue-500 hover:text-blue-600 transition-all"
            >
              <LinkedinIcon className="h-4 w-4 text-blue-600" />
              <span className="text-[11px] font-medium">LinkedIn</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handleShareSocial('twitter')}
              className="flex flex-col h-auto py-2.5 gap-1.5 hover:bg-sky-50 dark:hover:bg-sky-950/30 hover:border-sky-500 hover:text-sky-500 transition-all"
            >
              <TwitterIcon className="h-4 w-4 text-sky-500" />
              <span className="text-[11px] font-medium">Twitter / X</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handleShareSocial('whatsapp')}
              className="flex flex-col h-auto py-2.5 gap-1.5 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 hover:border-emerald-500 hover:text-emerald-600 transition-all"
            >
              <WhatsAppIcon className="h-4 w-4 text-emerald-600" />
              <span className="text-[11px] font-medium">WhatsApp</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handleShareSocial('email')}
              className="flex flex-col h-auto py-2.5 gap-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
            >
              <Mail className="h-4 w-4 text-foreground" />
              <span className="text-[11px] font-medium">Email</span>
            </Button>
          </div>
        </div>

        {/* High-Resolution QR & Single Full Card Download Option */}
        <div className="pt-3 border-t border-border space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <QrIcon className="h-4 w-4 text-primary" /> Networking QR & Share Banner
            </span>
            <span className="text-[11px] text-muted-foreground">Scan with phone camera</span>
          </div>

          <div className="bg-card border border-border rounded-xl p-4 flex flex-col sm:flex-row items-center gap-5 shadow-xs">
            <div className="w-32 h-32 bg-white rounded-lg p-2 border border-border flex items-center justify-center shrink-0 shadow-inner">
              {generatingQr ? (
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  <span className="text-[10px]">Generating...</span>
                </div>
              ) : qrDataUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={qrDataUrl}
                  alt={`QR Code for ${shareUrl}`}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="text-[10px] text-destructive text-center">Failed to load QR</div>
              )}
            </div>

            <div className="space-y-3 text-center sm:text-left flex-1">
              <div>
                <h4 className="text-sm font-semibold text-foreground">In-Person & Digital Networking</h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Download your executive 4K Ultra HD (3840×2016px) Share Card with embedded QR code ready for social media & crisp print.
                </p>
              </div>

              {/* ONE Single Primary Download Option */}
              <div className="flex items-center justify-center sm:justify-start">
                <Button
                  onClick={handleDownloadFullCard}
                  disabled={generatingQr || downloadingCard || !qrDataUrl}
                  size="sm"
                  className="gap-2 shadow-md bg-primary text-primary-foreground font-semibold text-xs h-9 px-4 hover:brightness-110"
                >
                  {downloadingCard ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4" />
                  )}
                  {downloadingCard ? 'Rendering 4K Card...' : 'Download 4K Ultra HD Card with QR'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

