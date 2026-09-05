'use client'
import * as React from 'react'
import * as ToastPrimitive from '@radix-ui/react-toast'
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from 'lucide-react'
import { cn } from '@/utils/cn'

const ToastProvider = ToastPrimitive.Provider
const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Viewport
    ref={ref}
    className={cn(
      'fixed bottom-0 right-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:max-w-[380px]',
      className
    )}
    {...props}
  />
))
ToastViewport.displayName = ToastPrimitive.Viewport.displayName

type ToastVariant = 'default' | 'success' | 'error' | 'warning' | 'info'

const toastVariants: Record<ToastVariant, string> = {
  default: 'bg-card border-border',
  success: 'bg-card border-green-200 dark:border-green-800',
  error: 'bg-card border-red-200 dark:border-red-800',
  warning: 'bg-card border-yellow-200 dark:border-yellow-800',
  info: 'bg-card border-blue-200 dark:border-blue-800',
}

const toastIcons: Record<ToastVariant, React.ReactNode> = {
  default: null,
  success: <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />,
  error: <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />,
  warning: <AlertTriangle className="h-4 w-4 text-yellow-500 flex-shrink-0" />,
  info: <Info className="h-4 w-4 text-blue-500 flex-shrink-0" />,
}

interface ToastProps extends React.ComponentPropsWithoutRef<typeof ToastPrimitive.Root> {
  variant?: ToastVariant
  title?: string
  description?: string
}

const Toast = React.forwardRef<React.ElementRef<typeof ToastPrimitive.Root>, ToastProps>(
  ({ className, variant = 'default', title, description, ...props }, ref) => (
    <ToastPrimitive.Root
      ref={ref}
      className={cn(
        'group pointer-events-auto relative flex w-full items-start gap-3 overflow-hidden rounded-xl border p-4 shadow-lg',
        'data-[state=open]:animate-in data-[state=closed]:animate-out',
        'data-[swipe=end]:animate-out data-[state=closed]:fade-out-80',
        'data-[state=open]:slide-in-from-bottom-5 data-[state=closed]:slide-out-to-right-full',
        'duration-300 transition-all',
        toastVariants[variant],
        className
      )}
      {...props}
    >
      {toastIcons[variant] && <div className="mt-0.5">{toastIcons[variant]}</div>}
      <div className="flex-1 min-w-0">
        {title && <ToastPrimitive.Title className="text-sm font-semibold">{title}</ToastPrimitive.Title>}
        {description && <ToastPrimitive.Description className="text-xs text-muted-foreground mt-0.5">{description}</ToastPrimitive.Description>}
      </div>
      <ToastPrimitive.Close className="rounded-md p-1 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring shrink-0">
        <X className="h-3.5 w-3.5" />
        <span className="sr-only">Dismiss</span>
      </ToastPrimitive.Close>
    </ToastPrimitive.Root>
  )
)
Toast.displayName = ToastPrimitive.Root.displayName

// ── Toast Hook ─────────────────────────────────────────
type ToastInput = { title?: string; description?: string; variant?: ToastVariant; duration?: number }

interface ToastState extends ToastInput { id: string; open: boolean }

const toastState: ToastState[] = []
const listeners: Array<(toasts: ToastState[]) => void> = []

function notify(listeners: Array<(t: ToastState[]) => void>, state: ToastState[]) {
  listeners.forEach(l => l([...state]))
}

export function toast(input: ToastInput) {
  const id = Math.random().toString(36).slice(2)
  const t: ToastState = { ...input, id, open: true }
  toastState.push(t)
  notify(listeners, toastState)
  setTimeout(() => {
    const idx = toastState.findIndex(x => x.id === id)
    if (idx !== -1) { toastState[idx].open = false; notify(listeners, toastState) }
  }, input.duration ?? 4000)
}

export function useToasts() {
  const [toasts, setToasts] = React.useState<ToastState[]>([])
  React.useEffect(() => {
    const handler = (t: ToastState[]) => setToasts(t)
    listeners.push(handler)
    return () => { const i = listeners.indexOf(handler); if (i > -1) listeners.splice(i, 1) }
  }, [])
  return toasts
}

// ── Toaster ───────────────────────────────────────────
export function Toaster() {
  const toasts = useToasts()
  return (
    <ToastProvider>
      {toasts.map(t => (
        <Toast key={t.id} open={t.open} variant={t.variant} title={t.title} description={t.description} />
      ))}
      <ToastViewport />
    </ToastProvider>
  )
}

export { Toast, ToastProvider, ToastViewport }
