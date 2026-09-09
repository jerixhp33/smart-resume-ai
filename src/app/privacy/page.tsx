'use client'

import React from 'react'
import Link from 'next/link'
import { ResunioLogo } from '@/components/brand/ResunioLogo'
import { ArrowLeft, Shield, Lock, CheckCircle2 } from 'lucide-react'

export default function PrivacyPolicyPage() {
  const lastUpdated = 'September 9, 2026'

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-primary">
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto flex items-center justify-between h-16 px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2">
            <ResunioLogo size="md" variant="horizontal" showText={true} />
          </Link>

          <Link href="/" className="text-xs font-semibold text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Link>
        </div>
      </header>

      <section className="py-12 border-b border-border/50 bg-muted/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-4">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full border border-primary/20">
            <Shield className="h-3.5 w-3.5" /> Official Policy Document
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-foreground">
            Privacy Policy
          </h1>
          <p className="text-sm text-muted-foreground">
            Last updated: <span className="font-semibold text-foreground">{lastUpdated}</span> · Effective immediately for all Resunio users.
          </p>
        </div>
      </section>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-10 text-sm leading-relaxed text-muted-foreground">
        <div className="bg-card border border-border rounded-2xl p-6 space-y-3 text-foreground shadow-xs">
          <h2 className="text-base font-bold flex items-center gap-2">
            <Lock className="h-4 w-4 text-emerald-500" /> Executive Summary & Privacy Guarantees
          </h2>
          <div className="grid sm:grid-cols-2 gap-3 text-xs text-muted-foreground pt-1">
            <div className="flex items-start gap-2 bg-muted/40 p-3 rounded-xl border border-border/50">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>Zero AI Fabrication:</strong> Our AI assists grammar and action verbs, but never invents fake job experience.</span>
            </div>
            <div className="flex items-start gap-2 bg-muted/40 p-3 rounded-xl border border-border/50">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>Strict Isolation:</strong> Your personal information and resumes are isolated via encrypted database security.</span>
            </div>
            <div className="flex items-start gap-2 bg-muted/40 p-3 rounded-xl border border-border/50">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>No Ads / Selling Data:</strong> We never sell, rent, or trade your personal resume data to third-party advertisers.</span>
            </div>
            <div className="flex items-start gap-2 bg-muted/40 p-3 rounded-xl border border-border/50">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>Full Data Ownership:</strong> You can export or request complete deletion of your account and resumes anytime.</span>
            </div>
          </div>
        </div>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-foreground">1. Information We Collect</h2>
          <p>
            When you register and use <strong>Resunio</strong>, we collect information necessary to provide our AI Resume Builder, ATS Analyzer, and 3D Web Portfolio services:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-muted-foreground">
            <li><strong>Account Information:</strong> Full name, email address, password hash, and profile details provided during signup or Google OAuth authentication.</li>
            <li><strong>Resume Content:</strong> Employment history, education, skills, contact details, project milestones, and custom sections created in the Studio Editor or imported via PDF.</li>
            <li><strong>Usage & Analytics Data:</strong> Anonymous analytics such as page visits, feature interactions, browser type, and device information to optimize platform performance.</li>
            <li><strong>Payment Transaction Metadata:</strong> Payment confirmation status, order IDs, and UPI transaction reference numbers processed via secure payment providers. <em>We do not store your credit card numbers or UPI PINs.</em></li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-foreground">2. How We Use Your Information</h2>
          <p>We process your personal information strictly for the following operational purposes:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Generating ATS-friendly vector PDF exports and formatting interactive web resumes.</li>
            <li>Processing AI-driven bullet point enhancements and job description tailoring requests.</li>
            <li>Publishing your optional live 3D web portfolio at your claimed custom URL (<code className="font-mono bg-muted px-1.5 py-0.5 rounded">resunio.ai/portfolio/[username]</code>).</li>
            <li>Processing UPI payment transactions and managing resume creation slot entitlements.</li>
            <li>Sending essential service notifications such as password reset links, security alerts, and payment receipts.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-foreground">3. AI Processing & Privacy Safety</h2>
          <p>
            Resunio utilizes state-of-the-art Large Language Models (LLMs) to provide automated resume proofreading, grammar corrections, and ATS keyword matching.
          </p>
          <p>
            We strictly enforce that your resume data is <strong>never used to train public LLM models</strong> without permission. Every AI suggestion generated in our editor requires your explicit review before being saved to your resume document.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-foreground">4. Data Security & Storage</h2>
          <p>
            We implement industry-standard administrative, physical, and technical safeguards to protect your personal information:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>All database connections are encrypted using 256-bit SSL/TLS protocol in transit and at rest.</li>
            <li>Strict row-level security protocols ensure that your resumes are only accessible by your authenticated user session.</li>
            <li>Passwords are hashed using secure one-way encryption functions and are never viewable by Resunio staff.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-foreground">5. Sharing & Third-Party Services</h2>
          <p>
            We do not sell or monetize your personal information. We only share necessary data with trusted service providers who adhere to strict data protection standards:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>Cloud & Database Hosting:</strong> Supabase Cloud Infrastructure (secure server hosting).</li>
            <li><strong>Payment Gateways:</strong> Cashfree / NPCI UPI Gateway (for processing ₹99 resume slot unlocks).</li>
            <li><strong>AI Infrastructure APIs:</strong> OpenRouter / OpenAI / Anthropic (for processing ephemeral text completion requests).</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-foreground">6. Public Portfolios & Share Cards</h2>
          <p>
            If you choose to publish a live 3D web portfolio or export a 4K share card, the information you select for public display will be accessible via your unique public URL (<code className="font-mono bg-muted px-1.5 py-0.5 rounded">resunio.ai/portfolio/[username]</code>). You may unpublish or set your portfolio to private at any time from your Portfolio Studio dashboard.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-foreground">7. Your Rights & Account Deletion</h2>
          <p>
            You have the right to access, update, export, or permanently delete your account and associated resumes at any time. You can trigger account deletion from your <strong>Settings &gt; Profile &gt; Danger Zone</strong> or by contacting our support team at <a href="mailto:privacy@resunio.ai" className="text-primary font-medium hover:underline">privacy@resunio.ai</a>.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-foreground">8. Contact Us</h2>
          <p>
            If you have any questions or privacy concerns regarding this Privacy Policy, please contact our Data Protection Officer:
          </p>
          <div className="bg-card border border-border p-4 rounded-xl space-y-1 text-xs text-foreground font-mono">
            <p className="font-bold font-sans text-sm">Resunio Data Privacy Team</p>
            <p>Email: privacy@resunio.ai</p>
            <p>Website: https://resunio.ai</p>
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-8 px-4 text-center text-xs text-muted-foreground bg-card/30">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Resunio AI. All rights reserved.</p>
          <div className="flex gap-4 font-semibold">
            <Link href="/" className="hover:text-foreground">Home</Link>
            <Link href="/terms" className="hover:text-foreground">Terms of Service</Link>
            <Link href="/privacy" className="text-primary font-bold">Privacy Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
