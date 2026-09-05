import { getPublicResumeBySlug } from '@/features/resume/public-actions'
import { renderResumeHTML } from '@/templates/renderer'
import { ViewTracker } from '@/components/portfolio/ViewTracker'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const resume = await getPublicResumeBySlug(slug)
  if (!resume) return { title: 'Resume Not Found' }
  
  return {
    title: `${(resume.data as any)?.personal?.full_name ?? 'Resume'} - SmartResume AI`,
    description: (resume.data as any)?.summary ?? 'View my professional resume online.',
  }
}

export default async function PublicResumePage({ params }: Props) {
  const { slug } = await params
  const resume = await getPublicResumeBySlug(slug)
  
  if (!resume) {
    notFound()
  }

  const html = renderResumeHTML(resume.data as any, resume.template_id as any)

  return (
    <div className="w-full h-screen flex flex-col bg-slate-50 relative">
      <ViewTracker slug={slug} />
      
      <iframe 
        srcDoc={html} 
        className="w-full flex-1 border-none bg-white shadow-sm"
        title="Resume"
      />
      
      {/* Floating Action Button / Branding */}
      <a 
        href="/"
        target="_blank"
        className="fixed bottom-4 right-4 bg-primary text-primary-foreground px-4 py-2 rounded-full shadow-lg font-medium text-sm hover:scale-105 transition-transform flex items-center gap-2"
      >
        <span className="text-xl leading-none">✨</span>
        Built with SmartResume AI
      </a>
    </div>
  )
}
