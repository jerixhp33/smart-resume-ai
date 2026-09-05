import { NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await getSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: resumes } = await supabase
    .from('resumes')
    .select('id, name, template_id, ats_score, updated_at, data')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false })

  return NextResponse.json({ resumes: resumes ?? [] })
}
