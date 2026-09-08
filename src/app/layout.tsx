import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    template: '%s | SmartResume AI',
    default: 'SmartResume AI — Build your resume. Beat the ATS. Get hired.',
  },
  description:
    'Create an ATS-compatible resume, tailor it to any job, and let AI help you present your real experience better.',
  keywords: ['resume builder', 'ATS checker', 'AI resume', 'job application', 'career tools'],
  openGraph: {
    type: 'website',
    title: 'SmartResume AI',
    description: 'Build your resume. Beat the ATS. Get hired.',
    siteName: 'SmartResume AI',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F7F7F5' },
    { media: '(prefers-color-scheme: dark)', color: '#0D0D0F' },
  ],
}

import { Toaster } from '@/components/ui/toast'
import { SmoothScroller } from '@/components/ui/SmoothScroller'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <SmoothScroller>
          {children}
        </SmoothScroller>
        <Toaster />
      </body>
    </html>
  )
}
