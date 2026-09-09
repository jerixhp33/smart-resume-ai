'use client'

import React, { useState } from 'react'
import { Sparkles, ScanSearch, MessageSquare, FileText, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { analyzeJobDescription, generateInterviewQuestions, generateCoverLetter, evaluateInterviewAnswer } from '@/features/ai/actions'
import { toast } from '@/components/ui/toast'
import type { JobAnalysis, InterviewQuestion } from '@/types'
import { InterviewFlashcards } from '@/components/tools/InterviewFlashcards'
import { PenTool } from 'lucide-react'
import { cn } from '@/utils/cn'

export default function AIToolsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight mb-1">AI Tools</h1>
        <p className="text-sm text-muted-foreground">
          AI-powered tools to analyze jobs, prepare for interviews, and improve your resume.
          AI never invents information — it only works with what you provide.
        </p>
      </div>

      <Tabs defaultValue="jd-analyzer">
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="jd-analyzer" className="gap-2">
            <ScanSearch className="h-3.5 w-3.5" /> JD Analyzer
          </TabsTrigger>
          <TabsTrigger value="cover-letter" className="gap-2">
            <PenTool className="h-3.5 w-3.5" /> Cover Letter
          </TabsTrigger>
          <TabsTrigger value="interview-prep" className="gap-2">
            <MessageSquare className="h-3.5 w-3.5" /> Interview Prep
          </TabsTrigger>
        </TabsList>

        <TabsContent value="jd-analyzer">
          <JDAnalyzerTool />
        </TabsContent>
        <TabsContent value="cover-letter">
          <CoverLetterTool />
        </TabsContent>
        <TabsContent value="interview-prep">
          <InterviewPrepTool />
        </TabsContent>
      </Tabs>
    </div>
  )
}

// ── JD Analyzer ───────────────────────────────────────────
function JDAnalyzerTool() {
  const [jdText, setJdText] = useState('')
  const [analysis, setAnalysis] = useState<JobAnalysis | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleAnalyze() {
    if (jdText.trim().length < 100) {
      toast({ title: 'Paste the full job description', description: 'Need at least 100 characters.', variant: 'warning' })
      return
    }
    setLoading(true)
    const result = await analyzeJobDescription(jdText)
    setLoading(false)
    if (result.error) {
      toast({ title: 'Analysis failed', description: result.error, variant: 'error' })
    } else if (result.analysis) {
      setAnalysis(result.analysis)
    }
  }

  return (
    <div className="space-y-6 mt-4">
      <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Paste Job Description</label>
          <textarea
            value={jdText}
            onChange={e => setJdText(e.target.value)}
            placeholder="Paste the full job description here — responsibilities, requirements, qualifications, everything…"
            rows={8}
            className="w-full border border-input rounded-lg px-3 py-2.5 text-sm bg-background resize-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none placeholder:text-muted-foreground"
          />
          <p className="text-xs text-muted-foreground mt-1">{jdText.length} characters</p>
        </div>
        <Button onClick={handleAnalyze} loading={loading} icon={<Sparkles className="h-4 w-4" />}>
          {loading ? 'Analyzing…' : 'Analyze Job Description'}
        </Button>
      </div>

      {analysis && (
        <div className="space-y-5 animate-in">
          {/* Job header */}
          <div className="bg-card border border-border rounded-2xl p-5">
            <h2 className="text-lg font-bold">{analysis.job_title}</h2>
            {analysis.company && <p className="text-muted-foreground text-sm">{analysis.company}</p>}
            <p className="text-sm mt-2">{analysis.summary}</p>
            <div className="flex flex-wrap gap-2 mt-3">
              <Badge variant="secondary">{analysis.industry}</Badge>
              <Badge variant="secondary">{analysis.experience_requirements}</Badge>
            </div>
          </div>

          {/* Skills breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {analysis.required_skills.length > 0 && (
              <div className="bg-card border border-border rounded-xl p-4">
                <h3 className="text-sm font-semibold text-red-600 dark:text-red-400 mb-2">🔴 Required Skills</h3>
                <div className="flex flex-wrap gap-1.5">
                  {analysis.required_skills.map(s => (
                    <span key={s} className="text-xs px-2.5 py-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 font-medium">{s}</span>
                  ))}
                </div>
              </div>
            )}
            {analysis.preferred_skills.length > 0 && (
              <div className="bg-card border border-border rounded-xl p-4">
                <h3 className="text-sm font-semibold text-yellow-600 dark:text-yellow-400 mb-2">🟡 Preferred Skills</h3>
                <div className="flex flex-wrap gap-1.5">
                  {analysis.preferred_skills.map(s => (
                    <span key={s} className="text-xs px-2.5 py-1 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 font-medium">{s}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Tools & Technologies */}
          {analysis.tools_and_technologies.length > 0 && (
            <div className="bg-card border border-border rounded-xl p-4">
              <h3 className="text-sm font-semibold mb-2">🔧 Tools & Technologies</h3>
              <div className="flex flex-wrap gap-1.5">
                {analysis.tools_and_technologies.map(t => (
                  <span key={t} className="text-xs px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-medium">{t}</span>
                ))}
              </div>
            </div>
          )}

          {/* Keywords */}
          {analysis.important_keywords.length > 0 && (
            <div className="bg-card border border-border rounded-xl p-4">
              <h3 className="text-sm font-semibold mb-2">🔑 Important Keywords</h3>
              <p className="text-xs text-muted-foreground mb-2">Add these to your resume if they accurately describe your experience.</p>
              <div className="flex flex-wrap gap-1.5">
                {analysis.important_keywords.map(k => (
                  <span key={k} className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary font-medium">{k}</span>
                ))}
              </div>
            </div>
          )}

          {/* Responsibilities */}
          {analysis.responsibilities.length > 0 && (
            <div className="bg-card border border-border rounded-xl p-4">
              <h3 className="text-sm font-semibold mb-2">📋 Key Responsibilities</h3>
              <ul className="space-y-1.5">
                {analysis.responsibilities.slice(0, 8).map((r, i) => (
                  <li key={i} className="text-sm flex gap-2">
                    <span className="text-muted-foreground flex-shrink-0">•</span>
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ── Interview Prep ────────────────────────────────────────
function InterviewPrepTool() {
  const [resumes, setResumes] = useState<{ id: string; name: string; data: unknown }[]>([])
  const [selectedResumeId, setSelectedResumeId] = useState('')
  const [jdText, setJdText] = useState('')
  const [questions, setQuestions] = useState<InterviewQuestion[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingResumes, setLoadingResumes] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [isPracticeMode, setIsPracticeMode] = useState(false)

  React.useEffect(() => {
    fetch('/api/resumes/list')
      .then(r => r.json())
      .then(data => {
        setResumes(data.resumes ?? [])
        if (data.resumes?.length > 0) setSelectedResumeId(data.resumes[0].id)
        setLoadingResumes(false)
      })
  }, [])

  async function handleGenerate() {
    const resume = resumes.find(r => r.id === selectedResumeId)
    if (!resume) {
      toast({ title: 'Select a resume', variant: 'warning' })
      return
    }
    setLoading(true)
    const result = await generateInterviewQuestions({
      resumeData: resume.data as any,
      jobDescription: jdText.trim() || undefined,
    })
    setLoading(false)
    if (result.error) {
      toast({ title: 'Generation failed', description: result.error, variant: 'error' })
    } else if (result.questions) {
      setQuestions(result.questions)
    }
  }

  const categories = ['all', 'hr', 'technical', 'resume_based', 'behavioral']
  const filteredQ = selectedCategory === 'all' ? questions : questions.filter(q => q.category === selectedCategory)
  const categoryLabel: Record<string, string> = { all: 'All', hr: 'HR', technical: 'Technical', resume_based: 'Resume-Based', behavioral: 'Behavioral' }

  return (
    <div className="space-y-6 mt-4">
      <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
        {loadingResumes ? (
          <div className="h-10 bg-muted rounded-lg animate-pulse" />
        ) : (
          <div>
            <label className="block text-sm font-medium mb-2">Select Resume</label>
            <select value={selectedResumeId} onChange={e => setSelectedResumeId(e.target.value)} className="w-full h-10 border border-input rounded-lg px-3 bg-background text-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none">
              {resumes.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-2">
            Job Description <span className="text-xs font-normal text-muted-foreground">(optional — enables JD-specific questions)</span>
          </label>
          <textarea
            value={jdText}
            onChange={e => setJdText(e.target.value)}
            placeholder="Paste the job description for more targeted questions…"
            rows={4}
            className="w-full border border-input rounded-lg px-3 py-2.5 text-sm bg-background resize-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none placeholder:text-muted-foreground"
          />
        </div>

        <Button onClick={handleGenerate} loading={loading} icon={<MessageSquare className="h-4 w-4" />}>
          {loading ? 'Generating…' : 'Generate Interview Questions'}
        </Button>

        <p className="text-xs text-muted-foreground">
          Questions are generated based only on your actual resume. AI will not invent skills or experience.
        </p>
      </div>

      {questions.length > 0 && (
        <div className="space-y-4 animate-in">
          {/* Header & Category filter */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border border-border p-4 rounded-xl">
            <div className="flex gap-2 flex-wrap">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${selectedCategory === cat ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:border-primary/40'}`}
                >
                  {categoryLabel[cat]} {cat === 'all' ? `(${questions.length})` : `(${questions.filter(q => q.category === cat).length})`}
                </button>
              ))}
            </div>
            <Button onClick={() => setIsPracticeMode(true)} className="gap-2 shrink-0">
              Start Practice Mode 🎯
            </Button>
          </div>

          {/* Questions */}
          <div className="space-y-3">
            {filteredQ.map(q => (
              <QuestionCard key={q.id} question={q} />
            ))}
          </div>
        </div>
      )}

      {isPracticeMode && (
        <InterviewFlashcards 
          questions={filteredQ} 
          onClose={() => setIsPracticeMode(false)} 
        />
      )}
    </div>
  )
}

function QuestionCard({ question }: { question: InterviewQuestion }) {
  const [showGuidance, setShowGuidance] = useState(false)
  const [showPractice, setShowPractice] = useState(false)
  const [candidateAnswer, setCandidateAnswer] = useState('')
  const [evaluating, setEvaluating] = useState(false)
  const [evaluation, setEvaluation] = useState<{
    score?: number
    feedback?: string
    strengths?: string[]
    improvements?: string[]
  } | null>(null)

  const difficultyColor = {
    easy: 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30',
    medium: 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30',
    hard: 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30',
  }[question.difficulty]

  const categoryColor: Record<string, string> = {
    hr: 'text-blue-600 dark:text-blue-400',
    technical: 'text-purple-600 dark:text-purple-400',
    resume_based: 'text-orange-600 dark:text-orange-400',
    jd_based: 'text-green-600 dark:text-green-400',
    behavioral: 'text-pink-600 dark:text-pink-400',
  }

  async function handleEvaluate() {
    if (candidateAnswer.trim().length < 20) {
      toast({ title: 'Please write a fuller practice response', description: 'At least 20 characters required.', variant: 'warning' })
      return
    }

    setEvaluating(true)
    const res = await evaluateInterviewAnswer({
      question: question.question,
      candidateAnswer: candidateAnswer.trim(),
      guidance: question.guidance,
    })
    setEvaluating(false)

    if (res.error) {
      toast({ title: 'Evaluation failed', description: res.error, variant: 'error' })
    } else {
      setEvaluation(res)
      toast({ title: 'Answer evaluated!', variant: 'success' })
    }
  }

  return (
    <div className="bg-card border border-border rounded-xl p-4 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className={`text-xs font-medium capitalize ${categoryColor[question.category] ?? ''}`}>
              {question.category.replace('_', ' ')}
            </span>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${difficultyColor}`}>
              {question.difficulty}
            </span>
          </div>
          <p className="text-sm font-medium leading-relaxed">{question.question}</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => setShowGuidance(!showGuidance)}
            className="text-xs text-primary hover:underline"
          >
            {showGuidance ? 'Hide Guidance' : 'Guidance'}
          </button>
          <button
            onClick={() => setShowPractice(!showPractice)}
            className="text-xs font-medium px-2.5 py-1 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
          >
            {showPractice ? 'Close Practice' : '✨ Practice Answer'}
          </button>
        </div>
      </div>

      {showGuidance && (
        <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg animate-in">
          <p className="text-xs font-semibold text-primary mb-1">Answer Guidance & Key Points</p>
          <p className="text-xs text-muted-foreground leading-relaxed">{question.guidance}</p>
        </div>
      )}

      {showPractice && (
        <div className="pt-2 border-t border-border space-y-3 animate-in">
          <div>
            <label className="block text-xs font-medium mb-1 text-muted-foreground">Type your practice answer:</label>
            <textarea
              value={candidateAnswer}
              onChange={e => setCandidateAnswer(e.target.value)}
              placeholder="Use the STAR method (Situation, Task, Action, Result) to structure your practice response..."
              rows={3}
              className="w-full border border-input rounded-lg px-3 py-2 text-xs bg-background resize-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            />
          </div>

          <Button
            size="sm"
            onClick={handleEvaluate}
            loading={evaluating}
            disabled={!candidateAnswer.trim()}
            icon={<Sparkles className="h-3.5 w-3.5" />}
          >
            {evaluating ? 'Evaluating…' : 'Grade My Answer'}
          </Button>

          {evaluation && (
            <div className="p-4 border border-border bg-card rounded-xl space-y-3 animate-in">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground">AI Evaluation Results:</span>
                <span className={cn(
                  'text-xs font-bold px-2.5 py-0.5 rounded-full',
                  (evaluation.score ?? 0) >= 80 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                  (evaluation.score ?? 0) >= 60 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                  'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                )}>
                  Score: {evaluation.score}/100
                </span>
              </div>

              {evaluation.feedback && (
                <p className="text-xs text-foreground leading-relaxed">{evaluation.feedback}</p>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs">
                {evaluation.strengths && evaluation.strengths.length > 0 && (
                  <div className="bg-green-50 dark:bg-green-950/20 p-2.5 rounded-lg border border-green-200 dark:border-green-800">
                    <p className="font-semibold text-green-700 dark:text-green-400 mb-1">👍 Strengths</p>
                    <ul className="space-y-1 text-muted-foreground">
                      {evaluation.strengths.map((s, i) => <li key={i}>• {s}</li>)}
                    </ul>
                  </div>
                )}
                {evaluation.improvements && evaluation.improvements.length > 0 && (
                  <div className="bg-amber-50 dark:bg-amber-950/20 p-2.5 rounded-lg border border-amber-200 dark:border-amber-800">
                    <p className="font-semibold text-amber-700 dark:text-amber-400 mb-1">💡 Key Improvements</p>
                    <ul className="space-y-1 text-muted-foreground">
                      {evaluation.improvements.map((imp, i) => <li key={i}>• {imp}</li>)}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ── Cover Letter Generator ──────────────────────────────────
function CoverLetterTool() {
  const [resumes, setResumes] = useState<{ id: string; name: string; data: unknown }[]>([])
  const [selectedResumeId, setSelectedResumeId] = useState('')
  const [jdText, setJdText] = useState('')
  const [coverLetter, setCoverLetter] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingResumes, setLoadingResumes] = useState(true)

  React.useEffect(() => {
    fetch('/api/resumes/list')
      .then(r => r.json())
      .then(data => {
        setResumes(data.resumes ?? [])
        if (data.resumes?.length > 0) setSelectedResumeId(data.resumes[0].id)
        setLoadingResumes(false)
      })
  }, [])

  async function handleGenerate() {
    const resume = resumes.find(r => r.id === selectedResumeId)
    if (!resume) {
      toast({ title: 'Select a resume', variant: 'warning' })
      return
    }
    if (jdText.trim().length < 50) {
      toast({ title: 'Paste a fuller job description', variant: 'warning' })
      return
    }

    setLoading(true)
    const result = await generateCoverLetter({
      resumeData: resume.data as any,
      jobDescription: jdText.trim(),
    })
    setLoading(false)

    if (result.error) {
      toast({ title: 'Generation failed', description: result.error, variant: 'error' })
    } else if (result.coverLetter) {
      setCoverLetter(result.coverLetter)
      toast({ title: 'Cover letter generated!', variant: 'success' })
    }
  }

  function handleCopy() {
    navigator.clipboard.writeText(coverLetter)
    toast({ title: 'Copied to clipboard', variant: 'success' })
  }

  return (
    <div className="space-y-6 mt-4">
      <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
        {loadingResumes ? (
          <div className="h-10 bg-muted rounded-lg animate-pulse" />
        ) : (
          <div>
            <label className="block text-sm font-medium mb-2">Select Target Resume</label>
            <select value={selectedResumeId} onChange={e => setSelectedResumeId(e.target.value)} className="w-full h-10 border border-input rounded-lg px-3 bg-background text-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none">
              {resumes.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-2">
            Target Job Description
          </label>
          <textarea
            value={jdText}
            onChange={e => setJdText(e.target.value)}
            placeholder="Paste the job description here so the AI knows exactly what the company is looking for..."
            rows={5}
            className="w-full border border-input rounded-lg px-3 py-2.5 text-sm bg-background resize-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none placeholder:text-muted-foreground"
          />
        </div>

        <Button onClick={handleGenerate} loading={loading} icon={<PenTool className="h-4 w-4" />}>
          {loading ? 'Writing...' : 'Write Cover Letter'}
        </Button>
      </div>

      {coverLetter && (
        <div className="bg-card border border-border rounded-2xl p-6 animate-in space-y-4 shadow-sm">
          <div className="flex justify-between items-center pb-4 border-b border-border">
            <h3 className="font-semibold text-lg">Your Cover Letter</h3>
            <Button variant="secondary" size="sm" onClick={handleCopy}>Copy to Clipboard</Button>
          </div>
          
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <div className="whitespace-pre-wrap leading-relaxed text-sm">
              {coverLetter}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
