'use client'

import React, { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { modalVariants } from '@/lib/animations'
import gsap from 'gsap'
import { Lottie } from 'lottie-react'

interface AIProcessingModalProps {
  isOpen: boolean
}

export function AIProcessingModal({ isOpen }: AIProcessingModalProps) {
  const progressRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const [lottieData, setLottieData] = useState<any>(null)

  useEffect(() => {
    // Fetch a generic document scanning animation JSON for demo purposes
    // (In production, you'd place a .json file in public directory)
    fetch('https://assets3.lottiefiles.com/packages/lf20_q5pk6p1k.json')
      .then(res => res.json())
      .then(data => setLottieData(data))
      .catch(() => {
        // Fallback Lottie if fetch fails
      })
  }, [])

  useEffect(() => {
    if (!isOpen) return

    const tl = gsap.timeline()
    
    // Animate progress bar from 0 to 100% over 3s
    if (progressRef.current) {
      tl.to(progressRef.current, {
        width: '100%',
        duration: 3,
        ease: 'power1.inOut'
      }, 'start')
    }

    // Animate text phases
    if (textRef.current) {
      const texts = ['Scanning document...', 'Extracting experience...', 'Analyzing skills...', 'Formatting for ATS...', 'Done!']
      
      texts.forEach((text, i) => {
        tl.to(textRef.current, {
          opacity: 0,
          duration: 0.2,
          onComplete: () => {
            if (textRef.current) textRef.current.innerText = text
          }
        }, `start+=${i * 0.6}`)
        
        tl.to(textRef.current, {
          opacity: 1,
          duration: 0.3
        })
      })
    }

    return () => {
      tl.kill()
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <motion.div
            variants={modalVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full mx-4 flex flex-col items-center text-center"
          >
            <div className="w-48 h-48 mb-6 relative">
              {lottieData ? (
                // @ts-ignore
                <Lottie animationData={lottieData} loop={true} />
              ) : (
                <div className="absolute inset-0 border-4 border-slate-100 rounded-full">
                  <div className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin" />
                </div>
              )}
            </div>

            <h3 className="text-2xl font-bold mb-2">Groq AI is Processing</h3>
            <div ref={textRef} className="text-muted-foreground font-medium h-6 mb-8">
              Initializing AI engine...
            </div>

            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div ref={progressRef} className="h-full bg-primary rounded-full w-0" />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
