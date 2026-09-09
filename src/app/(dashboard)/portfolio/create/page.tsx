import { redirect } from 'next/navigation'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { CreatePortfolioWizard } from '@/components/portfolio/CreatePortfolioWizard'

export const metadata = {
  title: 'Build AI Portfolio | Resunio',
  description: 'Automatically build a polished professional portfolio from your resume.',
}

export default async function CreatePortfolioPage() {
  const supabase = await getSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: resumes } = await supabase
    .from('resumes')
    .select('id, name, updated_at, template_id')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false })

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .single()

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      <CreatePortfolioWizard resumes={resumes || []} profile={profile} />
    </div>
  )
}
