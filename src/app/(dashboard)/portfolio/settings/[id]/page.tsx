import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { getPortfolioByIdAction } from '@/features/portfolio/actions'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, Settings, ShieldCheck } from 'lucide-react'

export const metadata = {
  title: 'Portfolio Settings | SmartResume AI',
  description: 'Manage SEO metadata, titles, and public URL.',
}

type Props = {
  params: Promise<{ id: string }>
}

export default async function PortfolioSettingsPage({ params }: Props) {
  const { id } = await params
  const supabase = await getSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const res = await getPortfolioByIdAction(id)
  if (res.error || !res.portfolio) notFound()

  const site = res.portfolio

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-6 px-4 sm:px-6">
      <div className="flex items-center gap-4">
        <Link href="/portfolio" prefetch={true}>
          <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground">
            <ArrowLeft className="h-4 w-4" /> Back to Portfolio Hub
          </Button>
        </Link>
      </div>

      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Portfolio Settings & SEO</h1>
        <p className="text-sm text-muted-foreground">Optimize search engine metadata and social sharing cards.</p>
      </div>

      <Card className="p-6 space-y-6">
        <div className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-muted-foreground">Portfolio Page Title</label>
            <Input defaultValue={site.title} className="mt-1" />
          </div>
          <div>
            <label className="font-semibold text-muted-foreground">SEO Description</label>
            <Textarea defaultValue={site.seo_metadata?.description || site.content?.hero?.summary || ''} className="mt-1 min-h-[80px]" />
          </div>
          <div>
            <label className="font-semibold text-muted-foreground">Username / Slug</label>
            <Input defaultValue={site.username} disabled className="mt-1 bg-muted/50" />
            <p className="text-[10px] text-muted-foreground mt-1">To change username, use the Claim Username modal in Portfolio Hub.</p>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-border">
          <Button size="sm">Save Settings</Button>
        </div>
      </Card>
    </div>
  )
}
