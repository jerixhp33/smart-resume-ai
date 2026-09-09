import { redirect, notFound } from 'next/navigation'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { getPortfolioByIdAction } from '@/features/portfolio/actions'
import { PortfolioSettingsClient } from '@/components/portfolio/PortfolioSettingsClient'

export const metadata = {
  title: 'Portfolio Settings & SEO | SmartResume AI',
  description: 'Manage SEO metadata, custom accent themes, social cards, and page titles.',
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

  return <PortfolioSettingsClient portfolio={res.portfolio} />
}

