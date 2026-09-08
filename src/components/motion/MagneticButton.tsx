'use client'

import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { EASING } from '@/lib/motion/config'

interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  className?: string
}

export function MagneticButton({ children, className, onClick, disabled, ...props }: MagneticButtonProps) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.button
      whileHover={shouldReduceMotion || disabled ? {} : { y: -1, scale: 1.01 }}
      whileTap={shouldReduceMotion || disabled ? {} : { y: 0, scale: 0.99 }}
      transition={EASING.spring}
      onClick={onClick}
      disabled={disabled}
      className={className}
      {...(props as any)}
    >
      {children}
    </motion.button>
  )
}
