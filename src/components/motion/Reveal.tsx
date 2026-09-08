'use client'

import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { MOTION, EASING } from '@/lib/motion/config'

interface RevealProps {
  children: React.ReactNode
  delay?: number
  className?: string
  once?: boolean
}

export function Reveal({ children, delay = 0, className, once = true }: RevealProps) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.div
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount: 0.1 }}
      transition={{
        duration: MOTION.normal,
        delay,
        ease: EASING.emphasized,
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
