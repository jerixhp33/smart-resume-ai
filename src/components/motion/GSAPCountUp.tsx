'use client'

import React, { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

interface GSAPCountUpProps {
  end: number
  suffix?: string
  prefix?: string
  duration?: number
  className?: string
}

export function GSAPCountUp({
  end,
  suffix = '',
  prefix = '',
  duration = 2,
  className = '',
}: GSAPCountUpProps) {
  const [count, setCount] = useState(0)
  const elRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!elRef.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          const obj = { val: 0 }
          gsap.to(obj, {
            val: end,
            duration,
            ease: 'power2.out',
            onUpdate: () => {
              setCount(Math.floor(obj.val))
            },
          })
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )

    observer.observe(elRef.current)
    return () => observer.disconnect()
  }, [end, duration])

  return (
    <span ref={elRef} className={className}>
      {prefix}
      {count}
      {suffix}
    </span>
  )
}
