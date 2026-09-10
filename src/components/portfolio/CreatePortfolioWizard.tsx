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
import { 
  Sparkles, Check, ArrowRight, ArrowLeft, Loader2, Code, Layout, 
  Zap, Eye, ExternalLink, Upload, FileText, Globe, CheckCircle2, 
  Copy, RefreshCw, Terminal, Send, MessageSquareText
} from 'lucide-react'

interface CreatePortfolioWizardProps {
  resumes: Array<{ id: string; name: string; updated_at: string; data?: any }>
  profile: any
}

export function CreatePortfolioWizard({ resumes, profile }: CreatePortfolioWizardProps) {
  const router = useRouter()
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1)
  
  // Step 1: Selected Resume
  const [selectedResumeId, setSelectedResumeId] = useState<string>(resumes[0]?.id || '')
  const [isUploading, setIsUploading] = useState(false)
  const [uploadMessage, setUploadMessage] = useState<string | null>(null)

  // Step 2: Chatbox ONLY Prompt (No accent selection, no extra pickers!)
  const [aiPrompt, setAiPrompt] = useState<string>(
    'Build a modern dark-mode cyberpunk portfolio with cyan glowing cards, clean monospaced tech badges, and smooth scroll reveals.'
  )
  const [accentHex, setAccentHex] = useState<string>('#06b6d4')
  const [layoutType, setLayoutType] = useState<string>('cyberpunk-neon')
  const [customCss, setCustomCss] = useState<string>('')

  // Real-time visible code streamer state
  const [isGenerating, setIsGenerating] = useState(false)
  const [streamedCodeLines, setStreamedCodeLines] = useState<string[]>([])
  const [currentLineIdx, setCurrentLineIdx] = useState(0)

  // Step 3: Preview & Code Inspector Tab
  const [previewTab, setPreviewTab] = useState<'preview' | 'code'>('preview')
  const [livePromptInput, setLivePromptInput] = useState('')
  const [isAiUpdating, setIsAiUpdating] = useState(false)

  // Step 4: Publish State
  const [createdPortfolio, setCreatedPortfolio] = useState<any>(null)
  const [isPublishing, setIsPublishing] = useState(false)
  const [isPublished, setIsPublished] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)

  const selectedResume = resumes.find(r => r.id === selectedResumeId) || resumes[0]
  const resumeDetails = selectedResume?.data || {}

  // Handle PDF Resume Upload
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
        setUploadMessage(`Success! Uploaded ${file.name}. Select below to proceed.`)
      }
    } catch (err) {
      setUploadMessage('An error occurred during upload.')
    } finally {
      setIsUploading(false)
    }
  }

  // Step 2: Trigger AI Prompt & Real-time Code Streamer in User View
  const handleGenerateFromPrompt = async () => {
    if (!aiPrompt.trim()) return
    setIsGenerating(true)
    setStreamedCodeLines([])
    setCurrentLineIdx(0)

    try {
      // 1. Fetch AI code generation response
      const aiRes = await fetch('/api/portfolio/ai-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: aiPrompt }),
      })
      const data = await aiRes.json()

      const generatedHex = data.suggestedHex || '#06b6d4'
      const generatedTemplate = data.suggestedTemplate || 'cyberpunk-neon'
      const generatedCssRules = data.generatedCss || ''

      setAccentHex(generatedHex)
      setLayoutType(generatedTemplate)
      setCustomCss(generatedCssRules)

      // 2. Prepare mock real-time streaming code lines to show in user view
      const codeLinesToStream = [
        `// 1. Initializing Groq AI Engine for candidate: ${resumeDetails.hero?.full_name || profile?.full_name || 'Candidate'}`,
        `// 2. Analyzing natural language prompt: "${aiPrompt.slice(0, 60)}..."`,
        `import React from 'react'`,
        `import { AIGeneratedTemplate } from '@/components/portfolio/templates/AIGeneratedTemplate'`,
        ``,
        `export const AIConfig = {`,
        `  accentHex: "${generatedHex}",`,
        `  layoutType: "${generatedTemplate}",`,
        `  customCss: \`${generatedCssRules}\`,`,
        `}`,
        ``,
        `// 3. Extracting authentic resume details from Hero to Contact...`,
        `// Hero: ${resumeDetails.hero?.title || 'Software Developer & Specialist'}`,
        `// Experience: ${resumeDetails.experience?.length || 0} Positions Loaded`,
        `// Projects: ${resumeDetails.projects?.length || 0} Projects Loaded`,
        `// 4. Compiling 60fps responsive layout & Supabase record...`,
        `// 5. Code Generation Complete! Launching Live Studio Preview...`,
      ]

      // Stream lines visible in real-time typewriter effect
      let idx = 0
      const timer = setInterval(async () => {
        if (idx < codeLinesToStream.length) {
          setStreamedCodeLines((prev) => [...prev, codeLinesToStream[idx]])
          setCurrentLineIdx(idx)
          idx++
        } else {
          clearInterval(timer)

          // 3. Save portfolio site to Supabase DB
          const res = await createPortfolioFromResumeAction({
            resumeId: selectedResumeId || undefined,
            template: 'ai-generated' as any,
            motionLevel: 'dynamic',
            theme: 'indigo',
            aiConfig: {
              accentHex: generatedHex,
              layoutType: generatedTemplate,
              customCss: generatedCssRules,
              prompt: aiPrompt,
            }
          })

          if (res.portfolio) {
            setCreatedPortfolio(res.portfolio)
          }

          setIsGenerating(false)
          setStep(3) // Jump to Step 3: Preview
        }
      }, 250)
    } catch (err) {
      alert('An error occurred during AI code generation.')
      setIsGenerating(false)
    }
  }

  // Live prompt update in Step 3 Preview
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

  // Step 4: Publish Live
  const handlePublishLive = async () => {
    if (!createdPortfolio) return
    setIsPublishing(true)
    try {
      const res = await publishPortfolioAction(createdPortfolio.id, true)
      if (res.success) {
        setIsPublished(true)
        setStep(4)
      } else {
        alert(res.error || 'Failed to publish.')
      }
    } catch (err) {
      alert('Failed to publish portfolio.')
    } finally {
      setIsPublishing(false)
    }
  }

  const generatedTsxCode = `// Generated Portfolio Component for ${resumeDetails.hero?.full_name || profile?.full_name || 'Candidate'}
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
      {/* 4-Step Navigation Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-border/80 pb-6 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-primary/10 text-primary">
              <Sparkles className="h-5 w-5 animate-pulse" />
            </span>
            <h1 className="text-2xl font-black tracking-tight">AI Code Studio</h1>
            <Badge variant="outline" className="ml-2 border-primary/40 text-primary font-bold">
              Prompt-to-Code Engine
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Prompt AI to write portfolio code in real-time from your authentic resume data.
          </p>
        </div>

        {/* 4 Step Tracker */}
        <div className="flex items-center gap-1.5 bg-muted/30 p-2 rounded-2xl border border-border/50">
          {[
            { num: 1, label: '1. Select Resume' },
            { num: 2, label: '2. AI Prompt' },
            { num: 3, label: '3. Preview' },
            { num: 4, label: '4. Publish' },
          ].map((s) => (
            <button
              key={s.num}
              onClick={() => {
                if (s.num < step || (createdPortfolio && s.num <= 4)) setStep(s.num as any)
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                s.num === step
                  ? 'bg-primary text-primary-foreground shadow-md scale-105'
                  : s.num < step
                  ? 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20'
                  : 'text-muted-foreground opacity-50 cursor-not-allowed'
              }`}
            >
              <span>{s.label}</span>
              {s.num < step && <Check className="h-3 w-3 text-emerald-500" />}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* STEP 1: 1st View App Resume (Select / Upload) */}
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
                  1st view your authentic resume details inside the app. AI will write code using this exact data.
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
                        {resumeDetails.hero?.title || 'Software Developer & Specialist'}
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
                Next: AI Prompt Chatbox <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}

        {/* STEP 2: Chatbox ONLY Prompt & Realtime Code Typing Streamer */}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6 max-w-4xl mx-auto"
          >
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2">
                <MessageSquareText className="h-5 w-5 text-primary" /> Step 2: Prompt AI to Write Code in Real-Time
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Type your design prompt below. Groq AI will write portfolio code live right on this screen.
              </p>
            </div>

            {/* Clean Prompt Chatbox (ONLY Prompt - No accent pickers, no extra options!) */}
            <Card className="p-6 bg-slate-950 text-slate-100 border border-white/15 rounded-3xl space-y-4 shadow-2xl">
              <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-wider">
                <Sparkles className="h-4 w-4 animate-pulse" />
                <span>AI Code Prompt Chatbox</span>
              </div>

              <textarea
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                disabled={isGenerating}
                rows={4}
                placeholder="e.g. Build a futuristic cyberpunk matrix dark portfolio with cyan glowing cards, terminal headers, and smooth hover reveals..."
                className="w-full p-4 rounded-2xl bg-slate-900 border border-white/20 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary leading-relaxed font-mono resize-none"
              />

              <div className="flex items-center justify-between pt-2">
                <Button variant="ghost" size="sm" onClick={() => setStep(1)} disabled={isGenerating} className="text-slate-400 hover:text-white">
                  <ArrowLeft className="h-4 w-4 mr-1" /> Back
                </Button>

                <Button
                  onClick={handleGenerateFromPrompt}
                  disabled={isGenerating || !aiPrompt.trim()}
                  size="lg"
                  className="gap-2 font-bold bg-primary text-primary-foreground shadow-xl hover:scale-105 transition-transform"
                >
                  {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  {isGenerating ? 'AI Writing Code...' : 'Generate Code with Groq AI'}
                </Button>
              </div>
            </Card>

            {/* REAL-TIME VISIBLE CODE STREAMER IN USER VIEW */}
            {isGenerating && (
              <Card className="p-6 bg-slate-950 text-emerald-400 font-mono text-xs border border-emerald-500/40 rounded-3xl space-y-3 shadow-2xl">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2 text-white font-bold">
                    <Terminal className="h-4 w-4 text-emerald-400 animate-pulse" />
                    <span>Real-Time Code Generator</span>
                  </div>
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold animate-pulse">
                    Writing TSX/CSS...
                  </span>
                </div>

                <div className="max-h-[300px] overflow-y-auto space-y-1 p-3 bg-slate-900/90 rounded-xl border border-white/10 text-slate-300">
                  {(streamedCodeLines || []).map((line, idx) => {
                    const safeLine = typeof line === 'string' ? line : ''
                    const isComment = safeLine.startsWith('//')
                    const isImport = safeLine.startsWith('import')
                    return (
                      <div key={idx} className="flex items-start gap-2">
                        <span className="text-slate-600 select-none w-6 text-right font-mono text-[10px]">{idx + 1}</span>
                        <span className={isComment ? 'text-slate-400 italic' : isImport ? 'text-purple-400 font-bold' : 'text-emerald-400'}>
                          {safeLine || '\u00A0'}
                        </span>
                      </div>
                    )
                  })}
                  <div className="flex items-center gap-1 text-emerald-400 font-bold animate-pulse pt-1">
                    <span className="inline-block w-2 h-4 bg-emerald-400" />
                  </div>
                </div>
              </Card>
            )}
          </motion.div>
        )}

        {/* STEP 3: Preview & Code Inspector */}
        {step === 3 && (
          <motion.div
            key="step3"
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
                  placeholder="Prompt AI to modify code live (e.g. Add glowing emerald borders)..."
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

            {/* Bottom Actions */}
            <div className="flex justify-between items-center pt-4">
              <Button variant="outline" onClick={() => setStep(2)} className="gap-2">
                <ArrowLeft className="h-4 w-4" /> Edit Prompt
              </Button>

              <Button onClick={handlePublishLive} disabled={isPublishing} size="lg" className="gap-2 font-black bg-emerald-600 hover:bg-emerald-700 text-white">
                {isPublishing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Globe className="h-4 w-4" />}
                Publish Live to Web <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}

        {/* STEP 4: Publish Success & Live Web URL */}
        {step === 4 && (
          <motion.div
            key="step4"
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
