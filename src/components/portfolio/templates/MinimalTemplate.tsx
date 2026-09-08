'use client'

import React from 'react'
import type { PortfolioContent, PortfolioThemeId, UserFile } from '@/types'
import { THEMES } from './theme-config'
import { SectionReveal } from '@/components/motion/SectionReveal'
import { StaggerContainer } from '@/components/motion/StaggerContainer'
import { StaggerItem } from '@/components/motion/StaggerItem'
import { ExternalLink, Mail, Award, Briefcase, GraduationCap, Code } from 'lucide-react'
import { GithubIcon } from '@/components/ui/icons'
import { motion } from 'framer-motion'

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
        <SectionReveal id="top">
          <header className="space-y-4 border-b border-border pb-12">
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground break-words">{hero.full_name}</h1>
            <p className="text-lg font-medium text-muted-foreground">{hero.title}</p>
            <p className="text-base text-foreground/80 leading-relaxed max-w-2xl">{hero.summary}</p>
            <div className="flex items-center gap-4 pt-2">
              {contact.email && (
                <a href={`mailto:${contact.email}`} className="text-xs font-semibold underline underline-offset-4 hover:text-primary transition-colors">
                  {contact.email}
                </a>
              )}
              {contact.github_url && (
                <a href={contact.github_url} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold underline underline-offset-4 hover:text-primary transition-colors">
                  GitHub
                </a>
              )}
            </div>
          </header>
        </SectionReveal>
      )}

      {/* About */}
      {!hidden.about && about && (
        <SectionReveal id="about">
          <section className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">About</h2>
            {about.biography && about.biography.trim() !== hero.summary?.trim() && (
              <p className="text-base leading-relaxed text-foreground/90">{about.biography}</p>
            )}
            {about.career_direction && (
              <p className="text-sm italic text-muted-foreground border-l-2 border-primary/40 pl-3 py-0.5">{about.career_direction}</p>
            )}
          </section>
        </SectionReveal>
      )}

      {/* Projects */}
      {!hidden.projects && projects && projects.length > 0 && (
        <SectionReveal id="projects">
          <section className="space-y-8">
            <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Projects</h2>
            <StaggerContainer className="space-y-6">
              {projects.map((p) => (
                <StaggerItem key={p.id}>
                  <motion.div
                    whileHover={{ x: 4 }}
                    className="p-5 rounded-2xl border border-border/80 bg-card hover:border-primary/40 transition-all flex justify-between items-start gap-4"
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-base text-foreground">{p.title}</h3>
                        {p.live_url && (
                          <a href={p.live_url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">{p.description}</p>
                      <div className="flex flex-wrap gap-2 pt-1">
                        {p.technologies.map((t, i) => (
                          <span key={i} className="text-[11px] font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </section>
        </SectionReveal>
      )}

      {/* Experience */}
      {!hidden.experience && experience && experience.length > 0 && (
        <SectionReveal id="experience">
          <section className="space-y-6">
            <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Experience</h2>
            <StaggerContainer className="space-y-6">
              {experience.map((exp) => (
                <StaggerItem key={exp.id}>
                  <div className="space-y-1">
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-bold text-sm text-foreground">{exp.role} <span className="text-muted-foreground font-normal">at {exp.company}</span></h3>
                      <span className="text-xs font-mono text-muted-foreground">{exp.period}</span>
                    </div>
                    {exp.description && <p className="text-xs text-muted-foreground leading-relaxed">{exp.description}</p>}
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </section>
        </SectionReveal>
      )}

      {/* Skills */}
      {!hidden.skills && skills && skills.length > 0 && (
        <SectionReveal id="skills">
          <section className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Skills</h2>
            <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {skills.map((group) => (
                <StaggerItem key={group.id}>
                  <div className="p-4 rounded-xl border border-border bg-card space-y-2 h-full">
                    <h3 className="text-xs font-bold text-foreground uppercase">{group.category}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {group.skills.join('  •  ')}
                    </p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </section>
        </SectionReveal>
      )}

      {/* Education */}
      {!hidden.education && education && education.length > 0 && (
        <SectionReveal id="education">
          <section className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Education</h2>
            <StaggerContainer className="grid md:grid-cols-2 gap-4">
              {education.map((edu) => (
                <StaggerItem key={edu.id}>
                  <div className="p-4 rounded-xl border border-border bg-card space-y-1 h-full">
                    <h3 className="font-bold text-sm text-foreground">{edu.degree} {edu.field ? `in ${edu.field}` : ''}</h3>
                    <p className="text-xs text-muted-foreground">{edu.institution}</p>
                    <p className="text-[10px] text-muted-foreground/70 font-mono">{edu.period}</p>
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
          <section className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Verified Credentials</h2>
            <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((file) => (
                <StaggerItem key={file.id}>
                  <div className="p-4 rounded-xl border border-border bg-card space-y-2 flex flex-col justify-between h-full">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-muted-foreground">{file.category || 'Certificate'}</span>
                      <h3 className="font-bold text-xs text-foreground truncate mt-1">{file.name}</h3>
                    </div>
                    {file.public_url && (
                      <a href={file.public_url} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
                        View <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </section>
        </SectionReveal>
      )}

      {/* Contact Section */}
      {!hidden.contact && contact && (
        <SectionReveal id="contact">
          <section className="text-center space-y-4 pt-8 border-t border-border max-w-xl mx-auto">
            <h2 className="text-2xl font-bold text-foreground">{contact.heading}</h2>
            <p className="text-xs text-muted-foreground">{contact.subheading}</p>
            {contact.email && (
              <a href={`mailto:${contact.email}`} className="inline-block text-sm font-semibold underline text-primary hover:opacity-80">
                {contact.email}
              </a>
            )}
          </section>
        </SectionReveal>
      )}
      
      {/* Footer */}
      <footer className="border-t border-border pt-8 text-xs text-muted-foreground">
        <p>© {new Date().getFullYear()} {hero.full_name}</p>
      </footer>
      </div>
    </div>
  )
}
