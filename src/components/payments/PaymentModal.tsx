'use client'

import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Smartphone, CheckCircle2, Clock, Loader2 } from 'lucide-react'
import { toast } from '@/components/ui/toast'

interface PaymentModalProps {
  open: boolean
  onClose: () => void
}

type PaymentState = 'idle' | 'creating' | 'awaiting' | 'success' | 'failed'

export function PaymentModal({ open, onClose }: PaymentModalProps) {
  const [state, setState] = useState<PaymentState>('idle')
  const [orderId, setOrderId] = useState<string>('')
  const [gatewayOrderId, setGatewayOrderId] = useState<string>('')
  const [upiLink, setUpiLink] = useState<string>('')
  const isDev = process.env.NODE_ENV !== 'production'

  async function startPayment() {
    setState('creating')
    try {
      const res = await fetch('/api/payments/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      setOrderId(data.paymentId)
      setGatewayOrderId(data.orderId)
      setUpiLink(data.upiLink ?? '')
      setState('awaiting')
    } catch (err) {
      toast({ title: 'Could not create payment', description: String(err), variant: 'error' })
      setState('failed')
    }
  }

  async function simulateSuccess() {
    // Development only
    setState('awaiting')
    const res = await fetch('/api/payments/mock-success', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId, gatewayOrderId }),
    })
    const data = await res.json()
    if (data.success) {
      setState('success')
    } else {
      toast({ title: 'Mock payment failed', variant: 'error' })
      setState('failed')
    }
  }

  function handleClose() {
    setState('idle')
    setOrderId('')
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Unlock Resume #4</DialogTitle>
          <DialogDescription>
            Pay ₹99 via UPI to unlock your next resume. Your existing resumes are always safe.
          </DialogDescription>
        </DialogHeader>

        {state === 'idle' && (
          <div className="space-y-4">
            <div className="bg-muted rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium">Resume Unlock</span>
                <span className="text-lg font-bold">₹99</span>
              </div>
              <ul className="space-y-2 text-xs text-muted-foreground">
                {['Unlock 1 additional resume slot', 'Permanent unlock — no subscription', 'UPI payment — GPay, PhonePe supported', 'Verified automatically via webhook'].map(item => (
                  <li key={item} className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-green-500 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <Button className="w-full h-11" onClick={startPayment} icon={<Smartphone className="h-4 w-4" />}>
              Pay ₹99 via UPI
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              Or wait {' '}
              <span className="font-medium text-foreground">5 hours</span>
              {' '}for the cooldown to expire
            </p>
          </div>
        )}

        {state === 'creating' && (
          <div className="flex flex-col items-center gap-3 py-6">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Creating payment order…</p>
          </div>
        )}

        {state === 'awaiting' && (
          <div className="space-y-4">
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 text-center">
              <Smartphone className="h-10 w-10 text-primary mx-auto mb-2" />
              <p className="font-semibold text-sm mb-1">Complete payment in your UPI app</p>
              <p className="text-xs text-muted-foreground mb-3">
                Open GPay, PhonePe, or any UPI app and pay ₹99
              </p>
              {upiLink && (
                <a
                  href={upiLink}
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
                >
                  <Smartphone className="h-4 w-4" /> Open UPI App
                </a>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="h-3.5 w-3.5 flex-shrink-0" />
              <span>Your resume will be unlocked automatically after payment is verified.</span>
            </div>

            {isDev && (
              <div className="border border-dashed border-border rounded-lg p-3">
                <p className="text-xs text-muted-foreground mb-2 font-medium">🛠 Dev mode — simulate payment:</p>
                <Button size="sm" variant="outline" className="w-full" onClick={simulateSuccess}>
                  Simulate Successful Payment
                </Button>
              </div>
            )}
          </div>
        )}

        {state === 'success' && (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <div className="h-14 w-14 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <CheckCircle2 className="h-7 w-7 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="font-semibold">Payment successful!</p>
              <p className="text-sm text-muted-foreground mt-1">Resume #4 is now unlocked.</p>
            </div>
            <Button className="w-full" onClick={handleClose}>Start creating</Button>
          </div>
        )}

        {state === 'failed' && (
          <div className="flex flex-col items-center gap-3 py-4 text-center">
            <p className="text-sm text-muted-foreground">Payment didn't complete. Your resume data is safe.</p>
            <div className="flex gap-2 w-full">
              <Button variant="outline" className="flex-1" onClick={handleClose}>Cancel</Button>
              <Button className="flex-1" onClick={() => setState('idle')}>Try again</Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
