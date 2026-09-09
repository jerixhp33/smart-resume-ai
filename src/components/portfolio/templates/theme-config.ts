import type { PortfolioThemeId } from '@/types'

export interface ThemeConfig {
  id: string
  name: string
  primary: string
  primaryHover: string
  accentBg: string
  accentText: string
  borderAccent: string
  badgeBg: string
  gradient: string
  customHex?: string
}

export const THEMES: Record<PortfolioThemeId, ThemeConfig> = {
  neutral: {
    id: 'neutral',
    name: 'Neutral',
    primary: 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950',
    primaryHover: 'hover:bg-zinc-800 dark:hover:bg-white',
    accentBg: 'bg-zinc-100 dark:bg-zinc-800/60',
    accentText: 'text-zinc-900 dark:text-zinc-100',
    borderAccent: 'border-zinc-300 dark:border-zinc-700',
    badgeBg: 'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200',
    gradient: 'from-zinc-900 to-zinc-600 dark:from-zinc-100 dark:to-zinc-400',
  },
  indigo: {
    id: 'indigo',
    name: 'Indigo',
    primary: 'bg-indigo-600 text-white',
    primaryHover: 'hover:bg-indigo-700',
    accentBg: 'bg-indigo-50 dark:bg-indigo-950/40',
    accentText: 'text-indigo-600 dark:text-indigo-400',
    borderAccent: 'border-indigo-200 dark:border-indigo-800',
    badgeBg: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300',
    gradient: 'from-indigo-600 to-blue-500',
  },
  blue: {
    id: 'blue',
    name: 'Ocean Blue',
    primary: 'bg-blue-600 text-white',
    primaryHover: 'hover:bg-blue-700',
    accentBg: 'bg-blue-50 dark:bg-blue-950/40',
    accentText: 'text-blue-600 dark:text-blue-400',
    borderAccent: 'border-blue-200 dark:border-blue-800',
    badgeBg: 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300',
    gradient: 'from-blue-600 to-cyan-500',
  },
  emerald: {
    id: 'emerald',
    name: 'Emerald',
    primary: 'bg-emerald-600 text-white',
    primaryHover: 'hover:bg-emerald-700',
    accentBg: 'bg-emerald-50 dark:bg-emerald-950/40',
    accentText: 'text-emerald-600 dark:text-emerald-400',
    borderAccent: 'border-emerald-200 dark:border-emerald-800',
    badgeBg: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300',
    gradient: 'from-emerald-600 to-teal-500',
  },
  violet: {
    id: 'violet',
    name: 'Royal Violet',
    primary: 'bg-violet-600 text-white',
    primaryHover: 'hover:bg-violet-700',
    accentBg: 'bg-violet-50 dark:bg-violet-950/40',
    accentText: 'text-violet-600 dark:text-violet-400',
    borderAccent: 'border-violet-200 dark:border-violet-800',
    badgeBg: 'bg-violet-50 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300',
    gradient: 'from-violet-600 to-purple-500',
  },
  rose: {
    id: 'rose',
    name: 'Rose',
    primary: 'bg-rose-600 text-white',
    primaryHover: 'hover:bg-rose-700',
    accentBg: 'bg-rose-50 dark:bg-rose-950/40',
    accentText: 'text-rose-600 dark:text-rose-400',
    borderAccent: 'border-rose-200 dark:border-rose-800',
    badgeBg: 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300',
    gradient: 'from-rose-600 to-pink-500',
  },
  amber: {
    id: 'amber',
    name: 'Amber',
    primary: 'bg-amber-600 text-white',
    primaryHover: 'hover:bg-amber-700',
    accentBg: 'bg-amber-50 dark:bg-amber-950/40',
    accentText: 'text-amber-700 dark:text-amber-400',
    borderAccent: 'border-amber-200 dark:border-amber-800',
    badgeBg: 'bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300',
    gradient: 'from-amber-600 to-orange-500',
  },
}

export function getThemeConfig(themeId: string = 'indigo', customHex?: string): ThemeConfig {
  if (customHex && /^#[0-9A-Fa-f]{6}$/.test(customHex)) {
    return {
      id: 'custom',
      name: 'Custom Accent',
      primary: 'bg-[var(--accent-color)] text-white',
      primaryHover: 'hover:brightness-110',
      accentBg: 'bg-[var(--accent-color)]/10',
      accentText: 'text-[var(--accent-color)]',
      borderAccent: 'border-[var(--accent-color)]/30',
      badgeBg: 'bg-[var(--accent-color)]/10 text-[var(--accent-color)] border border-[var(--accent-color)]/20',
      gradient: 'from-[var(--accent-color)] to-purple-500',
      customHex,
    }
  }

  const preset = THEMES[themeId as PortfolioThemeId]
  if (preset) return preset

  return THEMES.indigo
}
