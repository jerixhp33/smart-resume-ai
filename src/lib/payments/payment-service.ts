// ============================================================
// SmartResume AI — Payment Service (SERVER-SIDE ONLY)
// Handles payment creation, verification, entitlements
// ============================================================

import { getSupabaseServiceClient } from '@/lib/supabase/server'
import { getPaymentProvider } from './payment-provider'
import type { ResumeEligibilityResult } from '@/types'

const FREE_RESUME_LIMIT = 3
const COOLDOWN_HOURS = 5

// ── Entitlement Check ─────────────────────────────────────

export async function checkResumeCreationEligibility(
  userId: string
): Promise<ResumeEligibilityResult> {
  const supabase = getSupabaseServiceClient()

  // Use the PostgreSQL function for atomic check
  const { data, error } = await supabase
    .rpc('check_resume_creation_eligibility', { p_user_id: userId })

  if (error) {
    throw new Error(`Failed to check eligibility: ${error.message}`)
  }

  return data as ResumeEligibilityResult
}

// ── Record Resume Creation ────────────────────────────────

export async function recordResumeCreation(userId: string): Promise<void> {
  const supabase = getSupabaseServiceClient()

  // Increment free resume count atomically
  const { error } = await supabase.rpc('increment_free_resume_count', {
    p_user_id: userId,
  })

  if (error) {
    // Non-critical, log but don't fail
    console.error('[Payments] Failed to record resume creation:', error)
  }
}

// ── Create Payment Order ──────────────────────────────────

export async function createResumeUnlockPayment(params: {
  userId: string
  userEmail: string
  userPhone?: string
}): Promise<{
  paymentId: string
  orderId: string
  amount: number
  upiLink?: string
  paymentUrl?: string
}> {
  const supabase = getSupabaseServiceClient()
  const provider = getPaymentProvider()

  const UNLOCK_AMOUNT_PAISE = 9900 // ₹99 in paise

  // Create payment record first
  const { data: payment, error: createError } = await supabase
    .from('payments')
    .insert({
      user_id: params.userId,
      gateway: provider.name,
      amount: UNLOCK_AMOUNT_PAISE,
      currency: 'INR',
      status: 'pending',
      purpose: 'resume_unlock',
      metadata: { email: params.userEmail },
    })
    .select()
    .single()

  if (createError || !payment) {
    throw new Error('Failed to create payment record')
  }

  // Create order with provider
  const order = await provider.createOrder({
    userId: params.userId,
    amount: UNLOCK_AMOUNT_PAISE,
    currency: 'INR',
    purpose: 'resume_unlock',
    metadata: {
      email: params.userEmail,
      phone: params.userPhone ?? '9999999999',
      payment_id: payment.id,
    },
  })

  // Update payment with gateway order ID
  await supabase
    .from('payments')
    .update({ gateway_order_id: order.orderId })
    .eq('id', payment.id)

  return {
    paymentId: payment.id,
    orderId: order.orderId,
    amount: UNLOCK_AMOUNT_PAISE,
    upiLink: order.upiLink,
    paymentUrl: order.paymentUrl,
  }
}

// ── Process Verified Payment ──────────────────────────────

export async function processVerifiedPayment(params: {
  orderId: string
  transactionId: string
  status: 'success' | 'failed'
  amount: number
}): Promise<{ success: boolean; alreadyProcessed: boolean }> {
  const supabase = getSupabaseServiceClient()

  // Find payment by gateway order ID
  const { data: payment, error: findError } = await supabase
    .from('payments')
    .select()
    .eq('gateway_order_id', params.orderId)
    .single()

  if (findError || !payment) {
    console.error('[Payments] Payment not found for order:', params.orderId)
    return { success: false, alreadyProcessed: false }
  }

  // Idempotency: already processed
  if (payment.status !== 'pending') {
    console.info('[Payments] Payment already processed, skipping:', params.orderId)
    return { success: payment.status === 'successful', alreadyProcessed: true }
  }

  // Verify amount matches (security check)
  if (params.amount !== payment.amount) {
    console.error('[Payments] Amount mismatch:', params.amount, 'vs', payment.amount)
    await supabase
      .from('payments')
      .update({ status: 'failed', metadata: { ...payment.metadata as object, error: 'amount_mismatch' } })
      .eq('id', payment.id)
    return { success: false, alreadyProcessed: false }
  }

  if (params.status === 'success') {
    // Update payment status
    await supabase
      .from('payments')
      .update({
        status: 'successful',
        transaction_id: params.transactionId,
        verified_at: new Date().toISOString(),
      })
      .eq('id', payment.id)

    // Credit resume unlock via atomic RPC (avoids race conditions)
    await supabase.rpc('add_paid_resume_credits', {
      p_user_id: payment.user_id,
      p_credits: 1,
    })

    // Create notification
    await createPaymentNotification(payment.user_id, 'success', payment.amount)

    return { success: true, alreadyProcessed: false }
  } else {
    await supabase
      .from('payments')
      .update({ status: 'failed', transaction_id: params.transactionId })
      .eq('id', payment.id)

    await createPaymentNotification(payment.user_id, 'failed', payment.amount)

    return { success: false, alreadyProcessed: false }
  }
}

async function createPaymentNotification(
  userId: string,
  status: 'success' | 'failed',
  amount: number
): Promise<void> {
  try {
    const { createNotification } = await import('@/lib/notifications/createNotification')
    await createNotification({
      userId,
      type: status === 'success' ? 'payment_success' : 'payment_failed',
      title: status === 'success' ? '✅ Payment Successful' : '❌ Payment Failed',
      message: status === 'success'
        ? `Your payment of ₹${amount / 100} was successful. Resume #4 is now unlocked!`
        : `Your payment of ₹${amount / 100} could not be processed. Please try again.`,
      data: { amount, status },
    })
  } catch (err) {
    console.error('[Payments] Failed to create notification:', err)
  }
}
