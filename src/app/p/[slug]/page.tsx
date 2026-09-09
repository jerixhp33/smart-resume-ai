import { getPublicResumeBySlug } from '@/features/resume/public-actions'
import { getPublicPortfolio } from '@/features/portfolio/actions'
import { renderResumeHTML } from '@/templates/renderer'
import { ViewTracker } from '@/components/portfolio/ViewTracker'
import { PortfolioClient } from '@/app/portfolio/[username]/PortfolioClient'
import { notFound, redirect } from 'next/navigation'
import type { Metadata } from 'next'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  
  // 1. Try public portfolio first
  const { site, profile } = await getPublicPortfolio(slug)
  if (site || profile) {
    const name = site?.content?.hero?.full_name || profile?.full_name || 'Portfolio'
    return {
      title: site?.title || `${name} | Portfolio`,
      description: site?.seo_metadata?.description || 'View professional portfolio.',
    }
  }

  // 2. Try resume slug fallback
  const resume = await getPublicResumeBySlug(slug)
  if (!resume) return { title: 'Not Found' }
  
  return {
    title: `${(resume.data as any)?.personal?.full_name ?? 'Resume'} - Resunio`,
    description: (resume.data as any)?.summary ?? 'View my professional resume online.',
  }
}



export default async function PublicSlugPage({ params }: Props) {
  const { slug } = await params

  // 1. Try public portfolio first -> Redirect to standardized /portfolio/[username] URL
  const { site, profile } = await getPublicPortfolio(slug)
  if (site || profile) {
    redirect(`/portfolio/${slug}`)
  }

  // 2. Fallback to public resume by slug
  const publicResume = await getPublicResumeBySlug(slug)
  if (!publicResume) {
    notFound()
  }

  const html = renderResumeHTML(publicResume.data as any, publicResume.template_id as any)

  return (
    <div className="w-full h-screen flex flex-col bg-slate-50 relative">
      <ViewTracker slug={slug} />
      <iframe 
        srcDoc={html} 
        className="w-full flex-1 border-none bg-white shadow-sm"
        title="Resume"
      />
      <a 
        href="/"
        target="_blank"
        className="fixed bottom-4 right-4 bg-primary text-primary-foreground px-4 py-2 rounded-full shadow-lg font-medium text-sm hover:scale-105 transition-transform flex items-center gap-2"
      >
        <span className="text-xl leading-none">✨</span>
        Built with Resunio
      </a>
    </div>
  )
}
