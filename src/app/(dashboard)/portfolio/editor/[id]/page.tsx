import { redirect, notFound } from 'next/navigation'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { getPortfolioByIdAction } from '@/features/portfolio/actions'
import { PortfolioStudioEditor } from '@/components/portfolio/editor/PortfolioStudioEditor'

export const metadata = {
  title: 'Portfolio Studio Editor | SmartResume AI',
  description: 'Live studio editor to customize your AI portfolio.',
}

type Props = {
  params: Promise<{ id: string }>
}

export default async function PortfolioEditorPage({ params }: Props) {
  const { id } = await params
  const supabase = await getSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const res = await getPortfolioByIdAction(id)
  if (res.error || !res.portfolio) {
    notFound()
  }

  return <PortfolioStudioEditor portfolio={res.portfolio} />
}
