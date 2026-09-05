import { notFound, redirect } from 'next/navigation'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { ResumeBuilderClient } from '@/components/builder/ResumeBuilderClient'
import type { Resume } from '@/types'

interface BuilderPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: BuilderPageProps) {
  const { id } = await params
  const supabase = await getSupabaseServerClient()
  const { data } = await supabase.from('resumes').select('name').eq('id', id).single()
  return { title: data?.name ?? 'Resume Builder' }
}

export default async function BuilderPage({ params }: BuilderPageProps) {
  const { id } = await params
  const supabase = await getSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: resume, error } = await supabase
    .from('resumes')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (error || !resume) notFound()

  // Get versions
  const { data: versions } = await supabase
    .from('resume_versions')
    .select('id, version_number, description, created_at')
    .eq('resume_id', id)
    .order('version_number', { ascending: false })
    .limit(20)

  return (
    <ResumeBuilderClient
      resume={resume as unknown as Resume}
      versions={versions ?? []}
      userId={user.id}
    />
  )
}
