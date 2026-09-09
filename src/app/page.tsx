'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { ResunioLogo } from '@/components/brand/ResunioLogo'
import { 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  ScanSearch, 
  FileText, 
  Briefcase, 
  Zap, 
  Globe, 
  Check, 
  ChevronDown
} from 'lucide-react'

// --- MOCK DATA FOR INTERACTIVE HERO DEMO ---
const SAMPLE_JOBS = [
  {
    title: 'Senior Software Engineer',
    company: 'TechCorp AI',
    score: 98,
    matchColor: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30',
    keywords: ['React', 'TypeScript', 'Next.js', 'System Architecture', 'CI/CD'],
    missing: ['GraphQL'],
  },
  {
    title: 'Product Manager',
    company: 'Innovate Labs',
    score: 94,
    matchColor: 'text-blue-500 bg-blue-500/10 border-blue-500/30',
    keywords: ['Agile', 'Product Strategy', 'Roadmapping', 'User Research', 'KPIs'],
    missing: ['SQL'],
  },
  {
    title: 'Data Analyst',
    company: 'Analytics Co',
    score: 91,
    matchColor: 'text-violet-500 bg-violet-500/10 border-violet-500/30',
    keywords: ['Python', 'SQL', 'Data Visualization', 'Tableau', 'Statistics'],
    missing: ['BigQuery'],
  },
]

const FEATURES = [
  {
    icon: Sparkles,
    title: 'AI Resume Assistant',
    description: 'Polishes your achievements and action verbs without fabricating experience. Every suggestion is reviewable before applying.',
    tag: 'Smart Writing',
    gradient: 'from-purple-500/20 via-indigo-500/20 to-transparent',
    iconColor: 'text-purple-500 dark:text-purple-400',
    borderColor: 'group-hover:border-purple-500/40',
  },
  {
    icon: ScanSearch,
    title: 'Deterministic ATS Match Score',
    description: 'Real ATS parsing engine — not guessed by AI. Instant score breakdown with exact keyword density & format checks.',
    tag: 'ATS Optimization',
    gradient: 'from-blue-500/20 via-cyan-500/20 to-transparent',
    iconColor: 'text-blue-500 dark:text-blue-400',
    borderColor: 'group-hover:border-blue-500/40',
  },
  {
    icon: Globe,
    title: 'Instant Studio Portfolio',
    description: 'Convert your resume into a live 3D web portfolio at resunio.ai/portfolio/[username] with customizable dark themes.',
    tag: 'Personal Website',
    gradient: 'from-emerald-500/20 via-teal-500/20 to-transparent',
    iconColor: 'text-emerald-500 dark:text-emerald-400',
    borderColor: 'group-hover:border-emerald-500/40',
  },
  {
    icon: Zap,
    title: '1-Click Job Tailoring',
    description: 'Paste any job description to instantly tailor your resume bullet points for maximum recruiter relevance.',
    tag: 'Job Matching',
    gradient: 'from-amber-500/20 via-orange-500/20 to-transparent',
    iconColor: 'text-amber-500 dark:text-amber-400',
    borderColor: 'group-hover:border-amber-500/40',
  },
  {
    icon: FileText,
    title: 'Chromium Vector PDF Export',
    description: 'Generates pixel-perfect PDFs with selectable text, clickable hyperlinks, clean typography, and zero unwanted page breaks.',
    tag: 'Crisp Export',
    gradient: 'from-rose-500/20 via-pink-500/20 to-transparent',
    iconColor: 'text-rose-500 dark:text-rose-400',
    borderColor: 'group-hover:border-rose-500/40',
  },
  {
    icon: Briefcase,
    title: 'Kanban Application Tracker',
    description: 'Track your entire job search workflow in one unified dashboard — from wishlist and interviews to offers.',
    tag: 'Workflow Control',
    gradient: 'from-violet-500/20 via-indigo-500/20 to-transparent',
    iconColor: 'text-violet-500 dark:text-violet-400',
    borderColor: 'group-hover:border-violet-500/40',
  },
]

const STEPS = [
  {
    step: '01',
    icon: FileText,
    title: 'Build or Import',
    desc: 'Upload an existing PDF resume or fill in your details with our guided editor.',
  },
  {
    step: '02',
    icon: Sparkles,
    title: 'AI Enhancement',
    desc: 'Enhance bullet points with high-impact metrics and action verbs in 1 click.',
  },
  {
    step: '03',
    icon: ScanSearch,
    title: 'ATS Match Check',
    desc: 'Analyze compatibility against your target job title & fix missing keywords.',
  },
  {
    step: '04',
    icon: Globe,
    title: 'Export & Share',
    desc: 'Download crisp vector PDF & share your live Resunio 3D web portfolio.',
  },
]

const FAQS = [
  {
    q: 'How does Resunio guarantee ATS compatibility?',
    a: 'Resunio uses standard, recruiter-approved layout structures and text-layer PDF encoding that parsing engines like Workday, Taleo, and Greenhouse process with 100% accuracy. No complex tables or hidden text tricks.',
  },
  {
    q: 'Does the AI invent or fabricate experience on my resume?',
    a: 'Never. Our AI assistant strictly refines and polishes your genuine input (improving grammar, metric clarity, and action verbs). You review and accept every single suggestion.',
  },
  {
    q: 'Can I create a live personal portfolio website from my resume?',
    a: 'Yes! Resunio automatically transforms your resume into an interactive 3D web portfolio complete with custom handle (resunio.ai/portfolio/username), dark matte theme, and downloadable 4K share cards.',
  },
  {
    q: 'Is there a free plan?',
    a: 'Yes! You get 3 complete resume slots forever free, full AI assistance, ATS scoring, PDF exports, and application tracking with zero credit card required.',
  },
]

export default function LandingPage() {
  const [selectedJobIndex, setSelectedJobIndex] = useState(0)
  const [heroTab, setHeroTab] = useState<'resume' | 'ats' | 'portfolio'>('ats')
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  const activeJob = SAMPLE_JOBS[selectedJobIndex]

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-primary overflow-x-hidden">
      
      {/* Ambient Radial Background Glows */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-[20%] left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-tr from-primary/15 via-purple-600/10 to-cyan-500/10 blur-[130px] rounded-full opacity-70" />
        <div className="absolute top-[40%] -left-[10%] w-[600px] h-[600px] bg-indigo-600/10 blur-[150px] rounded-full" />
        <div className="absolute top-[70%] -right-[10%] w-[600px] h-[600px] bg-purple-600/10 blur-[150px] rounded-full" />
      </div>

      {/* --- GLASS NAVIGATION HEADER --- */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/70 backdrop-blur-xl transition-all shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2 group">
            <ResunioLogo size="md" variant="horizontal" showText={true} />
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <a href="#features" className="hover:text-primary transition-colors py-1">Features</a>
            <a href="#demo" className="hover:text-primary transition-colors py-1">ATS Demo</a>
            <a href="#how-it-works" className="hover:text-primary transition-colors py-1">How it works</a>
            <a href="#pricing" className="hover:text-primary transition-colors py-1">Pricing</a>
            <a href="#faq" className="hover:text-primary transition-colors py-1">FAQ</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link 
              href="/login" 
              className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded-lg"
            >
              Sign in
            </Link>
            <Link 
              href="/signup" 
              className="text-sm bg-gradient-to-r from-primary via-indigo-600 to-violet-600 text-white font-bold px-4 py-2.5 rounded-xl shadow-md shadow-primary/25 hover:shadow-lg hover:shadow-primary/35 hover:scale-[1.02] transition-all flex items-center gap-1.5"
            >
              Get started free <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* --- HERO SECTION --- */}
      <section className="relative pt-16 pb-20 px-4 sm:px-6 text-center z-10" id="demo">
        <div className="max-w-5xl mx-auto space-y-8">
          
          {/* Animated Announcement Pill */}
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/15 via-purple-500/15 to-indigo-500/15 border border-primary/25 text-primary text-xs font-bold px-4 py-2 rounded-full shadow-xs backdrop-blur-md">
            <Sparkles className="h-4 w-4 animate-spin text-primary" style={{ animationDuration: '3s' }} />
            <span>AI-Powered Career Suite — 3 Resumes Free Forever</span>
            <span className="bg-primary text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase">No Credit Card</span>
          </div>

          {/* High-Impact Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] text-foreground max-w-4xl mx-auto">
            Your resume shouldn&apos;t look <br className="hidden sm:inline" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 filter drop-shadow-sm">
              like everyone else&apos;s.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto font-normal leading-relaxed">
            Build ATS-optimized resumes, tailor content to any job description with real-time scoring, and publish interactive 3D web portfolios in seconds.
          </p>

          {/* Call to Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-2">
            <Link 
              href="/signup" 
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-primary via-indigo-600 to-violet-600 text-white font-black text-base px-8 py-4 rounded-2xl shadow-xl shadow-primary/30 hover:scale-[1.02] hover:shadow-2xl transition-all group"
            >
              Create My Free Resume 
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link 
              href="/analyzer" 
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-card/80 backdrop-blur-xl border border-border/80 text-foreground font-bold text-base px-7 py-4 rounded-2xl shadow-sm hover:border-primary/50 hover:bg-muted/50 transition-all"
            >
              <ScanSearch className="h-5 w-5 text-primary" /> Test ATS Score Free
            </Link>
          </div>

          {/* Trust Highlights */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs font-semibold text-muted-foreground">
            <div className="flex items-center gap-1.5 bg-card/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-border/50">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span>No Credit Card Required</span>
            </div>
            <div className="flex items-center gap-1.5 bg-card/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-border/50">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span>3 Resumes Free Forever</span>
            </div>
            <div className="flex items-center gap-1.5 bg-card/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-border/50">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span>98.4% ATS Compatibility Rate</span>
            </div>
          </div>
        </div>

        {/* --- INTERACTIVE 3D/GLASS MOCKUP SHOWCASE --- */}
        <div className="max-w-6xl mx-auto mt-14 z-20 relative">
          <div className="rounded-3xl p-3 bg-gradient-to-b from-white/20 via-white/10 to-transparent dark:from-white/10 dark:to-transparent border border-white/20 backdrop-blur-2xl shadow-2xl">
            
            {/* Mockup Top Header Controls */}
            <div className="bg-slate-950 rounded-2xl p-4 sm:p-6 text-white text-left space-y-6 overflow-hidden border border-slate-800/80 shadow-2xl relative">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                  </div>
                  <span className="text-xs font-mono text-slate-400 bg-slate-900 px-3 py-1 rounded-md border border-slate-800">
                    resunio.ai/app/studio
                  </span>
                </div>

                {/* Tab Controls inside Mockup */}
                <div className="flex bg-slate-900 rounded-xl p-1 border border-slate-800 gap-1 text-xs">
                  <button
                    type="button"
                    onClick={() => setHeroTab('ats')}
                    className={`px-3 py-1.5 font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                      heroTab === 'ats' 
                        ? 'bg-primary text-white shadow-md' 
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <ScanSearch className="h-3.5 w-3.5" /> ATS Analyzer
                  </button>
                  <button
                    type="button"
                    onClick={() => setHeroTab('resume')}
                    className={`px-3 py-1.5 font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                      heroTab === 'resume' 
                        ? 'bg-primary text-white shadow-md' 
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <FileText className="h-3.5 w-3.5" /> Resume Studio
                  </button>
                  <button
                    type="button"
                    onClick={() => setHeroTab('portfolio')}
                    className={`px-3 py-1.5 font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                      heroTab === 'portfolio' 
                        ? 'bg-primary text-white shadow-md' 
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Globe className="h-3.5 w-3.5" /> 3D Web Portfolio
                  </button>
                </div>
              </div>

              {/* Mockup Tab Content */}
              {heroTab === 'ats' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                  <div className="lg:col-span-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs uppercase font-bold tracking-widest text-slate-400">Target Role Match</span>
                      <span className="text-xs font-mono text-emerald-400">Deterministic Engine v2.4</span>
                    </div>

                    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-base font-bold text-white">{activeJob.title}</h4>
                          <p className="text-xs text-slate-400">{activeJob.company}</p>
                        </div>
                        <span className={`text-2xl font-black px-3 py-1 rounded-xl border ${activeJob.matchColor}`}>
                          {activeJob.score}%
                        </span>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-xs text-slate-400 font-medium">
                          <span>Keyword Alignment</span>
                          <span className="text-white font-bold">{activeJob.score}%</span>
                        </div>
                        <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden p-0.5">
                          <div 
                            className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full transition-all duration-500"
                            style={{ width: `${activeJob.score}%` }}
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5 pt-2">
                        <p className="text-xs font-semibold text-slate-300">Matched ATS Keywords:</p>
                        <div className="flex flex-wrap gap-1.5">
                          {activeJob.keywords.map(kw => (
                            <span key={kw} className="text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-md flex items-center gap-1">
                              <Check className="h-3 w-3" /> {kw}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 font-mono text-xs">
                    <div className="flex items-center justify-between text-slate-400 pb-2 border-b border-slate-800">
                      <span className="font-bold text-white flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-purple-400" /> AI Resume Suggestion Accepted
                      </span>
                      <span className="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded text-[10px] font-bold">1-Click Applied</span>
                    </div>

                    <div className="space-y-2">
                      <p className="text-slate-400 text-[11px]">Before (Basic Bullet):</p>
                      <p className="p-2.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/20 line-through">
                        &quot;Worked on building front-end components and fixed bugs for the web application.&quot;
                      </p>

                      <p className="text-slate-300 text-[11px] pt-1">After (AI Enhanced + ATS Matched):</p>
                      <p className="p-2.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 font-medium">
                        &quot;Architected 15+ responsive React & Next.js micro-frontends, accelerating page load speeds by 42% and eliminating 99.8% of user-reported UI bottlenecks.&quot;
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {heroTab === 'resume' && (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                  <div className="flex justify-between items-center pb-4 border-b border-slate-800">
                    <div>
                      <h3 className="text-lg font-black text-white">Alex Morgan</h3>
                      <p className="text-xs text-primary font-semibold">Senior Software Engineer & AI Specialist</p>
                    </div>
                    <span className="bg-primary/20 text-primary border border-primary/30 px-3 py-1 rounded-lg text-xs font-bold">
                      Chromium PDF Ready
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300">
                    <div className="space-y-2 bg-slate-950 p-4 rounded-xl border border-slate-800">
                      <p className="font-bold text-white uppercase tracking-wider text-[11px]">Core Skills</p>
                      <p className="leading-relaxed text-slate-400">TypeScript, React, Next.js, Node.js, Python, PostgreSQL, System Design, Tailored ATS Optimization</p>
                    </div>
                    <div className="space-y-2 bg-slate-950 p-4 rounded-xl border border-slate-800">
                      <p className="font-bold text-white uppercase tracking-wider text-[11px]">Key Experience</p>
                      <p className="leading-relaxed text-slate-400">Engineered high-scale web platforms serving 500k+ active users with 99.99% uptime and zero breaking changes.</p>
                    </div>
                  </div>
                </div>
              )}

              {heroTab === 'portfolio' && (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center space-y-4">
                  <div className="inline-flex items-center gap-2 bg-purple-500/10 text-purple-400 border border-purple-500/20 px-3 py-1 rounded-full text-xs font-bold">
                    <Globe className="h-3.5 w-3.5" /> Published at resunio.ai/portfolio/alexmorgan
                  </div>
                  <h3 className="text-xl font-black text-white">3D Interactive Web Portfolio</h3>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">
                    Automatically syncs with your resume content to create an executive online showcase with dark matte styling and instant QR sharing.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* --- STATS COUNTER BANNER --- */}
      <section className="py-12 border-y border-border/50 bg-muted/20 relative z-10">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="space-y-1">
            <p className="text-3xl sm:text-4xl font-black tracking-tight text-primary">150,000+</p>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Resumes Created</p>
          </div>
          <div className="space-y-1">
            <p className="text-3xl sm:text-4xl font-black tracking-tight text-emerald-500">98.4%</p>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">ATS Pass Rate</p>
          </div>
          <div className="space-y-1">
            <p className="text-3xl sm:text-4xl font-black tracking-tight text-purple-500">4.9 / 5.0</p>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">User Satisfaction</p>
          </div>
          <div className="space-y-1">
            <p className="text-3xl sm:text-4xl font-black tracking-tight text-amber-500">&lt; 60 Sec</p>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Creation Speed</p>
          </div>
        </div>
      </section>

      {/* --- FEATURES GRID SECTION --- */}
      <section className="py-24 px-4 sm:px-6 relative z-10" id="features">
        <div className="max-w-6xl mx-auto space-y-14">
          
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-extrabold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
              Superpowers for Your Career
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
              Everything you need to outshine the competition
            </h2>
            <p className="text-muted-foreground text-base">
              Not just another plain form editor. Resunio is an end-to-end career acceleration system.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f) => (
              <div 
                key={f.title}
                className={`group relative bg-card/60 backdrop-blur-xl border border-border/80 rounded-3xl p-6 hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between ${f.borderColor}`}
              >
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${f.gradient} rounded-bl-full pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity`} />

                <div className="space-y-4 relative z-10">
                  <div className="flex items-center justify-between">
                    <div className="h-12 w-12 rounded-2xl bg-muted/60 border border-border/60 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <f.icon className={`h-6 w-6 ${f.iconColor}`} />
                    </div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground bg-muted px-2.5 py-1 rounded-md border border-border/40">
                      {f.tag}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                    {f.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {f.description}
                  </p>
                </div>

                <div className="pt-6 relative z-10 flex items-center gap-1.5 text-xs font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Learn more</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- HOW IT WORKS (STEP FLOW) --- */}
      <section className="py-20 px-4 bg-muted/30 border-y border-border/50 relative z-10" id="how-it-works">
        <div className="max-w-5xl mx-auto space-y-12">
          
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-black tracking-tight">How Resunio Works</h2>
            <p className="text-muted-foreground text-sm max-w-md mx-auto">
              Four simple steps from your current draft to an ATS-matched resume and live portfolio.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map((s) => (
              <div key={s.title} className="bg-card border border-border/70 rounded-2xl p-6 relative space-y-4 hover:border-primary/30 transition-all shadow-xs">
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-black text-primary/30 font-mono">{s.step}</span>
                  <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <s.icon className="h-5 w-5" />
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-bold text-foreground">{s.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- PRICING SECTION --- */}
      <section className="py-24 px-4 sm:px-6 relative z-10" id="pricing">
        <div className="max-w-4xl mx-auto space-y-12 text-center">
          
          <div className="space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
              Transparent Pricing
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">Start free. Unlock only when needed.</h2>
            <p className="text-muted-foreground text-base max-w-lg mx-auto">
              No hidden subscriptions. No credit card traps. Full access to ATS features from day one.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left max-w-3xl mx-auto">
            
            {/* Free Tier */}
            <div className="bg-card border border-border/80 rounded-3xl p-8 space-y-6 relative hover:border-border transition-all shadow-sm">
              <div className="space-y-1">
                <h3 className="text-xl font-bold">Free Forever</h3>
                <p className="text-xs text-muted-foreground">Perfect for students and active job seekers.</p>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black">₹0</span>
                <span className="text-xs text-muted-foreground">/ free forever</span>
              </div>

              <ul className="space-y-3 text-sm text-muted-foreground pt-2">
                {[
                  '3 full resume slots',
                  '1-click AI bullet enhancement',
                  'Deterministic ATS score breakdown',
                  'Live 3D web portfolio link',
                  'High-res vector PDF exports',
                  'Kanban application tracker',
                ].map(item => (
                  <li key={item} className="flex items-center gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <Link 
                href="/signup" 
                className="block text-center w-full bg-muted hover:bg-muted/80 text-foreground font-bold py-3 rounded-xl transition-colors border border-border"
              >
                Get Started Free
              </Link>
            </div>

            {/* Paid Unlock Tier */}
            <div className="bg-card border-2 border-primary rounded-3xl p-8 space-y-6 relative shadow-xl shadow-primary/10">
              <div className="absolute -top-3.5 right-6 bg-gradient-to-r from-primary to-indigo-600 text-white text-[11px] font-black uppercase tracking-wider px-3.5 py-1 rounded-full shadow-md">
                One-Time Payment
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-bold">Extra Resume Slot</h3>
                <p className="text-xs text-muted-foreground">Instant unlock via UPI (GPay, PhonePe, Paytm).</p>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-foreground">₹99</span>
                <span className="text-xs text-muted-foreground">/ per extra slot</span>
              </div>

              <ul className="space-y-3 text-sm text-muted-foreground pt-2">
                {[
                  'Unlock 1 additional resume slot',
                  'Permanent access — zero monthly subscription',
                  'Instant UPI payment activation',
                  'Unlimited PDF downloads & ATS re-checks',
                  'Custom domain handle claim priority',
                ].map(item => (
                  <li key={item} className="flex items-center gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                    <span className="text-foreground font-medium">{item}</span>
                  </li>
                ))}
              </ul>

              <Link 
                href="/signup" 
                className="block text-center w-full bg-gradient-to-r from-primary via-indigo-600 to-violet-600 text-white font-bold py-3 rounded-xl shadow-md hover:scale-[1.01] transition-all"
              >
                Start Free & Unlock Anytime
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* --- FAQ SECTION --- */}
      <section className="py-20 px-4 bg-muted/20 border-t border-border/50 relative z-10" id="faq">
        <div className="max-w-3xl mx-auto space-y-10">
          
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-black tracking-tight">Frequently Asked Questions</h2>
            <p className="text-sm text-muted-foreground">Everything you need to know about Resunio.</p>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, idx) => (
              <div 
                key={faq.q} 
                className="bg-card border border-border/70 rounded-2xl overflow-hidden shadow-xs transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full text-left p-5 font-bold text-base flex justify-between items-center gap-4 hover:text-primary transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`h-5 w-5 shrink-0 transition-transform ${openFaq === idx ? 'rotate-180 text-primary' : 'text-muted-foreground'}`} />
                </button>

                {openFaq === idx && (
                  <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed border-t border-border/40 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- HIGH CONVERTING BOTTOM CTA --- */}
      <section className="py-24 px-4 sm:px-6 relative z-10 overflow-hidden">
        <div className="max-w-5xl mx-auto bg-slate-950 rounded-3xl p-10 sm:p-16 text-center text-white space-y-8 relative border border-slate-800 shadow-2xl overflow-hidden">
          
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/30 blur-[100px] rounded-full pointer-events-none" />

          <div className="space-y-4 relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Ready to land your dream job offer?
            </h2>
            <p className="text-slate-300 text-base">
              Join thousands of job seekers building ATS-optimized resumes and live 3D web portfolios.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center relative z-10 pt-2">
            <Link 
              href="/signup" 
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-primary via-indigo-600 to-violet-600 text-white font-black text-base px-9 py-4 rounded-2xl shadow-xl hover:scale-[1.02] transition-all"
            >
              Create My Free Resume <ArrowRight className="h-5 w-5" />
            </Link>
            <Link 
              href="/login" 
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-900 border border-slate-700 text-white font-bold text-base px-8 py-4 rounded-2xl hover:bg-slate-800 transition-colors"
            >
              Sign In to Account
            </Link>
          </div>
        </div>
      </section>

      {/* --- EXECUTIVE FOOTER --- */}
      <footer className="border-t border-border py-12 px-4 sm:px-6 bg-card/40 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-muted-foreground">
          
          <div className="flex items-center gap-3">
            <ResunioLogo size="sm" variant="horizontal" showText={true} />
            <span className="text-xs">© {new Date().getFullYear()} Resunio AI. All rights reserved.</span>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs font-semibold">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-foreground transition-colors">How It Works</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
            <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
          </div>
        </div>
      </footer>

    </div>
  )
}

