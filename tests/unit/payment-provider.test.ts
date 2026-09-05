import { describe, it, expect, vi, beforeEach } from 'vitest'
import { MockPaymentProvider } from '@/lib/payments/payment-provider'

describe('MockPaymentProvider', () => {
  let provider: MockPaymentProvider

  beforeEach(() => {
    provider = new MockPaymentProvider()
  })

  it('creates an order with correct structure', async () => {
    const order = await provider.createOrder({
      userId: 'user-123',
      amount: 9900,
      currency: 'INR',
      purpose: 'resume_unlock',
    })

    expect(order).toHaveProperty('orderId')
    expect(order).toHaveProperty('amount', 9900)
    expect(order).toHaveProperty('currency', 'INR')
    expect(order).toHaveProperty('status')
    expect(order).toHaveProperty('expiresAt')
    expect(order.orderId).toMatch(/^mock_order_/)
  })

  it('generates a UPI link', async () => {
    const order = await provider.createOrder({
      userId: 'user-123',
      amount: 9900,
      currency: 'INR',
      purpose: 'resume_unlock',
    })

    expect(order.upiLink).toBeTruthy()
    expect(order.upiLink).toContain('upi://')
  })

  it('verifies webhook with valid JSON payload', async () => {
    const payload = JSON.stringify({
      order_id: 'test-order-123',
      transaction_id: 'txn-456',
      status: 'success',
      amount: 9900,
      currency: 'INR',
    })

    const event = await provider.verifyWebhook(payload, 'any-signature')
    expect(event.orderId).toBe('test-order-123')
    expect(event.status).toBe('success')
    expect(event.amount).toBe(9900)
  })

  it('throws on invalid webhook payload', async () => {
    await expect(provider.verifyWebhook('invalid-json', '')).rejects.toThrow()
  })

  it('returns pending status for recent orders', async () => {
    const order = await provider.createOrder({
      userId: 'user-123',
      amount: 9900,
      currency: 'INR',
      purpose: 'resume_unlock',
    })

    // Fresh order should be pending
    const status = await provider.getOrderStatus(order.orderId)
    expect(status.status).toBe('pending')
    expect(status.transactionId).toBeNull()
  })
})

describe('Payment Security', () => {
  it('never exposes API keys in order response', async () => {
    const provider = new MockPaymentProvider()
    const order = await provider.createOrder({
      userId: 'user-123',
      amount: 9900,
      currency: 'INR',
      purpose: 'resume_unlock',
    })

    // Serialize the order and check no secrets appear
    const serialized = JSON.stringify(order)
    expect(serialized).not.toContain('sk_')
    expect(serialized).not.toContain('secret')
    expect(serialized).not.toContain('password')
    expect(serialized).not.toContain('api_key')
  })
})
