import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { getPortfolioByIdAction } from '@/features/portfolio/actions'
import { PortfolioRenderer } from '@/components/portfolio/templates/PortfolioRenderer'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Edit3 } from 'lucide-react'

type Props = {
  params: Promise<{ id: string }>
}

export default async function PortfolioPreviewPage({ params }: Props) {
  const { id } = await params
  const supabase = await getSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const res = await getPortfolioByIdAction(id)
  if (res.error || !res.portfolio) notFound()

  const site = res.portfolio

  return (
    <div className="min-h-screen bg-background relative">
      <div className="fixed top-4 left-4 z-50 flex items-center gap-2">
        <Link href="/portfolio">
          <Button variant="outline" size="sm" className="gap-1.5 shadow-md bg-card/90 backdrop-blur-md">
            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
          </Button>
        </Link>
        <Link href={`/portfolio/editor/${site.id}`}>
          <Button size="sm" className="gap-1.5 shadow-md">
            <Edit3 className="h-4 w-4" /> Edit in Studio
          </Button>
        </Link>
      </div>

      <PortfolioRenderer content={site.content} template={site.template} theme={site.theme} />
    </div>
  )
}
