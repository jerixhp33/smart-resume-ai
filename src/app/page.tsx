import Link from 'next/link'
import { ArrowRight, CheckCircle2, Sparkles, ScanSearch, FileText, Briefcase, Zap, Shield } from 'lucide-react'

const FEATURES = [
  {
    icon: Sparkles,
    title: 'AI Resume Builder',
    description: 'AI improves your writing without fabricating experience. Every suggestion is reviewable.',
    iconBg: 'bg-purple-100 dark:bg-purple-900/30',
    iconColor: 'text-purple-600 dark:text-purple-400',
  },
  {
    icon: ScanSearch,
    title: 'ATS Compatibility Score',
    description: 'Deterministic ATS scoring — not guessed by AI. Real breakdown with actionable fixes.',
    iconBg: 'bg-blue-100 dark:bg-blue-900/30',
    iconColor: 'text-blue-600 dark:text-blue-400',
  },
  {
    icon: Zap,
    title: 'Job Tailoring',
    description: 'Paste a job description, get AI-suggested changes. Review and accept each one individually.',
    iconBg: 'bg-yellow-100 dark:bg-yellow-900/30',
    iconColor: 'text-yellow-600 dark:text-yellow-400',
  },
  {
    icon: FileText,
    title: 'High-Quality PDF Export',
    description: 'Chromium-powered PDF with selectable text, working links, and crisp typography.',
    iconBg: 'bg-green-100 dark:bg-green-900/30',
    iconColor: 'text-green-600 dark:text-green-400',
  },
  {
    icon: Briefcase,
    title: 'Application Tracker',
    description: 'Kanban board to track your entire job search — from wishlist to offer.',
    iconBg: 'bg-orange-100 dark:bg-orange-900/30',
    iconColor: 'text-orange-600 dark:text-orange-400',
  },
  {
    icon: Shield,
    title: 'Privacy First',
    description: 'Your data is private by default. Row-level security ensures nobody sees your content.',
    iconBg: 'bg-red-100 dark:bg-red-900/30',
    iconColor: 'text-red-600 dark:text-red-400',
  },
]

const STEPS = [
  { icon: FileText, label: 'Build Resume', desc: 'Enter your real experience' },
  { icon: Sparkles, label: 'AI Improves', desc: 'Polish without fabricating' },
  { icon: ScanSearch, label: 'ATS Score', desc: 'Check compatibility' },
  { icon: Zap, label: 'Tailor to Job', desc: 'Match each application' },
  { icon: Briefcase, label: 'Get Hired', desc: 'Track applications' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="container-app flex items-center justify-between h-14">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="h-4 w-4 text-white" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M9 12h6M9 8h6M9 16h4M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z" />
              </svg>
            </div>
            <span className="font-semibold text-sm">SmartResume AI</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-foreground transition-colors">How it works</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors hidden sm:block">Sign in</Link>
            <Link href="/signup" className="text-sm bg-primary text-primary-foreground px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity">
              Get started free
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-20 pb-16 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
            <Sparkles className="h-3.5 w-3.5" />
            AI-powered resume builder — 3 resumes free, no credit card
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-tight">
            Your resume shouldn&apos;t look<br />
            <span className="text-primary">like everyone else&apos;s.</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Create an ATS-compatible resume, tailor it to any job, and let AI help you
            present your real experience better. Built for students, freshers, and career switchers.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/signup" className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold text-base hover:opacity-90 transition-opacity shadow-lg shadow-primary/25">
              Create My Resume <ArrowRight className="h-5 w-5" />
            </Link>
            <Link href="/analyzer" className="inline-flex items-center justify-center gap-2 bg-card border border-border text-foreground px-6 py-3 rounded-xl font-semibold text-base hover:border-primary/40 transition-colors">
              <ScanSearch className="h-5 w-5" /> Analyze My Resume
            </Link>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-sm text-muted-foreground">
            {['No credit card required', '3 resumes free forever', 'ATS-optimized templates'].map(item => (
              <div key={item} className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Flow */}
      <section className="py-12 px-4" id="how-it-works">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-10">How it works</h2>
          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center flex-wrap">
            {STEPS.map((step, i) => (
              <div key={step.label} className="flex items-center gap-4">
                <div className="flex flex-col items-center gap-2 text-center">
                  <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <step.icon className="h-6 w-6 text-primary" />
                  </div>
                  <p className="text-sm font-semibold">{step.label}</p>
                  <p className="text-xs text-muted-foreground">{step.desc}</p>
                </div>
                {i < STEPS.length - 1 && <ArrowRight className="h-5 w-5 text-muted-foreground/50 hidden sm:block flex-shrink-0" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-muted/30" id="features">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-2">Everything you need to land the job</h2>
          <p className="text-muted-foreground text-center mb-10">Not just a resume builder. A complete job search toolkit.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map(feature => (
              <div key={feature.title} className="bg-card border border-border rounded-2xl p-5 hover:shadow-sm hover:border-primary/20 transition-all">
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center mb-4 ${feature.iconBg}`}>
                  <feature.icon className={`h-5 w-5 ${feature.iconColor}`} />
                </div>
                <h3 className="font-semibold mb-1">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI accuracy */}
      <section className="py-16 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="h-12 w-12 rounded-2xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
            <Shield className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-2xl font-bold mb-3">AI that never makes things up</h2>
          <p className="text-muted-foreground">
            Our AI improves your writing, fixes grammar, and makes your resume ATS-friendly —
            but it <strong>never</strong> invents companies, skills, achievements, or experience.
            Every AI suggestion is reviewable before being applied.
          </p>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 px-4 bg-muted/30" id="pricing">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-2">Simple, transparent pricing</h2>
          <p className="text-muted-foreground mb-10">Start for free. Unlock more when you need it.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-card border border-border rounded-2xl p-6 text-left">
              <p className="text-lg font-bold mb-1">Free</p>
              <p className="text-3xl font-bold">₹0</p>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                {['3 resumes (forever free)', 'All templates', 'AI writing assistance', 'ATS analysis', 'PDF export', 'Application tracker'].map(f => (
                  <li key={f} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <Link href="/signup" className="mt-6 block text-center bg-muted border border-border text-foreground px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-muted/80 transition-colors">
                Get started free
              </Link>
            </div>
            <div className="bg-card border-2 border-primary rounded-2xl p-6 text-left relative overflow-hidden">
              <div className="absolute top-3 right-3 bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5 rounded-full">
                When you need more
              </div>
              <p className="text-lg font-bold mb-1">Resume Unlock</p>
              <p className="text-3xl font-bold">₹99</p>
              <p className="text-xs text-muted-foreground mt-1">per additional resume · one-time</p>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                {['Unlock 1 extra resume slot', 'Permanent — no subscription', 'UPI payment (GPay, PhonePe)', 'Or wait 5 hours for free'].map(f => (
                  <li key={f} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <Link href="/signup" className="mt-6 block text-center bg-primary text-primary-foreground px-4 py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity">
                Start for free
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to beat the ATS?</h2>
        <p className="text-muted-foreground mb-8">Join thousands of job seekers building smarter resumes.</p>
        <Link href="/signup" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3.5 rounded-xl font-semibold text-base hover:opacity-90 transition-opacity shadow-lg shadow-primary/25">
          Create My Resume Free <ArrowRight className="h-5 w-5" />
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4">
        <div className="container-app flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} SmartResume AI. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
