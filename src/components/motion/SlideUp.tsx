'use client'

import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { MOTION, EASING } from '@/lib/motion/config'

interface SlideUpProps {
  children: React.ReactNode
  delay?: number
  distance?: number
  className?: string
}

export function SlideUp({ children, delay = 0, distance = 16, className }: SlideUpProps) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.div
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : distance }}
      animate={{ opacity: 1, y: 0 }}
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
