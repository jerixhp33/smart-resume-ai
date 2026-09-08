'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'
import { fadeInUp, staggerContainer } from '@/lib/animations'

export function FadeIn({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      variants={fadeInUp}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function StaggerContainer({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, margin: "-50px" }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function ScrollReveal({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
