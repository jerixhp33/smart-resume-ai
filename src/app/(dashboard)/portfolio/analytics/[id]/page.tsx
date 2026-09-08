import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { getPortfolioByIdAction, getPortfolioAnalyticsAction } from '@/features/portfolio/actions'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, BarChart2, Eye, Globe } from 'lucide-react'

export const metadata = {
  title: 'Portfolio Analytics | SmartResume AI',
  description: 'Track portfolio views and traffic sources.',
}

type Props = {
  params: Promise<{ id: string }>
}

export default async function PortfolioAnalyticsPage({ params }: Props) {
  const { id } = await params
  const supabase = await getSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const res = await getPortfolioByIdAction(id)
  if (res.error || !res.portfolio) notFound()

  const analytics = await getPortfolioAnalyticsAction(id)
  const totalViews = ('totalViews' in analytics) ? analytics.totalViews : 0
  const topReferrers = ('topReferrers' in analytics && analytics.topReferrers) ? analytics.topReferrers : []

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-6 px-4 sm:px-6">
      <div className="flex items-center gap-4">
        <Link href="/portfolio">
          <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground">
            <ArrowLeft className="h-4 w-4" /> Back to Portfolio
          </Button>
        </Link>
      </div>

      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Portfolio Analytics</h1>
        <p className="text-sm text-muted-foreground">Traffic statistics for {res.portfolio.title}</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <Card className="p-6 space-y-2">
          <div className="flex items-center gap-2 text-muted-foreground text-xs font-semibold uppercase">
            <Eye className="h-4 w-4 text-primary" /> Total Views
          </div>
          <p className="text-3xl font-extrabold">{totalViews}</p>
        </Card>
        <Card className="p-6 space-y-2">
          <div className="flex items-center gap-2 text-muted-foreground text-xs font-semibold uppercase">
            <Globe className="h-4 w-4 text-blue-500" /> Top Referrers
          </div>
          <p className="text-3xl font-extrabold">{topReferrers.length}</p>
        </Card>
      </div>

      {/* Referrers List */}
      <Card className="p-6 space-y-4">
        <h2 className="text-base font-bold">Traffic Sources</h2>
        {topReferrers.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4">No view data recorded yet. Share your portfolio link to start gathering analytics!</p>
        ) : (
          <div className="space-y-2">
            {topReferrers.map((ref, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-muted/40 text-xs font-medium">
                <span className="truncate">{ref.source}</span>
                <span className="font-bold bg-card px-2.5 py-1 rounded-md border border-border">{ref.count} views</span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
