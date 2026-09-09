import React from 'react'

interface ResunioLogoProps {
  className?: string
  variant?: 'full' | 'mark' | 'horizontal'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showText?: boolean
  textSize?: 'sm' | 'md' | 'lg'
}

export function ResunioLogo({ 
  className = '', 
  variant = 'horizontal', 
  size = 'md',
  showText = true,
  textSize
}: ResunioLogoProps) {
  const iconSizeClass = {
    sm: 'h-7 w-7',
    md: 'h-9 w-9',
    lg: 'h-12 w-12',
    xl: 'h-20 w-20',
  }[size]

  return (
    <div className={`flex items-center gap-2.5 shrink-0 select-none ${className}`}>
      {/* 3D Ribbon "R" Icon Mark */}
      <div className={`${iconSizeClass} relative shrink-0 overflow-hidden rounded-xl bg-[#090c15] p-0.5 border border-white/10 shadow-sm`}>
        <svg viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <defs>
            <linearGradient id="r-grad-top" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="45%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#2563eb" />
            </linearGradient>

            <linearGradient id="r-grad-leg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="50%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>

            <linearGradient id="r-grad-fold" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00f2fe" />
              <stop offset="100%" stopColor="#38bdf8" />
            </linearGradient>
          </defs>

          {/* Ribbon R Paths */}
          <path 
            d="M140 90 C140 60, 168 40, 215 40 H315 C380 40, 430 90, 430 160 C430 230, 380 275, 315 275 H240 V385 C240 410, 220 430, 195 430 H185 C160 430, 140 410, 140 385 V90 Z" 
            fill="url(#r-grad-top)"
          />
          <path 
            d="M210 220 L375 385 C395 405, 425 405, 445 385 L450 380 C470 360, 470 330, 450 310 L315 175 Z" 
            fill="url(#r-grad-leg)"
          />
          <path 
            d="M140 315 L265 440 C285 460, 315 460, 335 440 L345 430 C365 410, 365 380, 345 360 L205 220 Z" 
            fill="url(#r-grad-fold)"
          />

          {/* Document Sheet Graphic */}
          <g transform="translate(205, 98)">
            <rect width="125" height="98" rx="14" fill="#ffffff" fillOpacity="0.96" />
            <circle cx="28" cy="28" r="9" fill="#0284c7" />
            <rect x="46" y="23" width="56" height="10" rx="5" fill="#0284c7" />
            <rect x="24" y="50" width="78" height="10" rx="5" fill="#0f172a" opacity="0.75" />
            <rect x="24" y="68" width="54" height="10" rx="5" fill="#0f172a" opacity="0.75" />
          </g>
        </svg>
      </div>

      {/* Brand Typography */}
      {showText && variant !== 'mark' && (
        <div className="flex flex-col truncate">
          <div className="flex items-center text-foreground font-extrabold tracking-tight leading-none text-lg sm:text-xl font-sans">
            <span>Resuni</span>
            <span className="bg-clip-text text-transparent bg-gradient-to-tr from-cyan-400 via-blue-500 to-purple-500">o</span>
          </div>

          {(variant === 'full' || size === 'lg' || size === 'xl') ? (
            <span className="text-[10px] sm:text-[11px] font-medium tracking-widest text-muted-foreground uppercase mt-1">
              AI Resume & Portfolio Builder
            </span>
          ) : (
            <span className="text-[10px] text-muted-foreground font-medium truncate mt-0.5">
              AI Resume & Portfolio
            </span>
          )}
        </div>
      )}
    </div>
  )
}
