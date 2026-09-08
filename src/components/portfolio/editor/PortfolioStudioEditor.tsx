'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { PortfolioSite } from '@/types'
import { usePortfolioStore } from '@/features/portfolio/usePortfolioStore'
import { LeftNavigationPanel } from './LeftNavigationPanel'
import { CenterPreviewPanel } from './CenterPreviewPanel'
import { RightDesignPanel } from './RightDesignPanel'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  ArrowLeft,
  Eye,
  Check,
  Loader2,
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
  Maximize2,
  Minimize2,
  Globe,
  ExternalLink,
} from 'lucide-react'

interface PortfolioStudioEditorProps {
  portfolio: PortfolioSite
}

export function PortfolioStudioEditor({ portfolio }: PortfolioStudioEditorProps) {
  const initialize = usePortfolioStore((s) => s.initialize)
  const saveStatus = usePortfolioStore((s) => s.saveStatus)
  const username = portfolio.username

  const router = useRouter()
  const [isLeftOpen, setIsLeftOpen] = useState(true)
  const [isRightOpen, setIsRightOpen] = useState(true)
  const [isNavigatingHub, setIsNavigatingHub] = useState(false)

  useEffect(() => {
    initialize(portfolio)
    // Instant prefetch both the hub and the public slug location
    router.prefetch('/portfolio')
    if (username) {
      router.prefetch(`/portfolio/${username}`)
    }
  }, [portfolio, username, initialize, router])

  const handleNavigateHub = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsNavigatingHub(true)
    router.push('/portfolio')
  }

  const toggleFullFocus = () => {
    if (isLeftOpen || isRightOpen) {
      setIsLeftOpen(false)
      setIsRightOpen(false)
    } else {
      setIsLeftOpen(true)
      setIsRightOpen(true)
    }
  }

  return (
    <div className="h-screen flex flex-col bg-background text-foreground overflow-hidden">
      {/* Studio Header Bar */}
      <header className="h-14 border-b border-border bg-card px-4 flex items-center justify-between z-30 flex-shrink-0">
        <div className="flex items-center gap-3">
          {/* Instant Fast Portfolio Hub Button */}
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="gap-1.5 text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <Link
              href="/portfolio"
              prefetch={true}
              onClick={handleNavigateHub}
            >
              {isNavigatingHub ? <Loader2 className="h-4 w-4 animate-spin text-primary" /> : <ArrowLeft className="h-4 w-4" />}
              <span>Portfolio Hub</span>
            </Link>
          </Button>

          <span className="text-border">|</span>

          {/* Direct Live Slug Location Link Button */}
          {username && (
            <Link
              href={`/portfolio/${username}`}
              target="_blank"
              prefetch={true}
              className="inline-flex items-center gap-1.5 text-xs font-mono px-2.5 py-1 rounded-lg bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-all font-semibold hover:scale-105 active:scale-95"
              title={`Jump directly to Live Slug Location: /portfolio/${username}`}
            >
              <Globe className="h-3.5 w-3.5" />
              <span className="truncate max-w-[130px]">/{username}</span>
              <ExternalLink className="h-3 w-3 opacity-70" />
            </Link>
          )}

          {/* Toggle Left Navigation Panel */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsLeftOpen(!isLeftOpen)}
            title={isLeftOpen ? "Collapse Content Editor Sidebar" : "Expand Content Editor Sidebar"}
            className="gap-1.5 text-xs h-8 text-muted-foreground hover:text-foreground"
          >
            {isLeftOpen ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4 text-primary" />}
            <span className="hidden sm:inline">{isLeftOpen ? "Close Editor" : "Expand Editor"}</span>
          </Button>

          <span className="font-bold text-sm truncate max-w-[160px] hidden lg:inline">{portfolio.title}</span>

          {/* Autosave Status Indicator */}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground ml-1">
            {saveStatus === 'saving' && (
              <Badge variant="outline" className="gap-1 text-amber-500 border-amber-500/30">
                <Loader2 className="h-3 w-3 animate-spin" /> Saving...
              </Badge>
            )}
            {saveStatus === 'saved' && (
              <Badge variant="outline" className="gap-1 text-emerald-500 border-emerald-500/30">
                <Check className="h-3 w-3" /> Saved
              </Badge>
            )}
            {saveStatus === 'unsaved' && (
              <Badge variant="outline" className="gap-1 text-slate-400">
                Unsaved
              </Badge>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Toggle Full Screen Canvas Focus Mode */}
          <Button
            variant="outline"
            size="sm"
            onClick={toggleFullFocus}
            title={!isLeftOpen && !isRightOpen ? "Restore Panels" : "Full Screen Canvas Mode"}
            className="gap-1.5 text-xs h-8"
          >
            {!isLeftOpen && !isRightOpen ? (
              <>
                <Minimize2 className="h-3.5 w-3.5 text-primary" />
                <span className="hidden md:inline">Restore Panels</span>
              </>
            ) : (
              <>
                <Maximize2 className="h-3.5 w-3.5" />
                <span className="hidden md:inline">Full Canvas</span>
              </>
            )}
          </Button>

          {/* Toggle Right Design Panel */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsRightOpen(!isRightOpen)}
            title={isRightOpen ? "Collapse Theme Controls" : "Expand Theme Controls"}
            className="gap-1.5 text-xs h-8 text-muted-foreground hover:text-foreground"
          >
            <span className="hidden sm:inline">{isRightOpen ? "Close Themes" : "Expand Themes"}</span>
            {isRightOpen ? <PanelRightClose className="h-4 w-4" /> : <PanelRightOpen className="h-4 w-4 text-primary" />}
          </Button>

          <Button asChild variant="default" size="sm" className="gap-1.5 h-8 text-xs font-semibold shadow-xs">
            <Link href={`/portfolio/${username}`} target="_blank" prefetch={true}>
              <Eye className="h-3.5 w-3.5" /> View Live
            </Link>
          </Button>
        </div>
      </header>

      {/* 3-Panel Studio Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel: Sections & Content Editor */}
        <aside
          className={`border-r border-border bg-card flex flex-col flex-shrink-0 transition-all duration-300 ease-in-out overflow-hidden ${
            isLeftOpen ? 'w-80 opacity-100' : 'w-0 opacity-0 pointer-events-none'
          }`}
        >
          <LeftNavigationPanel />
        </aside>

        {/* Center Panel: Interactive Responsive Canvas */}
        <main className="flex-1 bg-muted/30 flex flex-col overflow-hidden relative">
          <CenterPreviewPanel username={username} />
        </main>

        {/* Right Panel: Design & Theme Controls */}
        <aside
          className={`border-l border-border bg-card flex flex-col flex-shrink-0 transition-all duration-300 ease-in-out overflow-hidden ${
            isRightOpen ? 'w-72 opacity-100' : 'w-0 opacity-0 pointer-events-none'
          }`}
        >
          <RightDesignPanel />
        </aside>
      </div>
    </div>
  )
}
