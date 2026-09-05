'use client'

import React, { useState, useEffect } from 'react'
import { FlaskConical, Loader2, Trophy, Percent } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/toast'
import { calculateATSScore } from '@/features/ai/actions'
import { cn } from '@/utils/cn'
import type { ResumeData } from '@/types'

interface ResumeOption {
  id: string
  name: string
  data: ResumeData
}

interface ScoreResult {
  score: number
  matchedKeywords: string[]
  missingKeywords: string[]
  feedback: string
}

export default function ABTestPage() {
  const [resumes, setResumes] = useState<ResumeOption[]>([])
  const [resumeA, setResumeA] = useState('')
  const [resumeB, setResumeB] = useState('')
  const [jdText, setJdText] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingResumes, setLoadingResumes] = useState(true)
  const [resultA, setResultA] = useState<ScoreResult | null>(null)
  const [resultB, setResultB] = useState<ScoreResult | null>(null)

  useEffect(() => {
    fetch('/api/resumes/list')
      .then(r => r.json())
      .then(data => {
        const list = data.resumes ?? []
        setResumes(list)
        if (list.length >= 2) {
          setResumeA(list[0].id)
          setResumeB(list[1].id)
        } else if (list.length === 1) {
          setResumeA(list[0].id)
          setResumeB(list[0].id)
        }
        setLoadingResumes(false)
      })
  }, [])

  async function handleCompare() {
    const rA = resumes.find(r => r.id === resumeA)
    const rB = resumes.find(r => r.id === resumeB)
    if (!rA || !rB) {
      toast({ title: 'Select two resumes', variant: 'warning' })
      return
    }
    if (jdText.trim().length < 50) {
      toast({ title: 'Paste a fuller job description', description: 'Need at least 50 characters.', variant: 'warning' })
      return
    }

    setLoading(true)
    setResultA(null)
    setResultB(null)

    const [resA, resB] = await Promise.all([
      calculateATSScore({ resumeData: rA.data, jobDescription: jdText.trim() }),
      calculateATSScore({ resumeData: rB.data, jobDescription: jdText.trim() }),
    ])

    setLoading(false)

    if (resA.error || resB.error) {
      toast({ title: 'Comparison failed', description: resA.error || resB.error, variant: 'error' })
      return
    }

    setResultA({
      score: resA.score!,
      matchedKeywords: resA.matchedKeywords ?? [],
      missingKeywords: resA.missingKeywords ?? [],
      feedback: resA.feedback ?? '',
    })
    setResultB({
      score: resB.score!,
      matchedKeywords: resB.matchedKeywords ?? [],
      missingKeywords: resB.missingKeywords ?? [],
      feedback: resB.feedback ?? '',
    })

    toast({ title: 'Comparison complete!', variant: 'success' })
  }

  const nameA = resumes.find(r => r.id === resumeA)?.name ?? 'Resume A'
  const nameB = resumes.find(r => r.id === resumeB)?.name ?? 'Resume B'
  const winner = resultA && resultB ? (resultA.score > resultB.score ? 'A' : resultB.score > resultA.score ? 'B' : 'TIE') : null

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <FlaskConical className="h-6 w-6 text-primary" />
          Resume A/B Testing
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Compare two resumes against the same Job Description. Find out which version scores higher.
        </p>
      </div>

      {/* Setup */}
      <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
        {loadingResumes ? (
          <div className="h-10 bg-muted rounded-lg animate-pulse" />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Resume A</label>
              <select value={resumeA} onChange={e => setResumeA(e.target.value)} className="w-full h-10 border border-input rounded-lg px-3 bg-background text-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none">
                {resumes.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Resume B</label>
              <select value={resumeB} onChange={e => setResumeB(e.target.value)} className="w-full h-10 border border-input rounded-lg px-3 bg-background text-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none">
                {resumes.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
              </select>
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-2">Job Description</label>
          <textarea
            value={jdText}
            onChange={e => setJdText(e.target.value)}
            placeholder="Paste the job description to compare both resumes against..."
            rows={5}
            className="w-full border border-input rounded-lg px-3 py-2.5 text-sm bg-background resize-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none placeholder:text-muted-foreground"
          />
          <p className="text-xs text-muted-foreground mt-1">{jdText.length} characters</p>
        </div>

        <Button onClick={handleCompare} loading={loading} icon={<FlaskConical className="h-4 w-4" />}>
          {loading ? 'Scoring both resumes…' : 'Compare Resumes'}
        </Button>
      </div>

      {/* Results */}
      {resultA && resultB && (
        <div className="space-y-5 animate-in">
          {/* Winner Banner */}
          {winner && winner !== 'TIE' && (
            <div className="bg-gradient-to-r from-yellow-500/10 via-amber-500/10 to-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 flex items-center gap-3">
              <Trophy className="h-6 w-6 text-yellow-500 flex-shrink-0" />
              <div>
                <p className="text-sm font-bold text-yellow-700 dark:text-yellow-400">
                  🏆 Winner: {winner === 'A' ? nameA : nameB}
                </p>
                <p className="text-xs text-muted-foreground">
                  Scored {Math.abs(resultA.score - resultB.score)} points higher for this job description.
                </p>
              </div>
            </div>
          )}
          {winner === 'TIE' && (
            <div className="bg-muted/50 border border-border rounded-xl p-4 text-center">
              <p className="text-sm font-bold">🤝 It's a Tie! Both resumes scored equally.</p>
            </div>
          )}

          {/* Side by Side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ScoreCard
              label={nameA}
              result={resultA}
              isWinner={winner === 'A'}
              side="A"
            />
            <ScoreCard
              label={nameB}
              result={resultB}
              isWinner={winner === 'B'}
              side="B"
            />
          </div>

          {/* Unique missing keywords diff */}
          <div className="bg-card border border-border rounded-xl p-4">
            <h3 className="text-sm font-semibold mb-3">🔍 Key Differences</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <p className="font-medium text-muted-foreground mb-1.5">Keywords only {nameA} has:</p>
                <div className="flex flex-wrap gap-1.5">
                  {resultA.matchedKeywords.filter(k => !resultB.matchedKeywords.includes(k)).map(k => (
                    <span key={k} className="px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 font-medium">{k}</span>
                  ))}
                  {resultA.matchedKeywords.filter(k => !resultB.matchedKeywords.includes(k)).length === 0 && (
                    <span className="text-muted-foreground">None</span>
                  )}
                </div>
              </div>
              <div>
                <p className="font-medium text-muted-foreground mb-1.5">Keywords only {nameB} has:</p>
                <div className="flex flex-wrap gap-1.5">
                  {resultB.matchedKeywords.filter(k => !resultA.matchedKeywords.includes(k)).map(k => (
                    <span key={k} className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-medium">{k}</span>
                  ))}
                  {resultB.matchedKeywords.filter(k => !resultA.matchedKeywords.includes(k)).length === 0 && (
                    <span className="text-muted-foreground">None</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function ScoreCard({ label, result, isWinner, side }: { label: string; result: ScoreResult; isWinner: boolean; side: 'A' | 'B' }) {
  const scoreColor = result.score >= 80 ? 'text-green-500' : result.score >= 60 ? 'text-yellow-500' : 'text-red-500'
  const borderColor = result.score >= 80 ? 'border-green-500' : result.score >= 60 ? 'border-yellow-500' : 'border-red-500'

  return (
    <div className={cn(
      'bg-card border rounded-xl p-5 space-y-4 transition-all',
      isWinner ? 'border-yellow-500/50 ring-2 ring-yellow-500/20' : 'border-border'
    )}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-muted">{side}</span>
          <h3 className="text-sm font-semibold truncate">{label}</h3>
        </div>
        {isWinner && <Trophy className="h-4 w-4 text-yellow-500" />}
      </div>

      {/* Score */}
      <div className="flex justify-center">
        <div className={cn('w-24 h-24 rounded-full border-[6px] flex items-center justify-center', borderColor)}>
          <span className={cn('text-3xl font-extrabold', scoreColor)}>{result.score}</span>
        </div>
      </div>

      {/* Feedback */}
      <p className="text-xs text-muted-foreground leading-relaxed">{result.feedback}</p>

      {/* Keywords */}
      {result.matchedKeywords.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-green-600 dark:text-green-400 mb-1.5">✅ Matched ({result.matchedKeywords.length})</p>
          <div className="flex flex-wrap gap-1">
            {result.matchedKeywords.map(k => (
              <span key={k} className="text-[10px] px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 font-medium">{k}</span>
            ))}
          </div>
        </div>
      )}
      {result.missingKeywords.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-red-600 dark:text-red-400 mb-1.5">❌ Missing ({result.missingKeywords.length})</p>
          <div className="flex flex-wrap gap-1">
            {result.missingKeywords.map(k => (
              <span key={k} className="text-[10px] px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 font-medium">{k}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
