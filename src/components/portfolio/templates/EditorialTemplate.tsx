'use client'

import React from 'react'
import type { PortfolioContent, PortfolioThemeId, UserFile } from '@/types'
import { THEMES } from './theme-config'

interface TemplateProps {
  content: PortfolioContent
  theme: PortfolioThemeId
  items?: UserFile[]
}

export function EditorialTemplate({ content, theme, items }: TemplateProps) {
  const { hero, about, experience, projects, contact } = content

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#1c1917] font-serif antialiased max-w-4xl mx-auto px-8 py-20 space-y-24">
      <header className="border-b border-[#e7e5e4] pb-16 space-y-6">
        <p className="text-xs uppercase tracking-[0.2em] text-[#78716c] font-sans font-semibold">Portfolio & Monograph</p>
        <h1 className="text-6xl font-light tracking-tight text-[#0c0a09] leading-none">{hero.full_name}</h1>
        <p className="text-xl italic text-[#57534e] font-normal">{hero.title}</p>
        <p className="text-lg leading-relaxed text-[#292524] max-w-2xl pt-4">{hero.summary}</p>
      </header>

      {projects && projects.length > 0 && (
        <section className="space-y-12">
          <h2 className="text-xs uppercase tracking-[0.2em] text-[#78716c] font-sans font-bold">Selected Works</h2>
          <div className="space-y-16">
            {projects.map((p, idx) => (
              <div key={p.id} className="grid md:grid-cols-12 gap-6 items-baseline border-b border-[#e7e5e4] pb-12">
                <span className="md:col-span-1 text-xs font-mono text-[#a8a29e]">0{idx + 1}</span>
                <div className="md:col-span-11 space-y-3">
                  <h3 className="text-2xl font-normal text-[#0c0a09]">{p.title}</h3>
                  <p className="text-base text-[#44403c] leading-relaxed font-sans">{p.description}</p>
                  <div className="flex flex-wrap gap-2 pt-2 font-sans text-xs text-[#78716c]">
                    {p.technologies.map((t, i) => (
                      <span key={i}>— {t}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {contact.email && (
        <footer className="pt-12 text-center font-sans text-sm text-[#78716c]">
          <p>Direct inquiries to <a href={`mailto:${contact.email}`} className="text-[#0c0a09] font-medium underline">{contact.email}</a></p>
        </footer>
      )}
    </div>
  )
}
