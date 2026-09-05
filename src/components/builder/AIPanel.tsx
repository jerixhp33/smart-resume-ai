'use client'

import React, { useState } from 'react'
import { Sparkles, ScanSearch, Loader2, ChevronDown, ChevronUp } from 'lucide-react'
import { useResumeStore } from '@/features/resume/store'
import { runATSAnalysis } from '@/features/ats/actions'
import { analyzeJobDescription, tailorResumeToJob } from '@/features/ai/actions'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { formatATSScore } from '@/utils/format'
import { toast } from '@/components/ui/toast'
import { cn } from '@/utils/cn'

interface AIPanelProps {
  resumeId: string
}

export function AIPanel({ resumeId }: AIPanelProps) {
  const { data, updateData, atsResult, atsLoading, setATSResult, setATSLoading } = useResumeStore()
  const [expanded, setExpanded] = useState(true)
  const [jdText, setJdText] = useState('')
  const [showJDInput, setShowJDInput] = useState(false)
  const [showTailorModal, setShowTailorModal] = useState(false)
  const [tailorJDText, setTailorJDText] = useState('')
  const [tailoring, setTailoring] = useState(false)

  async function runTailor() {
    if (tailorJDText.trim().length < 50) {
      toast({ title: 'Paste a fuller job description', variant: 'warning' })
      return
    }
    setTailoring(true)
    
    // 1. Analyze JD
    const analysisRes = await analyzeJobDescription(tailorJDText)
    if (analysisRes.error || !analysisRes.analysis) {
      setTailoring(false)
      toast({ title: 'Failed to analyze JD', description: analysisRes.error, variant: 'error' })
      return
    }

    // 2. Tailor Resume
    const tailorRes = await tailorResumeToJob({
      resumeData: data,
      jobDescription: tailorJDText,
      jobAnalysis: analysisRes.analysis
    })

    setTailoring(false)

    if (tailorRes.error || !tailorRes.tailoredData) {
      toast({ title: 'Tailoring failed', description: tailorRes.error, variant: 'error' })
      return
    }

    // Preserve IDs for lists to prevent rendering bugs
    const tailored = tailorRes.tailoredData
    const preserveIds = (originalList: any[], newList: any[]) => {
      if (!originalList || !newList) return newList
      return newList.map((item, idx) => ({ ...item, id: originalList[idx]?.id || item.id || crypto.randomUUID() }))
    }

    // Update store
    updateData(prev => ({
      ...prev,
      summary: tailored.summary ?? prev.summary,
      skills: tailored.skills ?? prev.skills,
      experience: tailored.experience ? preserveIds(prev.experience, tailored.experience) : prev.experience,
      projects: tailored.projects ? preserveIds(prev.projects, tailored.projects) : prev.projects,
      education: tailored.education ? preserveIds(prev.education, tailored.education) : prev.education,
    }))

    setShowTailorModal(false)
    toast({ 
      title: 'Resume Tailored! ✨', 
      description: `Matched ${tailorRes.matchedKeywords?.length || 0} keywords and optimized your bullets.`,
      variant: 'success'
    })
  }

  async function runAnalysis() {
    setATSLoading(true)
    const result = await runATSAnalysis({
      resumeId,
      resumeData: data,
      jobDescription: jdText || undefined,
    })
    setATSLoading(false)

    if (result.error) {
      toast({ title: 'Analysis failed', description: result.error, variant: 'error' })
    } else if (result.result) {
      setATSResult(result.result)
    }
  }

  const atsInfo = atsResult ? formatATSScore(atsResult.overall_score) : null

  return (
    <div className="p-3 space-y-3">
      {/* ATS Analysis */}
      <div className="border border-border rounded-xl overflow-hidden">
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center gap-2 px-3 py-2.5 text-left hover:bg-muted/50 transition-colors"
        >
          <ScanSearch className="h-4 w-4 text-primary flex-shrink-0" />
          <span className="text-sm font-semibold flex-1">ATS Score</span>
          {atsResult && (
            <span className={cn('text-sm font-bold', atsInfo?.color)}>{atsResult.overall_score}/100</span>
          )}
          {expanded ? <ChevronUp className="h-3.5 w-3.5 text-muted-foreground" /> : <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />}
        </button>

        {expanded && (
          <div className="px-3 pb-3 space-y-3">
            {atsResult ? (
              <>
                {/* Score breakdown */}
                <div className="space-y-2">
                  {[
                    { label: 'Keywords', score: atsResult.keyword_score },
                    { label: 'Skills', score: atsResult.skills_score },
                    { label: 'Experience', score: atsResult.experience_score },
                    { label: 'Formatting', score: atsResult.formatting_score },
                  ].map(({ label, score }) => (
                    <div key={label}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-muted-foreground">{label}</span>
                        <span className={cn('font-medium', formatATSScore(score).color)}>{score}</span>
                      </div>
                      <Progress
                        value={score}
                        className="h-1.5"
                        indicatorClassName={score >= 80 ? 'bg-green-500' : score >= 60 ? 'bg-yellow-500' : 'bg-red-500'}
                      />
                    </div>
                  ))}
                </div>

                {/* Top suggestions */}
                {atsResult.suggestions.length > 0 && (
                  <div className="space-y-1.5">
                    <p className="text-xs font-semibold text-muted-foreground">Top Suggestions</p>
                    {atsResult.suggestions.slice(0, 3).map((s, i) => (
                      <div key={i} className={cn(
                        'text-xs p-2 rounded-lg',
                        s.priority === 'high' ? 'bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400' :
                        s.priority === 'medium' ? 'bg-yellow-50 dark:bg-yellow-950/20 text-yellow-700 dark:text-yellow-400' :
                        'bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400'
                      )}>
                        {s.action}
                      </div>
                    ))}
                  </div>
                )}

                <Button size="sm" variant="outline" className="w-full text-xs" onClick={runAnalysis} disabled={atsLoading}>
                  {atsLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Re-analyze'}
                </Button>
              </>
            ) : (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">
                  Check how well your resume matches ATS systems.
                </p>
                {showJDInput ? (
                  <div className="space-y-2">
                    <textarea
                      value={jdText}
                      onChange={e => setJdText(e.target.value)}
                      placeholder="Paste job description for targeted analysis…"
                      className="w-full h-20 text-xs border border-input rounded-lg px-2.5 py-2 bg-background resize-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                    />
                    <Button size="sm" className="w-full text-xs" onClick={runAnalysis} disabled={atsLoading}>
                      {atsLoading ? <><Loader2 className="h-3 w-3 animate-spin" /> Analyzing…</> : <><ScanSearch className="h-3 w-3" /> Analyze</>}
                    </Button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1 text-xs" onClick={() => setShowJDInput(true)}>
                      With Job Description
                    </Button>
                    <Button size="sm" className="flex-1 text-xs" onClick={runAnalysis} disabled={atsLoading}>
                      {atsLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <><ScanSearch className="h-3 w-3" /> Analyze</>}
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* AI quick actions */}
      <div className="border border-border rounded-xl p-3 space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <p className="text-sm font-semibold">AI Assistant</p>
        </div>
        
        <Button size="sm" className="w-full gap-2 text-xs" onClick={() => setShowTailorModal(true)}>
          <ScanSearch className="h-3.5 w-3.5" />
          Auto-Tailor to Job
        </Button>

        <p className="text-xs text-muted-foreground leading-relaxed">
          Select any text field in the editor and click ✨ to improve it, or use Auto-Tailor to rewrite your entire resume for a specific job.
        </p>
      </div>

      {/* Tailor Modal */}
      <Dialog open={showTailorModal} onOpenChange={setShowTailorModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Auto-Tailor Resume
            </DialogTitle>
            <DialogDescription>
              Paste a job description below. AI will intelligently rewrite your summary and bullet points to emphasize relevant experience and match keywords.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <textarea
              value={tailorJDText}
              onChange={e => setTailorJDText(e.target.value)}
              placeholder="Paste the target job description here..."
              rows={8}
              className="w-full border border-input rounded-lg px-3 py-2 text-sm bg-background resize-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none placeholder:text-muted-foreground"
            />
            <Button className="w-full" onClick={runTailor} disabled={tailoring}>
              {tailoring ? (
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Analyzing & Rewriting...</>
              ) : (
                'Tailor My Resume'
              )}
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              AI will never invent skills or experience you don't have.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
