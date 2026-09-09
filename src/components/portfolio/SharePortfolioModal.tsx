'use client'

import React, { useState } from 'react'
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
  ExternalLink, 
  Sparkles, 
  QrCode, 
  Download,
  Send,
  Mail
} from 'lucide-react'

interface SharePortfolioModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  portfolioTitle?: string
  portfolioSummary?: string
  username: string
  accentColor?: string
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
}: SharePortfolioModalProps) {
  const [copied, setCopied] = useState(false)
  const [showQr, setShowQr] = useState(false)

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://smartresume.ai'
  const shareUrl = `${origin}/portfolio/${username}`
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(shareUrl)}`

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    toast({ title: 'Link Copied!', description: 'Portfolio URL copied to clipboard.', variant: 'success' })
    setTimeout(() => setCopied(false), 2000)
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
      <DialogContent className="max-w-md sm:max-w-lg p-6 gap-6">
        <DialogHeader className="space-y-1 text-left">
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Share2 className="h-5 w-5 text-primary" /> Share Portfolio
          </DialogTitle>
          <DialogDescription className="text-xs">
            Distribute your portfolio link to recruiters, LinkedIn connections, or social channels.
          </DialogDescription>
        </DialogHeader>

        {/* Visual Share Card Preview */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Share Card Preview
          </p>
          <div
            className="rounded-xl p-5 text-white shadow-md relative overflow-hidden flex flex-col justify-between min-h-[140px]"
            style={{ background: `linear-gradient(135deg, ${accentColor} 0%, #0f172a 100%)` }}
          >
            <div className="flex justify-between items-center z-10">
              <span className="text-[11px] font-semibold uppercase tracking-wider opacity-90 flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5" /> SmartResume AI Portfolio
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-white/20 backdrop-blur-xs font-mono">
                @{username}
              </span>
            </div>

            <div className="space-y-1 z-10 my-2">
              <h3 className="text-lg font-bold leading-tight line-clamp-1">{portfolioTitle}</h3>
              <p className="text-xs opacity-85 line-clamp-2">{portfolioSummary}</p>
            </div>

            <div className="flex justify-between items-end z-10 text-[10px] opacity-75 font-mono">
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

        {/* QR Code Section Toggle */}
        <div className="pt-2 border-t border-border flex flex-col items-center">
          {!showQr ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowQr(true)}
              className="gap-2 text-xs text-muted-foreground hover:text-foreground"
            >
              <QrCode className="h-4 w-4" /> Show QR Code for In-Person Networking
            </Button>
          ) : (
            <div className="flex flex-col items-center space-y-3 py-2 bg-muted/20 w-full rounded-xl border border-border">
              <div className="p-2 bg-white rounded-lg shadow-xs">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={qrCodeUrl} alt="Portfolio QR Code" className="w-36 h-36 object-contain" />
              </div>
              <div className="flex items-center gap-2">
                <a href={qrCodeUrl} download={`portfolio-qr-${username}.png`} target="_blank" rel="noreferrer">
                  <Button variant="outline" size="sm" className="gap-1.5 text-xs h-7">
                    <Download className="h-3.5 w-3.5" /> Download QR Code
                  </Button>
                </a>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowQr(false)}
                  className="text-xs h-7 text-muted-foreground"
                >
                  Hide QR
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
