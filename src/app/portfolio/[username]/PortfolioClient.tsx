'use client'

import React, { useEffect } from 'react'
import type { PortfolioSite, Profile, Resume, UserFile } from '@/types'
import { PortfolioRenderer } from '@/components/portfolio/templates/PortfolioRenderer'
import { mapResumeToPortfolioContent, enrichContentWithResume } from '@/lib/portfolio/mapper'
import { trackPortfolioViewAction } from '@/features/portfolio/actions'
import Link from 'next/link'
import { Sparkles } from 'lucide-react'

interface PortfolioClientProps {
  site: PortfolioSite | null
  profile: Profile | null
  resume: Resume | null
  items: UserFile[]
  username: string
}

export function PortfolioClient({ site, profile, resume, items, username }: PortfolioClientProps) {
  useEffect(() => {
    if (site?.id) {
      trackPortfolioViewAction(site.id, document.referrer, navigator.userAgent)
    }
  }, [site?.id])

  const rawContent = site?.content || mapResumeToPortfolioContent((resume?.data as any) || {}, profile)
  const content = enrichContentWithResume(rawContent, (resume?.data as any) || {}, profile)
  const template = site?.template || 'modern'
  const theme = site?.theme || 'indigo'
  const bgClass = template === 'bold' ? 'bg-black text-white' : template === 'editorial' ? 'bg-[#faf8f5] text-[#1c1917]' : template === 'minimal' ? 'bg-background text-foreground' : 'bg-slate-950 text-slate-100'

  // JSON-LD Structured Data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    mainEntity: {
      '@type': 'Person',
      name: content.hero.full_name,
      jobTitle: content.hero.title,
      description: content.hero.summary,
      email: content.contact?.email,
    },
  }

  return (
    <div className={`relative min-h-screen w-full overflow-x-hidden ${bgClass}`}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PortfolioRenderer content={content} template={template} theme={theme} items={items} />

      {/* Branding Badge */}
      <Link
        href="/"
        target="_blank"
        className="fixed bottom-4 right-4 z-40 bg-card/90 backdrop-blur-md border border-border text-foreground px-3.5 py-1.5 rounded-full shadow-lg text-xs font-semibold hover:scale-105 transition-all flex items-center gap-2 group"
      >
        <Sparkles className="h-3.5 w-3.5 text-primary group-hover:rotate-12 transition-transform" />
        <span>Built with SmartResume AI</span>
      </Link>
    </div>
  )
}
