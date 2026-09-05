'use client'

import * as React from 'react'
import { cn } from '@/utils/cn'
import { Sparkles, Loader2 } from 'lucide-react'
import { improveText } from '@/features/ai/actions'
import { toast } from '@/components/ui/toast'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string
  label?: string
  hint?: string
  icon?: React.ReactNode
  iconRight?: React.ReactNode
  enableAI?: boolean
  onAIChange?: (value: string) => void
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, label, hint, icon, iconRight, enableAI, onAIChange, id, onBlur, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
    const [isAILoading, setIsAILoading] = React.useState(false)
    const lastCheckedValue = React.useRef<string>(props.value as string || '')

    async function handleAI(force: boolean = false) {
      const text = props.value as string
      if (!text || text.trim().length < 2) return
      if (!force && lastCheckedValue.current === text) return // Skip if we've already checked this exact text
      
      setIsAILoading(true)
      const response = await improveText({ text, instruction: 'grammar' })
      setIsAILoading(false)
      
      // Update ref to prevent infinite loops or retrying same string
      lastCheckedValue.current = text
      
      if (response.error) {
        // Silently fail on blur to avoid disrupting the user with error toasts for background tasks
        if (force) {
          toast({ title: 'AI Error', description: response.error, variant: 'error' })
        } else {
          console.error('[AI Autocorrect Error]', response.error)
        }
      } else if (response.result && onAIChange) {
        if (response.result.improved !== text) {
          onAIChange(response.result.improved)
          lastCheckedValue.current = response.result.improved
          toast({ title: 'Autocorrected ✨', description: 'AI fixed your spelling/grammar automatically.', variant: 'success' })
        } else if (force) {
          toast({ title: 'Looks good!', description: 'No grammar or capitalization issues found.', variant: 'default' })
        }
      }
    }

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      if (enableAI) {
        handleAI(false)
      }
      if (onBlur) {
        onBlur(e)
      }
    }

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-foreground mb-1.5">
            {label}
            {props.required && <span className="text-destructive ml-1" aria-hidden>*</span>}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
              {icon}
            </div>
          )}
          {iconRight && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {iconRight}
            </div>
          )}
          {enableAI && !iconRight && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              <button
                type="button"
                onClick={(e) => { e.preventDefault(); handleAI(true); }}
                disabled={isAILoading || !(props.value as string)?.trim()}
                title="Autocorrect with AI"
                className="hover:text-primary transition-colors disabled:opacity-50"
              >
                {isAILoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              </button>
            </div>
          )}
          <input
            id={inputId}
            type={type}
            ref={ref}
            onBlur={handleBlur}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
            className={cn(
              'flex h-10 w-full rounded-lg border bg-background px-3 py-2 text-sm',
              'placeholder:text-muted-foreground',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
              'disabled:cursor-not-allowed disabled:opacity-50',
              'transition-colors',
              icon && 'pl-9',
              (iconRight || enableAI) && 'pr-9',
              error ? 'border-destructive focus-visible:ring-destructive/50' : 'border-input',
              className
            )}
            {...props}
          />
        </div>
        {error && (
          <p id={`${inputId}-error`} role="alert" className="mt-1.5 text-xs text-destructive flex items-center gap-1">
            <svg viewBox="0 0 16 16" className="h-3 w-3 flex-shrink-0" fill="currentColor">
              <path d="M8 1a7 7 0 110 14A7 7 0 018 1zm0 1.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM8 4a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 018 4zm0 8a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
            {error}
          </p>
        )}
        {hint && !error && (
          <p id={`${inputId}-hint`} className="mt-1.5 text-xs text-muted-foreground">{hint}</p>
        )}
      </div>
    )
  }
)
Input.displayName = 'Input'

export { Input }
