import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { createResumeUnlockPayment } from '@/lib/payments/payment-service'
import { checkResumeCreationEligibility } from '@/lib/payments/payment-service'

export async function POST(request: NextRequest) {
  try {
    const supabase = await getSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // Verify the user actually needs to pay (server-side check)
    const eligibility = await checkResumeCreationEligibility(user.id)
    if (eligibility.can_create) {
      return NextResponse.json({
        error: 'You can already create a resume without payment.',
      }, { status: 400 })
    }

    const body = await request.json()
    const userPhone = body?.phone

    // Get user email from profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('email')
      .eq('user_id', user.id)
      .single()

    const payment = await createResumeUnlockPayment({
      userId: user.id,
      userEmail: profile?.email ?? user.email ?? '',
      userPhone,
    })

    return NextResponse.json(payment)
  } catch (error) {
    console.error('[Payment] Create failed:', error)
    return NextResponse.json(
      { error: 'Failed to create payment. Please try again.' },
      { status: 500 }
    )
  }
}
