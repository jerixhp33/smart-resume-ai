import React from 'react'
import { getPublicPortfolio } from '@/features/portfolio/actions'
import { mapResumeToPortfolioContent } from '@/lib/portfolio/mapper'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { PortfolioClient } from './PortfolioClient'

type Props = {
  params: Promise<{ username: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params
  const { site, profile, resume } = await getPublicPortfolio(username)
  if (!profile && !site) return { title: 'Portfolio Not Found' }

  const resumeData = (resume?.data as any) || {}
  const content = site?.content || mapResumeToPortfolioContent(resumeData, profile)
  const name = content.hero?.full_name || profile?.full_name || 'Professional'
  const title = content.hero?.title || 'Portfolio'

  return {
    title: site?.title || `${name} | ${title}`,
    description: site?.seo_metadata?.description || content.hero?.summary || `View ${name}'s professional portfolio and credentials.`,
    openGraph: {
      title: `${name} — ${title}`,
      description: content.hero?.summary,
      type: 'profile',
    },
  }
}

export default async function PortfolioPage({ params }: Props) {
  const { username } = await params
  const { site, profile, resume, items } = await getPublicPortfolio(username)

  if (!profile && !site) {
    notFound()
  }

  return (
    <PortfolioClient
      site={site}
      profile={profile}
      resume={resume}
      items={items || []}
      username={username}
    />
  )
}
