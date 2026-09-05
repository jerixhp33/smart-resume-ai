// ============================================================
// SmartResume AI — Payment Provider Abstraction
// SERVER-SIDE ONLY
// ============================================================

export interface CreateOrderParams {
  userId: string
  amount: number       // in paise (₹1 = 100 paise)
  currency: string
  purpose: string
  metadata?: Record<string, unknown>
}

export interface PaymentOrder {
  orderId: string
  amount: number
  currency: string
  status: string
  paymentUrl?: string
  qrCode?: string
  upiLink?: string
  expiresAt: Date
}

export interface WebhookEvent {
  orderId: string
  transactionId: string | null
  status: 'success' | 'failed' | 'pending'
  amount: number
  currency: string
  timestamp: string
  raw: Record<string, unknown>
}

export interface PaymentProvider {
  name: string
  createOrder(params: CreateOrderParams): Promise<PaymentOrder>
  verifyWebhook(payload: string, signature: string): Promise<WebhookEvent>
  getOrderStatus(orderId: string): Promise<{ status: string; transactionId: string | null }>
}

// ── Mock Provider (Development) ───────────────────────────
export class MockPaymentProvider implements PaymentProvider {
  name = 'mock'

  async createOrder(params: CreateOrderParams): Promise<PaymentOrder> {
    const orderId = `mock_order_${Date.now()}_${Math.random().toString(36).slice(2)}`
    return {
      orderId,
      amount: params.amount,
      currency: params.currency,
      status: 'created',
      upiLink: `upi://pay?pa=mock@upi&pn=SmartResume+AI&am=${params.amount / 100}&cu=INR&tn=Resume+Unlock`,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 min
    }
  }

  async verifyWebhook(payload: string, _signature: string): Promise<WebhookEvent> {
    try {
      const data = JSON.parse(payload)
      return {
        orderId: data.order_id,
        transactionId: data.transaction_id ?? null,
        status: data.status ?? 'success',
        amount: data.amount,
        currency: data.currency ?? 'INR',
        timestamp: new Date().toISOString(),
        raw: data,
      }
    } catch {
      throw new Error('Invalid mock webhook payload')
    }
  }

  async getOrderStatus(orderId: string): Promise<{ status: string; transactionId: string | null }> {
    // In dev, simulate success for orders that are > 30 seconds old
    const timestamp = orderId.split('_')[2]
    if (timestamp && Date.now() - parseInt(timestamp) > 30000) {
      return { status: 'paid', transactionId: `mock_txn_${Date.now()}` }
    }
    return { status: 'pending', transactionId: null }
  }
}

// ── Cashfree Provider (Production UPI) ───────────────────
// Cashfree supports: UPI, UPI Intent (GPay/PhonePe), webhook verification
export class CashfreePaymentProvider implements PaymentProvider {
  name = 'cashfree'
  private appId: string
  private secretKey: string
  private baseUrl: string

  constructor() {
    this.appId = process.env.CASHFREE_APP_ID ?? ''
    this.secretKey = process.env.CASHFREE_SECRET_KEY ?? ''
    const env = process.env.CASHFREE_ENV ?? 'sandbox'
    this.baseUrl = env === 'production'
      ? 'https://api.cashfree.com/pg'
      : 'https://sandbox.cashfree.com/pg'
  }

  async createOrder(params: CreateOrderParams): Promise<PaymentOrder> {
    const orderId = `sr_${params.userId.slice(0, 8)}_${Date.now()}`

    const response = await fetch(`${this.baseUrl}/orders`, {
      method: 'POST',
      headers: {
        'x-api-version': '2023-08-01',
        'x-client-id': this.appId,
        'x-client-secret': this.secretKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        order_id: orderId,
        order_amount: params.amount / 100, // Cashfree uses rupees
        order_currency: params.currency,
        customer_details: {
          customer_id: params.userId,
          customer_email: params.metadata?.email ?? 'user@example.com',
          customer_phone: params.metadata?.phone ?? '9999999999',
        },
        order_meta: {
          return_url: `${process.env.NEXT_PUBLIC_APP_URL}/payments/verify?order_id=${orderId}`,
          notify_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/webhook`,
          payment_methods: 'upi', // UPI only per requirements
        },
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(`Cashfree order creation failed: ${JSON.stringify(error)}`)
    }

    const data = await response.json()

    return {
      orderId: data.order_id,
      amount: params.amount,
      currency: params.currency,
      status: data.order_status,
      paymentUrl: data.payment_session_id
        ? `https://payments.cashfree.com/order/#${data.payment_session_id}`
        : undefined,
      expiresAt: new Date(data.order_expiry_time),
    }
  }

  async verifyWebhook(payload: string, signature: string): Promise<WebhookEvent> {
    // Cashfree HMAC-SHA256 signature verification
    const crypto = await import('crypto')
    const expectedSignature = crypto
      .createHmac('sha256', this.secretKey)
      .update(payload)
      .digest('base64')

    if (expectedSignature !== signature) {
      throw new Error('Invalid webhook signature')
    }

    const data = JSON.parse(payload)
    return {
      orderId: data.data?.order?.order_id,
      transactionId: data.data?.payment?.cf_payment_id?.toString() ?? null,
      status: data.data?.payment?.payment_status === 'SUCCESS' ? 'success' : 'failed',
      amount: Math.round(data.data?.order?.order_amount * 100), // back to paise
      currency: data.data?.order?.order_currency ?? 'INR',
      timestamp: data.event_time,
      raw: data,
    }
  }

  async getOrderStatus(orderId: string): Promise<{ status: string; transactionId: string | null }> {
    const response = await fetch(`${this.baseUrl}/orders/${orderId}`, {
      headers: {
        'x-api-version': '2023-08-01',
        'x-client-id': this.appId,
        'x-client-secret': this.secretKey,
      },
    })

    if (!response.ok) throw new Error('Failed to fetch order status')

    const data = await response.json()
    return {
      status: data.order_status === 'PAID' ? 'paid' : data.order_status?.toLowerCase() ?? 'pending',
      transactionId: data.cf_order_id?.toString() ?? null,
    }
  }
}

// ── Factory ───────────────────────────────────────────────
let providerInstance: PaymentProvider | null = null

export function getPaymentProvider(): PaymentProvider {
  if (providerInstance) return providerInstance

  const provider = process.env.PAYMENT_PROVIDER ?? 'mock'

  switch (provider) {
    case 'cashfree':
      providerInstance = new CashfreePaymentProvider()
      break
    case 'mock':
    default:
      providerInstance = new MockPaymentProvider()
      break
  }

  return providerInstance
}
