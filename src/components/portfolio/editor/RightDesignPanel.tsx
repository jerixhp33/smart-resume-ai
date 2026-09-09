'use client'

import React, { useState } from 'react'
import { usePortfolioStore } from '@/features/portfolio/usePortfolioStore'
import type { PortfolioTemplateId, PortfolioThemeId, MotionLevel } from '@/types'
import { THEMES } from '../templates/theme-config'
import { Palette, Layout, Zap, Check, Sparkles, Wand2, Loader2, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

const TEMPLATES: Array<{ id: PortfolioTemplateId | 'ai-generated'; title: string; icon: string }> = [
  { id: 'ai-generated' as any, title: '✨ AI Studio Code', icon: '🤖' },
  { id: 'developer', title: 'Cyber Matrix', icon: '⚡' },
  { id: 'creative', title: 'Glassmorphic', icon: '🎨' },
  { id: 'professional', title: 'Executive Gold', icon: '💎' },
  { id: 'modern', title: 'Modern SaaS', icon: '✨' },
  { id: 'editorial', title: 'Obsidian Minimal', icon: '📰' },
  { id: 'bold', title: 'Neon Pulse', icon: '💥' },
  { id: 'minimal', title: 'Clean Minimal', icon: '📝' },
]

const ACCENT_SWATCHES = [
  '#06b6d4', '#6366f1', '#10b981', '#f43f5e', '#f59e0b', '#8b5cf6', '#ec4899', '#3b82f6'
]

const THEME_KEYS: PortfolioThemeId[] = ['indigo', 'blue', 'emerald', 'violet', 'rose', 'amber', 'neutral']

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

  const [aiPrompt, setAiPrompt] = useState('')
  const [isPrompting, setIsPrompting] = useState(false)

  const currentAccentHex = content?.aiConfig?.accentHex || '#06b6d4'

  const handleApplyAiPrompt = async () => {
    if (!aiPrompt.trim()) return
    setIsPrompting(true)
    try {
      const res = await fetch('/api/portfolio/ai-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: aiPrompt, currentTemplate: template }),
      })
      const data = await res.json()
      if (data.success) {
        setTemplate('ai-generated' as any)
        updateAiConfig({
          accentHex: data.suggestedHex || currentAccentHex,
          layoutType: data.suggestedTemplate || 'cyberpunk-neon',
          customCss: data.generatedCss || '',
          prompt: aiPrompt,
        })
        setAiPrompt('')
      }
    } catch (e) {
      console.error(e)
    } finally {
      setIsPrompting(false)
    }
  }

  const handleSelectAccent = (hex: string) => {
    updateAiConfig({ accentHex: hex })
  }

  return (
    <div data-lenis-prevent className="flex flex-col h-full p-4 overflow-y-auto space-y-6 text-foreground">
      {/* AI Design Prompt Studio Box */}
      <div className="space-y-3 p-3.5 rounded-2xl bg-primary/10 border border-primary/30 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-black text-primary uppercase tracking-wider">
            <Wand2 className="h-4 w-4 animate-pulse" />
            <span>AI Code Prompt Studio</span>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/20 text-primary font-bold">Live</span>
        </div>
        <textarea
          value={aiPrompt}
          onChange={(e) => setAiPrompt(e.target.value)}
          rows={2}
          placeholder="Prompt AI to change code/colors (e.g. Neon Emerald Cyberpunk layout)..."
          className="w-full p-2.5 rounded-xl bg-background border border-border text-xs focus:outline-none focus:ring-1 focus:ring-primary font-mono leading-relaxed"
        />
        <Button
          onClick={handleApplyAiPrompt}
          disabled={isPrompting || !aiPrompt.trim()}
          size="sm"
          className="w-full text-xs font-bold gap-1.5 bg-primary text-primary-foreground"
        >
          {isPrompting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
          Execute AI Prompt & Live Changes
        </Button>
      </div>

      {/* Editable Hex Accent Color Picker (Editable in All Models) */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Palette className="h-3.5 w-3.5 text-primary" />
            <span>Accent Color (Editable)</span>
          </span>
          <span className="font-mono text-primary text-[11px] font-bold">{currentAccentHex}</span>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {ACCENT_SWATCHES.map((swatch) => (
            <button
              key={swatch}
              onClick={() => handleSelectAccent(swatch)}
              className={`h-8 rounded-xl transition-all border-2 flex items-center justify-center ${
                currentAccentHex === swatch ? 'border-primary shadow-md scale-105' : 'border-transparent opacity-80 hover:opacity-100'
              }`}
              style={{ backgroundColor: swatch }}
            >
              {currentAccentHex === swatch && <Check className="h-3.5 w-3.5 text-white drop-shadow" />}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 border border-border rounded-xl px-3 py-1 bg-background text-xs">
          <span className="w-3.5 h-3.5 rounded-md border" style={{ backgroundColor: currentAccentHex }} />
          <span className="text-muted-foreground font-mono">Hex:</span>
          <input
            type="text"
            value={currentAccentHex}
            onChange={(e) => handleSelectAccent(e.target.value)}
            className="w-full text-xs font-mono bg-transparent focus:outline-none uppercase"
          />
        </div>
      </div>

      {/* Visual Template Selector */}
      <div className="space-y-3 pt-4 border-t border-border">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
          <Layout className="h-3.5 w-3.5" />
          <span>Visual Models & Templates</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {TEMPLATES.map((t) => {
            const isSelected = template === t.id
            return (
              <button
                key={t.id}
                onClick={() => setTemplate(t.id as any)}
                className={`p-2.5 rounded-xl text-xs font-semibold border transition-all text-left flex items-center justify-between ${
                  isSelected
                    ? 'border-primary bg-primary/10 text-primary shadow-sm font-bold'
                    : 'border-border hover:bg-muted text-muted-foreground'
                }`}
              >
                <div className="flex items-center gap-1.5 truncate">
                  <span>{t.icon}</span>
                  <span className="truncate">{t.title}</span>
                </div>
                {isSelected && <Check className="h-3.5 w-3.5 text-primary flex-shrink-0" />}
              </button>
            )
          })}
        </div>
      </div>

      {/* Color Theme Presets */}
      <div className="space-y-3 pt-4 border-t border-border">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
          <Palette className="h-3.5 w-3.5" />
          <span>Theme Presets</span>
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
      <div className="space-y-3 pt-4 border-t border-border pb-6">
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
