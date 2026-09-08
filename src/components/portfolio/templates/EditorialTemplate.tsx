'use client'

import React from 'react'
import type { PortfolioContent, PortfolioThemeId, UserFile } from '@/types'
import { THEMES } from './theme-config'
import { SectionReveal } from '@/components/motion/SectionReveal'
import { StaggerContainer } from '@/components/motion/StaggerContainer'
import { StaggerItem } from '@/components/motion/StaggerItem'
import { ExternalLink, Mail, Award, BookOpen, Briefcase, GraduationCap } from 'lucide-react'
import { GithubIcon } from '@/components/ui/icons'
import { motion } from 'framer-motion'
import { getExperienceTypeLabel, getCleanDescription } from './template-utils'

interface TemplateProps {
  content: PortfolioContent
  theme: PortfolioThemeId
  items?: UserFile[]
}

export function EditorialTemplate({ content, theme, items }: TemplateProps) {
  const { hero, about, experience, education, skills, projects, contact } = content
  const hidden = content.hidden_sections || {}

  return (
    <div className="w-full min-h-screen bg-[#faf8f5] text-[#1c1917] font-serif antialiased">
      <div className="max-w-4xl mx-auto px-8 py-20 space-y-24">
      {/* Monograph Header / Hero */}
      {!hidden.hero && (
        <SectionReveal id="top">
          <header className="border-b border-[#e7e5e4] pb-16 space-y-6">
            <p className="text-xs uppercase tracking-[0.2em] text-[#78716c] font-sans font-semibold">Portfolio & Monograph</p>
            <h1 className="text-4xl sm:text-6xl font-light tracking-tight text-[#0c0a09] leading-none break-words">{hero.full_name}</h1>
            <p className="text-xl italic text-[#57534e] font-normal">{hero.title}</p>
            <p className="text-lg leading-relaxed text-[#292524] max-w-2xl pt-2">{hero.summary}</p>

            <div className="flex flex-wrap items-center gap-6 pt-4 font-sans text-xs font-semibold uppercase tracking-widest">
              {contact.email && (
                <a href={`mailto:${contact.email}`} className="text-[#0c0a09] underline underline-offset-4 hover:text-[#57534e] transition-colors">
                  Direct Mail
                </a>
              )}
              {contact.github_url && (
                <a href={contact.github_url} target="_blank" rel="noopener noreferrer" className="text-[#0c0a09] underline underline-offset-4 hover:text-[#57534e] transition-colors">
                  GitHub Monograph
                </a>
              )}
            </div>
          </header>
        </SectionReveal>
      )}

      {/* About Section */}
      {!hidden.about && about && (
        <SectionReveal id="about">
          <section className="space-y-6 border-b border-[#e7e5e4] pb-16">
            <h2 className="text-xs uppercase tracking-[0.2em] text-[#78716c] font-sans font-bold">Biography & Direction</h2>
            {about.biography && about.biography.trim() !== hero.summary?.trim() && (
              <p className="text-xl leading-relaxed text-[#292524] font-normal">{about.biography}</p>
            )}
            {about.career_direction && (
              <p className="text-base italic text-[#78716c] border-l-2 border-[#1c1917] pl-4 py-1">
                {about.career_direction}
              </p>
            )}
          </section>
        </SectionReveal>
      )}

      {/* Projects Section */}
      {!hidden.projects && projects && projects.length > 0 && (
        <SectionReveal id="projects">
          <section className="space-y-12 border-b border-[#e7e5e4] pb-16">
            <h2 className="text-xs uppercase tracking-[0.2em] text-[#78716c] font-sans font-bold">Selected Works</h2>
            <StaggerContainer className="space-y-12">
              {projects.map((p) => (
                <StaggerItem key={p.id}>
                  <motion.article
                    whileHover={{ x: 4 }}
                    className="space-y-4 group transition-transform"
                  >
                    <div className="flex items-baseline justify-between border-b border-[#e7e5e4] pb-2">
                      <h3 className="text-2xl font-normal text-[#0c0a09] group-hover:text-[#78716c] transition-colors">{p.title}</h3>
                      {p.live_url && (
                        <a href={p.live_url} target="_blank" rel="noopener noreferrer" className="text-xs font-sans uppercase tracking-widest text-[#78716c] hover:text-[#0c0a09]">
                          View Index →
                        </a>
                      )}
                    </div>
                    <p className="text-base text-[#44403c] leading-relaxed max-w-3xl">{p.description}</p>
                    <div className="flex flex-wrap gap-3 font-sans text-xs text-[#78716c]">
                      {p.technologies.map((t, i) => (
                        <span key={i} className="border-b border-[#d6d3d1] pb-0.5">{t}</span>
                      ))}
                    </div>
                  </motion.article>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </section>
        </SectionReveal>
      )}

      {/* Experience Section */}
      {!hidden.experience && experience && experience.length > 0 && (
        <SectionReveal id="experience">
          <section className="space-y-12 border-b border-[#e7e5e4] pb-16">
            <h2 className="text-xs uppercase tracking-[0.2em] text-[#78716c] font-sans font-bold">Chronology & Roles</h2>
            <StaggerContainer className="space-y-10">
              {experience.map((exp) => {
                const typeLabel = getExperienceTypeLabel(exp)
                const cleanDesc = getCleanDescription(exp.description, exp.bullets)
                return (
                  <StaggerItem key={exp.id}>
                    <div className="space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-xl font-normal text-[#0c0a09]">
                            {exp.role} <span className="text-[#78716c] font-sans text-sm">— {exp.company}{exp.location ? `, ${exp.location}` : ''}</span>
                          </h3>
                          {typeLabel && (
                            <span className="text-[10px] uppercase font-sans font-bold tracking-wider px-2 py-0.5 rounded bg-[#f5f5f4] text-[#78716c] border border-[#e7e5e4]">
                              {typeLabel}
                            </span>
                          )}
                        </div>
                        <span className="text-xs font-sans text-[#a8a29e] uppercase tracking-widest">{exp.period}</span>
                      </div>
                      {cleanDesc && <p className="text-base text-[#44403c] leading-relaxed">{cleanDesc}</p>}
                      {exp.bullets && exp.bullets.length > 0 && (
                        <ul className="space-y-1.5 pt-2 font-sans text-sm text-[#57534e]">
                          {exp.bullets.map((bullet, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-[#a8a29e]">—</span>
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
          </section>
        </SectionReveal>
      )}

      {/* Skills Section */}
      {!hidden.skills && skills && skills.length > 0 && (
        <SectionReveal id="skills">
          <section className="space-y-8 border-b border-[#e7e5e4] pb-16">
            <h2 className="text-xs uppercase tracking-[0.2em] text-[#78716c] font-sans font-bold">Disciplines & Tools</h2>
            <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {skills.map((group) => (
                <StaggerItem key={group.id}>
                  <div className="space-y-3">
                    <h3 className="text-xs font-sans font-bold uppercase tracking-widest text-[#0c0a09]">{group.category}</h3>
                    <ul className="space-y-1 text-sm text-[#57534e]">
                      {group.skills.map((skill, i) => (
                        <li key={i} className="border-b border-[#f5f5f4] py-1">{skill}</li>
                      ))}
                    </ul>
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
          <section className="space-y-8 border-b border-[#e7e5e4] pb-16">
            <h2 className="text-xs uppercase tracking-[0.2em] text-[#78716c] font-sans font-bold">Academic Background</h2>
            <StaggerContainer className="grid md:grid-cols-2 gap-8">
              {education.map((edu) => (
                <StaggerItem key={edu.id}>
                  <div className="space-y-1">
                    <h3 className="text-lg font-normal text-[#0c0a09]">{edu.degree} {edu.field ? `in ${edu.field}` : ''}</h3>
                    <p className="text-sm font-sans text-[#78716c]">{edu.institution}</p>
                    <p className="text-xs font-sans text-[#a8a29e]">{edu.period}</p>
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
          <section className="space-y-8 border-b border-[#e7e5e4] pb-16">
            <h2 className="text-xs uppercase tracking-[0.2em] text-[#78716c] font-sans font-bold">Verified Archives & Diplomas</h2>
            <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((file) => (
                <StaggerItem key={file.id}>
                  <div className="border border-[#e7e5e4] p-5 space-y-3 bg-white">
                    <span className="text-[10px] font-sans uppercase tracking-widest text-[#78716c]">{file.category || 'Certificate'}</span>
                    <h3 className="font-normal text-sm text-[#0c0a09] truncate">{file.name}</h3>
                    {file.public_url && (
                      <a href={file.public_url} target="_blank" rel="noopener noreferrer" className="text-xs font-sans uppercase tracking-widest text-[#0c0a09] underline block pt-2">
                        Inspect Record →
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
          <section className="text-center space-y-6 pt-8 max-w-xl mx-auto">
            <h2 className="text-3xl font-light text-[#0c0a09]">{contact.heading}</h2>
            <p className="text-sm font-sans text-[#57534e]">{contact.subheading}</p>
            {contact.email && (
              <a href={`mailto:${contact.email}`} className="inline-block text-lg underline underline-offset-8 text-[#0c0a09] hover:text-[#78716c] transition-colors">
                {contact.email}
              </a>
            )}
          </section>
        </SectionReveal>
      )}
      </div>
    </div>
  )
}
