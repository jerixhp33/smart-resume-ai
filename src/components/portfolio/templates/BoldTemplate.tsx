'use client'

import React from 'react'
import type { PortfolioContent, PortfolioThemeId, UserFile } from '@/types'
import { THEMES } from './theme-config'

interface TemplateProps {
  content: PortfolioContent
  theme: PortfolioThemeId
  items?: UserFile[]
}

export function BoldTemplate({ content, theme, items }: TemplateProps) {
  const themeConfig = THEMES[theme] || THEMES.rose
  const { hero, projects, experience, contact } = content

  return (
    <div className="min-h-screen bg-black text-white font-sans antialiased max-w-6xl mx-auto px-6 py-20 space-y-24">
      <header className="space-y-6">
        <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${themeConfig.badgeBg}`}>
          AVAILABLE FOR HIRE
        </span>
        <h1 className="text-6xl sm:text-8xl font-black tracking-tighter uppercase leading-none">
          {hero.full_name}
        </h1>
        <p className={`text-2xl sm:text-4xl font-extrabold uppercase bg-gradient-to-r ${themeConfig.gradient} bg-clip-text text-transparent`}>
          {hero.title}
        </p>
        <p className="text-xl text-zinc-300 font-medium max-w-3xl leading-relaxed">{hero.summary}</p>
      </header>

      {projects && projects.length > 0 && (
        <section className="space-y-8">
          <h2 className="text-xs font-black uppercase tracking-widest text-zinc-500">PROJECTS</h2>
          <div className="grid gap-6">
            {projects.map((p) => (
              <div key={p.id} className="bg-zinc-900 border-2 border-zinc-800 hover:border-white p-8 rounded-3xl transition-all">
                <h3 className="text-3xl font-black mb-3">{p.title}</h3>
                <p className="text-zinc-400 text-base mb-6 leading-relaxed">{p.description}</p>
                <div className="flex flex-wrap gap-2">
                  {p.technologies.map((t, i) => (
                    <span key={i} className="px-3 py-1 rounded-lg bg-zinc-800 text-zinc-200 text-xs font-bold">{t}</span>
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
