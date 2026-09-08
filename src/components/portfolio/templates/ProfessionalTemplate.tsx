'use client'

import React from 'react'
import type { PortfolioContent, PortfolioThemeId, UserFile } from '@/types'
import { THEMES } from './theme-config'
import { Briefcase, GraduationCap, Mail, Phone, MapPin, Award, Code, FolderGit2, ExternalLink } from 'lucide-react'
import { getExperienceTypeLabel, getCleanDescription } from './template-utils'

interface TemplateProps {
  content: PortfolioContent
  theme: PortfolioThemeId
  items?: UserFile[]
}

export function ProfessionalTemplate({ content, theme, items }: TemplateProps) {
  const themeConfig = THEMES[theme] || THEMES.blue
  const { hero, about, experience, education, skills, projects, contact } = content
  const hidden = content.hidden_sections || {}

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-sans antialiased">
      {/* Header Banner */}
      {!hidden.hero && (
        <div className="bg-slate-900 text-white py-16 border-b border-slate-800">
          <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">{hero.full_name}</h1>
              <p className="text-lg text-blue-400 font-medium mt-1">{hero.title}</p>
              {hero.location && <p className="text-xs text-slate-400 mt-2 flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{hero.location}</p>}
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <a href={hero.cta_primary_url || '#projects'} className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-colors shadow-sm">
                {hero.cta_primary_label || 'View Projects'}
              </a>
              {contact.email && (
                <a href={hero.cta_secondary_url || `mailto:${contact.email}`} className="px-6 py-3 rounded-lg border border-slate-700 text-slate-200 font-semibold text-sm hover:bg-slate-800 transition-colors">
                  {hero.cta_secondary_label || 'Connect via Email'}
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto px-6 py-12 space-y-12">
        {/* Executive Summary / About */}
        {!hidden.about && (
          <section id="about" className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-8 shadow-sm">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">Executive Summary</h2>
            <p className="text-base text-slate-700 dark:text-slate-200 leading-relaxed">
              {about?.biography && about.biography.trim() !== hero.summary?.trim()
                ? about.biography
                : about?.career_direction || hero.summary}
            </p>
          </section>
        )}

        {/* Projects */}
        {!hidden.projects && projects && projects.length > 0 && (
          <section id="projects" className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-8 shadow-sm space-y-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-4">
              <FolderGit2 className="h-5 w-5 text-blue-600" /> Key Projects & Initiatives
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {projects.map((p) => (
                <div key={p.id} className="p-5 border border-slate-200 dark:border-slate-700 rounded-xl space-y-3">
                  <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">{p.title}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{p.description}</p>
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {p.technologies.map((t, i) => (
                      <span key={i} className="px-2.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium">{t}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Experience Timeline */}
        {!hidden.experience && experience && experience.length > 0 && (
          <section id="experience" className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-8 shadow-sm space-y-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-4">
              <Briefcase className="h-5 w-5 text-blue-600" /> Professional Experience
            </h2>
            <div className="space-y-6">
              {experience.map((exp) => {
                const typeLabel = getExperienceTypeLabel(exp)
                const cleanDesc = getCleanDescription(exp.description, exp.bullets)
                return (
                  <div key={exp.id} className="space-y-2 pb-4 border-b border-slate-100 dark:border-slate-700/50 last:border-0 last:pb-0">
                    <div className="flex justify-between items-baseline flex-wrap gap-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
                          {exp.role} <span className="font-medium text-slate-600 dark:text-slate-300">— {exp.company}{exp.location ? `, ${exp.location}` : ''}</span>
                        </h3>
                        {typeLabel && (
                          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300">
                            {typeLabel}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-slate-500 font-semibold">{exp.period}</span>
                    </div>
                    {cleanDesc && <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{cleanDesc}</p>}
                    {exp.bullets && exp.bullets.length > 0 && (
                      <ul className="space-y-1.5 pt-1 text-sm text-slate-600 dark:text-slate-300">
                        {exp.bullets.map((bullet, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-blue-600 mt-2 flex-shrink-0" />
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* Skills */}
        {!hidden.skills && skills && skills.length > 0 && (
          <section id="skills" className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-8 shadow-sm space-y-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-4">
              <Code className="h-5 w-5 text-blue-600" /> Technical Capabilities
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {skills.map((group) => (
                <div key={group.id} className="p-4 border border-slate-200 dark:border-slate-700 rounded-xl space-y-2">
                  <h3 className="text-xs font-bold uppercase text-slate-500">{group.category}</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {group.skills.map((s, i) => (
                      <span key={i} className="px-2.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-medium">{s}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {!hidden.education && education && education.length > 0 && (
          <section id="education" className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-8 shadow-sm space-y-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-4">
              <GraduationCap className="h-5 w-5 text-blue-600" /> Education
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {education.map((edu) => (
                <div key={edu.id} className="p-4 border border-slate-200 dark:border-slate-700 rounded-xl space-y-1">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">{edu.degree} {edu.field ? `in ${edu.field}` : ''}</h3>
                  <p className="text-xs text-blue-600 dark:text-blue-400">{edu.institution}</p>
                  <p className="text-[10px] text-slate-500">{edu.period}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Uploaded Verified Certificate Files */}
        {items && items.length > 0 && (
          <section id="certificates" className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-8 shadow-sm space-y-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-4">
              <Award className="h-5 w-5 text-blue-600" /> Verified Credentials & Certificates
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((file) => (
                <div key={file.id} className="p-4 border border-slate-200 dark:border-slate-700 rounded-xl space-y-3 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] text-blue-600 font-bold uppercase">{file.category || 'Certificate'}</span>
                    <p className="font-bold text-xs text-slate-900 dark:text-slate-100 truncate mt-1">{file.name}</p>
                  </div>
                  {file.public_url && (
                    <a href={file.public_url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1">
                      View Credential <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Contact Section */}
      {!hidden.contact && contact && (
        <footer id="contact" className="max-w-5xl mx-auto px-6 pb-16 text-center space-y-4">
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-8 shadow-sm space-y-4">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{contact.heading}</h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 max-w-xl mx-auto">{contact.subheading}</p>
            {contact.email && (
              <a href={`mailto:${contact.email}`} className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-colors shadow-sm">
                <Mail className="h-4 w-4" /> {contact.email}
              </a>
            )}
          </div>
        </footer>
      )}
    </div>
  )
}
