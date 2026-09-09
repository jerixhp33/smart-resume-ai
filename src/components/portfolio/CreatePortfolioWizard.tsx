'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { createPortfolioFromResumeAction, publishPortfolioAction } from '@/features/portfolio/actions'
import { uploadFileAction } from '@/features/files/actions'
import { AIGeneratedTemplate } from '@/components/portfolio/templates/AIGeneratedTemplate'
import type { PortfolioTemplateId, MotionLevel, PortfolioThemeId } from '@/types'
import { 
  Sparkles, Check, ArrowRight, ArrowLeft, Loader2, Code, Layout, ShieldCheck, 
  Zap, Eye, ExternalLink, Upload, FileText, Palette, Globe, CheckCircle2, 
  Copy, RefreshCw, Terminal, Layers, Sparkle, Flame
} from 'lucide-react'

interface CreatePortfolioWizardProps {
  resumes: Array<{ id: string; name: string; updated_at: string; data?: any }>
  profile: any
}

const PRESET_PROMPTS = [
  {
    label: 'Cyberpunk Matrix',
    icon: '⚡',
    hex: '#06b6d4',
    layout: 'cyberpunk-neon',
    prompt: 'Futuristic Cyberpunk Matrix layout with glowing cyan glass cards, dark slate background, and smooth neon hover glow.',
  },
  {
    label: 'Executive Gold',
    icon: '💎',
    hex: '#f59e0b',
    layout: 'gold-serif',
    prompt: 'Ultra-luxurious Executive Gold dark theme with high-contrast typography, amber ambient aura, and sleek glass borders.',
  },
  {
    label: 'Obsidian Minimal',
    icon: '🖤',
    hex: '#6366f1',
    layout: 'matrix-terminal',
    prompt: 'Clean Obsidian Minimal style with indigo radial glow, clean monospaced tech pills, and subtle card reveals.',
  },
  {
    label: 'Emerald Terminal',
    icon: '🌿',
    hex: '#10b981',
    layout: 'matrix-terminal',
    prompt: 'Developer Terminal aesthetic with bright emerald glowing accents, terminal header badges, and monospaced code blocks.',
  },
  {
    label: 'Royal Violet',
    icon: '🔮',
    hex: '#8b5cf6',
    layout: 'glass-cards',
    prompt: 'Creative Royal Violet design with ambient purple blur, 3D card tilt effects, and glowing social links.',
  },
  {
    label: 'Neon Crimson',
    icon: '🔥',
    hex: '#f43f5e',
    layout: 'cyberpunk-neon',
    prompt: 'High-impact Crimson Red theme with bold headlines, glowing border highlights, and dynamic scroll animations.',
  },
]

const ACCENT_SWATCHES = [
  '#06b6d4', '#6366f1', '#10b981', '#f43f5e', '#f59e0b', '#8b5cf6', '#ec4899', '#3b82f6'
]

const GENERATION_STAGES = [
  'Extracting authentic resume details from Hero to Contact',
  'Structuring custom HTML/TSX layout components',
  'Writing CSS color variables & ambient radial lighting',
  'Injecting authentic Work Experience & Projects data',
  'Building 3D Tilt interactive cards & motion reveals',
  'Optimizing 60fps glassmorphic blur filters',
  'Saving site metadata to Supabase DB',
  'Compiling Live Portfolio Engine',
]

export function CreatePortfolioWizard({ resumes, profile }: CreatePortfolioWizardProps) {
  const router = useRouter()
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1)
  
  // Step 1 State: Selected Resume & Upload
  const [selectedResumeId, setSelectedResumeId] = useState<string>(resumes[0]?.id || '')
  const [isUploading, setIsUploading] = useState(false)
  const [uploadMessage, setUploadMessage] = useState<string | null>(null)

  // Step 2 State: Prompt & Accent
  const [aiPrompt, setAiPrompt] = useState<string>(
    'Futuristic Cyberpunk Matrix layout with glowing cyan glass cards, dark slate background, and smooth neon hover glow.'
  )
  const [accentHex, setAccentHex] = useState<string>('#06b6d4')
  const [layoutType, setLayoutType] = useState<string>('cyberpunk-neon')
  const [customCss, setCustomCss] = useState<string>('')

  // Step 3 State: Generation Progress
  const [currentStageIdx, setCurrentStageIdx] = useState(0)
  const [isGenerating, setIsGenerating] = useState(false)

  // Step 4 State: Preview & Code Inspector
  const [previewTab, setPreviewTab] = useState<'preview' | 'code'>('preview')
  const [livePromptInput, setLivePromptInput] = useState('')
  const [isAiUpdating, setIsAiUpdating] = useState(false)

  // Step 5 State: Created Site Info
  const [createdPortfolio, setCreatedPortfolio] = useState<any>(null)
  const [isPublishing, setIsPublishing] = useState(false)
  const [isPublished, setIsPublished] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)

  // Get selected resume object
  const selectedResume = resumes.find(r => r.id === selectedResumeId) || resumes[0]
  const resumeDetails = selectedResume?.data || {}

  // Handle PDF resume upload in Step 1
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setIsUploading(true)
    setUploadMessage('Uploading PDF resume...')
    
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('category', 'resumes')
      const res = await uploadFileAction(formData)
      if (res.error) {
        setUploadMessage(`Upload failed: ${res.error}`)
      } else {
        setUploadMessage(`Success! Uploaded ${file.name}. Click next to proceed.`)
      }
    } catch (err) {
      setUploadMessage('An error occurred during upload.')
    } finally {
      setIsUploading(false)
    }
  }

  // Handle Preset Choice
  const handleSelectPreset = (preset: typeof PRESET_PROMPTS[0]) => {
    setAiPrompt(preset.prompt)
    setAccentHex(preset.hex)
    setLayoutType(preset.layout)
  }

  // Step 3: Trigger AI Generation
  const handleStartGeneration = async () => {
    setStep(3)
    setIsGenerating(true)
    setCurrentStageIdx(0)

    // Progress Loop
    let current = 0
    const interval = setInterval(() => {
      current++
      if (current < GENERATION_STAGES.length) {
        setCurrentStageIdx(current)
      } else {
        clearInterval(interval)
      }
    }, 500)

    try {
      const res = await createPortfolioFromResumeAction({
        resumeId: selectedResumeId || undefined,
        template: 'ai-generated' as any,
        motionLevel: 'dynamic',
        theme: 'indigo',
        aiConfig: {
          accentHex,
          layoutType,
          customCss,
          prompt: aiPrompt,
        }
      })

      clearInterval(interval)

      if (res.error || !res.portfolio) {
        alert(res.error || 'Failed to create portfolio.')
        setStep(2)
        setIsGenerating(false)
        return
      }

      setCreatedPortfolio(res.portfolio)
      setStep(4)
    } catch (err) {
      clearInterval(interval)
      alert('An unexpected error occurred.')
      setStep(2)
    } finally {
      setIsGenerating(false)
    }
  }

  // Update design via AI Prompt in Step 4 Live Preview
  const handleAiLiveUpdate = async () => {
    if (!livePromptInput.trim()) return
    setIsAiUpdating(true)
    try {
      const res = await fetch('/api/portfolio/ai-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: livePromptInput, currentTemplate: 'ai-generated' }),
      })
      const data = await res.json()
      if (data.success) {
        if (data.suggestedHex) setAccentHex(data.suggestedHex)
        if (data.generatedCss) setCustomCss(data.generatedCss)
        if (data.suggestedTemplate) setLayoutType(data.suggestedTemplate)
        setLivePromptInput('')
      }
    } catch (e) {
      console.error(e)
    } finally {
      setIsAiUpdating(false)
    }
  }

  // Step 5: Publish Live
  const handlePublishLive = async () => {
    if (!createdPortfolio) return
    setIsPublishing(true)
    try {
      const res = await publishPortfolioAction(createdPortfolio.id, true)
      if (res.success) {
        setIsPublished(true)
        setStep(5)
      } else {
        alert(res.error || 'Failed to publish.')
      }
    } catch (err) {
      alert('Failed to publish portfolio.')
    } finally {
      setIsPublishing(false)
    }
  }

  // Generate TSX preview string for Code Inspector tab
  const generatedTsxCode = `// Generated TSX Component for Portfolio Studio
import React from 'react'
import { AIGeneratedTemplate } from '@/components/portfolio/templates/AIGeneratedTemplate'

export default function PortfolioPage({ resumeData }) {
  const aiConfig = {
    accentHex: "${accentHex}",
    layoutType: "${layoutType}",
    prompt: "${aiPrompt.replace(/"/g, '\\"')}",
    customCss: \`${customCss}\`
  }

  return (
    <AIGeneratedTemplate 
      content={resumeData}
      theme="indigo"
      aiConfig={aiConfig}
    />
  )
}`

  const publicUrl = createdPortfolio?.username 
    ? `${window.location.origin}/portfolio/${createdPortfolio.username}`
    : ''

  const copyToClipboard = () => {
    if (publicUrl) {
      navigator.clipboard.writeText(publicUrl)
      setCopiedLink(true)
      setTimeout(() => setCopiedLink(false), 2500)
    }
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Top Header Step Indicator */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-border/80 pb-6 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-primary/10 text-primary">
              <Sparkles className="h-5 w-5 animate-pulse" />
            </span>
            <h1 className="text-2xl font-black tracking-tight">AI Code Studio Builder</h1>
            <Badge variant="outline" className="ml-2 border-primary/40 text-primary font-bold">
              Hero-to-Bottom Engine
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Build, inspect, and publish your studio portfolio powered by authentic resume data.
          </p>
        </div>

        {/* 5-Step Bar */}
        <div className="flex items-center gap-1.5 bg-muted/30 p-2 rounded-2xl border border-border/50">
          {[
            { num: 1, label: 'Resume' },
            { num: 2, label: 'AI Prompt' },
            { num: 3, label: 'Generate' },
            { num: 4, label: 'Preview & Code' },
            { num: 5, label: 'Publish' },
          ].map((s) => (
            <button
              key={s.num}
              onClick={() => {
                if (s.num < step || (createdPortfolio && s.num <= 5)) setStep(s.num as any)
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                s.num === step
                  ? 'bg-primary text-primary-foreground shadow-md scale-105'
                  : s.num < step
                  ? 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20'
                  : 'text-muted-foreground opacity-50 cursor-not-allowed'
              }`}
            >
              <span>0{s.num}</span>
              <span className="hidden md:inline">{s.label}</span>
              {s.num < step && <Check className="h-3 w-3 text-emerald-500" />}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* STEP 1: Upload / Select Resume */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" /> Step 1: Select & View Authentic Resume Data
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  1st view your authentic resume details inside the app. AI will write portfolio code using this exact data.
                </p>
              </div>

              <label className="cursor-pointer">
                <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileUpload} className="hidden" />
                <Button variant="outline" size="sm" className="gap-2 pointer-events-none border-dashed border-primary/50">
                  <Upload className="h-4 w-4 text-primary" /> {isUploading ? 'Uploading...' : 'Upload New Resume PDF'}
                </Button>
              </label>
            </div>

            {uploadMessage && (
              <div className="p-3 rounded-xl bg-primary/10 border border-primary/30 text-xs font-medium text-primary">
                {uploadMessage}
              </div>
            )}

            {/* Resume Selection Cards */}
            <div className="grid md:grid-cols-3 gap-4">
              {resumes.map((r) => (
                <Card
                  key={r.id}
                  onClick={() => setSelectedResumeId(r.id)}
                  className={`p-4 cursor-pointer transition-all border-2 relative overflow-hidden ${
                    selectedResumeId === r.id
                      ? 'border-primary bg-primary/5 shadow-lg'
                      : 'hover:border-border/80 opacity-80 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <p className="font-bold text-sm line-clamp-1">{r.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Updated {new Date(r.updated_at).toLocaleDateString()}
                      </p>
                    </div>
                    {selectedResumeId === r.id && (
                      <div className="h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                        <Check className="h-3.5 w-3.5" />
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
                    <span>ATS Verified Data</span>
                    <Badge variant="secondary" className="text-[10px]">Active</Badge>
                  </div>
                </Card>
              ))}
            </div>

            {/* Live 1st View App Resume Card */}
            {selectedResume && (
              <Card className="p-6 bg-slate-900 text-slate-100 border border-white/10 rounded-2xl space-y-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-primary/20 text-primary flex items-center justify-center font-black">
                      1st
                    </div>
                    <div>
                      <h3 className="font-bold text-base">
                        {resumeDetails.hero?.full_name || profile?.full_name || 'Candidate Name'}
                      </h3>
                      <p className="text-xs text-primary font-semibold">
                        {resumeDetails.hero?.title || 'Software Developer & Designer'}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="border-emerald-500/40 text-emerald-400 text-xs">
                    <CheckCircle2 className="h-3 w-3 mr-1 text-emerald-400" /> Authentic Resume Loaded
                  </Badge>
                </div>

                <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                  <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                    <span className="text-slate-400 font-medium">Summary</span>
                    <p className="line-clamp-2 mt-1 opacity-90">
                      {resumeDetails.hero?.summary || 'Experienced professional with track record of high-impact delivery.'}
                    </p>
                  </div>
                  <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                    <span className="text-slate-400 font-medium">Experience Items</span>
                    <p className="font-bold text-sm mt-1 text-primary">
                      {resumeDetails.experience?.length || 0} Positions
                    </p>
                  </div>
                  <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                    <span className="text-slate-400 font-medium">Projects & Skills</span>
                    <p className="font-bold text-sm mt-1 text-purple-400">
                      {resumeDetails.projects?.length || 0} Projects · {resumeDetails.skills?.length || 0} Skill Groups
                    </p>
                  </div>
                  <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                    <span className="text-slate-400 font-medium">Contact Details</span>
                    <p className="line-clamp-1 mt-1 opacity-90">{resumeDetails.contact?.email || profile?.email || 'N/A'}</p>
                  </div>
                </div>
              </Card>
            )}

            <div className="flex justify-end pt-4">
              <Button onClick={() => setStep(2)} size="lg" className="gap-2 font-bold">
                Next: AI Design Prompt <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}

        {/* STEP 2: AI Prompt & Accent Color Direction */}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Palette className="h-5 w-5 text-primary" /> Step 2: AI Design Prompt & Accent Color Direction
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Tell AI how to code your website visual style, colors, and layout aesthetics.
              </p>
            </div>

            {/* Quick Prompt Presets */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-primary" /> Select Prompt Presets
              </label>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                {PRESET_PROMPTS.map((preset, idx) => (
                  <Card
                    key={idx}
                    onClick={() => handleSelectPreset(preset)}
                    className={`p-3.5 cursor-pointer transition-all border-2 hover:scale-[1.02] ${
                      accentHex === preset.hex && layoutType === preset.layout
                        ? 'border-primary bg-primary/10 shadow-md'
                        : 'hover:border-border/80'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">{preset.icon}</span>
                      <div>
                        <p className="font-bold text-xs">{preset.label}</p>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span
                            className="w-3 h-3 rounded-full border border-white/20"
                            style={{ backgroundColor: preset.hex }}
                          />
                          <span className="text-[10px] text-muted-foreground font-mono">{preset.hex}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Custom AI Prompt Input */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Custom Natural Language Design Prompt
              </label>
              <textarea
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                rows={3}
                placeholder="e.g. Modern Cyberpunk Matrix dark layout with glowing cyan glass cards and particle aura..."
                className="w-full p-4 rounded-xl bg-muted/40 border border-border/80 text-sm focus:outline-none focus:ring-2 focus:ring-primary leading-relaxed font-mono"
              />
            </div>

            {/* Accent Color Swatches & Hex Input */}
            <div className="space-y-3 bg-muted/20 p-4 rounded-2xl border border-border/60">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
                <span>Accent Color (Editable in All Models)</span>
                <span className="font-mono text-primary font-bold">{accentHex}</span>
              </label>
              <div className="flex flex-wrap items-center gap-3">
                {ACCENT_SWATCHES.map((swatch) => (
                  <button
                    key={swatch}
                    onClick={() => setAccentHex(swatch)}
                    className={`w-9 h-9 rounded-xl transition-all border-2 relative flex items-center justify-center ${
                      accentHex === swatch ? 'scale-110 border-white shadow-lg' : 'border-transparent opacity-80 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: swatch }}
                  >
                    {accentHex === swatch && <Check className="h-4 w-4 text-white drop-shadow" />}
                  </button>
                ))}
                
                {/* Custom Hex Input */}
                <div className="flex items-center gap-2 border border-border rounded-xl px-3 py-1.5 bg-background">
                  <span className="w-4 h-4 rounded-md border" style={{ backgroundColor: accentHex }} />
                  <input
                    type="text"
                    value={accentHex}
                    onChange={(e) => setAccentHex(e.target.value)}
                    className="w-20 text-xs font-mono bg-transparent focus:outline-none uppercase"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setStep(1)} className="gap-2">
                <ArrowLeft className="h-4 w-4" /> Back to Resume
              </Button>
              <Button onClick={handleStartGeneration} size="lg" className="gap-2 font-bold bg-primary">
                <Sparkles className="h-4 w-4" /> Create Portfolio with AI <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}

        {/* STEP 3: AI Code Generation Engine */}
        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-16 text-center space-y-8"
          >
            <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
              <div
                className="absolute inset-0 rounded-full border-4 border-t-transparent animate-spin"
                style={{ borderColor: `${accentHex}33`, borderTopColor: accentHex }}
              />
              <Sparkles className="h-10 w-10 animate-pulse" style={{ color: accentHex }} />
            </div>

            <div className="space-y-2 max-w-md mx-auto">
              <h3 className="text-2xl font-black">AI Writing Studio Code...</h3>
              <p className="text-sm font-semibold" style={{ color: accentHex }}>
                {GENERATION_STAGES[currentStageIdx]}
              </p>
            </div>

            <div className="max-w-lg mx-auto space-y-2 text-left bg-slate-950 p-5 rounded-2xl border border-white/10 text-xs font-mono shadow-2xl">
              {GENERATION_STAGES.map((st, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  {i < currentStageIdx ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                  ) : i === currentStageIdx ? (
                    <Loader2 className="h-4 w-4 animate-spin text-primary flex-shrink-0" />
                  ) : (
                    <span className="h-1.5 w-1.5 rounded-full bg-white/20 ml-1.5 flex-shrink-0" />
                  )}
                  <span className={i <= currentStageIdx ? 'text-slate-200 font-medium' : 'text-slate-600'}>
                    {st}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* STEP 4: View Live Preview & Code Inspector Tab */}
        {step === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
          >
            {/* Control Bar: View Switcher & Live AI Prompt Tweaker */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between bg-slate-900/90 text-white p-4 rounded-2xl border border-white/10 gap-4 shadow-xl">
              {/* Tab Switcher */}
              <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-white/10">
                <button
                  onClick={() => setPreviewTab('preview')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                    previewTab === 'preview' ? 'bg-primary text-white shadow-md' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Eye className="h-3.5 w-3.5" /> Live Site Preview
                </button>
                <button
                  onClick={() => setPreviewTab('code')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                    previewTab === 'code' ? 'bg-primary text-white shadow-md' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Code className="h-3.5 w-3.5" /> Code Inspector
                </button>
              </div>

              {/* Live AI Prompt Bar */}
              <div className="flex items-center gap-2 flex-1 w-full md:w-auto">
                <input
                  type="text"
                  value={livePromptInput}
                  onChange={(e) => setLivePromptInput(e.target.value)}
                  placeholder="Prompt AI to change code/colors live (e.g. Make accent neon emerald)..."
                  className="flex-1 px-3.5 py-2 rounded-xl bg-slate-950 border border-white/15 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-primary font-mono"
                  onKeyDown={(e) => e.key === 'Enter' && handleAiLiveUpdate()}
                />
                <Button
                  onClick={handleAiLiveUpdate}
                  disabled={isAiUpdating}
                  size="sm"
                  className="gap-1.5 text-xs font-bold"
                >
                  {isAiUpdating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
                  Update Live
                </Button>
              </div>
            </div>

            {/* Tab 1: Live Preview Rendering */}
            {previewTab === 'preview' && (
              <div className="rounded-2xl border border-border overflow-hidden shadow-2xl bg-slate-950 relative min-h-[600px]">
                <AIGeneratedTemplate
                  content={createdPortfolio?.content || {
                    hero: {
                      full_name: profile?.full_name || 'Candidate Portfolio',
                      title: 'Software Engineer & Studio Builder',
                      tagline: 'Building next-gen AI applications',
                      summary: resumeDetails.hero?.summary || 'Passionate developer creating modern web experiences.',
                      availability: 'Available for Hire',
                    },
                    about: { biography: 'Professional biography.' },
                    experience: resumeDetails.experience || [],
                    education: resumeDetails.education || [],
                    skills: resumeDetails.skills || [],
                    projects: resumeDetails.projects || [],
                    certifications: [],
                    achievements: [],
                    contact: { heading: 'Contact Me', subheading: 'Let us connect', email: profile?.email || '' }
                  }}
                  theme="indigo"
                  aiConfig={{ accentHex, layoutType: layoutType as any, customCss, prompt: aiPrompt }}
                />
              </div>
            )}

            {/* Tab 2: Code Inspector */}
            {previewTab === 'code' && (
              <Card className="p-6 bg-slate-950 text-slate-100 font-mono text-xs border border-white/10 rounded-2xl space-y-4 shadow-2xl">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Terminal className="h-4 w-4 text-emerald-400" />
                    <span>generated-portfolio-component.tsx</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigator.clipboard.writeText(generatedTsxCode)}
                    className="gap-1.5 text-xs border-white/20 text-white hover:bg-white/10"
                  >
                    <Copy className="h-3.5 w-3.5" /> Copy Code
                  </Button>
                </div>
                <pre className="overflow-x-auto p-4 rounded-xl bg-slate-900 text-slate-300 leading-relaxed">
                  <code>{generatedTsxCode}</code>
                </pre>
              </Card>
            )}

            {/* Bottom Actions: Back to Prompt or Proceed to Publish */}
            <div className="flex justify-between items-center pt-4">
              <Button variant="outline" onClick={() => setStep(2)} className="gap-2">
                <ArrowLeft className="h-4 w-4" /> Tweak Prompt
              </Button>

              <Button onClick={handlePublishLive} disabled={isPublishing} size="lg" className="gap-2 font-black bg-emerald-600 hover:bg-emerald-700 text-white">
                {isPublishing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Globe className="h-4 w-4" />}
                Publish Live to Web <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}

        {/* STEP 5: Publish Success & Live Web URL */}
        {step === 5 && (
          <motion.div
            key="step5"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-12 text-center space-y-8"
          >
            <div className="w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40 shadow-2xl">
              <CheckCircle2 className="h-10 w-10 animate-pulse" />
            </div>

            <div className="space-y-2 max-w-lg mx-auto">
              <h2 className="text-3xl font-black tracking-tight">Your AI Portfolio is Published Live!</h2>
              <p className="text-sm text-muted-foreground">
                Written from your authentic resume data and live on Supabase & web.
              </p>
            </div>

            {/* Live Web Link Banner */}
            <Card className="p-6 max-w-xl mx-auto bg-slate-900 text-white border border-emerald-500/40 rounded-2xl space-y-4 shadow-2xl">
              <div className="flex items-center justify-between text-xs text-emerald-400 font-bold uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  Live Web Address
                </span>
                <span>Supabase Verified</span>
              </div>

              <div className="flex items-center gap-2 p-3 bg-slate-950 rounded-xl border border-white/10 font-mono text-sm text-slate-200">
                <Globe className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                <span className="truncate flex-1 text-left">{publicUrl || 'https://resunio.ai/portfolio/...'}</span>
                <Button onClick={copyToClipboard} size="sm" variant="ghost" className="h-8 px-2 text-xs hover:bg-white/10">
                  {copiedLink ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                {publicUrl && (
                  <a href={publicUrl} target="_blank" rel="noopener noreferrer">
                    <Button className="gap-2 font-bold bg-emerald-600 hover:bg-emerald-700 text-white">
                      <ExternalLink className="h-4 w-4" /> View Public Site
                    </Button>
                  </a>
                )}
                {createdPortfolio?.id && (
                  <Button
                    variant="outline"
                    onClick={() => router.push(`/portfolio/editor/${createdPortfolio.id}`)}
                    className="gap-2 border-white/20 text-white hover:bg-white/10"
                  >
                    Open Studio Editor
                  </Button>
                )}
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
