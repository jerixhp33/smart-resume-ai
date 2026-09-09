'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  FileText,
  ScanSearch,
  Briefcase,
  Sparkles,
  FolderOpen,
  Settings,
  LogOut,
  ChevronRight,
  ChevronLeft,
  FlaskConical,
  Globe,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react'
import { cn } from '@/utils/cn'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import { NotificationBell } from '@/components/notifications/NotificationBell'

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/resumes', label: 'My Resumes', icon: FileText },
  { href: '/portfolio', label: 'AI Portfolio', icon: Globe },
  { href: '/analyzer', label: 'ATS Analyzer', icon: ScanSearch },
  { href: '/applications', label: 'Applications', icon: Briefcase },
  { href: '/ai-tools', label: 'AI Tools', icon: Sparkles },
  { href: '/ab-test', label: 'A/B Test', icon: FlaskConical },
  { href: '/files', label: 'Files', icon: FolderOpen },
]

interface DashboardNavProps {
  userId: string
  isCollapsed?: boolean
  onToggleCollapse?: () => void
}

export function DashboardNav({ userId, isCollapsed = false, onToggleCollapse }: DashboardNavProps) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = getSupabaseBrowserClient()

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <aside
      className={cn(
        'hidden lg:flex flex-col sticky top-0 h-screen bg-card border-r border-border z-30 transition-all duration-300 ease-in-out flex-shrink-0',
        isCollapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo Header & Expand/Close Toggle */}
      <div className={cn('flex items-center border-b border-border py-4 px-3', isCollapsed ? 'justify-center flex-col gap-2' : 'justify-between px-4')}>
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="h-8 w-8 rounded-xl bg-primary flex items-center justify-center flex-shrink-0 shadow-sm">
            <svg viewBox="0 0 24 24" className="h-4 w-4 text-white" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M9 12h6M9 8h6M9 16h4M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z" />
            </svg>
          </div>
          {!isCollapsed && (
            <div className="truncate">
              <p className="text-sm font-bold leading-none truncate">SmartResume AI</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Resume builder</p>
            </div>
          )}
        </div>

        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors focus:outline-none"
            title={isCollapsed ? 'Expand Navigation Sidebar' : 'Collapse Navigation Sidebar'}
          >
            {isCollapsed ? <PanelLeftOpen className="h-4 w-4 text-primary" /> : <PanelLeftClose className="h-4 w-4" />}
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive = href === '/dashboard' ? pathname === href : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              prefetch={true}
              onMouseEnter={() => router.prefetch(href)}
              title={isCollapsed ? label : undefined}
              className={cn(
                'flex items-center rounded-xl text-sm font-medium transition-all group relative',
                isCollapsed ? 'justify-center p-2.5' : 'gap-3 px-3 py-2.5',
                isActive
                  ? 'bg-primary/10 text-primary font-bold shadow-xs'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <Icon className={cn('h-4 w-4 flex-shrink-0', isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground')} />
              {!isCollapsed && <span className="truncate">{label}</span>}
              {!isCollapsed && isActive && <ChevronRight className="h-3.5 w-3.5 ml-auto text-primary" />}
            </Link>
          )
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="p-2 border-t border-border space-y-1">
        <div className={cn('flex items-center py-1', isCollapsed ? 'justify-center' : 'px-2')}>
          <NotificationBell userId={userId} isCollapsed={isCollapsed} />
        </div>

        <Link
          href="/settings"
          title={isCollapsed ? 'Settings' : undefined}
          className={cn(
            'flex items-center rounded-xl text-sm font-medium transition-all',
            isCollapsed ? 'justify-center p-2.5' : 'gap-3 px-3 py-2.5',
            pathname.startsWith('/settings')
              ? 'bg-primary/10 text-primary font-bold'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground'
          )}
        >
          <Settings className="h-4 w-4 flex-shrink-0" />
          {!isCollapsed && <span>Settings</span>}
        </Link>

        <button
          onClick={handleLogout}
          title={isCollapsed ? 'Sign out' : undefined}
          className={cn(
            'w-full flex items-center rounded-xl text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all',
            isCollapsed ? 'justify-center p-2.5' : 'gap-3 px-3 py-2.5'
          )}
        >
          <LogOut className="h-4 w-4 flex-shrink-0" />
          {!isCollapsed && <span>Sign out</span>}
        </button>
      </div>
    </aside>
  )
}
