'use client'

import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { MOTION, EASING } from '@/lib/motion/config'

interface SectionRevealProps {
  children: React.ReactNode
  id?: string
  className?: string
}

export function SectionReveal({ children, id, className }: SectionRevealProps) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{
        duration: MOTION.slow,
        ease: EASING.emphasized,
      }}
      className={className}
    >
      {children}
    </motion.section>
  )
}
