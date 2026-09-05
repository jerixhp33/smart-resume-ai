'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Check } from 'lucide-react'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/toast'
import type { CareerGoal, ExperienceLevel } from '@/types'

import { completeOnboarding } from './actions'

const GOALS: { value: CareerGoal; label: string; emoji: string }[] = [
  { value: 'first_job', label: 'Get my first job', emoji: '🎯' },
  { value: 'internship', label: 'Land an internship', emoji: '🏢' },
  { value: 'better_job', label: 'Find a better job', emoji: '📈' },
  { value: 'career_change', label: 'Switch careers', emoji: '🔄' },
  { value: 'freelancing', label: 'Go freelance', emoji: '💻' },
]

const EXPERIENCE: { value: ExperienceLevel; label: string }[] = [
  { value: 'student', label: 'Student' },
  { value: 'fresher', label: 'Fresher (0 years)' },
  { value: '1_2_years', label: '1–2 years' },
  { value: '3_5_years', label: '3–5 years' },
  { value: '5_plus_years', label: '5+ years' },
]

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [goal, setGoal] = useState<CareerGoal | null>(null)
  const [experience, setExperience] = useState<ExperienceLevel | null>(null)
  const [saving, setSaving] = useState(false)

  async function complete() {
    if (!goal || !experience) return
    setSaving(true)
    try {
      const result = await completeOnboarding(goal, experience)
      
      if (result?.error) {
        toast({ title: 'Could not save profile', description: result.error, variant: 'error' })
        setSaving(false)
        return
      }

      router.push('/dashboard')
    } catch (err: any) {
      toast({ title: 'Something went wrong', description: err.message || 'Please try again.', variant: 'error' })
      setSaving(false)
    }
  }

  return (
    <div className="w-full max-w-lg">
      {/* Progress dots */}
      <div className="flex items-center gap-2 justify-center mb-8">
        {[0, 1].map(i => (
          <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i <= step ? 'w-8 bg-primary' : 'w-4 bg-muted'}`} />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold mb-2">What's your goal?</h1>
              <p className="text-sm text-muted-foreground">This helps us personalize your experience</p>
            </div>
            <div className="grid gap-3">
              {GOALS.map(g => (
                <button
                  key={g.value}
                  onClick={() => setGoal(g.value)}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all ${
                    goal === g.value
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/40 bg-card'
                  }`}
                >
                  <span className="text-2xl">{g.emoji}</span>
                  <span className="font-medium text-sm">{g.label}</span>
                  {goal === g.value && <Check className="h-4 w-4 text-primary ml-auto" />}
                </button>
              ))}
            </div>
            <Button className="w-full mt-6 h-11" disabled={!goal} onClick={() => setStep(1)}>
              Continue <ArrowRight className="h-4 w-4" />
            </Button>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold mb-2">Your experience level?</h1>
              <p className="text-sm text-muted-foreground">So we can suggest the right resume style</p>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {EXPERIENCE.map(e => (
                <button
                  key={e.value}
                  onClick={() => setExperience(e.value)}
                  className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl border-2 text-left transition-all ${
                    experience === e.value
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/40 bg-card'
                  }`}
                >
                  <span className="font-medium text-sm">{e.label}</span>
                  {experience === e.value && <Check className="h-4 w-4 text-primary" />}
                </button>
              ))}
            </div>
            <div className="flex gap-3 mt-6">
              <Button variant="outline" className="h-11" onClick={() => setStep(0)}>Back</Button>
              <Button className="flex-1 h-11" disabled={!experience} loading={saving} onClick={complete}>
                Start building <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
