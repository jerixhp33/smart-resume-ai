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
  Sliders,
  Terminal,
  Layers
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
    prompt: 'Create a futuristic cyberpunk dark template with glowing neon cyan matrix cards and side navigation',
    hex: '#06b6d4',
  },
  {
    label: '🏆 Luxury Gold Minimal',
    prompt: 'Create a luxury gold serif template with floating amber cards and soft glass accents',
    hex: '#f59e0b',
  },
  {
    label: '🌿 Emerald Terminal Dark',
    prompt: 'Create a dark emerald developer terminal template with interactive code tabs',
    hex: '#10b981',
  },
  {
    label: '💜 Executive Royal Violet',
    prompt: 'Create an executive royal violet glassmorphism template with heavy typography and 3D cards',
    hex: '#8b5cf6',
  },
  {
    label: '🔥 Crimson Rose Impact',
    prompt: 'Create a high-contrast crimson rose dark template with bold metric highlights',
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
  const [activeTab, setActiveTab] = useState<'prompt' | 'code'>('prompt')
  const [prompt, setPrompt] = useState('')
  const [customHex, setCustomHex] = useState('#6366f1')
  const [isGenerating, setIsGenerating] = useState(false)
  const [copiedCode, setCopiedCode] = useState(false)
  const [lastGenerated, setLastGenerated] = useState<{
    hex: string
    template: string
    css: string
    codeSnippet: string
  }>({
    hex: '#6366f1',
    template: 'cyberpunk-neon',
    css: `.portfolio-card {\n  backdrop-filter: blur(16px);\n  border: 1px solid rgba(99, 102, 241, 0.3);\n  box-shadow: 0 0 30px rgba(99, 102, 241, 0.15);\n}`,
    codeSnippet: `<AIGeneratedTemplate\n  layoutType="cyberpunk-neon"\n  accentHex="#6366f1"\n  customCss={generatedCss}\n/>`,
  })

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

      const generatedHex = data.suggestedHex || '#6366f1'
      const generatedTemplate = 'ai-generated'
      const generatedCss = data.generatedCss || `.portfolio-card { backdrop-filter: blur(16px); border: 1px solid ${generatedHex}40; }`
      const codeSnippet = `<AIGeneratedTemplate\n  layoutType="${data.suggestedTemplate || 'cyberpunk-neon'}"\n  accentHex="${generatedHex}"\n  customCss={\`${generatedCss}\`}\n/>`

      setCustomHex(generatedHex)
      setLastGenerated({
        hex: generatedHex,
        template: generatedTemplate,
        css: generatedCss,
        codeSnippet,
      })

      // Apply live change immediately to site
      onApplyTheme(generatedHex, generatedTemplate, generatedCss)
      toast({ title: 'New AI Template & Code Applied Live!', description: 'Visualized in 60fps on your site preview.', variant: 'success' })
    } catch (err) {
      setIsGenerating(false)
      toast({ title: 'Generation error', description: String(err), variant: 'error' })
    }
  }

  const handleCopyCode = () => {
    navigator.clipboard.writeText(`${lastGenerated.css}\n\n/* React Component Code */\n${lastGenerated.codeSnippet}`)
    setCopiedCode(true)
    toast({ title: 'Copied Generated Code to Clipboard', variant: 'success' })
    setTimeout(() => setCopiedCode(false), 2000)
  }

  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const hex = e.target.value
    setCustomHex(hex)
    onApplyTheme(hex, 'ai-generated', lastGenerated.css)
  }

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95">
        
        {/* Header with Code Inspector Tab Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-primary via-indigo-600 to-purple-600 text-white flex items-center justify-center font-bold shadow-md">
              <Wand2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-foreground tracking-tight flex items-center gap-2">
                <span>AI Template & Code Studio</span>
                <span className="text-[10px] font-extrabold uppercase tracking-widest bg-primary/10 text-primary px-2.5 py-0.5 rounded-full border border-primary/20">
                  Live Preview
                </span>
              </h3>
              <p className="text-xs text-muted-foreground">Type any prompt to generate a new custom template & write code live on site.</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex bg-muted rounded-xl p-1 text-xs">
              <button
                type="button"
                onClick={() => setActiveTab('prompt')}
                className={`px-3 py-1 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === 'prompt' ? 'bg-card text-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Wand2 className="h-3.5 w-3.5" /> Prompt Studio
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('code')}
                className={`px-3 py-1 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === 'code' ? 'bg-card text-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Code2 className="h-3.5 w-3.5" /> Code Inspector
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {activeTab === 'prompt' ? (
          <div className="space-y-5">
            {/* Live Hex Color Accent Picker Engine */}
            <div className="bg-slate-950 text-white p-4 rounded-2xl space-y-3 border border-slate-800">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Palette className="h-4 w-4 text-primary" /> Live Accent Color Picker
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
                        onApplyTheme(hex, 'ai-generated', lastGenerated.css)
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
              <label className="text-xs font-bold text-foreground">Quick Preset Template Prompts</label>
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
                <span>Prompt to Generate Brand New Template</span>
                <span className="text-[10px] text-muted-foreground font-normal">(Describe your target layout, cards, and colors)</span>
              </label>

              <textarea
                rows={3}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g. Create a futuristic cyberpunk dark matrix template with glowing neon green cards and side navigation..."
                className="w-full bg-background border border-border rounded-xl p-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 leading-relaxed resize-none font-mono"
              />

              <button
                type="button"
                onClick={() => handleGenerate()}
                disabled={!prompt.trim() || isGenerating}
                className="w-full bg-gradient-to-r from-primary via-indigo-600 to-purple-600 text-white font-bold text-xs py-3 rounded-xl shadow-lg hover:scale-[1.01] disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <Sparkles className="h-4 w-4 animate-spin" /> Generating & Rendering New Template...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" /> Generate New Template & Visualize Live
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          /* Live AI Code Inspector Tab */
          <div className="space-y-4">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-foreground flex items-center gap-1.5">
                <Terminal className="h-4 w-4 text-purple-400" /> Generated Template Code & CSS
              </span>
              <button
                type="button"
                onClick={handleCopyCode}
                className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
              >
                {copiedCode ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                {copiedCode ? 'Copied' : 'Copy All Code'}
              </button>
            </div>

            {/* Generated CSS Code Frame */}
            <div className="bg-slate-950 text-emerald-400 p-4 rounded-2xl space-y-2 border border-slate-800 font-mono text-xs max-h-56 overflow-y-auto">
              <p className="text-slate-400 text-[10px] uppercase font-bold">// 1. Generated Custom CSS Stylesheet</p>
              <pre className="whitespace-pre-wrap leading-relaxed text-slate-200">{lastGenerated.css}</pre>

              <p className="text-slate-400 text-[10px] uppercase font-bold pt-3">// 2. Generated React Template Component Code</p>
              <pre className="whitespace-pre-wrap leading-relaxed text-purple-300">{lastGenerated.codeSnippet}</pre>
            </div>

            <p className="text-[11px] text-muted-foreground">
              This code is compiled on-the-fly and rendered directly into <code className="font-mono text-foreground">PortfolioRenderer.tsx</code>.
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="border-t border-border pt-4 flex justify-between items-center text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Eye className="h-3.5 w-3.5 text-emerald-500" /> Changes apply instantly on your live site preview
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
