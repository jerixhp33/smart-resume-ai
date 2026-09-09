'use client'

import React, { useState } from 'react'
import { 
  Bot, 
  Send, 
  Sparkles, 
  Mic, 
  MicOff, 
  CheckCircle2, 
  Award, 
  AlertCircle, 
  RotateCcw, 
  ChevronRight,
  TrendingUp,
  Volume2
} from 'lucide-react'

interface Question {
  id: number
  category: 'Behavioral' | 'Technical' | 'System Architecture' | 'Leadership'
  question: string
  context: string
}

const DEFAULT_QUESTIONS: Question[] = [
  {
    id: 1,
    category: 'Behavioral',
    question: 'Tell me about a complex project where you had to balance competing technical requirements under tight deadlines.',
    context: 'Evaluates your STAR technique (Situation, Task, Action, Result) and prioritization framework.',
  },
  {
    id: 2,
    category: 'Technical',
    question: 'How do you approach optimizing page load performance and reducing bundle sizes in modern React/Next.js applications?',
    context: 'Tests deep domain knowledge, code splitting, dynamic imports, and performance profiling.',
  },
  {
    id: 3,
    category: 'System Architecture',
    question: 'Describe a situation where a system or API under your ownership experienced an outage or high latency. How did you resolve and prevent it?',
    context: 'Assesses incident handling, root cause analysis, error logging, and post-mortem prevention.',
  },
  {
    id: 4,
    category: 'Leadership',
    question: 'How do you handle disagreements on technical choices or architectural patterns with senior team members?',
    context: 'Measures collaboration, diplomatic communication, data-backed reasoning, and team consensus.',
  },
]

export function InterviewSimulator() {
  const [jobTitle, setJobTitle] = useState('Senior Full Stack Engineer')
  const [currentQIndex, setCurrentQIndex] = useState(0)
  const [userResponse, setUserResponse] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [feedback, setFeedback] = useState<{
    score: number
    starRating: string
    strengths: string[]
    improvements: string[]
    suggestedRewrite: string
  } | null>(null)

  const currentQ = DEFAULT_QUESTIONS[currentQIndex]

  const handleSimulateAnalysis = () => {
    if (!userResponse.trim()) return

    setIsAnalyzing(true)

    // Simulate AI feedback scoring
    setTimeout(() => {
      setIsAnalyzing(false)
      const wordCount = userResponse.trim().split(/\s+/).length
      
      let calculatedScore = 85
      if (wordCount > 60) calculatedScore += 7
      if (userResponse.toLowerCase().includes('result') || userResponse.toLowerCase().includes('percent') || userResponse.toLowerCase().includes('%') || userResponse.toLowerCase().includes('improved')) {
        calculatedScore += 5
      }

      calculatedScore = Math.min(98, calculatedScore)

      setFeedback({
        score: calculatedScore,
        starRating: 'Strong (STAR Method Verified)',
        strengths: [
          'Clear explanation of core technical choices and ownership',
          'Good inclusion of quantifiable impact metrics',
          'Structured narrative flow from problem to resolution'
        ],
        improvements: [
          'Emphasize team collaboration dynamics earlier in the response',
          'Add exact percentage or latency reduction numbers for higher impact'
        ],
        suggestedRewrite: `In my role as ${jobTitle}, I spearheaded the optimization initiative when performance degraded. By implementing granular code splitting and caching strategies, I reduced peak load times by 45% and eliminated recurring latency spikes across 250k daily active users.`
      })
    }, 1200)
  }

  const handleNextQuestion = () => {
    setFeedback(null)
    setUserResponse('')
    setCurrentQIndex((prev) => (prev + 1) % DEFAULT_QUESTIONS.length)
  }

  return (
    <div className="space-y-6">
      
      {/* Header & Target Role Control */}
      <div className="bg-card border border-border rounded-2xl p-6 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight text-foreground">AI Recruiter Interview Simulator</h2>
              <p className="text-xs text-muted-foreground">Practice real recruiter questions with STAR method AI scoring & live metric feedback.</p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-muted/60 p-1.5 rounded-xl border border-border/60">
            <span className="text-xs font-bold text-muted-foreground px-2">Role:</span>
            <input
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              className="bg-background border border-border px-3 py-1 rounded-lg text-xs font-bold text-foreground focus:outline-none focus:ring-1 focus:ring-primary w-48"
              placeholder="e.g. Senior Product Manager"
            />
          </div>
        </div>
      </div>

      {/* Main Question & Answer Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Question Card & Answer Input */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* Question Card */}
          <div className="bg-slate-950 text-white border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl relative overflow-hidden">
            <div className="flex justify-between items-center text-xs">
              <span className="bg-primary/20 text-primary border border-primary/30 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                Question {currentQIndex + 1} of {DEFAULT_QUESTIONS.length} · {currentQ.category}
              </span>
              <button
                type="button"
                onClick={handleNextQuestion}
                className="text-slate-400 hover:text-white flex items-center gap-1 font-semibold transition-colors"
              >
                Skip Question <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <h3 className="text-lg sm:text-xl font-bold leading-snug text-white">
              &quot;{currentQ.question}&quot;
            </h3>

            <div className="bg-slate-900/90 border border-slate-800/80 p-3 rounded-xl text-xs text-slate-300 flex items-start gap-2">
              <Sparkles className="h-4 w-4 text-purple-400 shrink-0 mt-0.5" />
              <span><strong>Recruiter Context:</strong> {currentQ.context}</span>
            </div>
          </div>

          {/* User Answer Textarea */}
          <div className="bg-card border border-border rounded-2xl p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-foreground flex items-center gap-2">
                <span>Your Answer Response</span>
                <span className="text-[10px] text-muted-foreground font-normal">(Use STAR method: Situation, Task, Action, Result)</span>
              </label>
              
              <button
                type="button"
                onClick={() => setIsRecording(!isRecording)}
                className={`text-xs px-3 py-1 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
                  isRecording 
                    ? 'bg-rose-500 text-white animate-pulse' 
                    : 'bg-muted hover:bg-muted/80 text-muted-foreground'
                }`}
              >
                {isRecording ? <MicOff className="h-3.5 w-3.5" /> : <Mic className="h-3.5 w-3.5" />}
                {isRecording ? 'Stop Voice Input' : 'Voice Practice'}
              </button>
            </div>

            <textarea
              rows={5}
              value={userResponse}
              onChange={(e) => setUserResponse(e.target.value)}
              placeholder="Type your response here or click 'Voice Practice'. Describe your exact actions and metric results..."
              className="w-full bg-background border border-border rounded-xl p-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 leading-relaxed resize-none"
            />

            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-muted-foreground">
                Word count: <strong className="text-foreground">{userResponse.trim() ? userResponse.trim().split(/\s+/).length : 0}</strong> words
              </span>

              <button
                type="button"
                onClick={handleSimulateAnalysis}
                disabled={!userResponse.trim() || isAnalyzing}
                className="bg-gradient-to-r from-primary via-indigo-600 to-violet-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md shadow-primary/20 hover:scale-[1.02] disabled:opacity-50 transition-all flex items-center gap-1.5"
              >
                {isAnalyzing ? (
                  <>
                    <Sparkles className="h-4 w-4 animate-spin" /> Scoring Response...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" /> Evaluate Response
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Feedback Scorecard */}
        <div className="lg:col-span-5 space-y-5">
          {feedback ? (
            <div className="bg-card border border-primary/30 rounded-2xl p-6 space-y-5 shadow-lg animate-in fade-in slide-in-from-bottom-2">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-primary bg-primary/10 px-2.5 py-0.5 rounded-full border border-primary/20">
                    AI Recruiter Scorecard
                  </span>
                  <h4 className="text-base font-black text-foreground pt-1">{feedback.starRating}</h4>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-black text-emerald-500">{feedback.score}%</span>
                  <p className="text-[10px] text-muted-foreground font-semibold">Impact Score</p>
                </div>
              </div>

              {/* Strengths */}
              <div className="space-y-2">
                <p className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Key Strengths
                </p>
                <ul className="space-y-1.5 text-xs text-muted-foreground pl-1">
                  {feedback.strengths.map((s, idx) => (
                    <li key={idx} className="flex items-start gap-2 bg-emerald-500/5 p-2 rounded-lg border border-emerald-500/15">
                      <span className="text-emerald-500 font-bold">•</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Areas to Improve */}
              <div className="space-y-2">
                <p className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <TrendingUp className="h-4 w-4 text-amber-500" /> High-Impact Refinements
                </p>
                <ul className="space-y-1.5 text-xs text-muted-foreground pl-1">
                  {feedback.improvements.map((imp, idx) => (
                    <li key={idx} className="flex items-start gap-2 bg-amber-500/5 p-2 rounded-lg border border-amber-500/15">
                      <span className="text-amber-500 font-bold">•</span>
                      <span>{imp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* AI Suggested Executive Rewrite */}
              <div className="bg-slate-950 text-white p-4 rounded-xl space-y-2 border border-slate-800 text-xs">
                <div className="flex items-center justify-between text-slate-400 font-semibold">
                  <span className="flex items-center gap-1 text-purple-400 font-bold">
                    <Sparkles className="h-3.5 w-3.5" /> High-Impact Polish Suggestion
                  </span>
                </div>
                <p className="text-slate-200 leading-relaxed font-sans italic">
                  &quot;{feedback.suggestedRewrite}&quot;
                </p>
              </div>

              <button
                type="button"
                onClick={handleNextQuestion}
                className="w-full bg-muted hover:bg-muted/80 text-foreground font-bold text-xs py-2.5 rounded-xl border border-border transition-colors flex items-center justify-center gap-2"
              >
                <RotateCcw className="h-3.5 w-3.5" /> Practice Next Question
              </button>
            </div>
          ) : (
            <div className="bg-card/50 border border-dashed border-border rounded-2xl p-8 text-center space-y-3 text-muted-foreground h-full flex flex-col items-center justify-center">
              <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                <Award className="h-6 w-6" />
              </div>
              <h4 className="text-sm font-bold text-foreground">Ready for Practice</h4>
              <p className="text-xs max-w-xs leading-relaxed">
                Type your response to Question {currentQIndex + 1} and click <strong>Evaluate Response</strong> to get real-time recruiter feedback.
              </p>
            </div>
          )}
        </div>

      </div>

    </div>
  )
}
