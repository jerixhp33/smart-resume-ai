'use client'

import React, { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { DashboardNav } from '@/components/layout/DashboardNav'
import { MobileNav } from '@/components/layout/MobileNav'
import { Toaster } from '@/components/ui/toast'

export function DashboardLayoutClient({
  userId,
  children,
}: {
  userId: string
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Full studio pages (Portfolio Editor, Resume Builder) get full screen workspace without duplicate navbars
  const isStudioPage = pathname.includes('/portfolio/editor/') || pathname.includes('/builder/')

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem('smartresume_sidebar_collapsed')
    if (saved === 'true') {
      setIsCollapsed(true)
    }
  }, [])

  const toggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev
      localStorage.setItem('smartresume_sidebar_collapsed', String(next))
      return next
    })
  }

  if (isStudioPage) {
    return (
      <div className="h-screen w-screen bg-background overflow-hidden flex flex-col">
        <main className="flex-1 w-full overflow-hidden p-0 min-h-0 flex flex-col">
          {children}
        </main>
        <Toaster />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <DashboardNav
        userId={userId}
        isCollapsed={isCollapsed}
        onToggleCollapse={toggleCollapse}
      />

      {/* Main Content Container */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0 transition-all duration-300 ease-in-out">
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav />

      <Toaster />
    </div>
  )
}
