import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: { template: '%s | Resunio', default: 'Resunio — AI Resume & Portfolio Builder' },
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-border/50">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg overflow-hidden flex items-center justify-center bg-slate-950 border border-border/40">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Resunio Logo" className="w-full h-full object-cover" />
          </div>
          <span className="font-bold text-base bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500">Resunio</span>
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
