import React from 'react'
import { getPublicPortfolio } from '@/features/portfolio/actions'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { PortfolioClient } from './PortfolioClient'

type Props = {
  params: Promise<{ username: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params
  const { profile, resume } = await getPublicPortfolio(username)
  if (!profile) return { title: 'Portfolio Not Found' }
  
  const resumeData = resume?.data || {}
  const name = resumeData.personal?.full_name || profile.full_name || 'User'
  const title = resumeData.personal?.professional_title || 'Portfolio'
  
  return {
    title: `${name} | ${title}`,
    description: resumeData.summary || `View ${name}'s professional portfolio and credentials.`,
  }
}

export default async function PortfolioPage({ params }: Props) {
  const { username } = await params
  const { profile, resume, items, error } = await getPublicPortfolio(username)

  if (error || !profile) {
    notFound()
  }

  return <PortfolioClient profile={profile} resume={resume} items={items || []} />
}
