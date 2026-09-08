'use client'

import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { MOTION, EASING } from '@/lib/motion/config'

interface StaggerItemProps {
  children: React.ReactNode
  className?: string
}

export function StaggerItem({ children, className }: StaggerItemProps) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 12 },
        show: {
          opacity: 1,
          y: 0,
          transition: {
            duration: MOTION.normal,
            ease: EASING.standard,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
