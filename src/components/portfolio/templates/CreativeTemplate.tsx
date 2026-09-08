'use client'

import React from 'react'
import type { PortfolioContent, PortfolioThemeId, UserFile } from '@/types'
import { THEMES } from './theme-config'
import { SectionReveal } from '@/components/motion/SectionReveal'
import { StaggerContainer } from '@/components/motion/StaggerContainer'
import { StaggerItem } from '@/components/motion/StaggerItem'
import { Sparkles, ArrowUpRight, Mail, Briefcase, GraduationCap, Code, Award, ExternalLink } from 'lucide-react'
import { motion } from 'framer-motion'
import { ProjectAppPreview } from './ProjectAppPreview'
import { getExperienceTypeLabel, getCleanDescription } from './template-utils'

interface TemplateProps {
  content: PortfolioContent
  theme: PortfolioThemeId
  items?: UserFile[]
}

export function CreativeTemplate({ content, theme, items }: TemplateProps) {
  const themeConfig = THEMES[theme] || THEMES.violet
  const { hero, about, experience, education, skills, projects, certifications, contact } = content
  const hidden = content.hidden_sections || {}

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans antialiased relative overflow-x-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/15 rounded-full blur-[140px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/3 right-10 w-[400px] h-[400px] bg-blue-600/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 py-20 relative z-10 space-y-24">
        {/* Creative Hero */}
        {!hidden.hero && (
          <SectionReveal id="top">
            <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-10">
              <div className="space-y-8 max-w-2xl flex-1">
                {hero.availability && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-semibold text-purple-300"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>{hero.availability}</span>
                  </motion.div>
                )}
                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight bg-gradient-to-r from-white via-purple-100 to-purple-400 bg-clip-text text-transparent leading-[1.08] break-words">
                  {hero.full_name}
                </h1>
                <p className="text-2xl font-medium text-purple-200/90">{hero.title}</p>
                <p className="text-lg text-slate-300 leading-relaxed">{hero.summary}</p>
                <div className="flex flex-wrap gap-4 pt-4">
                  <a
                    href={hero.cta_primary_url || '#projects'}
                    className="px-7 py-3.5 rounded-2xl bg-white text-slate-950 font-bold hover:bg-purple-100 transition-all hover:scale-105 shadow-lg shadow-purple-500/10 active:scale-95"
                  >
                    {hero.cta_primary_label || 'View Work'}
                  </a>
                  {contact.email && (
                    <a
                      href={hero.cta_secondary_url || `mailto:${contact.email}`}
                      className="px-7 py-3.5 rounded-2xl bg-white/10 text-white font-bold hover:bg-white/20 transition-all hover:scale-105 border border-white/10 active:scale-95"
                    >
                      {hero.cta_secondary_label || "Let's Talk"}
                    </a>
                  )}
                </div>
              </div>

              {/* Profile Avatar / Photo Container with Animated Glow & Edge Matching */}
              {hero.avatar_url && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.85, rotate: -2 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  className="relative group flex-shrink-0 mt-4 md:mt-0"
                >
                  {/* Outer Glow Aura */}
                  <div className="absolute -inset-2 bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-600 rounded-3xl blur-xl opacity-60 group-hover:opacity-90 transition-opacity duration-500 animate-pulse" />
                  
                  {/* Glassmorphism Border Frame */}
                  <div className="relative w-56 h-56 sm:w-64 sm:h-64 rounded-3xl p-2 bg-slate-900/90 border border-purple-500/40 backdrop-blur-2xl shadow-2xl overflow-hidden transition-all duration-500 group-hover:scale-[1.04] group-hover:rotate-1">
                    <img
                      src={hero.avatar_url}
                      alt={hero.full_name}
                      className="w-full h-full object-cover rounded-2xl transition-all duration-700 filter group-hover:brightness-110 drop-shadow-2xl"
                    />
                    {/* Ambient Lighting Overlay */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-purple-950/40 via-transparent to-transparent opacity-80 pointer-events-none" />
                  </div>
                </motion.div>
              )}
            </div>
          </SectionReveal>
        )}

        {/* About Section */}
        {!hidden.about && about && (
          <SectionReveal id="about">
            <div className="space-y-8 bg-white/5 border border-white/10 backdrop-blur-md rounded-3xl p-8 hover:border-purple-500/30 transition-colors">
              <h2 className="text-3xl font-extrabold tracking-tight text-white">About Me</h2>
              <div className="space-y-4">
                {about.biography && about.biography.trim() !== hero.summary?.trim() && (
                  <p className="text-slate-300 leading-relaxed whitespace-pre-line text-base">{about.biography}</p>
                )}
                {about.career_direction && (
                  <p className="text-purple-300 font-medium italic border-l-2 border-purple-400 pl-4 py-1">
                    {about.career_direction}
                  </p>
                )}
              </div>
            </div>
          </SectionReveal>
        )}

        {/* Projects */}
        {!hidden.projects && projects && projects.length > 0 && (
          <SectionReveal id="projects">
            <div className="space-y-10">
              <h2 className="text-3xl font-extrabold tracking-tight text-white">Featured Projects</h2>
              <StaggerContainer className="grid md:grid-cols-2 gap-8">
                {projects.map((p) => (
                  <StaggerItem key={p.id}>
                    <motion.div
                      whileHover={{ y: -6, scale: 1.01 }}
                      transition={{ duration: 0.2 }}
                      className="group h-full bg-white/5 border border-white/10 backdrop-blur-md rounded-3xl p-6 sm:p-8 hover:bg-white/10 hover:border-purple-500/40 transition-all duration-300 flex flex-col justify-between shadow-xl"
                    >
                      <div>
                        {/* Interactive App Preview Window */}
                        <ProjectAppPreview project={p} />

                        <div className="flex items-center justify-between gap-4 mb-3">
                          <h3 className="text-2xl font-bold text-white group-hover:text-purple-300 transition-colors">{p.title}</h3>
                          {p.live_url && (
                            <a href={p.live_url} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-white/10 text-white hover:bg-purple-500/20 hover:text-purple-300 transition-colors">
                              <ArrowUpRight className="h-5 w-5" />
                            </a>
                          )}
                        </div>
                        <p className="text-slate-300 text-sm leading-relaxed mb-6">{p.description}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {p.technologies.map((t, i) => (
                          <span key={i} className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">{t}</span>
                        ))}
                      </div>
                    </motion.div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          </SectionReveal>
        )}

        {/* Experience Section */}
        {!hidden.experience && experience && experience.length > 0 && (
          <SectionReveal id="experience">
            <div className="space-y-8">
              <h2 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
                <Briefcase className="h-7 w-7 text-purple-400" /> Experience
              </h2>
              <StaggerContainer className="space-y-6">
                {experience.map((exp) => {
                  const typeLabel = getExperienceTypeLabel(exp)
                  const cleanDesc = getCleanDescription(exp.description, exp.bullets)
                  return (
                    <StaggerItem key={exp.id}>
                      <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-3xl p-8 space-y-3 hover:border-purple-500/30 transition-colors">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="text-xl font-bold text-white">{exp.role}</h3>
                              {typeLabel && (
                                <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                                  {typeLabel}
                                </span>
                              )}
                            </div>
                            <p className="text-purple-300 font-medium text-sm">{exp.company}{exp.location ? `, ${exp.location}` : ''}</p>
                          </div>
                          <span className="text-xs px-3 py-1 rounded-full bg-white/10 text-slate-300 font-mono w-fit">{exp.period}</span>
                        </div>
                        {cleanDesc && <p className="text-slate-300 text-sm leading-relaxed">{cleanDesc}</p>}
                        {exp.bullets && exp.bullets.length > 0 && (
                          <ul className="space-y-2 pt-2 border-t border-white/10">
                            {exp.bullets.map((bullet, i) => (
                              <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-purple-400 mt-2 flex-shrink-0" />
                                <span>{bullet}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </StaggerItem>
                  )
                })}
              </StaggerContainer>
            </div>
          </SectionReveal>
        )}

        {/* Skills Section */}
        {!hidden.skills && skills && skills.length > 0 && (
          <SectionReveal id="skills">
            <div className="space-y-8">
              <h2 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
                <Code className="h-7 w-7 text-purple-400" /> Skills & Tech
              </h2>
              <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {skills.map((group) => (
                  <StaggerItem key={group.id}>
                    <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-3xl p-6 hover:border-purple-500/30 transition-colors h-full">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-purple-300 mb-4">{group.category}</h3>
                      <div className="flex flex-wrap gap-2">
                        {group.skills.map((skill, i) => (
                          <motion.span
                            key={i}
                            whileHover={{ scale: 1.08 }}
                            className="px-3 py-1 rounded-xl text-xs font-semibold bg-white/10 text-slate-200 border border-white/10 transition-colors hover:border-purple-400"
                          >
                            {skill}
                          </motion.span>
                        ))}
                      </div>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          </SectionReveal>
        )}

        {/* Education Section */}
        {!hidden.education && education && education.length > 0 && (
          <SectionReveal id="education">
            <div className="space-y-8">
              <h2 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
                <GraduationCap className="h-7 w-7 text-purple-400" /> Education
              </h2>
              <StaggerContainer className="grid md:grid-cols-2 gap-6">
                {education.map((edu) => (
                  <StaggerItem key={edu.id}>
                    <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-3xl p-6 space-y-2 hover:border-purple-500/30 transition-colors h-full">
                      <h3 className="font-bold text-lg text-white">{edu.degree} {edu.field ? `in ${edu.field}` : ''}</h3>
                      <p className="text-purple-300 text-sm">{edu.institution}</p>
                      <p className="text-xs text-slate-400 font-mono">{edu.period}</p>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          </SectionReveal>
        )}

        {/* Uploaded Verified Certificate Files */}
        {items && items.length > 0 && (
          <SectionReveal id="certificates">
            <div className="space-y-8">
              <h2 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
                <Award className="h-7 w-7 text-purple-400" /> Verified Credentials & Certificates
              </h2>
              <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((file) => (
                  <StaggerItem key={file.id}>
                    <motion.div
                      whileHover={{ y: -4 }}
                      className="bg-white/5 border border-white/10 backdrop-blur-md rounded-3xl p-6 flex flex-col justify-between space-y-4 hover:border-purple-500/40 transition-all h-full shadow-lg"
                    >
                      <div>
                        <span className="text-xs font-semibold text-purple-300 uppercase tracking-wider">{file.category || 'Certificate'}</span>
                        <h3 className="font-bold text-base text-white mt-1 truncate">{file.name}</h3>
                      </div>
                      {file.public_url && (
                        <a
                          href={file.public_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-bold text-purple-300 hover:text-white flex items-center gap-1.5 border-t border-white/10 pt-3"
                        >
                          View Credential <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      )}
                    </motion.div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          </SectionReveal>
        )}

        {/* Contact Section */}
        {!hidden.contact && contact && (
          <SectionReveal id="contact">
            <div className="text-center space-y-6 pt-12 border-t border-white/10 max-w-2xl mx-auto">
              <h2 className="text-4xl font-extrabold text-white">{contact.heading}</h2>
              <p className="text-slate-300 text-base">{contact.subheading}</p>
              {contact.email && (
                <a
                  href={`mailto:${contact.email}`}
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-slate-950 font-bold hover:bg-purple-100 transition-all hover:scale-105 shadow-lg active:scale-95"
                >
                  <Mail className="h-4 w-4" /> {contact.email}
                </a>
              )}
            </div>
          </SectionReveal>
        )}
      </div>
    </div>
  )
}

