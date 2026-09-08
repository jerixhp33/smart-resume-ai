'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { createPortfolioFromResumeAction } from '@/features/portfolio/actions'
import type { PortfolioTemplateId, MotionLevel, PortfolioThemeId } from '@/types'
import { Sparkles, Check, ArrowRight, ArrowLeft, Loader2, Code, Layout, ShieldCheck, Zap, Layers, Smartphone, Eye, ExternalLink } from 'lucide-react'

interface CreatePortfolioWizardProps {
  resumes: Array<{ id: string; name: string; updated_at: string }>
  profile: any
}

const TEMPLATES: Array<{ id: PortfolioTemplateId; title: string; desc: string; icon: string }> = [
  { id: 'modern', title: 'Modern', desc: 'Sleek SaaS aesthetic, clean cards, gradient highlights', icon: '✨' },
  { id: 'minimal', title: 'Minimal', desc: 'Ultra-clean, monochromatic typography focus', icon: '📝' },
  { id: 'developer', title: 'Developer', desc: 'Tech stack grid, terminal aesthetic, GitHub integration', icon: '⚡' },
  { id: 'creative', title: 'Creative', desc: 'Expressive layout, ambient glow, dynamic accents', icon: '🎨' },
  { id: 'professional', title: 'Professional', desc: 'Structured executive layout, classic timeline', icon: '💼' },
  { id: 'editorial', title: 'Editorial', desc: 'High-contrast typography, magazine-style layout', icon: '📰' },
  { id: 'bold', title: 'Bold', desc: 'Big headlines, high-impact buttons, strong theme accents', icon: '💥' },
  { id: 'elegant', title: 'Elegant', desc: 'Subtle glassmorphic cards and glowing indicators', icon: '💎' },
]

const MOTION_OPTIONS: Array<{ id: MotionLevel; title: string; desc: string }> = [
  { id: 'subtle', title: 'Subtle', desc: 'Lightweight entrance fades, essential transitions' },
  { id: 'smooth', title: 'Smooth (Default)', desc: 'Balanced scroll reveals, staggered card animations' },
  { id: 'dynamic', title: 'Dynamic', desc: 'Expressive hover states, spring micro-interactions' },
]

const STAGES = [
  'Analyzing your resume',
  'Structuring your portfolio',
  'Writing your introduction',
  'Organizing projects',
  'Creating visual hierarchy',
  'Applying design system',
  'Optimizing responsive layout',
  'Publishing your portfolio',
]

export function CreatePortfolioWizard({ resumes, profile }: CreatePortfolioWizardProps) {
  const router = useRouter()
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1)
  const [selectedResumeId, setSelectedResumeId] = useState<string>(resumes[0]?.id || '')
  const [selectedTemplate, setSelectedTemplate] = useState<PortfolioTemplateId>('modern')
  const [selectedMotion, setSelectedMotion] = useState<MotionLevel>('smooth')
  const [selectedTheme, setSelectedTheme] = useState<PortfolioThemeId>('indigo')
  const [currentStageIdx, setCurrentStageIdx] = useState(0)
  const [isGenerating, setIsGenerating] = useState(false)
  const [createdPortfolioId, setCreatedPortfolioId] = useState<string | null>(null)
  const [createdUsername, setCreatedUsername] = useState<string>('')

  const handleStartGeneration = async () => {
    setStep(4)
    setIsGenerating(true)

    // Progress animation loop
    let stage = 0
    const interval = setInterval(() => {
      stage++
      if (stage < STAGES.length) {
        setCurrentStageIdx(stage)
      } else {
        clearInterval(interval)
      }
    }, 600)

    try {
      const res = await createPortfolioFromResumeAction({
        resumeId: selectedResumeId || undefined,
        template: selectedTemplate,
        motionLevel: selectedMotion,
        theme: selectedTheme,
      })

      clearInterval(interval)

      if (res.error || !res.portfolio) {
        alert(res.error || 'Failed to create portfolio.')
        setStep(3)
        setIsGenerating(false)
        return
      }

      setCreatedPortfolioId(res.portfolio.id)
      setCreatedUsername(res.portfolio.username)
      setStep(5)
    } catch (e) {
      clearInterval(interval)
      alert('An unexpected error occurred.')
      setStep(3)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Step Header */}
      <div className="flex items-center justify-between border-b border-border pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">AI Portfolio Autobuilder</h1>
          <p className="text-sm text-muted-foreground mt-1">Transform your resume into a live studio portfolio.</p>
        </div>
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((s) => (
            <div
              key={s}
              className={`h-2.5 w-8 rounded-full transition-all ${
                s === step ? 'bg-primary' : s < step ? 'bg-primary/40' : 'bg-muted'
              }`}
            />
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* Step 1: Profile & Resume Selection */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="space-y-2">
              <h2 className="text-lg font-bold">Step 1: Your Profile & Source Data</h2>
              <p className="text-sm text-muted-foreground">Select which resume to use as the base for your portfolio.</p>
            </div>

            {resumes.length === 0 ? (
              <Card className="p-8 text-center space-y-4">
                <p className="text-muted-foreground text-sm">No structured resume found yet. We will build your portfolio from your profile details!</p>
                <Badge variant="outline" className="text-xs">Profile Auto-Detect Active</Badge>
              </Card>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {resumes.map((r) => (
                  <Card
                    key={r.id}
                    onClick={() => setSelectedResumeId(r.id)}
                    className={`p-5 cursor-pointer transition-all border-2 ${
                      selectedResumeId === r.id ? 'border-primary bg-primary/5' : 'hover:border-border/80'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold text-sm">{r.name}</p>
                        <p className="text-xs text-muted-foreground mt-1">Updated {new Date(r.updated_at).toLocaleDateString()}</p>
                      </div>
                      {selectedResumeId === r.id && (
                        <div className="h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                          <Check className="h-3.5 w-3.5" />
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            )}

            <div className="flex justify-end pt-4">
              <Button onClick={() => setStep(2)} className="gap-2">
                Continue to Styles <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}

        {/* Step 2: Choose Style */}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="space-y-2">
              <h2 className="text-lg font-bold">Step 2: Choose Your Visual Style</h2>
              <p className="text-sm text-muted-foreground">Select a template preset for your portfolio.</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {TEMPLATES.map((t) => (
                <Card
                  key={t.id}
                  onClick={() => setSelectedTemplate(t.id)}
                  className={`p-4 cursor-pointer transition-all border-2 ${
                    selectedTemplate === t.id ? 'border-primary bg-primary/5 shadow-sm' : 'hover:border-border/80'
                  }`}
                >
                  <div className="text-2xl mb-2">{t.icon}</div>
                  <p className="font-bold text-sm">{t.title}</p>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{t.desc}</p>
                </Card>
              ))}
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setStep(1)} className="gap-2">
                <ArrowLeft className="h-4 w-4" /> Back
              </Button>
              <Button onClick={() => setStep(3)} className="gap-2">
                Continue to Motion <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Choose Motion */}
        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="space-y-2">
              <h2 className="text-lg font-bold">Step 3: Choose Motion Level</h2>
              <p className="text-sm text-muted-foreground">Select animation intensity for scroll entry and interactions.</p>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              {MOTION_OPTIONS.map((m) => (
                <Card
                  key={m.id}
                  onClick={() => setSelectedMotion(m.id)}
                  className={`p-5 cursor-pointer transition-all border-2 ${
                    selectedMotion === m.id ? 'border-primary bg-primary/5' : 'hover:border-border/80'
                  }`}
                >
                  <p className="font-bold text-sm">{m.title}</p>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{m.desc}</p>
                </Card>
              ))}
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setStep(2)} className="gap-2">
                <ArrowLeft className="h-4 w-4" /> Back
              </Button>
              <Button onClick={handleStartGeneration} className="gap-2 bg-primary">
                <Sparkles className="h-4 w-4" /> Generate Portfolio
              </Button>
            </div>
          </motion.div>
        )}

        {/* Step 4: Real-time Generation Loader */}
        {step === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-16 text-center space-y-8"
          >
            <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
              <Sparkles className="h-8 w-8 text-primary animate-pulse" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold">Building Your Portfolio</h3>
              <p className="text-sm text-primary font-medium">{STAGES[currentStageIdx]}...</p>
            </div>

            <div className="max-w-md mx-auto space-y-2 text-left bg-muted/40 p-4 rounded-xl border border-border/50 text-xs">
              {STAGES.map((st, i) => (
                <div key={i} className="flex items-center gap-2">
                  {i < currentStageIdx ? (
                    <Check className="h-3.5 w-3.5 text-emerald-500" />
                  ) : i === currentStageIdx ? (
                    <Loader2 className="h-3.5 w-3.5 text-primary animate-spin" />
                  ) : (
                    <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40 ml-1" />
                  )}
                  <span className={i <= currentStageIdx ? 'text-foreground font-medium' : 'text-muted-foreground'}>
                    {st}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Step 5: Portfolio Ready */}
        {step === 5 && (
          <motion.div
            key="step5"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-12 text-center space-y-6"
          >
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
              <Check className="h-8 w-8" />
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-extrabold tracking-tight">Your Portfolio is Ready!</h2>
              <p className="text-sm text-muted-foreground">Generated cleanly from your resume data. You can now edit or publish it.</p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Button onClick={() => router.push(`/portfolio/editor/${createdPortfolioId}`)} className="gap-2">
                Open Studio Editor <ArrowRight className="h-4 w-4" />
              </Button>
              <Button variant="outline" onClick={() => router.push(`/portfolio/${createdUsername}`)} className="gap-2">
                <Eye className="h-4 w-4" /> View Public Page
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
