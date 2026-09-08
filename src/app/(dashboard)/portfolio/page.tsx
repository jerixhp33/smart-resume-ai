import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { getUserPortfolioAction } from '@/features/portfolio/actions'
import { PortfolioDashboardClient } from '@/components/portfolio/PortfolioDashboardClient'

export const metadata = {
  title: 'AI Portfolio Hub | SmartResume AI',
  description: 'Manage, edit, publish and track your professional AI portfolio.',
}

export default async function PortfolioPage() {
  const supabase = await getSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .single()

  const { portfolio } = await getUserPortfolioAction()

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-6">
      <PortfolioDashboardClient portfolio={portfolio || null} profile={profile} />
    </div>
  )
}
