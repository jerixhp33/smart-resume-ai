import { redirect } from 'next/navigation'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { ApplicationsClient } from '@/components/applications/ApplicationsClient'
import type { JobApplication } from '@/types'

export const metadata = { title: 'Job Applications' }

export default async function ApplicationsPage() {
  const supabase = await getSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: applications } = await supabase
    .from('job_applications')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const { data: resumes } = await supabase
    .from('resumes')
    .select('id, name')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false })

  return (
    <ApplicationsClient
      initialApplications={(applications ?? []) as JobApplication[]}
      resumes={resumes ?? []}
    />
  )
}
