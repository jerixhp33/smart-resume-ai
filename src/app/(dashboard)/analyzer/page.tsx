'use client'

import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { ScanSearch, Loader2, ChevronDown, CheckCircle2, AlertCircle, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { runATSAnalysis } from '@/features/ats/actions'
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

  const atsInfo = result ? formatATSScore(result.overall_score) : null

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight mb-1">ATS Analyzer</h1>
        <p className="text-sm text-muted-foreground">
          Check how well your resume performs with Applicant Tracking Systems.
          Score is calculated deterministically — not guessed by AI.
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
            <span className="ml-2 text-xs font-normal text-muted-foreground">(optional, but improves accuracy)</span>
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

          {/* Tabs: Suggestions, Keywords, Issues */}
          <Tabs defaultValue="suggestions">
            <TabsList>
              <TabsTrigger value="suggestions">Suggestions ({result.suggestions.length})</TabsTrigger>
              <TabsTrigger value="keywords">Keywords</TabsTrigger>
              <TabsTrigger value="issues">Formatting Issues ({result.formatting_issues.length})</TabsTrigger>
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

            <TabsContent value="keywords">
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
                    <div className="flex flex-wrap gap-2">
                      {result.missing_keywords.map(kw => (
                        <span key={kw} className="text-xs px-2.5 py-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 font-medium">{kw}</span>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Add these keywords only if they accurately describe your experience.
                    </p>
                  </div>
                )}
                {result.matched_keywords.length === 0 && result.missing_keywords.length === 0 && (
                  <div className="col-span-2 text-sm text-muted-foreground py-4">
                    Paste a job description to get keyword analysis.
                  </div>
                )}
              </div>
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
