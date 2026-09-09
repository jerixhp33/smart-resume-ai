'use client'

import React from 'react'
import type { PortfolioContent, PortfolioThemeId, UserFile } from '@/types'
import { SectionReveal } from '@/components/motion/SectionReveal'
import { StaggerContainer } from '@/components/motion/StaggerContainer'
import { StaggerItem } from '@/components/motion/StaggerItem'
import { TiltCard } from '@/components/motion/TiltCard'
import { ProjectAppPreview } from './ProjectAppPreview'
import { getExperienceTypeLabel, getCleanDescription } from './template-utils'
import { ExternalLink, Mail, Award, Terminal, Sparkles, CheckCircle2 } from 'lucide-react'
import { GithubIcon } from '@/components/ui/icons'

interface AITemplateConfig {
  accentHex?: string
  layoutType?: 'matrix-terminal' | 'glass-cards' | 'gold-serif' | 'cyberpunk-neon' | 'standard'
  customCss?: string
}

interface TemplateProps {
  content: PortfolioContent
  theme: PortfolioThemeId
  aiConfig?: AITemplateConfig
  items?: UserFile[]
}

export function AIGeneratedTemplate({ content, theme, aiConfig, items }: TemplateProps) {
  const { hero, about, experience, education, skills, projects, certifications, contact } = content
  const hidden = content.hidden_sections || {}

  const accentHex = aiConfig?.accentHex || '#6366f1'
  const layoutType = aiConfig?.layoutType || 'cyberpunk-neon'
  const customCss = aiConfig?.customCss || ''

  const isMatrix = layoutType === 'matrix-terminal'
  const isCyber = layoutType === 'cyberpunk-neon'
  const isGold = layoutType === 'gold-serif'

  return (
    <div 
      className={`min-h-screen font-sans antialiased relative overflow-hidden ${
        isMatrix ? 'bg-slate-950 text-emerald-400 font-mono' :
        isCyber ? 'bg-slate-950 text-cyan-100' :
        isGold ? 'bg-[#0f0d0b] text-[#fef08a] font-serif' :
        'bg-slate-950 text-slate-100'
      }`}
    >
      {/* Inject AI Generated Custom CSS */}
      {customCss && <style dangerouslySetInnerHTML={{ __html: customCss }} />}

      {/* Dynamic Ambient Background Aura */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div 
          className="absolute -top-[20%] left-1/2 -translate-x-1/2 w-[900px] h-[600px] blur-[150px] rounded-full opacity-40"
          style={{ background: `radial-gradient(circle, ${accentHex} 0%, transparent 70%)` }}
        />
      </div>

      {/* AI Template Live Indicator Pill */}
      <div className="fixed bottom-4 right-4 z-50 bg-slate-900/90 backdrop-blur-xl border border-white/20 px-3.5 py-2 rounded-2xl text-xs flex items-center gap-2 shadow-2xl text-white">
        <Sparkles className="h-4 w-4 text-purple-400 animate-spin" style={{ animationDuration: '4s' }} />
        <span>AI Dynamic Template: <strong>{layoutType.toUpperCase()}</strong></span>
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
      </div>

      {/* Hero Section */}
      {!hidden.hero && (
        <SectionReveal id="top" className="py-20 md:py-32 max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="max-w-3xl space-y-6 flex-1">
              {hero.availability && (
                <div 
                  className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold border backdrop-blur-md"
                  style={{
                    backgroundColor: `${accentHex}1A`,
                    borderColor: `${accentHex}40`,
                    color: accentHex,
                  }}
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  {hero.availability}
                </div>
              )}

              <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
                {hero.full_name}
              </h1>

              <p 
                className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent"
                style={{
                  backgroundImage: `linear-gradient(to right, ${accentHex}, #a855f7, #38bdf8)`
                }}
              >
                {hero.title}
              </p>

              <p className="text-base sm:text-lg opacity-85 leading-relaxed max-w-2xl">
                {hero.summary}
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <a
                  href="#projects"
                  className="px-6 py-3.5 rounded-xl font-bold text-white shadow-xl hover:scale-105 transition-transform"
                  style={{ backgroundColor: accentHex }}
                >
                  {hero.cta_primary_label || 'View AI Portfolio'}
                </a>
                <a
                  href="#contact"
                  className="px-6 py-3.5 rounded-xl font-bold border border-white/20 bg-white/5 backdrop-blur-md hover:bg-white/10 transition-colors"
                >
                  {hero.cta_secondary_label || 'Contact Candidate'}
                </a>
              </div>
            </div>

            {/* Profile Avatar */}
            {hero.avatar_url && (
              <TiltCard className="rounded-3xl flex-shrink-0">
                <div className="relative group">
                  <div 
                    className="absolute -inset-2 rounded-3xl blur-xl opacity-60 group-hover:opacity-100 transition-opacity animate-pulse"
                    style={{ background: `linear-gradient(135deg, ${accentHex}, #ec4899, #3b82f6)` }}
                  />
                  <div className="relative w-56 h-56 sm:w-64 sm:h-64 rounded-3xl p-1.5 bg-slate-900 border border-white/20 shadow-2xl overflow-hidden">
                    <img
                      src={hero.avatar_url}
                      alt={hero.full_name}
                      className="w-full h-full object-cover rounded-2xl"
                    />
                  </div>
                </div>
              </TiltCard>
            )}
          </div>
        </SectionReveal>
      )}

      {/* Featured Projects Grid */}
      {!hidden.projects && projects && projects.length > 0 && (
        <SectionReveal id="projects" className="py-20 max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400 bg-white/5 px-3 py-1 rounded-full border border-white/10">
              AI Generated Layout
            </span>
            <h2 className="text-3xl font-black tracking-tight mt-2">Featured Projects</h2>
          </div>

          <StaggerContainer className="grid md:grid-cols-2 gap-6">
            {projects.map((proj) => (
              <StaggerItem key={proj.id}>
                <TiltCard className="rounded-2xl h-full">
                  <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-6 hover:border-white/30 backdrop-blur-xl transition-all h-full flex flex-col justify-between shadow-xl">
                    <div>
                      <ProjectAppPreview project={proj} />
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-xl font-bold">{proj.title}</h3>
                        {proj.live_url && (
                          <a href={proj.live_url} target="_blank" rel="noopener noreferrer" className="p-1 rounded bg-white/10 hover:bg-white/20">
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )}
                      </div>
                      <p className="text-xs font-bold opacity-75 mb-2">{proj.tagline}</p>
                      <p className="text-xs opacity-80 leading-relaxed mb-4">{proj.description}</p>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-3 border-t border-white/10">
                      {proj.technologies.map((t, i) => (
                        <span key={i} className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/10 border border-white/15">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </TiltCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </SectionReveal>
      )}

      {/* Experience Timeline */}
      {!hidden.experience && experience && experience.length > 0 && (
        <SectionReveal id="experience" className="py-20 bg-slate-900/40 border-y border-white/10 relative z-10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
            <h2 className="text-3xl font-black tracking-tight">Work Experience</h2>
            <div className="space-y-6">
              {experience.map((exp) => (
                <div key={exp.id} className="bg-slate-900/80 border border-white/10 p-6 rounded-2xl space-y-3">
                  <div className="flex justify-between items-start flex-wrap gap-2">
                    <div>
                      <h3 className="text-lg font-bold">{exp.role}</h3>
                      <p className="text-xs opacity-75">{exp.company}</p>
                    </div>
                    <span className="text-xs font-mono opacity-60 bg-white/5 px-2.5 py-1 rounded-md">{exp.period}</span>
                  </div>
                  <p className="text-xs opacity-80 leading-relaxed">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>
        </SectionReveal>
      )}

      {/* Contact Section */}
      {!hidden.contact && contact && (
        <SectionReveal id="contact" className="py-24 max-w-3xl mx-auto px-4 text-center space-y-6 relative z-10">
          <h2 className="text-3xl font-black">{contact.heading || 'Get In Touch'}</h2>
          <p className="text-sm opacity-80 max-w-md mx-auto">{contact.subheading}</p>
          {contact.email && (
            <a
              href={`mailto:${contact.email}`}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-black text-white shadow-2xl hover:scale-105 transition-transform"
              style={{ backgroundColor: accentHex }}
            >
              <Mail className="h-4 w-4" /> {contact.email}
            </a>
          )}
        </SectionReveal>
      )}

      <footer className="py-8 border-t border-white/10 text-center text-xs opacity-60">
        <p>© {new Date().getFullYear()} {hero.full_name} · Dynamic AI Portfolio</p>
      </footer>
    </div>
  )
}
