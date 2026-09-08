'use client'

import React from 'react'
import type { PortfolioContent, PortfolioThemeId, UserFile } from '@/types'
import { THEMES } from './theme-config'
import { SectionReveal } from '@/components/motion/SectionReveal'
import { StaggerContainer } from '@/components/motion/StaggerContainer'
import { StaggerItem } from '@/components/motion/StaggerItem'
import { Terminal, Code, GitBranch, ExternalLink, Mail, FolderGit2, GraduationCap, Award } from 'lucide-react'
import { GithubIcon } from '@/components/ui/icons'
import { motion } from 'framer-motion'

interface TemplateProps {
  content: PortfolioContent
  theme: PortfolioThemeId
  items?: UserFile[]
}

export function DeveloperTemplate({ content, theme, items }: TemplateProps) {
  const themeConfig = THEMES[theme] || THEMES.indigo
  const { hero, about, experience, education, skills, projects, contact } = content
  const hidden = content.hidden_sections || {}

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
        {!hidden.hero && (
          <SectionReveal id="top">
            <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10 text-emerald-500 pointer-events-none">
                <Code className="h-48 w-48" />
              </div>
              <div className="space-y-4 relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-emerald-950/60 border border-emerald-800/60 text-xs text-emerald-400">
                  <Terminal className="h-3.5 w-3.5" />
                  <span>developer.profile.init()</span>
                </div>
                <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white break-words">{hero.full_name}</h1>
                <p className="text-xl text-emerald-400 font-semibold">{`// ${hero.title}`}</p>
                <p className="text-slate-300 text-sm leading-relaxed max-w-2xl font-sans">{hero.summary}</p>
                
                <div className="flex flex-wrap gap-4 pt-4 font-sans">
                  <a href={hero.cta_primary_url || '#projects'} className="px-5 py-2.5 rounded-lg bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition-colors flex items-center gap-2 active:scale-95">
                    <Code className="h-4 w-4" />
                    {hero.cta_primary_label || 'View Projects'}
                  </a>
                  {contact.email && (
                    <a href={hero.cta_secondary_url || `mailto:${contact.email}`} className="px-5 py-2.5 rounded-lg bg-slate-800 text-slate-200 font-bold text-xs hover:bg-slate-700 transition-colors flex items-center gap-2 active:scale-95">
                      <Mail className="h-4 w-4" />
                      {hero.cta_secondary_label || 'Contact Developer'}
                    </a>
                  )}
                  {contact.github_url && (
                    <a href={contact.github_url} target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 rounded-lg bg-slate-800 text-slate-200 font-bold text-xs hover:bg-slate-700 transition-colors flex items-center gap-2 active:scale-95">
                      <GithubIcon className="h-4 w-4" />
                      GitHub Profile
                    </a>
                  )}
                </div>
              </div>
            </section>
          </SectionReveal>
        )}

        {/* About README Section */}
        {!hidden.about && about && (
          <SectionReveal id="about">
            <section className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2 text-xs text-slate-400 border-b border-slate-800 pb-3 font-mono">
                <FileCodeIcon />
                <span>README.md</span>
              </div>
              <div className="font-sans space-y-3 text-slate-300 text-sm leading-relaxed">
                {about.biography && about.biography.trim() !== hero.summary?.trim() && (
                  <p className="whitespace-pre-line">{about.biography}</p>
                )}
                {about.career_direction && (
                  <p className="text-emerald-400 font-mono text-xs border-l-2 border-emerald-500 pl-3 py-1">
                    {`> Focus: ${about.career_direction}`}
                  </p>
                )}
              </div>
            </section>
          </SectionReveal>
        )}

        {/* Projects Repository Section */}
        {!hidden.projects && projects && projects.length > 0 && (
          <SectionReveal id="projects">
            <section className="space-y-6">
              <div className="flex items-center gap-2 text-emerald-400 font-mono text-sm">
                <FolderGit2 className="h-4 w-4" />
                <span>const featuredRepositories = [</span>
              </div>
              <StaggerContainer className="grid md:grid-cols-2 gap-6 pl-4 border-l-2 border-emerald-500/20">
                {projects.map((p) => (
                  <StaggerItem key={p.id}>
                    <motion.div
                      whileHover={{ y: -4 }}
                      className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4 hover:border-emerald-500/50 transition-all flex flex-col justify-between h-full shadow-lg"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-4 mb-2">
                          <h3 className="font-bold text-white text-lg font-mono flex items-center gap-2">
                            <GitBranch className="h-4 w-4 text-emerald-400" />
                            {p.title}
                          </h3>
                          {p.live_url && (
                            <a href={p.live_url} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-emerald-400 p-1">
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          )}
                        </div>
                        <p className="text-slate-300 text-xs font-sans leading-relaxed">{p.description}</p>
                      </div>
                      <div className="flex flex-wrap gap-1.5 pt-3 border-t border-slate-800/80">
                        {p.technologies.map((t, i) => (
                          <span key={i} className="px-2.5 py-0.5 rounded text-[11px] font-mono bg-slate-800 text-emerald-300 border border-slate-700">
                            {t}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
              <div className="text-emerald-400 font-mono text-sm">]</div>
            </section>
          </SectionReveal>
        )}

        {/* Experience Log Section */}
        {!hidden.experience && experience && experience.length > 0 && (
          <SectionReveal id="experience">
            <section className="space-y-6">
              <div className="flex items-center gap-2 text-emerald-400 font-mono text-sm">
                <Terminal className="h-4 w-4" />
                <span>git log --experience --oneline</span>
              </div>
              <StaggerContainer className="space-y-4 pl-4 border-l-2 border-emerald-500/20">
                {experience.map((exp) => (
                  <StaggerItem key={exp.id}>
                    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-3 hover:border-slate-700 transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <h3 className="font-bold text-white text-base">{exp.role}</h3>
                          <p className="text-emerald-400 text-xs">{`@ ${exp.company}`}</p>
                        </div>
                        <span className="text-[11px] font-mono px-3 py-1 rounded bg-slate-800 text-slate-300 w-fit">{exp.period}</span>
                      </div>
                      {exp.description && <p className="text-slate-300 text-xs font-sans leading-relaxed">{exp.description}</p>}
                      {exp.bullets && exp.bullets.length > 0 && (
                        <ul className="space-y-1.5 pt-2 border-t border-slate-800/60 font-sans text-xs">
                          {exp.bullets.map((bullet, i) => (
                            <li key={i} className="text-slate-300 flex items-start gap-2">
                              <span className="text-emerald-400 font-mono">$</span>
                              <span>{bullet}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </section>
          </SectionReveal>
        )}

        {/* Skills Stack Section */}
        {!hidden.skills && skills && skills.length > 0 && (
          <SectionReveal id="skills">
            <section className="space-y-6">
              <div className="flex items-center gap-2 text-emerald-400 font-mono text-sm">
                <Code className="h-4 w-4" />
                <span>export const techStack = &#123;</span>
              </div>
              <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 pl-4 border-l-2 border-emerald-500/20">
                {skills.map((group) => (
                  <StaggerItem key={group.id}>
                    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-3 h-full">
                      <h3 className="text-xs font-mono text-emerald-400 font-bold uppercase">{`// ${group.category}`}</h3>
                      <div className="flex flex-wrap gap-2">
                        {group.skills.map((skill, i) => (
                          <motion.span
                            key={i}
                            whileHover={{ scale: 1.05 }}
                            className="px-2.5 py-1 rounded text-xs font-mono bg-slate-800 text-slate-200 border border-slate-700"
                          >
                            {skill}
                          </motion.span>
                        ))}
                      </div>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
              <div className="text-emerald-400 font-mono text-sm">&#125;</div>
            </section>
          </SectionReveal>
        )}

        {/* Education Section */}
        {!hidden.education && education && education.length > 0 && (
          <SectionReveal id="education">
            <section className="space-y-6">
              <div className="flex items-center gap-2 text-emerald-400 font-mono text-sm">
                <GraduationCap className="h-4 w-4" />
                <span>class Education extends Background</span>
              </div>
              <StaggerContainer className="grid md:grid-cols-2 gap-6 pl-4 border-l-2 border-emerald-500/20">
                {education.map((edu) => (
                  <StaggerItem key={edu.id}>
                    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-2 h-full">
                      <h3 className="font-bold text-white text-sm">{edu.degree} {edu.field ? `in ${edu.field}` : ''}</h3>
                      <p className="text-emerald-400 text-xs">{edu.institution}</p>
                      <p className="text-[11px] text-slate-400 font-mono">{edu.period}</p>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </section>
          </SectionReveal>
        )}

        {/* Verified Certificates */}
        {items && items.length > 0 && (
          <SectionReveal id="certificates">
            <section className="space-y-6">
              <div className="flex items-center gap-2 text-emerald-400 font-mono text-sm">
                <Award className="h-4 w-4" />
                <span>const verifiedCertificates = [</span>
              </div>
              <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 pl-4 border-l-2 border-emerald-500/20">
                {items.map((file) => (
                  <StaggerItem key={file.id}>
                    <motion.div
                      whileHover={{ y: -4 }}
                      className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between space-y-3 h-full shadow-md"
                    >
                      <div>
                        <span className="text-[10px] font-mono text-emerald-400 uppercase">{file.category || 'Certificate'}</span>
                        <h3 className="font-bold text-sm text-white truncate mt-1">{file.name}</h3>
                      </div>
                      {file.public_url && (
                        <a
                          href={file.public_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-mono text-emerald-400 hover:underline flex items-center gap-1 pt-2 border-t border-slate-800"
                        >
                          View Credential <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </motion.div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
              <div className="text-emerald-400 font-mono text-sm">]</div>
            </section>
          </SectionReveal>
        )}

        {/* Contact Terminal Footer */}
        {!hidden.contact && contact && (
          <SectionReveal id="contact">
            <section className="bg-slate-900/80 border border-slate-800 rounded-2xl p-8 text-center space-y-4 max-w-2xl mx-auto font-mono">
              <h2 className="text-2xl font-bold text-white">{contact.heading}</h2>
              <p className="text-slate-300 text-xs font-sans">{contact.subheading}</p>
              {contact.email && (
                <a
                  href={`mailto:${contact.email}`}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition-colors shadow-lg active:scale-95"
                >
                  <Mail className="h-4 w-4" /> {contact.email}
                </a>
              )}
            </section>
          </SectionReveal>
        )}
      </div>
    </div>
  )
}

function FileCodeIcon() {
  return (
    <svg className="h-4 w-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  )
}
