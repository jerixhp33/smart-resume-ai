'use client'

import { useEffect, useState } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function SmoothScroller({ children }: { children: React.ReactNode }) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [isReducedMotion, setIsReducedMotion] = useState(false)

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setIsReducedMotion(mediaQuery.matches)
    
    if (mediaQuery.matches) return

    // Initialize Lenis
    const lenis = new Lenis({
      lerp: 0.08,
      smoothWheel: true,
    })

    // Sync Lenis with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update)

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000)
    })
    
    gsap.ticker.lagSmoothing(0)

    // Cursor tracking
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY })
      document.documentElement.style.setProperty('--cx', `${e.clientX}px`)
      document.documentElement.style.setProperty('--cy', `${e.clientY}px`)
    }
    
    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      lenis.destroy()
      gsap.ticker.remove((time) => lenis.raf(time * 1000))
    }
  }, [])

  return (
    <>
      {!isReducedMotion && (
        <>
          <div className="cursor-dot hidden md:block" />
          <div className="cursor-ring hidden md:block" />
        </>
      )}
      {children}
    </>
  )
}
