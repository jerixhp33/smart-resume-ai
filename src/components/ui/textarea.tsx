import * as React from 'react'
import { cn } from '@/utils/cn'

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string
  label?: string
  hint?: string
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, label, hint, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-foreground mb-1.5">
            {label}
            {props.required && <span className="text-destructive ml-1" aria-hidden>*</span>}
          </label>
        )}
        <textarea
          id={inputId}
          ref={ref}
          aria-invalid={!!error}
          className={cn(
            'flex min-h-[80px] w-full rounded-lg border bg-background px-3 py-2.5 text-sm',
            'placeholder:text-muted-foreground resize-y',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            'disabled:cursor-not-allowed disabled:opacity-50 transition-colors',
            error ? 'border-destructive' : 'border-input',
            className
          )}
          {...props}
        />
        {error && <p role="alert" className="mt-1.5 text-xs text-destructive">{error}</p>}
        {hint && !error && <p className="mt-1.5 text-xs text-muted-foreground">{hint}</p>}
      </div>
    )
  }
)
Textarea.displayName = 'Textarea'

export { Textarea }
