'use client'

import React from 'react'
import type { PortfolioContent, PortfolioThemeId, UserFile } from '@/types'
import { THEMES } from './theme-config'
import { SectionReveal } from '@/components/motion/SectionReveal'
import { ExternalLink, Mail } from 'lucide-react'
import { GithubIcon } from '@/components/ui/icons'

interface TemplateProps {
  content: PortfolioContent
  theme: PortfolioThemeId
  items?: UserFile[]
}

export function MinimalTemplate({ content, theme, items }: TemplateProps) {
  const themeConfig = THEMES[theme] || THEMES.neutral
  const { hero, about, experience, education, skills, projects, contact } = content
  const hidden = content.hidden_sections || {}

  return (
    <div className="w-full min-h-screen bg-background text-foreground font-sans antialiased">
      <div className="max-w-4xl mx-auto px-6 py-16 space-y-20">
      {/* Header / Hero */}
      {!hidden.hero && (
        <header className="space-y-4 border-b border-border pb-12">
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground">{hero.full_name}</h1>
          <p className="text-lg font-medium text-muted-foreground">{hero.title}</p>
          <p className="text-base text-foreground/80 leading-relaxed max-w-2xl">{hero.summary}</p>
          <div className="flex items-center gap-4 pt-2">
            {contact.email && (
              <a href={`mailto:${contact.email}`} className="text-xs font-semibold underline underline-offset-4 hover:text-primary">
                {contact.email}
              </a>
            )}
            {contact.github_url && (
              <a href={contact.github_url} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold underline underline-offset-4 hover:text-primary">
                GitHub
              </a>
            )}
          </div>
        </header>
      )}

      {/* About */}
      {!hidden.about && about && (
        <section id="about" className="space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">About</h2>
          {about.biography && about.biography.trim() !== hero.summary?.trim() && (
            <p className="text-base leading-relaxed text-foreground/90">{about.biography}</p>
          )}
          {about.career_direction && (
            <p className="text-sm italic text-muted-foreground border-l-2 border-primary/40 pl-3 py-0.5">{about.career_direction}</p>
          )}
        </section>
      )}

      {/* Projects */}
      {!hidden.projects && projects && projects.length > 0 && (
        <section id="projects" className="space-y-8">
          <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Selected Work</h2>
          <div className="space-y-8">
            {projects.map((p) => (
              <div key={p.id} className="group space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold group-hover:text-primary transition-colors">{p.title}</h3>
                  {p.live_url && (
                    <a href={p.live_url} target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-foreground">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{p.description}</p>
                <div className="flex flex-wrap gap-2 pt-1">
                  {p.technologies.map((t, i) => (
                    <span key={i} className="text-xs text-muted-foreground font-mono">#{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Experience */}
      {!hidden.experience && experience && experience.length > 0 && (
        <section id="experience" className="space-y-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Experience</h2>
          <div className="space-y-6">
            {experience.map((exp) => (
              <div key={exp.id} className="space-y-1">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-bold text-base">{exp.role} <span className="font-normal text-muted-foreground">at {exp.company}</span></h3>
                  <span className="text-xs text-muted-foreground">{exp.period}</span>
                </div>
                <p className="text-sm text-muted-foreground">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {!hidden.skills && skills && skills.length > 0 && (
        <section id="skills" className="space-y-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Skills</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {skills.map((group) => (
              <div key={group.id} className="space-y-2">
                <h3 className="text-xs font-semibold text-foreground">{group.category}</h3>
                <div className="flex flex-wrap gap-1.5">
                  {group.skills.map((s, i) => (
                    <span key={i} className="text-xs text-muted-foreground font-mono">#{s}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {!hidden.education && education && education.length > 0 && (
        <section id="education" className="space-y-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Education</h2>
          <div className="space-y-4">
            {education.map((edu) => (
              <div key={edu.id} className="flex justify-between items-baseline">
                <div>
                  <h3 className="font-bold text-sm">{edu.degree} {edu.field ? `in ${edu.field}` : ''}</h3>
                  <p className="text-xs text-muted-foreground">{edu.institution}</p>
                </div>
                <span className="text-xs text-muted-foreground font-mono">{edu.period}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Uploaded Verified Certificate Files */}
      {items && items.length > 0 && (
        <section id="certificates" className="space-y-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Verified Credentials</h2>
          <div className="space-y-3">
            {items.map((file) => (
              <div key={file.id} className="flex justify-between items-center text-xs">
                <span className="font-medium text-foreground">{file.name}</span>
                {file.public_url && (
                  <a href={file.public_url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground underline">
                    View Document
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-border pt-8 text-xs text-muted-foreground">
        <p>© {new Date().getFullYear()} {hero.full_name}</p>
      </footer>
      </div>
    </div>
  )
}
