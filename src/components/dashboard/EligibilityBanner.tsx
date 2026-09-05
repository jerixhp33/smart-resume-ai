'use client'

import React, { useState, useEffect } from 'react'
import { Clock, Lock, CreditCard, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { ResumeEligibilityResult } from '@/types'
import { PaymentModal } from '@/components/payments/PaymentModal'

interface EligibilityBannerProps {
  eligibility: ResumeEligibilityResult
}

export function EligibilityBanner({ eligibility }: EligibilityBannerProps) {
  const [timeLeft, setTimeLeft] = useState<string>('')
  const [showPayment, setShowPayment] = useState(false)

  useEffect(() => {
    if (!eligibility.cooldown_expires_at || eligibility.reason !== 'cooldown_active') return

    function updateTimer() {
      const expires = new Date(eligibility.cooldown_expires_at!).getTime()
      const now = Date.now()
      const diff = expires - now

      if (diff <= 0) {
        setTimeLeft('00:00:00')
        return
      }

      const h = Math.floor(diff / 3_600_000)
      const m = Math.floor((diff % 3_600_000) / 60_000)
      const s = Math.floor((diff % 60_000) / 1_000)
      setTimeLeft(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`)
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)
    return () => clearInterval(interval)
  }, [eligibility])

  if (eligibility.can_create) {
    const resumesLeft = Math.max(0, 3 - eligibility.free_count)
    if (resumesLeft > 0 && eligibility.free_count > 0) {
      return (
        <div className="flex items-center gap-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-xl px-4 py-3">
          <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0" />
          <p className="text-sm text-green-800 dark:text-green-300">
            <span className="font-semibold">{resumesLeft} free resume{resumesLeft > 1 ? 's' : ''} remaining.</span>{' '}
            No credit card required.
          </p>
        </div>
      )
    }
    return null
  }

  if (eligibility.reason === 'cooldown_active') {
    return (
      <>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-xl px-4 py-4">
          <div className="flex items-center gap-3 flex-1">
            <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">Resume #4 is locked</p>
              <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">
                You've used your 3 free resumes. Wait for the cooldown or unlock now.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {timeLeft && (
              <div className="font-mono text-sm font-bold text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/30 px-3 py-1.5 rounded-lg">
                {timeLeft}
              </div>
            )}
            <Button size="sm" onClick={() => setShowPayment(true)} icon={<Lock className="h-3.5 w-3.5" />}>
              Unlock now — ₹99
            </Button>
          </div>
        </div>

        <PaymentModal open={showPayment} onClose={() => setShowPayment(false)} />
      </>
    )
  }

  return null
}
