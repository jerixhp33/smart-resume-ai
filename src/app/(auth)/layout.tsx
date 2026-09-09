import type { Metadata } from 'next'
import Link from 'next/link'
import { ResunioLogo } from '@/components/brand/ResunioLogo'

export const metadata: Metadata = {
  title: { template: '%s | Resunio', default: 'Resunio — AI Resume & Portfolio Builder' },
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-border/50">
        <Link href="/">
          <ResunioLogo className="h-8 w-8 rounded-lg overflow-hidden border border-border/40" showText textSize="md" />
        </Link>
        <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          Back to home
        </Link>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center p-6">
        {children}
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-muted-foreground border-t border-border/50">
        © {new Date().getFullYear()} Resunio &nbsp;·&nbsp;
        <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
        &nbsp;·&nbsp;
        <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
      </footer>
    </div>
  )
}
