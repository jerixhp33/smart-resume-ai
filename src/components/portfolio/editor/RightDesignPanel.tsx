'use client'

import React from 'react'
import { usePortfolioStore } from '@/features/portfolio/usePortfolioStore'
import type { PortfolioTemplateId, PortfolioThemeId, MotionLevel } from '@/types'
import { THEMES } from '../templates/theme-config'
import { Palette, Layout, Zap, Check } from 'lucide-react'

const TEMPLATES: Array<{ id: PortfolioTemplateId; title: string }> = [
  { id: 'modern', title: 'Modern' },
  { id: 'minimal', title: 'Minimal' },
  { id: 'developer', title: 'Developer' },
  { id: 'creative', title: 'Creative' },
  { id: 'professional', title: 'Professional' },
  { id: 'editorial', title: 'Editorial' },
  { id: 'bold', title: 'Bold' },
  { id: 'elegant', title: 'Elegant' },
]

const THEME_KEYS: PortfolioThemeId[] = ['indigo', 'blue', 'emerald', 'violet', 'rose', 'amber', 'neutral']

const MOTION_LEVELS: Array<{ id: MotionLevel; title: string }> = [
  { id: 'subtle', title: 'Subtle' },
  { id: 'smooth', title: 'Smooth' },
  { id: 'dynamic', title: 'Dynamic' },
]

export function RightDesignPanel() {
  const template = usePortfolioStore((s) => s.template)
  const theme = usePortfolioStore((s) => s.theme)
  const motionLevel = usePortfolioStore((s) => s.motionLevel)
  const setTemplate = usePortfolioStore((s) => s.setTemplate)
  const setTheme = usePortfolioStore((s) => s.setTheme)
  const setMotionLevel = usePortfolioStore((s) => s.setMotionLevel)

  return (
    <div data-lenis-prevent className="flex flex-col h-full p-4 overflow-y-auto space-y-6">
      {/* Template Selector */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
          <Layout className="h-3.5 w-3.5" />
          <span>Visual Template</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {TEMPLATES.map((t) => (
            <button
              key={t.id}
              onClick={() => setTemplate(t.id)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all text-left flex items-center justify-between ${
                template === t.id
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border hover:bg-muted text-muted-foreground'
              }`}
            >
              <span>{t.title}</span>
              {template === t.id && <Check className="h-3.5 w-3.5 text-primary" />}
            </button>
          ))}
        </div>
      </div>

      {/* Theme Color Palette */}
      <div className="space-y-3 pt-4 border-t border-border">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
          <Palette className="h-3.5 w-3.5" />
          <span>Color Theme</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {THEME_KEYS.map((tKey) => {
            const tConf = THEMES[tKey]
            const isSelected = theme === tKey

            return (
              <button
                key={tKey}
                onClick={() => setTheme(tKey)}
                className={`p-2.5 rounded-xl border text-xs font-semibold transition-all flex items-center justify-between ${
                  isSelected ? 'border-primary bg-primary/10 text-foreground' : 'border-border hover:bg-muted text-muted-foreground'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className={`w-3.5 h-3.5 rounded-full ${tConf.primary}`} />
                  <span className="capitalize">{tConf.name}</span>
                </div>
                {isSelected && <Check className="h-3.5 w-3.5 text-primary" />}
              </button>
            )
          })}
        </div>
      </div>

      {/* Motion Level */}
      <div className="space-y-3 pt-4 border-t border-border">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
          <Zap className="h-3.5 w-3.5" />
          <span>Motion Level</span>
        </div>
        <div className="space-y-1.5">
          {MOTION_LEVELS.map((m) => (
            <button
              key={m.id}
              onClick={() => setMotionLevel(m.id)}
              className={`w-full px-3 py-2 rounded-xl text-xs font-semibold border transition-all text-left flex items-center justify-between ${
                motionLevel === m.id
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border hover:bg-muted text-muted-foreground'
              }`}
            >
              <span>{m.title}</span>
              {motionLevel === m.id && <Check className="h-3.5 w-3.5 text-primary" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
