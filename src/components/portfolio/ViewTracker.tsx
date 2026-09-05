'use client'

import { useEffect, useRef } from 'react'
import { incrementResumeView } from '@/features/resume/public-actions'

export function ViewTracker({ slug }: { slug: string }) {
  const hasViewed = useRef(false)

  useEffect(() => {
    // Prevent double-counting in React StrictMode
    if (hasViewed.current) return
    hasViewed.current = true

    // Fire and forget
    incrementResumeView(slug).catch(console.error)
  }, [slug])

  return null
}
