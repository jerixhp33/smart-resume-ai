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
    template: '%s | Resunio',
    default: 'Resunio — AI Resume & Portfolio Builder',
  },
  description:
    'Build ATS-compatible resumes, generate interactive AI portfolios, tailor applications to any job, and get hired faster with Resunio.',
  keywords: ['Resunio', 'AI Resume Builder', 'Portfolio Builder', 'ATS checker', 'AI career tools'],
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
  openGraph: {
    type: 'website',
    title: 'Resunio — AI Resume & Portfolio Builder',
    description: 'Build ATS-compatible resumes, generate interactive AI portfolios, and track your job search.',
    siteName: 'Resunio',
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
