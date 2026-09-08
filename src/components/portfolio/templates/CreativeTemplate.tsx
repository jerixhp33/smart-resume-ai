'use client'

import React from 'react'
import type { PortfolioContent, PortfolioThemeId, UserFile } from '@/types'
import { THEMES } from './theme-config'
import { SectionReveal } from '@/components/motion/SectionReveal'
import { Sparkles, ArrowUpRight, Mail, Briefcase, GraduationCap, Code, Award, CheckCircle2, ExternalLink } from 'lucide-react'
import { GithubIcon } from '@/components/ui/icons'

interface TemplateProps {
  content: PortfolioContent
  theme: PortfolioThemeId
  items?: UserFile[]
}

export function CreativeTemplate({ content, theme, items }: TemplateProps) {
  const themeConfig = THEMES[theme] || THEMES.violet
  const { hero, about, experience, education, skills, projects, certifications, achievements, contact } = content
  const hidden = content.hidden_sections || {}

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans antialiased relative overflow-x-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-10 w-[400px] h-[400px] bg-blue-600/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 py-20 relative z-10 space-y-24">
        {/* Creative Hero */}
        {!hidden.hero && (
          <section className="space-y-8 max-w-4xl">
            {hero.availability && (
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-semibold text-purple-300">
                <Sparkles className="h-3.5 w-3.5" />
                <span>{hero.availability}</span>
              </div>
            )}
            <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight bg-gradient-to-r from-white via-purple-100 to-purple-400 bg-clip-text text-transparent leading-[1.08]">
              {hero.full_name}
            </h1>
            <p className="text-2xl font-medium text-purple-200/90">{hero.title}</p>
            <p className="text-lg text-slate-300 leading-relaxed max-w-2xl">{hero.summary}</p>
            <div className="flex flex-wrap gap-4 pt-4">
              {contact.email && (
                <a href={`mailto:${contact.email}`} className="px-7 py-3.5 rounded-2xl bg-white text-slate-950 font-bold hover:bg-purple-100 transition-colors shadow-lg shadow-purple-500/10">
                  {hero.cta_primary_label || "Let's Talk"}
                </a>
              )}
            </div>
          </section>
        )}

        {/* About Section */}
        {!hidden.about && about && (
          <section id="about" className="space-y-8 bg-white/5 border border-white/10 backdrop-blur-md rounded-3xl p-8">
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
          </section>
        )}

        {/* Projects */}
        {!hidden.projects && projects && projects.length > 0 && (
          <section id="projects" className="space-y-10">
            <h2 className="text-3xl font-extrabold tracking-tight text-white">Featured Projects</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {projects.map((p) => (
                <div key={p.id} className="group bg-white/5 border border-white/10 backdrop-blur-md rounded-3xl p-8 hover:bg-white/10 hover:border-white/20 transition-all duration-300 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-4 mb-4">
                      <h3 className="text-2xl font-bold text-white group-hover:text-purple-300 transition-colors">{p.title}</h3>
                      {p.live_url && (
                        <a href={p.live_url} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20">
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
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Experience Section */}
        {!hidden.experience && experience && experience.length > 0 && (
          <section id="experience" className="space-y-8">
            <h2 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
              <Briefcase className="h-7 w-7 text-purple-400" /> Experience
            </h2>
            <div className="space-y-6">
              {experience.map((exp) => (
                <div key={exp.id} className="bg-white/5 border border-white/10 backdrop-blur-md rounded-3xl p-8 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h3 className="text-xl font-bold text-white">{exp.role}</h3>
                      <p className="text-purple-300 font-medium text-sm">{exp.company}</p>
                    </div>
                    <span className="text-xs px-3 py-1 rounded-full bg-white/10 text-slate-300 font-mono w-fit">{exp.period}</span>
                  </div>
                  {exp.description && <p className="text-slate-300 text-sm leading-relaxed">{exp.description}</p>}
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
              ))}
            </div>
          </section>
        )}

        {/* Skills Section */}
        {!hidden.skills && skills && skills.length > 0 && (
          <section id="skills" className="space-y-8">
            <h2 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
              <Code className="h-7 w-7 text-purple-400" /> Skills & Tech
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {skills.map((group) => (
                <div key={group.id} className="bg-white/5 border border-white/10 backdrop-blur-md rounded-3xl p-6">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-purple-300 mb-4">{group.category}</h3>
                  <div className="flex flex-wrap gap-2">
                    {group.skills.map((skill, i) => (
                      <span key={i} className="px-3 py-1 rounded-xl text-xs font-semibold bg-white/10 text-slate-200 border border-white/10">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education Section */}
        {!hidden.education && education && education.length > 0 && (
          <section id="education" className="space-y-8">
            <h2 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
              <GraduationCap className="h-7 w-7 text-purple-400" /> Education
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {education.map((edu) => (
                <div key={edu.id} className="bg-white/5 border border-white/10 backdrop-blur-md rounded-3xl p-6 space-y-2">
                  <h3 className="font-bold text-lg text-white">{edu.degree} {edu.field ? `in ${edu.field}` : ''}</h3>
                  <p className="text-purple-300 text-sm">{edu.institution}</p>
                  <p className="text-xs text-slate-400 font-mono">{edu.period}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Uploaded Verified Certificate Files */}
        {items && items.length > 0 && (
          <section id="verified-certificates" className="space-y-8">
            <h2 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
              <Award className="h-7 w-7 text-purple-400" /> Verified Credentials & Certificates
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((file) => (
                <div key={file.id} className="bg-white/5 border border-white/10 backdrop-blur-md rounded-3xl p-6 flex flex-col justify-between space-y-4">
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
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Contact Section */}
        {!hidden.contact && contact && (
          <section id="contact" className="text-center space-y-6 pt-12 border-t border-white/10 max-w-2xl mx-auto">
            <h2 className="text-4xl font-extrabold text-white">{contact.heading}</h2>
            <p className="text-slate-300 text-base">{contact.subheading}</p>
            {contact.email && (
              <a href={`mailto:${contact.email}`} className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-slate-950 font-bold hover:bg-purple-100 transition-colors shadow-lg">
                <Mail className="h-4 w-4" /> {contact.email}
              </a>
            )}
          </section>
        )}
      </div>
    </div>
  )
}
