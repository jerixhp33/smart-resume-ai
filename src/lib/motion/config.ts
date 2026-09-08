// ============================================================
// SmartResume AI — Central Motion Configuration
// ============================================================

export const MOTION = {
  instant: 0.1,
  fast: 0.18,
  normal: 0.28,
  slow: 0.45,
  stagger: 0.06,
}

export const EASING = {
  standard: [0.22, 1, 0.36, 1] as const,
  emphasized: [0.16, 1, 0.3, 1] as const,
  gentle: [0.25, 0.1, 0.25, 1] as const,
  spring: { type: 'spring' as const, stiffness: 320, damping: 25 },
  smoothSpring: { type: 'spring' as const, stiffness: 240, damping: 22 },
}

export const PAGE_TRANSITION_VARIANTS = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -4 },
}

export const REDUCED_MOTION_VARIANTS = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
}
