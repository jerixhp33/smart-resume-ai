'use client'

import React from 'react'
import Link from 'next/link'
import { ResunioLogo } from '@/components/brand/ResunioLogo'
import { ArrowLeft, FileText, Scale, CheckCircle2 } from 'lucide-react'

export default function TermsOfServicePage() {
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
            <Scale className="h-3.5 w-3.5" /> Legal Agreement
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-foreground">
            Terms of Service
          </h1>
          <p className="text-sm text-muted-foreground">
            Last updated: <span className="font-semibold text-foreground">{lastUpdated}</span> · Please read carefully before using Resunio AI.
          </p>
        </div>
      </section>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-10 text-sm leading-relaxed text-muted-foreground">
        <div className="bg-card border border-border rounded-2xl p-6 space-y-3 text-foreground shadow-xs">
          <h2 className="text-base font-bold flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary" /> Key Summary of Terms
          </h2>
          <div className="grid sm:grid-cols-2 gap-3 text-xs text-muted-foreground pt-1">
            <div className="flex items-start gap-2 bg-muted/40 p-3 rounded-xl border border-border/50">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>3 Free Resumes:</strong> Every account receives 3 full resume slots free forever without credit card.</span>
            </div>
            <div className="flex items-start gap-2 bg-muted/40 p-3 rounded-xl border border-border/50">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>₹99 One-Time Unlock:</strong> Additional resume slots can be unlocked via instant UPI payment without recurring fees.</span>
            </div>
            <div className="flex items-start gap-2 bg-muted/40 p-3 rounded-xl border border-border/50">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>You Own Your Content:</strong> All resume text, credentials, and uploaded media remain 100% your property.</span>
            </div>
            <div className="flex items-start gap-2 bg-muted/40 p-3 rounded-xl border border-border/50">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>Responsible AI Use:</strong> AI suggestions are intended for editing assistance; users are responsible for factual accuracy.</span>
            </div>
          </div>
        </div>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-foreground">1. Acceptance of Terms</h2>
          <p>
            By accessing or using <strong>Resunio AI</strong> (<code className="font-mono bg-muted px-1.5 py-0.5 rounded">https://resunio.ai</code>), creating an account, or purchasing resume unlock slots, you agree to be bound by these Terms of Service. If you do not agree to all terms, you may not access or use the platform.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-foreground">2. Account Registration & Security</h2>
          <p>
            You must provide accurate information when creating an account. You are solely responsible for maintaining the confidentiality of your login credentials and for all activities conducted under your account.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-foreground">3. Service Description & Free Entitlements</h2>
          <p>
            Resunio provides AI-assisted resume creation, deterministic ATS match scoring, Chromium vector PDF exports, and 3D web portfolio generation:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>Free Tier:</strong> Includes 3 active resume slots, full AI writing assistance, ATS score analysis, vector PDF downloads, and 3D web portfolio links forever free.</li>
            <li><strong>Free Cooldown:</strong> Users who reach their slot limit may wait 5 hours for free cooldown reset or instantly unlock an additional slot for ₹99.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-foreground">4. Payments & Slot Unlocks</h2>
          <p>
            Additional resume slot unlocks are priced at <strong>₹99 per slot</strong>. Payments are processed securely via UPI (Google Pay, PhonePe, Paytm, BHIM, Cred) or integrated payment gateways.
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Payments are <strong>one-time purchases</strong> and do not auto-renew or charge recurring monthly subscriptions.</li>
            <li>Verified payments instantly credit the unlocked resume slot to your account permanently.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-foreground">5. User Content & Intellectual Property</h2>
          <p>
            You retain 100% ownership of all resumes, work history, titles, achievements, and images you upload or create using Resunio. We do not claim any ownership over your content.
          </p>
          <p>
            By publishing a portfolio site, you grant Resunio a non-exclusive license to host and display your portfolio at your designated public URL (<code className="font-mono bg-muted px-1.5 py-0.5 rounded">resunio.ai/portfolio/[username]</code>).
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-foreground">6. Factual Accuracy & AI Disclaimer</h2>
          <p>
            Resunio provides AI tools to improve grammar, metrics clarity, and ATS keyword matching. However, users are strictly responsible for verifying the truthfulness and accuracy of all experience listed on their resumes before submitting to employers. Resunio is not liable for employment decisions made by third-party recruiters.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-foreground">7. Prohibited Conduct</h2>
          <p>You agree not to:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Use the platform for fraudulent, illegal, or deceptive job application practices.</li>
            <li>Attempt to reverse engineer, scrape, or disrupt the platform infrastructure.</li>
            <li>Create abusive automated accounts to bypass entitlement limits.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-foreground">8. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by applicable law, Resunio AI and its operators shall not be liable for any indirect, incidental, special, or consequential damages resulting from your use or inability to use the platform.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-foreground">9. Contact Information</h2>
          <p>For any legal inquiries or support regarding these Terms of Service, please reach out to:</p>
          <div className="bg-card border border-border p-4 rounded-xl space-y-1 text-xs text-foreground font-mono">
            <p className="font-bold font-sans text-sm">Resunio Legal Support</p>
            <p>Email: support@resunio.ai</p>
            <p>Website: https://resunio.ai</p>
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-8 px-4 text-center text-xs text-muted-foreground bg-card/30">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Resunio AI. All rights reserved.</p>
          <div className="flex gap-4 font-semibold">
            <Link href="/" className="hover:text-foreground">Home</Link>
            <Link href="/terms" className="text-primary font-bold">Terms of Service</Link>
            <Link href="/privacy" className="hover:text-foreground">Privacy Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
