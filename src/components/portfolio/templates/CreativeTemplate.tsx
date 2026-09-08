'use client'

import React from 'react'
import type { PortfolioContent, PortfolioThemeId, UserFile } from '@/types'
import { THEMES } from './theme-config'
import { SectionReveal } from '@/components/motion/SectionReveal'
import { Sparkles, ArrowUpRight, Mail } from 'lucide-react'
import { GithubIcon } from '@/components/ui/icons'

interface TemplateProps {
  content: PortfolioContent
  theme: PortfolioThemeId
  items?: UserFile[]
}

export function CreativeTemplate({ content, theme, items }: TemplateProps) {
  const themeConfig = THEMES[theme] || THEMES.violet
  const { hero, about, experience, projects, skills, contact } = content

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans antialiased relative overflow-x-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-10 w-[400px] h-[400px] bg-blue-600/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 py-20 relative z-10 space-y-28">
        {/* Creative Hero */}
        <section className="space-y-8 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-semibold text-purple-300">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Creative Showcase</span>
          </div>
          <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight bg-gradient-to-r from-white via-purple-100 to-purple-400 bg-clip-text text-transparent leading-[1.08]">
            {hero.full_name}
          </h1>
          <p className="text-2xl font-medium text-purple-200/90">{hero.title}</p>
          <p className="text-lg text-slate-300 leading-relaxed max-w-2xl">{hero.summary}</p>
          <div className="flex flex-wrap gap-4 pt-4">
            {contact.email && (
              <a href={`mailto:${contact.email}`} className="px-7 py-3.5 rounded-2xl bg-white text-slate-950 font-bold hover:bg-purple-100 transition-colors shadow-lg shadow-purple-500/10">
                Let's Talk
              </a>
            )}
          </div>
        </section>

        {/* Projects */}
        {projects && projects.length > 0 && (
          <section className="space-y-10">
            <h2 className="text-3xl font-extrabold tracking-tight text-white">Selected Creations</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {projects.map((p) => (
                <div key={p.id} className="group bg-white/5 border border-white/10 backdrop-blur-md rounded-3xl p-8 hover:bg-white/10 hover:border-white/20 transition-all duration-300 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-4 mb-4">
                      <h3 className="text-2xl font-bold text-white group-hover:text-purple-300 transition-colors">{p.title}</h3>
                      {p.live_url && (
                        <a href={p.live_url} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20">
                          <ArrowUpRight className="h-5 w-5" />
                        </a>
                      )}
                    </div>
                    <p className="text-slate-300 text-sm leading-relaxed mb-6">{p.description}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {p.technologies.map((t, i) => (
                      <span key={i} className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">{t}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
