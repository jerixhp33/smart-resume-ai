'use client'

import React from 'react'
import type { PortfolioContent, PortfolioThemeId } from '@/types'
import { THEMES } from './theme-config'
import { SectionReveal } from '@/components/motion/SectionReveal'
import { Terminal, Code, GitBranch, ExternalLink, Mail, FolderGit2 } from 'lucide-react'
import { GithubIcon } from '@/components/ui/icons'

interface TemplateProps {
  content: PortfolioContent
  theme: PortfolioThemeId
}

export function DeveloperTemplate({ content, theme }: TemplateProps) {
  const themeConfig = THEMES[theme] || THEMES.indigo
  const { hero, about, experience, skills, projects, contact } = content

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-mono antialiased selection:bg-emerald-500/20 selection:text-emerald-400">
      {/* Terminal Bar */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
          <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
          <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
          <span className="ml-2 font-mono text-slate-300">~/portfolio/{hero.full_name.toLowerCase().replace(/\s+/g, '-')}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-emerald-400">● node v20.12.0</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-16 space-y-20">
        {/* Terminal Hero Header */}
        <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10 text-emerald-500 pointer-events-none">
            <Code className="h-48 w-48" />
          </div>
          <div className="space-y-4 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-emerald-950/60 border border-emerald-800/60 text-xs text-emerald-400">
              <Terminal className="h-3.5 w-3.5" />
              <span>developer.profile.init()</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white">{hero.full_name}</h1>
            <p className="text-xl text-emerald-400 font-semibold">{`// ${hero.title}`}</p>
            <p className="text-slate-300 text-sm leading-relaxed max-w-2xl font-sans">{hero.summary}</p>
            
            <div className="flex flex-wrap gap-4 pt-4">
              {contact.email && (
                <a href={`mailto:${contact.email}`} className="px-5 py-2.5 rounded-lg bg-emerald-600 text-slate-950 font-bold text-xs hover:bg-emerald-500 transition-colors flex items-center gap-2 font-sans">
                  <Mail className="h-4 w-4" />
                  Contact Developer
                </a>
              )}
              {contact.github_url && (
                <a href={contact.github_url} target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 rounded-lg bg-slate-800 text-slate-200 font-bold text-xs hover:bg-slate-700 transition-colors flex items-center gap-2 font-sans">
                  <GithubIcon className="h-4 w-4" />
                  GitHub Profile
                </a>
              )}
            </div>
          </div>
        </section>

        {/* Projects */}
        {projects && projects.length > 0 && (
          <section className="space-y-6">
            <h2 className="text-xl font-bold text-slate-200 flex items-center gap-2">
              <FolderGit2 className="h-5 w-5 text-emerald-400" />
              <span>Repositories & Projects</span>
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {projects.map((p) => (
                <div key={p.id} className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 hover:border-emerald-500/50 transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-4 mb-2">
                      <h3 className="font-bold text-base text-emerald-300 hover:underline cursor-pointer">{p.title}</h3>
                      <div className="flex items-center gap-2 text-slate-400">
                        {p.github_url && <a href={p.github_url} target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400"><GithubIcon className="h-4 w-4" /></a>}
                        {p.live_url && <a href={p.live_url} target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400"><ExternalLink className="h-4 w-4" /></a>}
                      </div>
                    </div>
                    <p className="text-xs text-slate-400 mb-4 font-sans leading-relaxed">{p.description}</p>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-800">
                    {p.technologies.map((t, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-xs">{t}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Experience */}
        {experience && experience.length > 0 && (
          <section className="space-y-6">
            <h2 className="text-xl font-bold text-slate-200 flex items-center gap-2">
              <GitBranch className="h-5 w-5 text-emerald-400" />
              <span>Commit Log / Experience</span>
            </h2>
            <div className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.id} className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-6 space-y-2">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-bold text-slate-200">{exp.role} <span className="text-emerald-400 font-normal">@ {exp.company}</span></h3>
                    <span className="text-xs text-slate-500">{exp.period}</span>
                  </div>
                  <p className="text-xs text-slate-400 font-sans">{exp.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
