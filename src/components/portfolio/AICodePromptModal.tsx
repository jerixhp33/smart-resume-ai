'use client'

import React, { useState } from 'react'
import { 
  Sparkles, 
  Code2, 
  Palette, 
  Wand2, 
  Check, 
  Copy, 
  RotateCcw, 
  X, 
  Eye,
  Sliders
} from 'lucide-react'
import { toast } from '@/components/ui/toast'

interface AICodePromptModalProps {
  isOpen: boolean
  onClose: () => void
  currentTemplate: string
  currentTheme: string
  onApplyTheme: (accentHex: string, templateId?: string, customCss?: string) => void
}

const PRESET_PROMPTS = [
  {
    label: '✨ Cyberpunk Neon Cyan',
    prompt: 'Make the hero dark obsidian glassmorphic with neon cyan borders and matrix code highlights',
    hex: '#06b6d4',
  },
  {
    label: '🏆 Luxury Gold Minimal',
    prompt: 'Transform into a gold luxury theme with floating amber cards and soft serif accents',
    hex: '#f59e0b',
  },
  {
    label: '🌿 Emerald Terminal Dark',
    prompt: 'Convert to dark emerald developer terminal styling with syntax highlighted cards',
    hex: '#10b981',
  },
  {
    label: '💜 Executive Royal Violet',
    prompt: 'Apply royal violet glassmorphism with heavy typography and glowing border highlights',
    hex: '#8b5cf6',
  },
  {
    label: '🔥 Crimson Rose Impact',
    prompt: 'Create high-contrast crimson rose dark theme with bold metric highlights',
    hex: '#f43f5e',
  },
]

export function AICodePromptModal({
  isOpen,
  onClose,
  currentTemplate,
  currentTheme,
  onApplyTheme,
}: AICodePromptModalProps) {
  const [prompt, setPrompt] = useState('')
  const [customHex, setCustomHex] = useState('#6366f1')
  const [isGenerating, setIsGenerating] = useState(false)
  const [lastGenerated, setLastGenerated] = useState<{
    hex: string
    template: string
    css: string
  } | null>(null)

  if (!isOpen) return null

  const handleGenerate = async (promptText?: string) => {
    const textToUse = promptText || prompt
    if (!textToUse.trim()) return

    setIsGenerating(true)
    try {
      const res = await fetch('/api/portfolio/ai-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: textToUse,
          currentTemplate,
          currentTheme,
        }),
      })

      const data = await res.json()
      setIsGenerating(false)

      if (data.error) {
        toast({ title: 'AI Code Generation Failed', description: data.error, variant: 'error' })
        return
      }

      setCustomHex(data.suggestedHex)
      setLastGenerated({
        hex: data.suggestedHex,
        template: data.suggestedTemplate,
        css: data.generatedCss,
      })

      // Apply live change immediately to site
      onApplyTheme(data.suggestedHex, data.suggestedTemplate, data.generatedCss)
      toast({ title: 'AI Code & Theme Applied Live!', description: data.message, variant: 'success' })
    } catch (err) {
      setIsGenerating(false)
      toast({ title: 'Generation error', description: String(err), variant: 'error' })
    }
  }

  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const hex = e.target.value
    setCustomHex(hex)
    onApplyTheme(hex)
  }

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-primary via-indigo-600 to-purple-600 text-white flex items-center justify-center font-bold shadow-md">
              <Wand2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-foreground tracking-tight flex items-center gap-2">
                <span>AI Code & Design Prompt Studio</span>
                <span className="text-[10px] font-extrabold uppercase tracking-widest bg-primary/10 text-primary px-2.5 py-0.5 rounded-full border border-primary/20">
                  Live Preview
                </span>
              </h3>
              <p className="text-xs text-muted-foreground">Type any natural language prompt to generate & apply live site code changes with unlimited runs.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Live Hex Color Accent Picker Engine */}
        <div className="bg-slate-950 text-white p-4 rounded-2xl space-y-3 border border-slate-800">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Palette className="h-4 w-4 text-primary" /> Live Accent Color Picker (All 8 Models)
            </label>
            <span className="text-xs font-mono font-bold text-primary">{customHex}</span>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="color"
              value={customHex}
              onChange={handleHexChange}
              className="h-9 w-12 rounded-lg bg-transparent border-0 cursor-pointer"
            />
            <div className="flex flex-wrap gap-2 flex-1">
              {['#6366f1', '#10b981', '#f43f5e', '#f59e0b', '#06b6d4', '#8b5cf6', '#ec4899', '#0f172a'].map((hex) => (
                <button
                  key={hex}
                  type="button"
                  onClick={() => {
                    setCustomHex(hex)
                    onApplyTheme(hex)
                  }}
                  className="w-7 h-7 rounded-full border-2 border-white/20 transition-transform hover:scale-110 shadow-sm"
                  style={{ backgroundColor: hex }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Preset AI Prompts */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-foreground">Quick Preset Prompts</label>
          <div className="flex flex-wrap gap-1.5">
            {PRESET_PROMPTS.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => {
                  setPrompt(item.prompt)
                  handleGenerate(item.prompt)
                }}
                className="text-xs bg-muted/60 hover:bg-primary/10 hover:text-primary border border-border/80 px-3 py-1.5 rounded-xl font-medium transition-all"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Prompt Input Textarea */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-foreground flex items-center gap-2">
            <span>Natural Language AI Prompt</span>
            <span className="text-[10px] text-muted-foreground font-normal">(Describe your target colors, glassmorphism, or card layout)</span>
          </label>

          <textarea
            rows={3}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g. Make hero dark obsidian glassmorphic with neon cyan borders and matrix code highlights..."
            className="w-full bg-background border border-border rounded-xl p-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 leading-relaxed resize-none"
          />

          <button
            type="button"
            onClick={() => handleGenerate()}
            disabled={!prompt.trim() || isGenerating}
            className="w-full bg-gradient-to-r from-primary via-indigo-600 to-purple-600 text-white font-bold text-xs py-3 rounded-xl shadow-lg hover:scale-[1.01] disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <>
                <Sparkles className="h-4 w-4 animate-spin" /> Generating AI Code & Theme...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" /> Apply AI Code Live to Site
              </>
            )}
          </button>
        </div>

        {/* Footer */}
        <div className="border-t border-border pt-4 flex justify-between items-center text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Eye className="h-3.5 w-3.5 text-emerald-500" /> Changes apply instantly on your live preview
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-muted hover:bg-muted/80 text-foreground font-bold rounded-xl transition-colors"
          >
            Done & Save
          </button>
        </div>

      </div>
    </div>
  )
}
