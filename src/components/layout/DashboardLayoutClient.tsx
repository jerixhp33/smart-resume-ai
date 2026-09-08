'use client'

import React, { useState, useEffect } from 'react'
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
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [mounted, setMounted] = useState(false)

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

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <DashboardNav
        userId={userId}
        isCollapsed={isCollapsed}
        onToggleCollapse={toggleCollapse}
      />

      {/* Main Content Container */}
      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out ${
          mounted && isCollapsed ? 'lg:ml-16' : 'lg:ml-64'
        }`}
      >
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
