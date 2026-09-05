'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Sparkles, FileText, Loader2, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createResume } from '@/features/resume/actions'
import { toast } from '@/components/ui/toast'
import { TEMPLATE_METADATA } from '@/templates/renderer'
import type { TemplateId } from '@/types'
import { cn } from '@/utils/cn'
import { PaymentModal } from '@/components/payments/PaymentModal'

export default function NewResumePage() {
  const router = useRouter()
  const [name, setName] = useState('My Resume')
  const [templateId, setTemplateId] = useState<TemplateId>('ats-classic')
  const [creating, setCreating] = useState(false)
  const [eligibility, setEligibility] = useState<{ can_create: boolean; reason: string; cooldown_expires_at: string | null } | null>(null)
  const [showPayment, setShowPayment] = useState(false)

  useEffect(() => {
    fetch('/api/entitlements/check')
      .then(r => r.json())
      .then(data => setEligibility(data))
  }, [])

  async function handleCreate() {
    setCreating(true)
    const result = await createResume({ name, templateId })
    setCreating(false)

    if ('error' in result) {
      if (result.error === 'cooldown') {
        toast({ title: 'Resume locked', description: 'Pay ₹99 or wait for cooldown to expire.', variant: 'warning' })
        setShowPayment(true)
      } else {
        toast({ title: 'Could not create resume', description: String(result.error), variant: 'error' })
      }
      return
    }

    if ('resumeId' in result && result.resumeId) {
      toast({ title: 'Resume created!', variant: 'success' })
      router.push(`/builder/${result.resumeId}`)
    }
  }

  if (!eligibility) {
    return (
      <div className="max-w-2xl mx-auto flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!eligibility.can_create) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center space-y-6">
        <div className="h-14 w-14 rounded-2xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mx-auto">
          <Lock className="h-7 w-7 text-amber-600 dark:text-amber-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold mb-2">Resume Slot Locked</h1>
          <p className="text-muted-foreground">You've used all 3 free resume slots.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={() => setShowPayment(true)} icon={<Sparkles className="h-4 w-4" />}>
            Unlock for ₹99
          </Button>
          <Button variant="outline" onClick={() => router.push('/resumes')}>
            Back to Resumes
          </Button>
        </div>
        <PaymentModal open={showPayment} onClose={() => setShowPayment(false)} />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight mb-1">Create New Resume</h1>
        <p className="text-sm text-muted-foreground">Choose a name and starting template. You can change everything later.</p>
      </div>

      <div className="space-y-6">
        {/* Resume name */}
        <Input
          label="Resume Name"
          placeholder="e.g. Software Engineer — Google Application"
          value={name}
          onChange={e => setName(e.target.value)}
          hint="Use a specific name if you're tailoring this for a particular role."
          required
        />

        {/* Template selection */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-3">
            Starting Template
            <span className="ml-2 text-xs font-normal text-muted-foreground">(ATS templates recommended for most roles)</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {TEMPLATE_METADATA.map(tmpl => (
              <button
                key={tmpl.id}
                onClick={() => setTemplateId(tmpl.id)}
                className={cn(
                  'flex flex-col items-start gap-2 p-3 rounded-xl border-2 text-left transition-all',
                  templateId === tmpl.id
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/40 bg-card'
                )}
              >
                {/* Mini preview */}
                <div className="w-full h-16 bg-muted rounded-lg flex items-center justify-center">
                  <div className="w-9 h-12 bg-white rounded shadow-sm border border-border/50 flex flex-col p-1 gap-0.5">
                    <div className="h-0.5 w-6 bg-gray-800 rounded-full" />
                    <div className="h-px w-4 bg-gray-400 rounded-full" />
                    <div className="h-px w-full bg-gray-200 my-0.5" />
                    {[5, 7, 4, 6].map((w, i) => (
                      <div key={i} className="h-px rounded-full bg-gray-200" style={{ width: `${w * 10}%` }} />
                    ))}
                  </div>
                </div>
                <div className="w-full">
                  <p className="text-xs font-semibold">{tmpl.name}</p>
                  {tmpl.is_ats_optimized && (
                    <span className="text-[10px] font-medium text-green-700 dark:text-green-400">ATS ✓</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Create button */}
        <div className="flex gap-3 pt-2">
          <Button variant="outline" onClick={() => router.push('/resumes')}>Cancel</Button>
          <Button
            onClick={handleCreate}
            loading={creating}
            disabled={!name.trim()}
            icon={<FileText className="h-4 w-4" />}
            className="flex-1"
          >
            Create Resume
          </Button>
        </div>
      </div>
    </div>
  )
}
