'use client'

import React, { useState } from 'react'
import { Sparkles, Check, X, RotateCcw, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { improveText } from '@/features/ai/actions'
import { toast } from '@/components/ui/toast'
import type { AIImprovement } from '@/types'
import { cn } from '@/utils/cn'

type ImproveMode = 'improve' | 'professional' | 'ats' | 'concise' | 'grammar' | 'rewrite'

interface AIImproveButtonProps {
  text: string
  onAccept: (improved: string) => void
  context?: string
  modes?: ImproveMode[]
  className?: string
}

const MODE_LABELS: Record<ImproveMode, string> = {
  improve: 'Improve',
  professional: 'Make Professional',
  ats: 'ATS-Friendly',
  concise: 'Make Concise',
  grammar: 'Fix Grammar',
  rewrite: 'Rewrite',
}

export function AIImproveButton({
  text,
  onAccept,
  context,
  modes = ['improve', 'professional', 'ats', 'concise', 'grammar'],
  className,
}: AIImproveButtonProps) {
  const [state, setState] = useState<'idle' | 'menu' | 'loading' | 'preview'>('idle')
  const [result, setResult] = useState<AIImprovement | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function improve(mode: ImproveMode) {
    if (!text || text.trim().length < 10) {
      toast({ title: 'Too short', description: 'Add some text first before improving.', variant: 'warning' })
      setState('idle')
      return
    }
    setState('loading')
    setError(null)

    const response = await improveText({ text, instruction: mode, context })

    if (response.error) {
      setError(response.error)
      setState('idle')
      toast({ title: "We couldn't improve this section.", description: response.error, variant: 'error' })
    } else if (response.result) {
      setResult(response.result)
      setState('preview')
    }
  }

  function accept() {
    if (result) {
      onAccept(result.improved)
      setState('idle')
      setResult(null)
      toast({ title: 'Applied!', variant: 'success' })
    }
  }

  function reject() {
    setState('idle')
    setResult(null)
  }

  if (state === 'loading') {
    return (
      <div className={cn('flex items-center gap-1.5 text-xs text-muted-foreground', className)}>
        <Loader2 className="h-3 w-3 animate-spin text-primary" />
        <span>AI improving…</span>
      </div>
    )
  }

  if (state === 'preview' && result) {
    return (
      <div className={cn('border border-primary/20 bg-primary/5 rounded-lg p-3 space-y-2', className)}>
        <div className="flex items-center gap-1.5 text-xs font-semibold text-primary">
          <Sparkles className="h-3.5 w-3.5" />
          AI Suggestion — Review before applying
        </div>
        <p className="text-sm text-foreground leading-relaxed">{result.improved}</p>
        {result.changes_made.length > 0 && (
          <p className="text-xs text-muted-foreground">
            Changes: {result.changes_made.join(', ')}
          </p>
        )}
        <div className="flex gap-2 pt-1">
          <Button size="sm" onClick={accept} className="gap-1 text-xs h-7">
            <Check className="h-3 w-3" /> Accept
          </Button>
          <Button size="sm" variant="outline" onClick={reject} className="gap-1 text-xs h-7">
            <X className="h-3 w-3" /> Reject
          </Button>
          <Button size="sm" variant="ghost" onClick={() => { setResult(null); setState('menu') }} className="gap-1 text-xs h-7">
            <RotateCcw className="h-3 w-3" /> Try another
          </Button>
        </div>
      </div>
    )
  }

  if (state === 'menu') {
    return (
      <div className={cn('flex flex-wrap gap-1.5', className)}>
        {modes.map(mode => (
          <button
            key={mode}
            onClick={() => improve(mode)}
            className="text-xs px-2.5 py-1 rounded-full border border-primary/30 text-primary hover:bg-primary/10 transition-colors"
          >
            {MODE_LABELS[mode]}
          </button>
        ))}
        <button
          onClick={() => setState('idle')}
          className="text-xs px-2.5 py-1 rounded-full border border-border text-muted-foreground hover:bg-muted transition-colors"
        >
          Cancel
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => setState('menu')}
      disabled={!text || text.trim().length < 10}
      className={cn(
        'flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors',
        'disabled:opacity-30 disabled:cursor-not-allowed',
        className
      )}
    >
      <Sparkles className="h-3 w-3" />
      Improve with AI
    </button>
  )
}
