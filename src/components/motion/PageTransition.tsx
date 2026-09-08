'use client'

import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { MOTION, EASING, PAGE_TRANSITION_VARIANTS, REDUCED_MOTION_VARIANTS } from '@/lib/motion/config'

interface PageTransitionProps {
  children: React.ReactNode
  className?: string
}

export function PageTransition({ children, className }: PageTransitionProps) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={shouldReduceMotion ? REDUCED_MOTION_VARIANTS : PAGE_TRANSITION_VARIANTS}
      transition={{
        duration: MOTION.normal,
        ease: EASING.standard,
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
