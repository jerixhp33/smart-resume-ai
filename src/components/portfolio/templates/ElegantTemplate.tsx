'use client'

import React from 'react'
import type { PortfolioContent, PortfolioThemeId, UserFile } from '@/types'
import { THEMES } from './theme-config'
import { Sparkles, Mail, ExternalLink, Briefcase, GraduationCap, Award, Code } from 'lucide-react'
import { GithubIcon } from '@/components/ui/icons'

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
        <header className="space-y-6 text-center max-w-3xl mx-auto">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Sparkles className="h-8 w-8" />
          </div>
          <h1 className="text-5xl sm:text-7xl font-serif tracking-tight text-white">{hero.full_name}</h1>
          <p className="text-xl font-medium text-amber-400">{hero.title}</p>
          <p className="text-slate-300 text-base leading-relaxed">{hero.summary}</p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            {contact.email && (
              <a
                href={`mailto:${contact.email}`}
                className="px-8 py-3.5 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-amber-500/10 flex items-center gap-2"
              >
                <Mail className="h-4 w-4" /> Connect with Me
              </a>
            )}
            {contact.github_url && (
              <a
                href={contact.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-3.5 rounded-full bg-slate-900 border border-slate-800 text-slate-200 font-bold text-sm hover:border-amber-500/40 transition-all flex items-center gap-2"
              >
                <GithubIcon className="h-4 w-4" /> GitHub
              </a>
            )}
          </div>
        </header>
      )}

      {/* About Section */}
      {!hidden.about && about && (
        <section id="about" className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8 space-y-4">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-amber-400">About Me</h2>
          {about.biography && about.biography.trim() !== hero.summary?.trim() && (
            <p className="text-slate-300 text-base leading-relaxed whitespace-pre-line">{about.biography}</p>
          )}
          {about.career_direction && (
            <p className="text-amber-400/90 text-sm font-serif italic border-l-2 border-amber-400 pl-4 py-1">
              {about.career_direction}
            </p>
          )}
        </section>
      )}

      {/* Crafted Projects */}
      {!hidden.projects && projects && projects.length > 0 && (
        <section id="projects" className="space-y-8">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-center text-amber-400/80">Crafted Work</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {projects.map((p) => (
              <div key={p.id} className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 space-y-4 hover:border-amber-500/40 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-4 mb-2">
                    <h3 className="text-2xl font-serif font-bold text-white">{p.title}</h3>
                    <div className="flex items-center gap-2 text-slate-400">
                      {p.github_url && <a href={p.github_url} target="_blank" rel="noopener noreferrer" className="hover:text-amber-400"><GithubIcon className="h-4 w-4" /></a>}
                      {p.live_url && <a href={p.live_url} target="_blank" rel="noopener noreferrer" className="hover:text-amber-400"><ExternalLink className="h-4 w-4" /></a>}
                    </div>
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed">{p.description}</p>
                </div>
                <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-800/80">
                  {p.technologies.map((t, i) => (
                    <span key={i} className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 text-xs">{t}</span>
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
          <h2 className="text-sm font-semibold uppercase tracking-widest text-center text-amber-400/80 flex items-center justify-center gap-2">
            <Briefcase className="h-4 w-4" /> Professional Experience
          </h2>
          <div className="space-y-6">
            {experience.map((exp) => (
              <div key={exp.id} className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-xl font-serif font-bold text-white">{exp.role}</h3>
                    <p className="text-amber-400 font-medium text-sm">{exp.company}</p>
                  </div>
                  <span className="text-xs px-3 py-1 rounded-full bg-slate-800 text-slate-400 font-mono w-fit">{exp.period}</span>
                </div>
                {exp.description && <p className="text-slate-300 text-sm leading-relaxed">{exp.description}</p>}
                {exp.bullets && exp.bullets.length > 0 && (
                  <ul className="space-y-1.5 pt-2 border-t border-slate-800">
                    {exp.bullets.map((b, i) => (
                      <li key={i} className="text-xs text-slate-400 flex items-start gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                        <span>{b}</span>
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
          <h2 className="text-sm font-semibold uppercase tracking-widest text-center text-amber-400/80 flex items-center justify-center gap-2">
            <Code className="h-4 w-4" /> Technical Capabilities
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {skills.map((group) => (
              <div key={group.id} className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-3">
                <h3 className="text-xs font-bold uppercase text-amber-400">{group.category}</h3>
                <div className="flex flex-wrap gap-2">
                  {group.skills.map((s, i) => (
                    <span key={i} className="px-3 py-1 rounded-full bg-slate-800 text-slate-200 text-xs font-medium">{s}</span>
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
          <h2 className="text-sm font-semibold uppercase tracking-widest text-center text-amber-400/80 flex items-center justify-center gap-2">
            <GraduationCap className="h-4 w-4" /> Education
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {education.map((edu) => (
              <div key={edu.id} className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-1">
                <h3 className="font-serif font-bold text-lg text-white">{edu.degree} {edu.field ? `in ${edu.field}` : ''}</h3>
                <p className="text-amber-400 text-sm">{edu.institution}</p>
                <p className="text-xs text-slate-500 font-mono">{edu.period}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Verified Credentials & Certificates */}
      {items && items.length > 0 && (
        <section id="certificates" className="space-y-8">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-center text-amber-400/80 flex items-center justify-center gap-2">
            <Award className="h-4 w-4" /> Verified Credentials
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((file) => (
              <div key={file.id} className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-3 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-amber-400">{file.category || 'Certificate'}</span>
                  <h3 className="font-bold text-sm text-white truncate mt-1">{file.name}</h3>
                </div>
                {file.public_url && (
                  <a href={file.public_url} target="_blank" rel="noopener noreferrer" className="text-xs text-amber-400 font-semibold hover:underline flex items-center gap-1">
                    View Document <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Contact Section */}
      {!hidden.contact && contact && (
        <footer id="contact" className="text-center space-y-6 pt-12 border-t border-slate-800/80 max-w-2xl mx-auto">
          <h2 className="text-3xl font-serif text-white">{contact.heading}</h2>
          <p className="text-slate-400 text-sm">{contact.subheading}</p>
          {contact.email && (
            <a
              href={`mailto:${contact.email}`}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-all shadow-lg"
            >
              <Mail className="h-4 w-4" /> Send Email
            </a>
          )}
        </footer>
      )}
      </div>
    </div>
  )
}
