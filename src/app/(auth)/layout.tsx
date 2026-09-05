import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: { template: '%s | SmartResume AI', default: 'SmartResume AI' },
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-border/50">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="h-4 w-4 text-white" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M9 12h6M9 8h6M9 16h4M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z" />
            </svg>
          </div>
          <span className="font-semibold text-sm">SmartResume AI</span>
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
        © {new Date().getFullYear()} SmartResume AI &nbsp;·&nbsp;
        <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
        &nbsp;·&nbsp;
        <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
      </footer>
    </div>
  )
}
