import React from 'react'

interface ResunioLogoProps {
  className?: string
  showText?: boolean
  textSize?: 'sm' | 'md' | 'lg'
}

export function ResunioLogo({ className = 'h-8 w-8', showText = false, textSize = 'md' }: ResunioLogoProps) {
  return (
    <div className="flex items-center gap-2.5 shrink-0">
      <div className={className}>
        <svg viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-xs">
          <defs>
            <linearGradient id="resunio-bg-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0f172a" />
              <stop offset="100%" stopColor="#020617" />
            </linearGradient>

            <linearGradient id="grad-cyan-blue" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="50%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#2563eb" />
            </linearGradient>

            <linearGradient id="grad-blue-purple" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="50%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>

            <linearGradient id="grad-cyan-fold" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00f2fe" />
              <stop offset="100%" stopColor="#4facfe" />
            </linearGradient>
          </defs>

          {/* Squircle background base */}
          <rect width="512" height="512" rx="128" fill="url(#resunio-bg-grad)" />

          {/* Ribbon R Icon Vector */}
          <g transform="translate(16, 16)">
            {/* 1. Main Upper Loop and Left Vertical Stem (Cyan -> Blue) */}
            <path 
              d="M140 100 C140 70, 165 48, 205 48 H310 C370 48, 420 95, 420 160 C420 225, 370 272, 310 272 H240 V380 C240 405, 220 425, 195 425 H185 C160 425, 140 405, 140 380 V100 Z" 
              fill="url(#grad-cyan-blue)"
            />

            {/* 2. Lower Right Extending Leg Ribbon (Blue -> Purple) */}
            <path 
              d="M210 220 L370 380 C390 400, 420 400, 440 380 L445 375 C465 355, 465 325, 445 305 L310 170 Z" 
              fill="url(#grad-blue-purple)"
            />

            {/* 3. Bottom-Left Upward Cyan Cross Fold Ribbon */}
            <path 
              d="M140 310 L260 430 C280 450, 310 450, 330 430 L340 420 C360 400, 360 370, 340 350 L200 210 Z" 
              fill="url(#grad-cyan-fold)"
            />

            {/* 4. Document / Resume Paper Graphic in Upper Loop */}
            <g transform="translate(200, 105)">
              <rect width="130" height="100" rx="14" fill="#ffffff" fillOpacity="0.95" />
              <circle cx="28" cy="30" r="9" fill="#0284c7" />
              <rect x="48" y="25" width="56" height="10" rx="5" fill="#0284c7" />
              <rect x="24" y="52" width="80" height="10" rx="5" fill="#0f172a" opacity="0.75" />
              <rect x="24" y="70" width="56" height="10" rx="5" fill="#0f172a" opacity="0.75" />
            </g>
          </g>
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col truncate">
          <span className={`font-bold leading-none bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 ${
            textSize === 'sm' ? 'text-sm' : textSize === 'lg' ? 'text-xl' : 'text-base'
          }`}>
            Resunio
          </span>
          <span className="text-[10px] text-muted-foreground font-medium truncate mt-0.5">
            AI Resume & Portfolio
          </span>
        </div>
      )}
    </div>
  )
}
