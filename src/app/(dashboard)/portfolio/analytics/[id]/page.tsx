import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { getPortfolioByIdAction, getPortfolioAnalyticsAction } from '@/features/portfolio/actions'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, BarChart2, Eye, Globe } from 'lucide-react'

export const metadata = {
  title: 'Portfolio Analytics | Resunio',
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
  const recentViews = ('recentViews' in analytics && analytics.recentViews) ? analytics.recentViews : []

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-6 px-4 sm:px-6">
      <div className="flex items-center justify-between">
        <Link href="/portfolio" prefetch={true}>
          <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground">
            <ArrowLeft className="h-4 w-4" /> Back to Portfolio
          </Button>
        </Link>
        <Link href={`/portfolio/${res.portfolio.username}`} target="_blank">
          <Button variant="outline" size="sm" className="gap-1.5 text-xs">
            <Globe className="h-3.5 w-3.5" /> View Public Site
          </Button>
        </Link>
      </div>

      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Portfolio Analytics & Visitor Traffic</h1>
        <p className="text-sm text-muted-foreground">Traffic statistics and recruiter views for {res.portfolio.title}</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <Card className="p-6 space-y-2 border-border/80">
          <div className="flex items-center gap-2 text-muted-foreground text-xs font-semibold uppercase">
            <Eye className="h-4 w-4 text-primary" /> Total Page Views
          </div>
          <p className="text-3xl font-extrabold">{totalViews}</p>
          <p className="text-xs text-muted-foreground">Cumulative page hits across all links</p>
        </Card>
        <Card className="p-6 space-y-2 border-border/80">
          <div className="flex items-center gap-2 text-muted-foreground text-xs font-semibold uppercase">
            <Globe className="h-4 w-4 text-blue-500" /> Distinct Traffic Sources
          </div>
          <p className="text-3xl font-extrabold">{topReferrers.length}</p>
          <p className="text-xs text-muted-foreground">Unique channels driving visitors</p>
        </Card>
        <Card className="p-6 space-y-2 border-border/80">
          <div className="flex items-center gap-2 text-muted-foreground text-xs font-semibold uppercase">
            <BarChart2 className="h-4 w-4 text-emerald-500" /> Recent Tracked Activity
          </div>
          <p className="text-3xl font-extrabold">{recentViews.length}</p>
          <p className="text-xs text-muted-foreground">Log events captured in last 30 days</p>
        </Card>
      </div>

      {/* Referrers & Traffic breakdown */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6 space-y-4">
          <h2 className="text-base font-bold flex items-center gap-2">
            <Globe className="h-4 w-4 text-primary" /> Top Traffic Sources
          </h2>
          {topReferrers.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4">No referrer data recorded yet. Share your portfolio link to start gathering analytics!</p>
          ) : (
            <div className="space-y-2.5">
              {topReferrers.map((ref, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-muted/40 text-xs font-medium border border-border/40">
                  <span className="truncate max-w-[240px]">{ref.source}</span>
                  <span className="font-bold bg-card px-2.5 py-1 rounded-md border border-border">{ref.count} views</span>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Recent Visitor Events */}
        <Card className="p-6 space-y-4">
          <h2 className="text-base font-bold flex items-center gap-2">
            <BarChart2 className="h-4 w-4 text-emerald-500" /> Recent Visitor Activity
          </h2>
          {recentViews.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4">No recent view events recorded.</p>
          ) : (
            <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar pr-1">
              {recentViews.map((v, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 rounded-lg bg-muted/30 text-xs">
                  <span className="truncate text-muted-foreground max-w-[200px]">{v.referrer || 'Direct Link / Social'}</span>
                  <span className="text-[11px] text-muted-foreground font-mono">
                    {new Date(v.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
