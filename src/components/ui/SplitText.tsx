'use client'

import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'

export function SplitText({ text, className }: { text: string; className?: string }) {
  const containerRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    if (!containerRef.current) return
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mediaQuery.matches) {
      gsap.set(containerRef.current.querySelectorAll('.split-char'), { opacity: 1, y: 0 })
      return
    }

    const chars = containerRef.current.querySelectorAll('.split-char')
    gsap.fromTo(chars, 
      { opacity: 0, y: 60 },
      { 
        opacity: 1, 
        y: 0, 
        stagger: 0.03, 
        ease: "expo.out", 
        duration: 1.2,
        delay: 0.1
      }
    )
  }, [text])

  // Split text into spans
  const words = text.split(' ').map((word, wordIdx) => {
    return (
      <span key={`word-${wordIdx}`} className="inline-block whitespace-nowrap">
        {word.split('').map((char, charIdx) => (
          <span 
            key={`char-${wordIdx}-${charIdx}`} 
            className="split-char inline-block opacity-0"
          >
            {char}
          </span>
        ))}
        <span className="inline-block">&nbsp;</span>
      </span>
    )
  })

  return (
    <h1 ref={containerRef} className={className}>
      {words}
    </h1>
  )
}
