'use client'

import React, { useState, useEffect } from 'react'
import QRCode from 'qrcode'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Smartphone, CheckCircle2, Clock, Loader2, QrCode as QrIcon, Copy, Check } from 'lucide-react'
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
  const [qrDataUrl, setQrDataUrl] = useState<string>('')
  const [copiedUpi, setCopiedUpi] = useState(false)
  const isDev = process.env.NODE_ENV !== 'production'

  const upiVpa = 'resunio@upi'
  const effectiveUpiUri = upiLink || `upi://pay?pa=${upiVpa}&pn=Resunio%20AI&am=99&cu=INR&tn=Resume%20Unlock%20Slot`

  useEffect(() => {
    if (state !== 'awaiting') return

    QRCode.toDataURL(effectiveUpiUri, {
      width: 600,
      margin: 2,
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error('Failed to generate UPI QR scanner:', err))
  }, [state, effectiveUpiUri])

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

  function handleCopyVpa() {
    navigator.clipboard.writeText(upiVpa)
    setCopiedUpi(true)
    toast({ title: 'UPI ID Copied!', description: `${upiVpa} copied to clipboard.`, variant: 'success' })
    setTimeout(() => setCopiedUpi(false), 2000)
  }

  function handleClose() {
    setState('idle')
    setOrderId('')
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <QrIcon className="h-5 w-5 text-primary" /> Unlock Resume #4
          </DialogTitle>
          <DialogDescription className="text-xs">
            Pay ₹99 via UPI to unlock your next resume slot. Existing resumes remain 100% safe.
          </DialogDescription>
        </DialogHeader>

        {state === 'idle' && (
          <div className="space-y-4 pt-1">
            <div className="bg-card border border-border/80 rounded-2xl p-5 space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold">Resume Unlock Slot</span>
                <span className="text-xl font-black text-primary">₹99</span>
              </div>
              <ul className="space-y-2 text-xs text-muted-foreground pt-1 border-t border-border/60">
                {[
                  'Unlock 1 additional resume slot',
                  'Permanent unlock — zero monthly subscription',
                  'Instant UPI payment — GPay, PhonePe, Paytm supported',
                  'Automatic verification & instant unlock',
                ].map(item => (
                  <li key={item} className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Button className="w-full h-11 text-sm font-bold shadow-md gap-2" onClick={startPayment}>
              <Smartphone className="h-4 w-4" /> Generate UPI QR Scanner (₹99)
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              Or wait <span className="font-semibold text-foreground">5 hours</span> for free cooldown
            </p>
          </div>
        )}

        {state === 'creating' && (
          <div className="flex flex-col items-center gap-3 py-10">
            <Loader2 className="h-9 w-9 animate-spin text-primary" />
            <p className="text-sm font-medium text-muted-foreground">Generating accurate UPI Scanner QR…</p>
          </div>
        )}

        {state === 'awaiting' && (
          <div className="space-y-5 pt-1">
            {/* Centered High-Res Accurate UPI QR Code Scanner Display */}
            <div className="bg-card border-2 border-primary/30 rounded-2xl p-5 text-center shadow-lg space-y-3 relative overflow-hidden">
              <div className="space-y-1">
                <p className="font-extrabold text-sm text-foreground flex items-center justify-center gap-1.5">
                  <QrIcon className="h-4 w-4 text-primary" /> Scan & Pay ₹99 via UPI App
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Works with Google Pay, PhonePe, Paytm, BHIM, Cred & Banking Apps
                </p>
              </div>

              {/* QR Scanner Display Box */}
              <div className="w-48 h-48 bg-white rounded-2xl p-2.5 mx-auto border-2 border-primary/20 flex items-center justify-center shadow-inner relative group">
                {qrDataUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={qrDataUrl}
                    alt="UPI Payment QR Code"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    <span className="text-[10px]">Loading QR Scanner...</span>
                  </div>
                )}
              </div>

              {/* UPI ID Copy & Mobile App Action */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2">
                <a
                  href={effectiveUpiUri}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl text-xs font-bold shadow-sm hover:opacity-90 transition-opacity"
                >
                  <Smartphone className="h-4 w-4" /> Open UPI App (Mobile)
                </a>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyVpa}
                  className="w-full sm:w-auto text-xs gap-1.5 border-border"
                >
                  {copiedUpi ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                  {copiedUpi ? 'Copied ID' : 'Copy UPI ID'}
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground bg-muted/40 p-3 rounded-xl border border-border/60">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <Clock className="h-3.5 w-3.5 text-primary shrink-0" />
                <span>Waiting for payment verification...</span>
              </div>
              <span className="font-mono font-bold text-foreground">₹99</span>
            </div>

            {isDev && (
              <div className="border border-dashed border-border rounded-xl p-3 bg-muted/10 space-y-2">
                <p className="text-xs text-muted-foreground font-semibold">🛠 Dev mode — simulate payment verification:</p>
                <Button size="sm" variant="outline" className="w-full text-xs" onClick={simulateSuccess}>
                  Simulate Successful Payment
                </Button>
              </div>
            )}
          </div>
        )}

        {state === 'success' && (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <div className="h-14 w-14 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
              <CheckCircle2 className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="font-bold text-base">Payment Verified Successfully!</p>
              <p className="text-xs text-muted-foreground mt-1">Resume slot #4 is now permanently unlocked.</p>
            </div>
            <Button className="w-full mt-2 font-bold" onClick={handleClose}>Start Creating Resume</Button>
          </div>
        )}

        {state === 'failed' && (
          <div className="flex flex-col items-center gap-3 py-4 text-center">
            <p className="text-xs text-muted-foreground">Payment didn't complete. Your existing resume data is safe.</p>
            <div className="flex gap-2 w-full pt-2">
              <Button variant="outline" className="flex-1 text-xs" onClick={handleClose}>Cancel</Button>
              <Button className="flex-1 text-xs font-bold" onClick={() => setState('idle')}>Try Again</Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

