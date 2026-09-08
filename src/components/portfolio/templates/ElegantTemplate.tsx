'use client'

import React from 'react'
import type { PortfolioContent, PortfolioThemeId, UserFile } from '@/types'
import { THEMES } from './theme-config'
import { Sparkles, Mail, ExternalLink } from 'lucide-react'
import { GithubIcon } from '@/components/ui/icons'

interface TemplateProps {
  content: PortfolioContent
  theme: PortfolioThemeId
  items?: UserFile[]
}

export function ElegantTemplate({ content, theme, items }: TemplateProps) {
  const themeConfig = THEMES[theme] || THEMES.amber
  const { hero, about, experience, projects, contact } = content

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased max-w-5xl mx-auto px-6 py-20 space-y-24">
      <header className="space-y-6 text-center max-w-3xl mx-auto">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
          <Sparkles className="h-8 w-8" />
        </div>
        <h1 className="text-5xl sm:text-6xl font-serif tracking-tight text-white">{hero.full_name}</h1>
        <p className="text-xl font-medium text-amber-400">{hero.title}</p>
        <p className="text-slate-300 text-base leading-relaxed">{hero.summary}</p>
      </header>

      {projects && projects.length > 0 && (
        <section className="space-y-8">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-center text-amber-400/80">Crafted Work</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {projects.map((p) => (
              <div key={p.id} className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 space-y-4 hover:border-amber-500/40 transition-all">
                <h3 className="text-2xl font-serif font-bold text-white">{p.title}</h3>
                <p className="text-slate-300 text-sm leading-relaxed">{p.description}</p>
                <div className="flex flex-wrap gap-2 pt-2">
                  {p.technologies.map((t, i) => (
                    <span key={i} className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 text-xs">{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
