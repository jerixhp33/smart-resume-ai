'use client'

import React from 'react'
import type { PortfolioContent, PortfolioThemeId, UserFile } from '@/types'
import { THEMES } from './theme-config'
import { SectionReveal } from '@/components/motion/SectionReveal'
import { StaggerContainer } from '@/components/motion/StaggerContainer'
import { StaggerItem } from '@/components/motion/StaggerItem'
import { Sparkles, Mail, ExternalLink, Briefcase, GraduationCap, Award, Code } from 'lucide-react'
import { GithubIcon } from '@/components/ui/icons'
import { motion } from 'framer-motion'

interface TemplateProps {
  content: PortfolioContent
  theme: PortfolioThemeId
  items?: UserFile[]
}

export function ElegantTemplate({ content, theme, items }: TemplateProps) {
  const { hero, about, experience, education, skills, projects, contact } = content
  const hidden = content.hidden_sections || {}

  return (
    <div className="w-full min-h-screen bg-slate-950 text-slate-100 font-sans antialiased">
      <div className="max-w-5xl mx-auto px-6 py-20 space-y-24">
      {/* Header / Hero */}
      {!hidden.hero && (
        <SectionReveal id="top">
          <header className="space-y-6 text-center max-w-3xl mx-auto">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400"
            >
              <Sparkles className="h-8 w-8" />
            </motion.div>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif tracking-tight text-white break-words">{hero.full_name}</h1>
            <p className="text-xl font-medium text-amber-400">{hero.title}</p>
            <p className="text-slate-300 text-base leading-relaxed">{hero.summary}</p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              {contact.email && (
                <a
                  href={`mailto:${contact.email}`}
                  className="px-8 py-3.5 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-amber-500/10 flex items-center gap-2 active:scale-95"
                >
                  <Mail className="h-4 w-4" /> Connect with Me
                </a>
              )}
              {contact.github_url && (
                <a
                  href={contact.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-3.5 rounded-full bg-slate-900 border border-slate-800 text-slate-200 font-bold text-sm hover:border-amber-500/40 transition-all flex items-center gap-2 active:scale-95"
                >
                  <GithubIcon className="h-4 w-4" /> GitHub
                </a>
              )}
            </div>
          </header>
        </SectionReveal>
      )}

      {/* About Section */}
      {!hidden.about && about && (
        <SectionReveal id="about">
          <section className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8 space-y-4 hover:border-amber-500/20 transition-colors">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-amber-400">About Me</h2>
            {about.biography && about.biography.trim() !== hero.summary?.trim() && (
              <p className="text-slate-300 text-base leading-relaxed whitespace-pre-line">{about.biography}</p>
            )}
            {about.career_direction && (
              <p className="text-amber-300 font-serif italic border-l-2 border-amber-400 pl-4 py-1 text-sm">
                {about.career_direction}
              </p>
            )}
          </section>
        </SectionReveal>
      )}

      {/* Projects Section */}
      {!hidden.projects && projects && projects.length > 0 && (
        <SectionReveal id="projects">
          <section className="space-y-8">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-amber-400 text-center">Selected Projects</h2>
            <StaggerContainer className="grid md:grid-cols-2 gap-8">
              {projects.map((p) => (
                <StaggerItem key={p.id}>
                  <motion.div
                    whileHover={{ y: -5 }}
                    className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 space-y-4 hover:border-amber-500/30 transition-all flex flex-col justify-between h-full shadow-xl"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-4 mb-2">
                        <h3 className="text-xl font-serif font-bold text-white">{p.title}</h3>
                        {p.live_url && (
                          <a href={p.live_url} target="_blank" rel="noopener noreferrer" className="text-amber-400 p-1 hover:scale-110 transition-transform">
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )}
                      </div>
                      <p className="text-slate-300 text-sm leading-relaxed">{p.description}</p>
                    </div>
                    <div className="flex flex-wrap gap-2 pt-3 border-t border-slate-800">
                      {p.technologies.map((t, i) => (
                        <span key={i} className="px-3 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-300 border border-amber-500/20">
                          {t}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </section>
        </SectionReveal>
      )}

      {/* Experience Section */}
      {!hidden.experience && experience && experience.length > 0 && (
        <SectionReveal id="experience">
          <section className="space-y-8">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-amber-400 flex items-center gap-2">
              <Briefcase className="h-4 w-4" /> Professional Journey
            </h2>
            <StaggerContainer className="space-y-6">
              {experience.map((exp) => (
                <StaggerItem key={exp.id}>
                  <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8 space-y-3 hover:border-amber-500/20 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <h3 className="text-lg font-bold text-white">{exp.role}</h3>
                        <p className="text-amber-400 text-sm font-serif">{exp.company}</p>
                      </div>
                      <span className="text-xs px-3 py-1 rounded-full bg-slate-800 text-slate-300 font-mono w-fit">{exp.period}</span>
                    </div>
                    {exp.description && <p className="text-slate-300 text-sm leading-relaxed">{exp.description}</p>}
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </section>
        </SectionReveal>
      )}

      {/* Skills Section */}
      {!hidden.skills && skills && skills.length > 0 && (
        <SectionReveal id="skills">
          <section className="space-y-8">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-amber-400 flex items-center gap-2">
              <Code className="h-4 w-4" /> Expertise & Skills
            </h2>
            <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {skills.map((group) => (
                <StaggerItem key={group.id}>
                  <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 space-y-3 h-full">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400">{group.category}</h3>
                    <div className="flex flex-wrap gap-2">
                      {group.skills.map((skill, i) => (
                        <motion.span
                          key={i}
                          whileHover={{ scale: 1.05 }}
                          className="px-3 py-1 rounded-xl text-xs bg-slate-800 text-slate-200 border border-slate-700"
                        >
                          {skill}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </section>
        </SectionReveal>
      )}

      {/* Education Section */}
      {!hidden.education && education && education.length > 0 && (
        <SectionReveal id="education">
          <section className="space-y-8">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-amber-400 flex items-center gap-2">
              <GraduationCap className="h-4 w-4" /> Education
            </h2>
            <StaggerContainer className="grid md:grid-cols-2 gap-6">
              {education.map((edu) => (
                <StaggerItem key={edu.id}>
                  <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 space-y-2 h-full">
                    <h3 className="font-bold text-white text-base">{edu.degree} {edu.field ? `in ${edu.field}` : ''}</h3>
                    <p className="text-amber-400 text-sm font-serif">{edu.institution}</p>
                    <p className="text-xs text-slate-400 font-mono">{edu.period}</p>
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
          <section className="space-y-8">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-amber-400 flex items-center gap-2">
              <Award className="h-4 w-4" /> Verified Credentials
            </h2>
            <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((file) => (
                <StaggerItem key={file.id}>
                  <motion.div
                    whileHover={{ y: -4 }}
                    className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between space-y-4 h-full shadow-lg"
                  >
                    <div>
                      <span className="text-[10px] font-semibold text-amber-400 uppercase tracking-wider">{file.category || 'Certificate'}</span>
                      <h3 className="font-bold text-base text-white mt-1 truncate">{file.name}</h3>
                    </div>
                    {file.public_url && (
                      <a
                        href={file.public_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-bold text-amber-400 hover:text-white flex items-center gap-1.5 pt-3 border-t border-slate-800"
                      >
                        View Credential <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </motion.div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </section>
        </SectionReveal>
      )}

      {/* Contact Section */}
      {!hidden.contact && contact && (
        <SectionReveal id="contact">
          <section className="text-center space-y-6 pt-16 border-t border-slate-800 max-w-2xl mx-auto">
            <h2 className="text-4xl font-serif text-white">{contact.heading}</h2>
            <p className="text-slate-300 text-base">{contact.subheading}</p>
            {contact.email && (
              <a
                href={`mailto:${contact.email}`}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 transition-all shadow-lg active:scale-95"
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
