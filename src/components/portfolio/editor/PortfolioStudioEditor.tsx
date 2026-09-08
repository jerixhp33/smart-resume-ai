'use client'

import React, { useEffect } from 'react'
import Link from 'next/link'
import type { PortfolioSite } from '@/types'
import { usePortfolioStore } from '@/features/portfolio/usePortfolioStore'
import { LeftNavigationPanel } from './LeftNavigationPanel'
import { CenterPreviewPanel } from './CenterPreviewPanel'
import { RightDesignPanel } from './RightDesignPanel'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Eye, Share2, Check, Loader2, Sparkles } from 'lucide-react'

interface PortfolioStudioEditorProps {
  portfolio: PortfolioSite
}

export function PortfolioStudioEditor({ portfolio }: PortfolioStudioEditorProps) {
  const initialize = usePortfolioStore((s) => s.initialize)
  const saveStatus = usePortfolioStore((s) => s.saveStatus)
  const username = portfolio.username

  useEffect(() => {
    initialize(portfolio)
  }, [portfolio, initialize])

  return (
    <div className="h-screen flex flex-col bg-background text-foreground overflow-hidden">
      {/* Studio Header Bar */}
      <header className="h-14 border-b border-border bg-card px-4 flex items-center justify-between z-30 flex-shrink-0">
        <div className="flex items-center gap-3">
          <Link href="/portfolio">
            <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" /> Portfolio Hub
            </Button>
          </Link>
          <span className="text-border">|</span>
          <span className="font-bold text-sm truncate max-w-[200px]">{portfolio.title}</span>

          {/* Autosave Status Indicator */}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground ml-2">
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
                Unsaved changes
              </Badge>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link href={`/portfolio/${username}`} target="_blank">
            <Button variant="outline" size="sm" className="gap-1.5">
              <Eye className="h-3.5 w-3.5" /> View Live
            </Button>
          </Link>
        </div>
      </header>

      {/* 3-Panel Studio Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel: Sections & Content Editor */}
        <aside className="w-80 border-r border-border bg-card flex flex-col flex-shrink-0">
          <LeftNavigationPanel />
        </aside>

        {/* Center Panel: Interactive Responsive Canvas */}
        <main className="flex-1 bg-muted/30 flex flex-col overflow-hidden relative">
          <CenterPreviewPanel username={username} />
        </main>

        {/* Right Panel: Design & Theme Controls */}
        <aside className="w-72 border-l border-border bg-card flex flex-col flex-shrink-0">
          <RightDesignPanel />
        </aside>
      </div>
    </div>
  )
}
