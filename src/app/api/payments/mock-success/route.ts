import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { processVerifiedPayment } from '@/lib/payments/payment-service'

// ⚠️ DEVELOPMENT ONLY — This route is disabled in production
export async function POST(request: NextRequest) {
  if (process.env.NODE_ENV === 'production' || process.env.PAYMENT_PROVIDER !== 'mock') {
    return NextResponse.json({ error: 'Not available in production' }, { status: 404 })
  }

  const supabase = await getSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { orderId, gatewayOrderId } = body

  if (!gatewayOrderId) {
    return NextResponse.json({ error: 'gatewayOrderId required' }, { status: 400 })
  }

  // Simulate successful payment webhook
  const result = await processVerifiedPayment({
    orderId: gatewayOrderId,
    transactionId: `mock_txn_${Date.now()}`,
    status: 'success',
    amount: 9900, // ₹99
  })

  return NextResponse.json({ success: true, ...result })
}
