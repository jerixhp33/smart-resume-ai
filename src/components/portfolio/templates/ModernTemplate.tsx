'use client'

import React from 'react'
import type { PortfolioContent, PortfolioThemeId, UserFile } from '@/types'
import { THEMES } from './theme-config'
import { Reveal } from '@/components/motion/Reveal'
import { SectionReveal } from '@/components/motion/SectionReveal'
import { StaggerContainer } from '@/components/motion/StaggerContainer'
import { StaggerItem } from '@/components/motion/StaggerItem'
import { Briefcase, GraduationCap, Award, ExternalLink, Mail, MapPin, CheckCircle2 } from 'lucide-react'
import { GithubIcon } from '@/components/ui/icons'

interface TemplateProps {
  content: PortfolioContent
  theme: PortfolioThemeId
  items?: UserFile[]
}

export function ModernTemplate({ content, theme, items }: TemplateProps) {
  const themeConfig = THEMES[theme] || THEMES.indigo
  const { hero, about, experience, education, skills, projects, certifications, achievements, contact } = content
  const hidden = content.hidden_sections || {}

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-primary font-sans antialiased">


      {/* Hero Section */}
      {!hidden.hero && (
        <SectionReveal className="py-20 md:py-32 max-w-6xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl space-y-6">
            {hero.availability && (
              <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${themeConfig.badgeBg}`}>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {hero.availability}
              </span>
            )}
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-foreground leading-[1.1]">
              {hero.full_name}
            </h1>
            <p className={`text-xl sm:text-2xl font-semibold bg-gradient-to-r ${themeConfig.gradient} bg-clip-text text-transparent`}>
              {hero.title}
            </p>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl">
              {hero.summary}
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <a
                href={hero.cta_primary_url || '#projects'}
                className={`px-6 py-3 rounded-xl font-medium shadow-sm transition-all duration-200 ${themeConfig.primary} ${themeConfig.primaryHover} hover:-translate-y-0.5`}
              >
                {hero.cta_primary_label || 'View Projects'}
              </a>
              <a
                href={hero.cta_secondary_url || '#contact'}
                className="px-6 py-3 rounded-xl font-medium border border-border bg-card hover:bg-muted transition-all duration-200 hover:-translate-y-0.5"
              >
                {hero.cta_secondary_label || 'Contact Me'}
              </a>
            </div>
          </div>
        </SectionReveal>
      )}

      {/* About Section */}
      {!hidden.about && about && (
        <SectionReveal id="about" className="py-16 bg-muted/30 border-y border-border/40">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl font-bold tracking-tight mb-8">About Me</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-4">
                {about.biography && about.biography.trim() !== hero.summary?.trim() && (
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                    {about.biography}
                  </p>
                )}
                {about.career_direction && (
                  <p className="text-sm text-foreground/80 font-medium italic border-l-2 border-primary pl-4 py-1">
                    {about.career_direction}
                  </p>
                )}
              </div>
              {about.highlights && about.highlights.length > 0 && (
                <div className="bg-card border border-border/60 rounded-2xl p-6 shadow-sm">
                  <h3 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">Key Highlights</h3>
                  <ul className="space-y-3">
                    {about.highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                        <CheckCircle2 className={`h-4 w-4 mt-0.5 flex-shrink-0 ${themeConfig.accentText}`} />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </SectionReveal>
      )}

      {/* Projects Section */}
      {!hidden.projects && projects && projects.length > 0 && (
        <SectionReveal id="projects" className="py-20 max-w-6xl mx-auto px-4 sm:px-6">
          <div className="mb-12">
            <h2 className="text-3xl font-bold tracking-tight">Featured Projects</h2>
            <p className="text-muted-foreground mt-2">Selection of recent technical work and products.</p>
          </div>
          <StaggerContainer className="grid md:grid-cols-2 gap-6">
            {projects.map((proj) => (
              <StaggerItem key={proj.id}>
                <div className="group bg-card border border-border/60 rounded-2xl p-6 hover:shadow-md hover:border-primary/40 transition-all duration-300 flex flex-col justify-between h-full">
                  <div>
                    <div className="flex items-center justify-between gap-4 mb-3">
                      <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                        {proj.title}
                      </h3>
                      <div className="flex items-center gap-2">
                        {proj.github_url && (
                          <a href={proj.github_url} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                            <GithubIcon className="h-4 w-4" />
                          </a>
                        )}
                        {proj.live_url && (
                          <a href={proj.live_url} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )}
                      </div>
                    </div>
                    <p className="text-xs font-semibold text-primary/80 mb-3">{proj.tagline}</p>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">{proj.description}</p>
                  </div>
                  <div>
                    <div className="flex flex-wrap gap-1.5 pt-4 border-t border-border/40">
                      {proj.technologies.map((tech, i) => (
                        <span key={i} className={`px-2.5 py-0.5 rounded-md text-xs font-medium ${themeConfig.badgeBg}`}>
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </SectionReveal>
      )}

      {/* Experience Section */}
      {!hidden.experience && experience && experience.length > 0 && (
        <SectionReveal id="experience" className="py-20 bg-muted/20 border-y border-border/40">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="mb-12">
              <h2 className="text-3xl font-bold tracking-tight">Work Experience</h2>
              <p className="text-muted-foreground mt-2">Career history and contributions.</p>
            </div>
            <div className="space-y-6">
              {experience.map((exp) => (
                <div key={exp.id} className="bg-card border border-border/60 rounded-2xl p-6 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <div>
                      <h3 className="text-lg font-bold text-foreground">{exp.role}</h3>
                      <p className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                        <Briefcase className="h-3.5 w-3.5" />
                        {exp.company}
                      </p>
                    </div>
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-muted text-muted-foreground w-fit">
                      {exp.period}
                    </span>
                  </div>
                  {exp.description && <p className="text-sm text-muted-foreground mb-3">{exp.description}</p>}
                  {exp.bullets && exp.bullets.length > 0 && (
                    <ul className="space-y-2 pt-2 border-t border-border/40">
                      {exp.bullets.map((bullet, i) => (
                        <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        </SectionReveal>
      )}

      {/* Skills Section */}
      {!hidden.skills && skills && skills.length > 0 && (
        <SectionReveal id="skills" className="py-20 max-w-6xl mx-auto px-4 sm:px-6">
          <div className="mb-12">
            <h2 className="text-3xl font-bold tracking-tight">Skills & Capabilities</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {skills.map((group) => (
              <div key={group.id} className="bg-card border border-border/60 rounded-2xl p-6">
                <h3 className="text-sm font-bold uppercase tracking-wider text-foreground mb-4">{group.category}</h3>
                <div className="flex flex-wrap gap-2">
                  {group.skills.map((skill, i) => (
                    <span key={i} className={`px-3 py-1 rounded-lg text-xs font-semibold ${themeConfig.badgeBg}`}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </SectionReveal>
      )}

      {/* Education Section */}
      {!hidden.education && education && education.length > 0 && (
        <SectionReveal id="education" className="py-16 bg-muted/20 border-y border-border/40">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl font-bold tracking-tight mb-8">Education</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {education.map((edu) => (
                <div key={edu.id} className="bg-card border border-border/60 rounded-2xl p-6">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl ${themeConfig.accentBg}`}>
                        <GraduationCap className={`h-5 w-5 ${themeConfig.accentText}`} />
                      </div>
                      <div>
                        <h3 className="font-bold text-foreground">{edu.degree} {edu.field ? `in ${edu.field}` : ''}</h3>
                        <p className="text-sm text-muted-foreground">{edu.institution}</p>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground font-medium">{edu.period}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </SectionReveal>
      )}

      {/* Uploaded Certificates & Documents Section */}
      {items && items.length > 0 && (
        <SectionReveal id="certificates" className="py-16 bg-muted/20 border-y border-border/40">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="mb-8">
              <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                <Award className="h-6 w-6 text-primary" />
                Verified Certificates & Credentials
              </h2>
              <p className="text-sm text-muted-foreground mt-1">Uploaded certificates and reference documents.</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((file) => (
                <div key={file.id} className="bg-card border border-border/60 rounded-xl p-4 flex flex-col justify-between hover:border-primary/40 transition-all">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`p-2 rounded-lg ${themeConfig.accentBg}`}>
                        <Award className={`h-4 w-4 ${themeConfig.accentText}`} />
                      </div>
                      <span className="font-semibold text-sm truncate">{file.name}</span>
                    </div>
                    <p className="text-xs text-muted-foreground capitalize">{file.category || 'Certificate'}</p>
                  </div>
                  {file.public_url && (
                    <div className="pt-3 mt-3 border-t border-border/40 flex justify-end">
                      <a
                        href={file.public_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                      >
                        View Credential <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </SectionReveal>
      )}

      {/* Contact Section */}
      {!hidden.contact && contact && (
        <SectionReveal id="contact" className="py-24 max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">{contact.heading}</h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">{contact.subheading}</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {contact.email && (
              <a
                href={`mailto:${contact.email}`}
                className={`inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold shadow-md transition-all ${themeConfig.primary} ${themeConfig.primaryHover}`}
              >
                <Mail className="h-4 w-4" />
                {contact.email}
              </a>
            )}
            {contact.github_url && (
              <a
                href={contact.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold border border-border bg-card hover:bg-muted transition-all"
              >
                <GithubIcon className="h-4 w-4" />
                GitHub
              </a>
            )}
          </div>
        </SectionReveal>
      )}

      {/* Footer */}
      <footer className="py-8 border-t border-border/40 text-center text-xs text-muted-foreground">
        <p>© {new Date().getFullYear()} {hero.full_name}. Built with SmartResume AI.</p>
      </footer>
    </div>
  )
}
