'use client'

import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { ScanSearch, Loader2, CheckCircle2, AlertCircle, Info, Sparkles, Copy, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { runATSAnalysis, autofillKeywordAction, generateCoverLetterAction } from '@/features/ats/actions'
import { toast } from '@/components/ui/toast'
import { formatATSScore } from '@/utils/format'
import type { ATSScanResult } from '@/types'
import { cn } from '@/utils/cn'

export default function AnalyzerPage() {
  const searchParams = useSearchParams()
  const resumeId = searchParams.get('resumeId')

  const [resumes, setResumes] = useState<{ id: string; name: string; data: unknown }[]>([])
  const [selectedResumeId, setSelectedResumeId] = useState(resumeId ?? '')
  const [jobDescription, setJobDescription] = useState('')
  const [result, setResult] = useState<ATSScanResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [loadingResumes, setLoadingResumes] = useState(true)

  // AI Autofill & Cover Letter states
  const [autofillKeyword, setAutofillKeyword] = useState<string | null>(null)
  const [autofillBullet, setAutofillBullet] = useState<string | null>(null)
  const [autofillLoading, setAutofillLoading] = useState(false)

  const [coverLetter, setCoverLetter] = useState<string | null>(null)
  const [coverLetterLoading, setCoverLetterLoading] = useState(false)

  useEffect(() => {
    fetch('/api/resumes/list')
      .then(r => r.json())
      .then(data => {
        setResumes(data.resumes ?? [])
        if (resumeId) setSelectedResumeId(resumeId)
        else if (data.resumes?.length > 0) setSelectedResumeId(data.resumes[0].id)
        setLoadingResumes(false)
      })
  }, [resumeId])

  async function handleAnalyze() {
    if (!selectedResumeId) {
      toast({ title: 'Select a resume first', variant: 'warning' })
      return
    }
    const resume = resumes.find(r => r.id === selectedResumeId)
    if (!resume) return

    setLoading(true)
    setResult(null)
    setCoverLetter(null)

    const res = await runATSAnalysis({
      resumeId: selectedResumeId,
      resumeData: resume.data as any,
      jobDescription: jobDescription.trim() || undefined,
    })
    setLoading(false)

    if (res.error) {
      toast({ title: 'Analysis failed', description: res.error, variant: 'error' })
    } else if (res.result) {
      setResult(res.result)
    }
  }

  async function handleAutofill(keyword: string) {
    if (!selectedResumeId) return
    setAutofillKeyword(keyword)
    setAutofillLoading(true)
    setAutofillBullet(null)

    const res = await autofillKeywordAction({
      resumeId: selectedResumeId,
      keyword,
      jobDescription: jobDescription.trim() || undefined,
    })
    setAutofillLoading(false)

    if (res.error) {
      toast({ title: 'Autofill failed', description: res.error, variant: 'error' })
    } else if (res.suggestedBullet) {
      setAutofillBullet(res.suggestedBullet)
    }
  }

  async function handleGenerateCoverLetter() {
    if (!selectedResumeId || !jobDescription.trim()) {
      toast({ title: 'Job description required', description: 'Please paste a job description first.', variant: 'warning' })
      return
    }
    setCoverLetterLoading(true)
    const res = await generateCoverLetterAction({
      resumeId: selectedResumeId,
      jobDescription: jobDescription.trim(),
    })
    setCoverLetterLoading(false)

    if (res.error) {
      toast({ title: 'Generation failed', description: res.error, variant: 'error' })
    } else if (res.coverLetter) {
      setCoverLetter(res.coverLetter)
      toast({ title: 'Cover letter generated!', variant: 'success' })
    }
  }

  function copyToClipboard(text: string, label: string) {
    navigator.clipboard.writeText(text)
    toast({ title: `${label} copied to clipboard!`, variant: 'success' })
  }

  const atsInfo = result ? formatATSScore(result.overall_score) : null

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight mb-1">ATS Analyzer & Job Matcher</h1>
        <p className="text-sm text-muted-foreground">
          Check how well your resume performs with Applicant Tracking Systems, get AI keyword bullet suggestions, and generate tailored cover letters.
        </p>
      </div>

      {/* Setup */}
      <div className="bg-card border border-border rounded-2xl p-6 space-y-5">
        {/* Resume selector */}
        <div>
          <label className="block text-sm font-medium mb-2">Select Resume</label>
          {loadingResumes ? (
            <div className="h-10 bg-muted rounded-lg animate-pulse" />
          ) : (
            <select
              value={selectedResumeId}
              onChange={e => setSelectedResumeId(e.target.value)}
              className="w-full h-10 border border-input rounded-lg px-3 bg-background text-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              <option value="">— Select a resume —</option>
              {resumes.map(r => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>
          )}
        </div>

        {/* Job description */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Job Description
            <span className="ml-2 text-xs font-normal text-muted-foreground">(recommended for keyword matching & cover letter generation)</span>
          </label>
          <textarea
            value={jobDescription}
            onChange={e => setJobDescription(e.target.value)}
            placeholder="Paste the full job description here for targeted keyword matching…"
            rows={6}
            className="w-full border border-input rounded-lg px-3 py-2.5 text-sm bg-background resize-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none placeholder:text-muted-foreground"
          />
          {jobDescription.length > 0 && (
            <p className="text-xs text-muted-foreground mt-1">{jobDescription.length} characters</p>
          )}
        </div>

        <Button onClick={handleAnalyze} loading={loading} className="w-full sm:w-auto" icon={<ScanSearch className="h-4 w-4" />}>
          {loading ? 'Analyzing…' : 'Run ATS Analysis'}
        </Button>

        <p className="text-xs text-muted-foreground">
          ℹ️ This is an "ATS Compatibility Score" based on common ATS criteria. It does not represent any specific employer's proprietary ATS system.
        </p>
      </div>

      {/* Results */}
      {loading && (
        <div className="flex flex-col items-center gap-4 py-12">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <div className="text-center">
            <p className="font-medium">Analyzing your resume…</p>
            <p className="text-sm text-muted-foreground mt-1">Checking keywords, formatting, and ATS compatibility</p>
          </div>
        </div>
      )}

      {result && (
        <div className="space-y-6 animate-in">
          {/* Overall score */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-6">
              <div className="flex items-center gap-4">
                <div className={cn('relative h-20 w-20 flex-shrink-0')}>
                  <svg viewBox="0 0 100 100" className="h-20 w-20 -rotate-90">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="hsl(var(--muted))" strokeWidth="10" />
                    <circle
                      cx="50" cy="50" r="40" fill="none"
                      stroke={result.overall_score >= 80 ? '#22C55E' : result.overall_score >= 60 ? '#F59E0B' : '#EF4444'}
                      strokeWidth="10"
                      strokeDasharray={`${2 * Math.PI * 40 * result.overall_score / 100} ${2 * Math.PI * 40}`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center rotate-0">
                    <span className={cn('text-xl font-bold', atsInfo?.color)}>{result.overall_score}</span>
                  </div>
                </div>
                <div>
                  <p className="text-2xl font-bold">ATS Compatibility Score</p>
                  <p className={cn('text-lg font-semibold', atsInfo?.color)}>{atsInfo?.label}</p>
                </div>
              </div>

              <div className="flex-1 grid grid-cols-2 gap-3">
                {[
                  { label: 'Keywords', score: result.keyword_score },
                  { label: 'Skills', score: result.skills_score },
                  { label: 'Experience', score: result.experience_score },
                  { label: 'Formatting', score: result.formatting_score },
                ].map(({ label, score }) => {
                  const info = formatATSScore(score)
                  return (
                    <div key={label} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">{label}</span>
                        <span className={cn('font-semibold', info.color)}>{score}</span>
                      </div>
                      <Progress
                        value={score}
                        className="h-1.5"
                        indicatorClassName={score >= 80 ? 'bg-green-500' : score >= 60 ? 'bg-yellow-500' : 'bg-red-500'}
                      />
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Tabs: Suggestions, Keywords, Issues, Cover Letter */}
          <Tabs defaultValue="suggestions">
            <TabsList>
              <TabsTrigger value="suggestions">Suggestions ({result.suggestions.length})</TabsTrigger>
              <TabsTrigger value="keywords">Keywords</TabsTrigger>
              <TabsTrigger value="issues">Formatting Issues ({result.formatting_issues.length})</TabsTrigger>
              <TabsTrigger value="coverletter">Tailored Cover Letter</TabsTrigger>
              {result.ai_explanation && <TabsTrigger value="explanation">AI Insight</TabsTrigger>}
            </TabsList>

            <TabsContent value="suggestions" className="space-y-3">
              {result.suggestions.length === 0 ? (
                <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-xl text-sm text-green-700 dark:text-green-400">
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
                  Great job! No major issues found.
                </div>
              ) : result.suggestions.map((s, i) => (
                <div key={i} className={cn(
                  'p-4 rounded-xl border text-sm',
                  s.priority === 'high' ? 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800' :
                  s.priority === 'medium' ? 'bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800' :
                  'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800'
                )}>
                  <div className="flex items-start gap-2">
                    <AlertCircle className={cn('h-4 w-4 flex-shrink-0 mt-0.5',
                      s.priority === 'high' ? 'text-red-500' : s.priority === 'medium' ? 'text-yellow-500' : 'text-blue-500'
                    )} />
                    <div>
                      <p className="font-medium">{s.message}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{s.action}</p>
                    </div>
                    <Badge
                      variant={s.priority === 'high' ? 'destructive' : 'secondary'}
                      className="ml-auto flex-shrink-0"
                    >
                      {s.priority}
                    </Badge>
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="keywords" className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {result.matched_keywords.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-green-600 dark:text-green-400 mb-2 flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4" /> Matched ({result.matched_keywords.length})
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {result.matched_keywords.map(kw => (
                        <span key={kw} className="text-xs px-2.5 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 font-medium">{kw}</span>
                      ))}
                    </div>
                  </div>
                )}

                {result.missing_keywords.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-red-600 dark:text-red-400 mb-2 flex items-center gap-1.5">
                      <AlertCircle className="h-4 w-4" /> Missing ({result.missing_keywords.length})
                    </h3>
                    <p className="text-xs text-muted-foreground mb-3">Click any keyword to generate a tailored bullet point for your resume:</p>
                    <div className="flex flex-wrap gap-2">
                      {result.missing_keywords.map(kw => (
                        <button
                          key={kw}
                          onClick={() => handleAutofill(kw)}
                          className={cn(
                            'text-xs px-2.5 py-1 rounded-full border flex items-center gap-1 transition-all hover:scale-105',
                            autofillKeyword === kw
                              ? 'bg-primary text-primary-foreground border-primary font-medium'
                              : 'bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800 hover:bg-red-100'
                          )}
                        >
                          <Sparkles className="h-3 w-3" />
                          {kw}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Keyword autofill result preview */}
              {autofillLoading && (
                <div className="p-4 border border-primary/20 bg-primary/5 rounded-xl flex items-center gap-3">
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  <p className="text-sm font-medium">Generating bullet point incorporating "{autofillKeyword}"…</p>
                </div>
              )}

              {autofillBullet && autofillKeyword && !autofillLoading && (
                <div className="p-5 border border-primary/30 bg-card rounded-xl space-y-3 animate-in">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-primary flex items-center gap-1.5">
                      <Sparkles className="h-4 w-4" /> Suggested Bullet for "{autofillKeyword}"
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(autofillBullet, 'Bullet point')}
                      icon={<Copy className="h-3.5 w-3.5" />}
                    >
                      Copy Bullet
                    </Button>
                  </div>
                  <p className="text-sm bg-muted/50 p-3 rounded-lg border border-border/50 text-foreground font-mono">
                    • {autofillBullet}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Copy and paste this bullet point into your resume's Work Experience or Skills section to improve your ATS match score.
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="issues" className="space-y-3">
              {result.formatting_issues.length === 0 ? (
                <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-xl text-sm text-green-700 dark:text-green-400">
                  <CheckCircle2 className="h-5 w-5" />
                  No major formatting issues found.
                </div>
              ) : result.formatting_issues.map((issue, i) => (
                <div key={i} className="flex gap-3 p-4 border border-border rounded-xl text-sm">
                  <Info className={cn('h-4 w-4 flex-shrink-0 mt-0.5',
                    issue.severity === 'high' ? 'text-red-500' : issue.severity === 'medium' ? 'text-yellow-500' : 'text-blue-500'
                  )} />
                  <div>
                    <p className="font-medium">{issue.message}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{issue.fix}</p>
                  </div>
                  <Badge variant={issue.severity === 'high' ? 'destructive' : 'secondary'} className="ml-auto flex-shrink-0">
                    {issue.severity}
                  </Badge>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="coverletter" className="space-y-4">
              <div className="bg-card border border-border rounded-xl p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-semibold flex items-center gap-2">
                      <FileText className="h-4 w-4 text-primary" /> Tailored Cover Letter Generator
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Generate a custom 3-paragraph cover letter combining your resume experience with the target job description.
                    </p>
                  </div>
                  <Button
                    onClick={handleGenerateCoverLetter}
                    loading={coverLetterLoading}
                    disabled={!jobDescription.trim()}
                    icon={<Sparkles className="h-4 w-4" />}
                  >
                    {coverLetter ? 'Regenerate Cover Letter' : 'Generate Cover Letter'}
                  </Button>
                </div>

                {!jobDescription.trim() && (
                  <p className="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 p-3 rounded-lg border border-amber-200 dark:border-amber-800">
                    ⚠️ Please paste a Job Description in the box above to generate a tailored cover letter.
                  </p>
                )}

                {coverLetter && (
                  <div className="space-y-3 pt-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-semibold text-muted-foreground">Generated Cover Letter:</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(coverLetter, 'Cover letter')}
                        icon={<Copy className="h-3.5 w-3.5" />}
                      >
                        Copy Cover Letter
                      </Button>
                    </div>
                    <div className="bg-background border border-border p-5 rounded-xl text-sm whitespace-pre-line leading-relaxed text-foreground font-sans">
                      {coverLetter}
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            {result.ai_explanation && (
              <TabsContent value="explanation">
                <div className="bg-primary/5 border border-primary/20 rounded-xl p-5">
                  <p className="text-sm font-semibold text-primary mb-2">✨ AI Insight</p>
                  <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">{result.ai_explanation}</p>
                </div>
              </TabsContent>
            )}
          </Tabs>
        </div>
      )}
    </div>
  )
}

