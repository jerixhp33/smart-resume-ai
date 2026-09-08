'use client'

import React from 'react'
import { ExternalLink, Terminal, Activity, ShieldCheck } from 'lucide-react'
import type { PortfolioProjectItem } from '@/types'

interface ProjectAppPreviewProps {
  project: PortfolioProjectItem
  accentColor?: string
}

export function ProjectAppPreview({ project, accentColor = 'purple' }: ProjectAppPreviewProps) {
  const { title, image_url, technologies = [], live_url, tagline } = project

  // Generate a clean domain name from title
  const domainName = (title || 'app').toLowerCase().replace(/[^a-z0-9]/g, '-') + '.dev'

  return (
    <div className="relative group/preview mb-6 rounded-2xl overflow-hidden border border-white/10 bg-slate-950/80 shadow-2xl transition-all duration-500 group-hover:border-purple-500/40">
      {/* Outer Ambient Glow Aura */}
      <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-600 rounded-2xl blur-lg opacity-0 group-hover/preview:opacity-40 transition-opacity duration-500" />

      {/* Browser Window Header Bar */}
      <div className="relative z-10 bg-slate-950/90 border-b border-white/10 px-3.5 py-2 flex items-center justify-between text-xs backdrop-blur-md">
        {/* Red, Yellow, Green Window Dots */}
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
        </div>

        {/* Address Bar Simulation */}
        <div className="flex items-center gap-1.5 bg-slate-900/90 border border-white/10 px-3 py-0.5 rounded-full text-[10px] text-slate-400 font-mono max-w-[200px] truncate shadow-inner">
          <ShieldCheck className="h-2.5 w-2.5 text-emerald-400 flex-shrink-0" />
          <span className="truncate">https://{domainName}</span>
        </div>

        {/* Live Indicator */}
        <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Live App</span>
        </div>
      </div>

      {/* App Body Content / Image Preview */}
      <div className="relative h-44 sm:h-52 w-full overflow-hidden bg-slate-950 flex items-center justify-center">
        {image_url ? (
          <div className="relative w-full h-full overflow-hidden">
            <img
              src={image_url}
              alt={title}
              className="w-full h-full object-cover object-top transition-transform duration-700 group-hover/preview:scale-105 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-70" />
          </div>
        ) : (
          /* Automated Dynamic Tech App Mockup UI Frame */
          <div className="relative w-full h-full p-4 flex flex-col justify-between bg-gradient-to-br from-slate-950 via-slate-900 to-purple-950/40 group-hover/preview:scale-[1.03] transition-transform duration-700">
            {/* Background Grid Pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(#a855f7_1px,transparent_1px)] [background-size:16px_16px] opacity-15 pointer-events-none" />

            {/* Mockup Dashboard Header / Card */}
            <div className="relative z-10 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  <Activity className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white truncate max-w-[180px]">{title}</p>
                  <p className="text-[10px] text-purple-300/80 font-mono">{tagline || 'Interactive Web Application'}</p>
                </div>
              </div>

              <div className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-mono text-emerald-300">
                200 OK
              </div>
            </div>

            {/* Mockup UI Widget Cards Grid */}
            <div className="relative z-10 grid grid-cols-3 gap-2 my-auto">
              <div className="p-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
                <p className="text-[9px] text-slate-400 font-mono">STATUS</p>
                <p className="text-xs font-bold text-emerald-400 font-mono">Active</p>
              </div>
              <div className="p-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
                <p className="text-[9px] text-slate-400 font-mono">PRIMARY</p>
                <p className="text-xs font-bold text-purple-300 truncate">{technologies[0] || 'React'}</p>
              </div>
              <div className="p-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
                <p className="text-[9px] text-slate-400 font-mono">LATENCY</p>
                <p className="text-xs font-bold text-blue-400 font-mono">~12ms</p>
              </div>
            </div>

            {/* Mockup Footer Code / Tech Pill Bar */}
            <div className="relative z-10 flex items-center justify-between text-[10px] text-slate-400 border-t border-white/10 pt-2 font-mono">
              <span className="flex items-center gap-1 text-purple-300 truncate max-w-[200px]">
                <Terminal className="h-3 w-3 flex-shrink-0" /> {technologies.slice(0, 3).join(' • ')}
              </span>
              <span className="group-hover/preview:text-white transition-colors flex items-center gap-1">
                Preview <ExternalLink className="h-2.5 w-2.5" />
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
