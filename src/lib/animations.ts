import { Variants } from 'framer-motion'

export const EASE = [0.22, 1, 0.36, 1] as const
export const DURATION = 0.35

// Page Transition Variants
export const pageVariants: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: DURATION, ease: EASE } },
  exit: { opacity: 0, y: -20, transition: { duration: DURATION, ease: EASE } }
}

// Stagger Container
export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.06
    }
  }
}

// Fade In Up (used inside stagger)
export const fadeInUp: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
}

// Card Hover Physics
export const cardHover = {
  y: -4,
  scale: 1.02,
  transition: {
    type: 'spring' as const,
    stiffness: 300,
    damping: 20
  }
}

// Modal Animation
export const modalVariants: Variants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { 
    opacity: 1, 
    scale: 1, 
    transition: { duration: 0.24, ease: 'easeOut' } 
  },
  exit: { 
    opacity: 0, 
    scale: 0.95, 
    transition: { duration: 0.2, ease: 'easeIn' } 
  }
}
