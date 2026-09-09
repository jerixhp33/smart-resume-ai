import React from 'react'
import { ResunioLogo } from '@/components/brand/ResunioLogo'

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-pulse">
          <ResunioLogo size="xl" variant="mark" showBg={true} />
        </div>
        <p className="text-sm font-semibold tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 animate-pulse">
          Loading Resunio...
        </p>
      </div>
    </div>
  )
}
