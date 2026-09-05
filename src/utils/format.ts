import { format, formatDistanceToNow, parseISO } from 'date-fns'

export function formatDate(dateStr: string | null | undefined, fmt = 'MMM yyyy'): string {
  if (!dateStr) return ''
  try {
    const d = dateStr.length === 7 ? parseISO(dateStr + '-01') : parseISO(dateStr)
    return format(d, fmt)
  } catch { return dateStr }
}

export function formatDateRange(
  start: string,
  end: string | null | undefined,
  isCurrent: boolean
): string {
  const s = formatDate(start)
  const e = isCurrent ? 'Present' : formatDate(end ?? undefined)
  return `${s} – ${e}`
}

export function formatRelativeTime(dateStr: string): string {
  try {
    return formatDistanceToNow(parseISO(dateStr), { addSuffix: true })
  } catch { return '' }
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function formatCurrency(paise: number, currency = 'INR'): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(paise / 100)
}

export function formatATSScore(score: number): {
  label: string
  color: string
  bg: string
} {
  if (score >= 80) return { label: 'Excellent', color: 'text-green-600 dark:text-green-400', bg: 'bg-green-100 dark:bg-green-900/30' }
  if (score >= 60) return { label: 'Good', color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-100 dark:bg-yellow-900/30' }
  if (score >= 40) return { label: 'Fair', color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-100 dark:bg-orange-900/30' }
  return { label: 'Needs Work', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-900/30' }
}

export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength - 3) + '...'
}
