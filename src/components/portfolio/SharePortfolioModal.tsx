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
  Sparkles, 
  QrCode as QrIcon, 
  Download,
  Mail,
  Loader2
} from 'lucide-react'

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

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://smartresume.ai'
  const shareUrl = `${origin}/portfolio/${username}`

  // Lock body scroll 100% when modal is open (prevents background scrolling on trackpad/mouse)
  useEffect(() => {
    if (open) {
      const origOverflow = document.body.style.overflow
      const origTouch = document.body.style.touchAction
      document.body.style.overflow = 'hidden'
      document.body.style.touchAction = 'none'

      return () => {
        document.body.style.overflow = origOverflow
        document.body.style.touchAction = origTouch
      }
    }
  }, [open])

  useEffect(() => {
    if (!shareUrl) return
    setGeneratingQr(true)

    // Generate high-resolution clean PNG Data URL locally in client
    QRCode.toDataURL(shareUrl, {
      width: 600,
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

  // 1 Single Download Button: High-res Full Share Card with embedded QR Code & custom background/accent
  const handleDownloadFullCard = () => {
    if (!qrDataUrl) return
    setDownloadingCard(true)

    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      setDownloadingCard(false)
      return
    }

    canvas.width = 1200
    canvas.height = 630

    const renderCanvasContent = (bgImg?: HTMLImageElement) => {
      // 1. Draw uploaded image as background or fallback solid base
      if (bgImg) {
        ctx.drawImage(bgImg, 0, 0, 1200, 630)
        // Accent color overlay gradient for maximum contrast and legibility
        const grad = ctx.createLinearGradient(0, 0, 1200, 630)
        grad.addColorStop(0, `${accentColor}E6`)
        grad.addColorStop(1, '#0f172aFA')
        ctx.fillStyle = grad
        ctx.fillRect(0, 0, 1200, 630)
      } else {
        const grad = ctx.createLinearGradient(0, 0, 1200, 630)
        grad.addColorStop(0, accentColor || '#6366f1')
        grad.addColorStop(1, '#0f172a')
        ctx.fillStyle = grad
        ctx.fillRect(0, 0, 1200, 630)
      }

      // 2. Header Branding
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
      ctx.font = 'bold 24px sans-serif'
      ctx.fillText('✨ SMARTRESUME AI PORTFOLIO', 60, 80)

      ctx.fillStyle = 'rgba(255, 255, 255, 0.2)'
      ctx.roundRect(980, 50, 160, 42, 10)
      ctx.fill()
      ctx.fillStyle = '#ffffff'
      ctx.font = '18px monospace'
      ctx.fillText(`@${username}`, 1000, 77)

      // 3. Title & Summary
      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 50px sans-serif'
      ctx.fillText(portfolioTitle.slice(0, 36), 60, 220)

      ctx.fillStyle = 'rgba(255, 255, 255, 0.88)'
      ctx.font = '24px sans-serif'
      const summaryText = portfolioSummary.slice(0, 95) + (portfolioSummary.length > 95 ? '...' : '')
      ctx.fillText(summaryText, 60, 285)

      // 4. Footer link
      ctx.fillStyle = 'rgba(255, 255, 255, 0.75)'
      ctx.font = '22px monospace'
      ctx.fillText(`smartresume.ai/portfolio/${username}`, 60, 560)

      // 5. Embedded QR Code Box on bottom right
      const qrImg = new Image()
      qrImg.crossOrigin = 'anonymous'
      qrImg.src = qrDataUrl
      qrImg.onload = () => {
        ctx.fillStyle = '#ffffff'
        ctx.roundRect(870, 330, 270, 250, 16)
        ctx.fill()

        ctx.drawImage(qrImg, 895, 345, 220, 210)

        const a = document.createElement('a')
        a.href = canvas.toDataURL('image/png')
        a.download = `portfolio-full-card-${username}.png`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        setDownloadingCard(false)
        toast({ title: 'Full Share Card Downloaded!', description: '1200x630 share card with QR code saved to device.', variant: 'success' })
      }
    }

    if (ogImage) {
      const bg = new Image()
      bg.crossOrigin = 'anonymous'
      bg.src = ogImage
      bg.onload = () => renderCanvasContent(bg)
      bg.onerror = () => renderCanvasContent()
    } else {
      renderCanvasContent()
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
      <DialogContent className="max-w-md sm:max-w-lg p-6 gap-5 max-h-[85vh] overflow-y-auto overscroll-contain">
        <DialogHeader className="space-y-1 text-left">
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Share2 className="h-5 w-5 text-primary" /> Share Portfolio
          </DialogTitle>
          <DialogDescription className="text-xs">
            Distribute your portfolio link to recruiters, LinkedIn connections, or social channels.
          </DialogDescription>
        </DialogHeader>

        {/* Visual Share Card Preview with Uploaded Background & Accent Overlay */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Share Card Preview
          </p>
          <div
            className="rounded-xl p-5 text-white shadow-md relative overflow-hidden flex flex-col justify-between min-h-[150px]"
            style={{ background: `linear-gradient(135deg, ${accentColor} 0%, #0f172a 100%)` }}
          >
            {ogImage && (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={ogImage}
                  alt="Share Background"
                  className="absolute inset-0 w-full h-full object-cover z-0"
                />
                <div
                  className="absolute inset-0 z-0 opacity-85"
                  style={{ background: `linear-gradient(135deg, ${accentColor}D9 0%, #0f172aF2 100%)` }}
                />
              </>
            )}

            <div className="flex justify-between items-center z-10">
              <span className="text-[11px] font-semibold uppercase tracking-wider opacity-90 flex items-center gap-1 drop-shadow-xs">
                <Sparkles className="h-3.5 w-3.5" /> SmartResume AI Portfolio
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-white/20 backdrop-blur-xs font-mono drop-shadow-xs">
                @{username}
              </span>
            </div>

            <div className="space-y-1 z-10 my-2">
              <h3 className="text-lg font-bold leading-tight line-clamp-1 drop-shadow-xs">{portfolioTitle}</h3>
              <p className="text-xs opacity-90 line-clamp-2 drop-shadow-xs">{portfolioSummary}</p>
            </div>

            <div className="flex justify-between items-end z-10 text-[10px] opacity-80 font-mono drop-shadow-xs">
              <span>smartresume.ai/portfolio/{username}</span>
              <span className="capitalize">{username}</span>
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
                  Download your branded 1200×630px Share Card with embedded QR code ready for social media & print.
                </p>
              </div>

              {/* ONE Single Primary Download Option */}
              <div className="flex items-center justify-center sm:justify-start">
                <Button
                  onClick={handleDownloadFullCard}
                  disabled={generatingQr || downloadingCard || !qrDataUrl}
                  size="sm"
                  className="gap-2 shadow-sm bg-primary text-primary-foreground font-medium text-xs h-9 px-4"
                >
                  {downloadingCard ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4" />
                  )}
                  {downloadingCard ? 'Generating Card...' : 'Download Full Card with QR'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
