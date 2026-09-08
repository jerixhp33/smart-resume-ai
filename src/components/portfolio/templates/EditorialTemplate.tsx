'use client'

import React from 'react'
import type { PortfolioContent, PortfolioThemeId, UserFile } from '@/types'
import { THEMES } from './theme-config'
import { ExternalLink, Mail, Award, BookOpen, Briefcase, GraduationCap } from 'lucide-react'
import { GithubIcon } from '@/components/ui/icons'

interface TemplateProps {
  content: PortfolioContent
  theme: PortfolioThemeId
  items?: UserFile[]
}

export function EditorialTemplate({ content, theme, items }: TemplateProps) {
  const { hero, about, experience, education, skills, projects, contact } = content
  const hidden = content.hidden_sections || {}

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#1c1917] font-serif antialiased max-w-4xl mx-auto px-8 py-20 space-y-24">
      {/* Monograph Header / Hero */}
      {!hidden.hero && (
        <header className="border-b border-[#e7e5e4] pb-16 space-y-6">
          <p className="text-xs uppercase tracking-[0.2em] text-[#78716c] font-sans font-semibold">Portfolio & Monograph</p>
          <h1 className="text-6xl font-light tracking-tight text-[#0c0a09] leading-none">{hero.full_name}</h1>
          <p className="text-xl italic text-[#57534e] font-normal">{hero.title}</p>
          <p className="text-lg leading-relaxed text-[#292524] max-w-2xl pt-2">{hero.summary}</p>

          <div className="flex flex-wrap items-center gap-6 pt-4 font-sans text-xs font-semibold uppercase tracking-widest">
            {contact.email && (
              <a href={`mailto:${contact.email}`} className="text-[#0c0a09] underline underline-offset-4 hover:text-[#57534e]">
                Direct Mail
              </a>
            )}
            {contact.github_url && (
              <a href={contact.github_url} target="_blank" rel="noopener noreferrer" className="text-[#0c0a09] underline underline-offset-4 hover:text-[#57534e]">
                GitHub Monograph
              </a>
            )}
          </div>
        </header>
      )}

      {/* About Section */}
      {!hidden.about && about && (
        <section id="about" className="space-y-6 border-b border-[#e7e5e4] pb-16">
          <h2 className="text-xs uppercase tracking-[0.2em] text-[#78716c] font-sans font-bold">Biography & Direction</h2>
          {about.biography && about.biography.trim() !== hero.summary?.trim() && (
            <p className="text-xl leading-relaxed text-[#292524] font-normal">{about.biography}</p>
          )}
          {about.career_direction && (
            <p className="text-base italic text-[#57534e] border-l-2 border-[#1c1917] pl-4 py-1">
              "{about.career_direction}"
            </p>
          )}
        </section>
      )}

      {/* Selected Works (Projects) */}
      {!hidden.projects && projects && projects.length > 0 && (
        <section id="projects" className="space-y-12">
          <h2 className="text-xs uppercase tracking-[0.2em] text-[#78716c] font-sans font-bold">Selected Works</h2>
          <div className="space-y-16">
            {projects.map((p, idx) => (
              <div key={p.id} className="grid md:grid-cols-12 gap-6 items-baseline border-b border-[#e7e5e4] pb-12">
                <span className="md:col-span-1 text-xs font-mono text-[#a8a29e]">0{idx + 1}</span>
                <div className="md:col-span-11 space-y-3">
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="text-2xl font-normal text-[#0c0a09]">{p.title}</h3>
                    <div className="flex items-center gap-3 font-sans text-xs text-[#78716c]">
                      {p.github_url && <a href={p.github_url} target="_blank" rel="noopener noreferrer" className="hover:text-[#0c0a09]">GitHub</a>}
                      {p.live_url && <a href={p.live_url} target="_blank" rel="noopener noreferrer" className="hover:text-[#0c0a09]">Live Project</a>}
                    </div>
                  </div>
                  <p className="text-base text-[#44403c] leading-relaxed font-sans">{p.description}</p>
                  <div className="flex flex-wrap gap-3 pt-2 font-sans text-xs text-[#78716c]">
                    {p.technologies.map((t, i) => (
                      <span key={i}>— {t}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Experience Section */}
      {!hidden.experience && experience && experience.length > 0 && (
        <section id="experience" className="space-y-12">
          <h2 className="text-xs uppercase tracking-[0.2em] text-[#78716c] font-sans font-bold">Career & Positions</h2>
          <div className="space-y-12">
            {experience.map((exp, idx) => (
              <div key={exp.id} className="grid md:grid-cols-12 gap-6 items-baseline border-b border-[#e7e5e4] pb-10">
                <span className="md:col-span-3 text-xs font-sans text-[#78716c] uppercase tracking-wider">{exp.period}</span>
                <div className="md:col-span-9 space-y-2">
                  <h3 className="text-xl font-normal text-[#0c0a09]">{exp.role} <span className="italic text-[#57534e]">at {exp.company}</span></h3>
                  {exp.description && <p className="text-sm text-[#44403c] font-sans leading-relaxed">{exp.description}</p>}
                  {exp.bullets && exp.bullets.length > 0 && (
                    <ul className="space-y-1.5 pt-2 font-sans text-xs text-[#57534e]">
                      {exp.bullets.map((b, i) => (
                        <li key={i}>• {b}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills Section */}
      {!hidden.skills && skills && skills.length > 0 && (
        <section id="skills" className="space-y-8 border-b border-[#e7e5e4] pb-16">
          <h2 className="text-xs uppercase tracking-[0.2em] text-[#78716c] font-sans font-bold">Skills & Expertise</h2>
          <div className="grid sm:grid-cols-2 gap-8 font-sans">
            {skills.map((group) => (
              <div key={group.id} className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#0c0a09]">{group.category}</h3>
                <p className="text-sm text-[#57534e] leading-relaxed">
                  {group.skills.join('  •  ')}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education Section */}
      {!hidden.education && education && education.length > 0 && (
        <section id="education" className="space-y-8 border-b border-[#e7e5e4] pb-16">
          <h2 className="text-xs uppercase tracking-[0.2em] text-[#78716c] font-sans font-bold">Education</h2>
          <div className="space-y-6">
            {education.map((edu) => (
              <div key={edu.id} className="flex justify-between items-baseline font-sans">
                <div>
                  <h3 className="text-base font-semibold text-[#0c0a09]">{edu.degree} {edu.field ? `in ${edu.field}` : ''}</h3>
                  <p className="text-xs text-[#78716c]">{edu.institution}</p>
                </div>
                <span className="text-xs text-[#a8a29e] font-mono">{edu.period}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Verified Credentials & Certificates */}
      {items && items.length > 0 && (
        <section id="certificates" className="space-y-8 border-b border-[#e7e5e4] pb-16">
          <h2 className="text-xs uppercase tracking-[0.2em] text-[#78716c] font-sans font-bold">Verified Credentials</h2>
          <div className="grid sm:grid-cols-2 gap-6 font-sans">
            {items.map((file) => (
              <div key={file.id} className="p-4 border border-[#e7e5e4] rounded-lg flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-[#0c0a09]">{file.name}</p>
                  <p className="text-[10px] text-[#78716c] capitalize">{file.category || 'Certificate'}</p>
                </div>
                {file.public_url && (
                  <a href={file.public_url} target="_blank" rel="noopener noreferrer" className="text-xs text-[#0c0a09] underline font-medium">
                    Document
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Contact & Inquiries */}
      {!hidden.contact && contact && (
        <footer id="contact" className="pt-8 text-center font-sans text-sm text-[#78716c] space-y-4">
          <p className="text-base font-serif italic text-[#1c1917]">{contact.heading}</p>
          {contact.email && (
            <p>Direct inquiries to <a href={`mailto:${contact.email}`} className="text-[#0c0a09] font-medium underline">{contact.email}</a></p>
          )}
        </footer>
      )}
    </div>
  )
}
