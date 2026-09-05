import { NextRequest, NextResponse } from 'next/server'
import { getPaymentProvider } from '@/lib/payments/payment-provider'
import { processVerifiedPayment } from '@/lib/payments/payment-service'

export async function POST(request: NextRequest) {
  try {
    const payload = await request.text()
    const signature = request.headers.get('x-webhook-signature')
      ?? request.headers.get('x-cashfree-signature')
      ?? ''

    const provider = getPaymentProvider()

    let event
    try {
      event = await provider.verifyWebhook(payload, signature)
    } catch (verifyError) {
      console.error('[Webhook] Signature verification failed:', verifyError)
      // Return 200 to prevent retries on bad signatures (security: don't reveal internal errors)
      return NextResponse.json({ received: true }, { status: 200 })
    }

    // Process the verified event
    const result = await processVerifiedPayment({
      orderId: event.orderId,
      transactionId: event.transactionId ?? `${event.orderId}_${Date.now()}`,
      status: event.status === 'success' ? 'success' : 'failed',
      amount: event.amount,
    })

    console.info('[Webhook] Processed:', event.orderId, result)

    // Always return 200 to prevent webhook retries
    return NextResponse.json({ received: true, processed: !result.alreadyProcessed })
  } catch (error) {
    console.error('[Webhook] Error:', error)
    // Return 200 anyway to prevent infinite retry loops
    return NextResponse.json({ received: true }, { status: 200 })
  }
}

// Cashfree and other providers may send OPTIONS for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST',
      'Access-Control-Allow-Headers': 'Content-Type, x-webhook-signature, x-cashfree-signature',
    },
  })
}
