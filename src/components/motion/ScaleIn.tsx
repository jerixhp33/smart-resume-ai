'use client'

import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { MOTION, EASING } from '@/lib/motion/config'

interface ScaleInProps {
  children: React.ReactNode
  delay?: number
  className?: string
}

export function ScaleIn({ children, delay = 0, className }: ScaleInProps) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.div
      initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: MOTION.normal,
        delay,
        ease: EASING.standard,
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
