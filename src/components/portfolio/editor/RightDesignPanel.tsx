'use client'

import React from 'react'
import { usePortfolioStore } from '@/features/portfolio/usePortfolioStore'
import type { PortfolioTemplateId, PortfolioThemeId, MotionLevel } from '@/types'
import { Palette, Layout, Zap, Check, Sparkles } from 'lucide-react'

const TEMPLATES: Array<{ id: PortfolioTemplateId | 'ai-generated'; title: string; icon: string }> = [
  { id: 'ai-generated' as any, title: '✨ AI Studio Code', icon: '🤖' },
  { id: 'modern', title: 'Modern', icon: '✨' },
  { id: 'minimal', title: 'Minimal', icon: '📝' },
  { id: 'developer', title: 'Developer', icon: '⚡' },
  { id: 'creative', title: 'Creative', icon: '🎨' },
  { id: 'professional', title: 'Professional', icon: '💼' },
  { id: 'editorial', title: 'Editorial', icon: '📰' },
  { id: 'bold', title: 'Bold', icon: '💥' },
  { id: 'elegant', title: 'Elegant', icon: '💎' },
]

const COLOR_PRESETS: Array<{ themeId: PortfolioThemeId; hex: string; label: string }> = [
  { themeId: 'indigo', hex: '#6366f1', label: 'Indigo' },
  { themeId: 'blue', hex: '#3b82f6', label: 'Ocean Blue' },
  { themeId: 'emerald', hex: '#10b981', label: 'Emerald' },
  { themeId: 'violet', hex: '#8b5cf6', label: 'Royal Violet' },
  { themeId: 'rose', hex: '#f43f5e', label: 'Rose' },
  { themeId: 'amber', hex: '#f59e0b', label: 'Amber' },
]

const MOTION_LEVELS: Array<{ id: MotionLevel; title: string }> = [
  { id: 'subtle', title: 'Subtle' },
  { id: 'smooth', title: 'Smooth (Default)' },
  { id: 'dynamic', title: 'Dynamic 3D' },
]

export function RightDesignPanel() {
  const template = usePortfolioStore((s) => s.template)
  const theme = usePortfolioStore((s) => s.theme)
  const motionLevel = usePortfolioStore((s) => s.motionLevel)
  const content = usePortfolioStore((s) => s.content)
  
  const setTemplate = usePortfolioStore((s) => s.setTemplate)
  const setTheme = usePortfolioStore((s) => s.setTheme)
  const setMotionLevel = usePortfolioStore((s) => s.setMotionLevel)
  const updateAiConfig = usePortfolioStore((s) => s.updateAiConfig)

  const currentAccentHex = content?.aiConfig?.accentHex || '#6366f1'

  const handleSelectColorPreset = (preset: typeof COLOR_PRESETS[0]) => {
    setTheme(preset.themeId)
    updateAiConfig({ accentHex: preset.hex })
  }

  const handleCustomHexChange = (hex: string) => {
    updateAiConfig({ accentHex: hex })
  }

  return (
    <div data-lenis-prevent className="flex flex-col h-full p-4 overflow-y-auto space-y-6 text-foreground">
      {/* 1. Visual Models & Templates */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
          <Layout className="h-3.5 w-3.5 text-primary" />
          <span>Visual Models & Templates</span>
        </div>
        <div className="space-y-1.5">
          {TEMPLATES.map((t) => {
            const isSelected = template === t.id
            return (
              <button
                key={t.id}
                onClick={() => setTemplate(t.id as any)}
                className={`w-full px-3 py-2.5 rounded-xl text-xs font-semibold border transition-all text-left flex items-center justify-between ${
                  isSelected
                    ? 'border-primary bg-primary/10 text-primary shadow-xs font-bold'
                    : 'border-border hover:bg-muted text-muted-foreground'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span>{t.icon}</span>
                  <span className="font-bold">{t.title}</span>
                </div>
                {isSelected && <Check className="h-3.5 w-3.5 text-primary flex-shrink-0" />}
              </button>
            )
          })}
        </div>
      </div>

      {/* 2. Color Theme & Accent Picker */}
      <div className="space-y-3 pt-4 border-t border-border">
        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Palette className="h-3.5 w-3.5 text-primary" />
            <span>Color Theme & Accent</span>
          </span>
          <span className="font-mono text-primary text-[11px] font-bold">{currentAccentHex}</span>
        </div>

        {/* Color Presets Grid */}
        <div className="grid grid-cols-2 gap-2">
          {COLOR_PRESETS.map((preset) => {
            const isSelected = theme === preset.themeId || currentAccentHex.toLowerCase() === preset.hex.toLowerCase()
            return (
              <button
                key={preset.themeId}
                onClick={() => handleSelectColorPreset(preset)}
                className={`p-2.5 rounded-xl border text-xs font-semibold transition-all flex items-center justify-between ${
                  isSelected ? 'border-primary bg-primary/10 text-foreground font-bold' : 'border-border hover:bg-muted text-muted-foreground'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded-full border border-white/20" style={{ backgroundColor: preset.hex }} />
                  <span>{preset.label}</span>
                </div>
                {isSelected && <Check className="h-3.5 w-3.5 text-primary" />}
              </button>
            )
          })}
        </div>

        {/* Custom Hex Input */}
        <div className="flex items-center gap-2 border border-border rounded-xl px-3 py-1.5 bg-background text-xs">
          <span className="w-4 h-4 rounded-md border" style={{ backgroundColor: currentAccentHex }} />
          <span className="text-muted-foreground font-mono">Custom Hex:</span>
          <input
            type="text"
            value={currentAccentHex}
            onChange={(e) => handleCustomHexChange(e.target.value)}
            className="w-full text-xs font-mono bg-transparent focus:outline-none uppercase font-bold"
          />
        </div>
      </div>

      {/* 3. Motion Level */}
      <div className="space-y-3 pt-4 border-t border-border pb-6">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
          <Zap className="h-3.5 w-3.5 text-primary" />
          <span>Motion Level</span>
        </div>
        <div className="space-y-1.5">
          {MOTION_LEVELS.map((m) => (
            <button
              key={m.id}
              onClick={() => setMotionLevel(m.id)}
              className={`w-full px-3 py-2 rounded-xl text-xs font-semibold border transition-all text-left flex items-center justify-between ${
                motionLevel === m.id
                  ? 'border-primary bg-primary/10 text-primary font-bold'
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
