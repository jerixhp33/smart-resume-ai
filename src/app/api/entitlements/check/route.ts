import { NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { checkResumeCreationEligibility } from '@/lib/payments/payment-service'

export async function GET() {
  const supabase = await getSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const eligibility = await checkResumeCreationEligibility(user.id)
    return NextResponse.json(eligibility)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to check eligibility' }, { status: 500 })
  }
}
