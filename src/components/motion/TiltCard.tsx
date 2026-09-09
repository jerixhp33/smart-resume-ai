'use client'

import React, { useRef, useState } from 'react'
import { motion } from 'framer-motion'

interface TiltCardProps {
  children: React.ReactNode
  className?: string
  tiltMaxAngle?: number
  scaleOnHover?: number
  glowColor?: string
}

export function TiltCard({
  children,
  className = '',
  tiltMaxAngle = 12,
  scaleOnHover = 1.02,
  glowColor = 'rgba(99, 102, 241, 0.15)',
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [rotateX, setRotateX] = useState(0)
  const [rotateY, setRotateY] = useState(0)
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 })
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const width = rect.width
    const height = rect.height

    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top

    const xPct = (mouseX / width) * 100
    const yPct = (mouseY / height) * 100

    setMousePos({ x: xPct, y: yPct })

    // Calculate rotation (-1 to +1)
    const rotX = ((mouseY - height / 2) / (height / 2)) * -tiltMaxAngle
    const rotY = ((mouseX - width / 2) / (width / 2)) * tiltMaxAngle

    setRotateX(rotX)
    setRotateY(rotY)
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    setRotateX(0)
    setRotateY(0)
  }

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      animate={{
        rotateX: isHovered ? rotateX : 0,
        rotateY: isHovered ? rotateY : 0,
        scale: isHovered ? scaleOnHover : 1,
      }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 20,
        mass: 0.5,
      }}
      style={{
        transformStyle: 'preserve-3d',
        perspective: 1000,
      }}
      className={`relative overflow-hidden transition-shadow duration-300 ${className}`}
    >
      {/* Mouse Tracking Radial Spotlight Overlay */}
      {isHovered && (
        <div
          className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-300 rounded-inherit"
          style={{
            background: `radial-gradient(400px circle at ${mousePos.x}% ${mousePos.y}%, ${glowColor}, transparent 80%)`,
          }}
        />
      )}
      <div className="relative z-0 h-full w-full">{children}</div>
    </motion.div>
  )
}
