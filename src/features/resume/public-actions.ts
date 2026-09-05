'use server'

import { getSupabaseServiceClient } from '@/lib/supabase/server'
import type { Resume } from '@/types'

export async function getPublicResumeBySlug(slug: string): Promise<Resume | null> {
  // Use service client to bypass RLS since the user is not authenticated
  const supabase = getSupabaseServiceClient()

  const { data, error } = await supabase
    .from('resumes')
    .select('*')
    .eq('public_slug', slug)
    .eq('is_public', true)
    .single()

  if (error || !data) {
    return null
  }

  return data as Resume
}

export async function incrementResumeView(slug: string) {
  const supabase = getSupabaseServiceClient()
  await supabase.rpc('increment_resume_view', { p_slug: slug })
}
