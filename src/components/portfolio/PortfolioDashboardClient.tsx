'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { PortfolioSite, Profile } from '@/types'
import { publishPortfolioAction } from '@/features/portfolio/actions'
import { ClaimUsernameModal } from './ClaimUsernameModal'
import { SharePortfolioModal } from './SharePortfolioModal'
import { Sparkles, Edit3, Eye, Share2, BarChart2, Globe, Check, Copy, Settings, Plus, ArrowRight } from 'lucide-react'

interface PortfolioDashboardClientProps {
  portfolio: PortfolioSite | null
  profile: Profile | null
}

export function PortfolioDashboardClient({ portfolio, profile }: PortfolioDashboardClientProps) {
  const [published, setPublished] = useState(portfolio?.published ?? false)
  const [publishing, setPublishing] = useState(false)
  const [copied, setCopied] = useState(false)
  const [claimModalOpen, setClaimModalOpen] = useState(false)
  const [shareModalOpen, setShareModalOpen] = useState(false)
  const [username, setUsername] = useState(portfolio?.username || (profile as any)?.username || '')

  const publicUrl = username ? `${typeof window !== 'undefined' ? window.location.origin : ''}/portfolio/${username}` : ''

  const handleTogglePublish = async () => {
    if (!portfolio) return
    setPublishing(true)
    const nextPublished = !published
    const res = await publishPortfolioAction(portfolio.id, nextPublished)
    setPublishing(false)

    if (res.success) {
      setPublished(nextPublished)
    }
  }

  const handleCopyLink = () => {
    if (!publicUrl) return
    navigator.clipboard.writeText(publicUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!portfolio) {
    return (
      <div className="border-2 border-dashed border-border rounded-2xl p-12 text-center space-y-4 max-w-2xl mx-auto my-12">
        <div className="h-14 w-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
          <Sparkles className="h-7 w-7" />
        </div>
        <div className="space-y-1">
          <h2 className="text-xl font-bold">Build Your AI Portfolio</h2>
          <p className="text-sm text-muted-foreground">
            Generate an elite personal website in seconds from your resume data.
          </p>
        </div>
        <Link href="/portfolio/create">
          <Button size="lg" className="gap-2 shadow-md">
            <Sparkles className="h-4 w-4" /> Build My Portfolio
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">AI Portfolio</h1>
            <Badge variant={published ? 'default' : 'secondary'} className="capitalize">
              {published ? 'Published' : 'Draft'}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your live portfolio, customize studio design, and track analytics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setShareModalOpen(true)}
            className="gap-2 shadow-xs border-primary/30 text-primary hover:bg-primary/5"
          >
            <Share2 className="h-4 w-4" /> Share Portfolio
          </Button>
          <Link href={`/portfolio/editor/${portfolio.id}`}>
            <Button className="gap-2 shadow-xs">
              <Edit3 className="h-4 w-4" /> Open Studio Editor
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Portfolio Card */}
      <Card className="p-6 space-y-6 border-border/80 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-border">
          <div className="space-y-1">
            <h2 className="text-xl font-bold">{portfolio.title}</h2>
            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              <span>Template: <strong className="text-foreground capitalize">{portfolio.template}</strong></span>
              <span>•</span>
              <span>Theme: <strong className="text-foreground capitalize">{portfolio.theme}</strong></span>
              <span>•</span>
              <span>Motion: <strong className="text-foreground capitalize">{portfolio.motion_level}</strong></span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant={published ? 'outline' : 'default'}
              onClick={handleTogglePublish}
              disabled={publishing}
              className="gap-2"
            >
              <Globe className="h-4 w-4" />
              {published ? 'Unpublish' : 'Publish Portfolio'}
            </Button>
          </div>
        </div>

        {/* Public Link Bar */}
        <div className="bg-muted/40 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-border/60">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-muted-foreground">Your Public Portfolio Link</p>
            <p className="text-sm font-mono font-medium text-foreground truncate">
              {publicUrl || `smartresume.ai/portfolio/${username}`}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button size="sm" onClick={() => setShareModalOpen(true)} className="gap-1.5 shadow-xs">
              <Share2 className="h-3.5 w-3.5" /> Share Card
            </Button>
            <Button variant="outline" size="sm" onClick={handleCopyLink} className="gap-1.5">
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? 'Copied!' : 'Copy Link'}
            </Button>
            <Link href={`/portfolio/${username}`} target="_blank">
              <Button size="sm" variant="ghost" className="gap-1.5">
                <Eye className="h-3.5 w-3.5" /> Visit
              </Button>
            </Link>
            <Button size="sm" variant="ghost" onClick={() => setClaimModalOpen(true)}>
              Claim Custom URL
            </Button>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid sm:grid-cols-3 gap-4 pt-2">
          <Link href={`/portfolio/editor/${portfolio.id}`} prefetch={true}>
            <Card className="p-4 hover:border-primary/40 transition-all cursor-pointer group">
              <Edit3 className="h-5 w-5 text-primary mb-2" />
              <p className="font-bold text-sm group-hover:text-primary transition-colors">Studio Editor</p>
              <p className="text-xs text-muted-foreground mt-0.5">Customize sections, content, and colors</p>
            </Card>
          </Link>
          <Link href={`/portfolio/analytics/${portfolio.id}`} prefetch={true}>
            <Card className="p-4 hover:border-primary/40 transition-all cursor-pointer group">
              <BarChart2 className="h-5 w-5 text-blue-500 mb-2" />
              <p className="font-bold text-sm group-hover:text-primary transition-colors">Analytics</p>
              <p className="text-xs text-muted-foreground mt-0.5">View traffic, referrers, and visitor insights</p>
            </Card>
          </Link>
          <Link href={`/portfolio/settings/${portfolio.id}`} prefetch={true}>
            <Card className="p-4 hover:border-primary/40 transition-all cursor-pointer group">
              <Settings className="h-5 w-5 text-orange-500 mb-2" />
              <p className="font-bold text-sm group-hover:text-primary transition-colors">SEO & Settings</p>
              <p className="text-xs text-muted-foreground mt-0.5">Meta titles, description, and social image</p>
            </Card>
          </Link>
        </div>
      </Card>

      <ClaimUsernameModal
        open={claimModalOpen}
        onOpenChange={setClaimModalOpen}
        onClaimed={(newUsername) => setUsername(newUsername)}
      />

      <SharePortfolioModal
        open={shareModalOpen}
        onOpenChange={setShareModalOpen}
        portfolioTitle={portfolio.title}
        portfolioSummary={portfolio.content?.hero?.summary}
        username={username}
        accentColor={portfolio.seo_metadata?.accent_color || portfolio.theme}
        ogImage={portfolio.seo_metadata?.og_image}
      />
    </div>
  )
}

