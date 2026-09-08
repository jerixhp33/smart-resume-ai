'use client'

import React from 'react'
import type { PortfolioContent, PortfolioThemeId, UserFile } from '@/types'
import { THEMES } from './theme-config'
import { SectionReveal } from '@/components/motion/SectionReveal'
import { StaggerContainer } from '@/components/motion/StaggerContainer'
import { StaggerItem } from '@/components/motion/StaggerItem'
import { Briefcase, GraduationCap, Award, ExternalLink, Mail, Code } from 'lucide-react'
import { GithubIcon } from '@/components/ui/icons'
import { motion } from 'framer-motion'

interface TemplateProps {
  content: PortfolioContent
  theme: PortfolioThemeId
  items?: UserFile[]
}

export function BoldTemplate({ content, theme, items }: TemplateProps) {
  const themeConfig = THEMES[theme] || THEMES.rose
  const { hero, about, experience, education, skills, projects, contact } = content
  const hidden = content.hidden_sections || {}

  return (
    <div className="w-full min-h-screen bg-black text-white font-sans antialiased">
      <div className="max-w-6xl mx-auto px-6 py-20 space-y-24">
      {/* Header / Hero */}
      {!hidden.hero && (
        <SectionReveal id="top">
          <header className="space-y-6">
            <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${themeConfig.badgeBg}`}>
              AVAILABLE FOR HIRE
            </span>
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tighter uppercase leading-none break-words">
              {hero.full_name}
            </h1>
            <p className={`text-2xl sm:text-4xl font-extrabold uppercase bg-gradient-to-r ${themeConfig.gradient} bg-clip-text text-transparent`}>
              {hero.title}
            </p>
            <p className="text-xl text-zinc-300 font-medium max-w-3xl leading-relaxed">{hero.summary}</p>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <a
                href={hero.cta_primary_url || '#projects'}
                className={`px-8 py-4 rounded-2xl text-black font-black uppercase tracking-wider text-sm transition-all hover:scale-105 active:scale-95 ${themeConfig.primary}`}
              >
                {hero.cta_primary_label || "View My Work"}
              </a>
              {contact.email && (
                <a
                  href={hero.cta_secondary_url || `mailto:${contact.email}`}
                  className="px-8 py-4 rounded-2xl bg-zinc-900 border-2 border-zinc-800 text-white font-black uppercase tracking-wider text-sm hover:border-white transition-all flex items-center gap-2 active:scale-95"
                >
                  <Mail className="h-4 w-4" /> {hero.cta_secondary_label || "Get In Touch"}
                </a>
              )}
              {contact.github_url && (
                <a
                  href={contact.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 rounded-2xl bg-zinc-900 border-2 border-zinc-800 text-white font-black uppercase tracking-wider text-sm hover:border-white transition-all flex items-center gap-2 active:scale-95"
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
          <section className="space-y-6 border-t-2 border-zinc-900 pt-16">
            <h2 className="text-xs font-black uppercase tracking-widest text-zinc-500">ABOUT ME</h2>
            <div className="bg-zinc-900/80 border-2 border-zinc-800 p-8 rounded-3xl space-y-4 hover:border-zinc-700 transition-colors">
              {about.biography && about.biography.trim() !== hero.summary?.trim() && (
                <p className="text-zinc-300 leading-relaxed text-lg whitespace-pre-line font-medium">{about.biography}</p>
              )}
              {about.career_direction && (
                <p className="text-white font-bold border-l-4 border-rose-500 pl-4 py-1 text-base uppercase tracking-wide">
                  {about.career_direction}
                </p>
              )}
            </div>
          </section>
        </SectionReveal>
      )}

      {/* Projects Section */}
      {!hidden.projects && projects && projects.length > 0 && (
        <SectionReveal id="projects">
          <section className="space-y-8 border-t-2 border-zinc-900 pt-16">
            <h2 className="text-xs font-black uppercase tracking-widest text-zinc-500">FEATURED PROJECTS</h2>
            <StaggerContainer className="grid md:grid-cols-2 gap-8">
              {projects.map((p) => (
                <StaggerItem key={p.id}>
                  <motion.div
                    whileHover={{ y: -6 }}
                    className="group bg-zinc-900 border-2 border-zinc-800 p-8 rounded-3xl hover:border-white transition-all duration-300 flex flex-col justify-between h-full"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-4 mb-4">
                        <h3 className="text-2xl font-black uppercase group-hover:text-rose-400 transition-colors">{p.title}</h3>
                        {p.live_url && (
                          <a
                            href={p.live_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-full bg-zinc-800 text-white hover:bg-white hover:text-black transition-colors"
                          >
                            <ExternalLink className="h-5 w-5" />
                          </a>
                        )}
                      </div>
                      <p className="text-zinc-400 text-sm font-medium leading-relaxed mb-6">{p.description}</p>
                    </div>
                    <div className="flex flex-wrap gap-2 pt-4 border-t border-zinc-800">
                      {p.technologies.map((tech, i) => (
                        <span key={i} className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-zinc-800 text-zinc-300">
                          {tech}
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
          <section className="space-y-8 border-t-2 border-zinc-900 pt-16">
            <h2 className="text-xs font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2">
              <Briefcase className="h-4 w-4" /> EXPERIENCE
            </h2>
            <StaggerContainer className="space-y-6">
              {experience.map((exp) => (
                <StaggerItem key={exp.id}>
                  <div className="bg-zinc-900 border-2 border-zinc-800 p-8 rounded-3xl space-y-4 hover:border-zinc-700 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <h3 className="text-xl font-black uppercase text-white">{exp.role}</h3>
                        <p className={`font-bold text-sm uppercase ${themeConfig.accentText}`}>{exp.company}</p>
                      </div>
                      <span className="text-xs px-4 py-1.5 rounded-full bg-zinc-800 font-mono font-bold w-fit text-zinc-300">{exp.period}</span>
                    </div>
                    {exp.description && <p className="text-zinc-400 text-sm font-medium">{exp.description}</p>}
                    {exp.bullets && exp.bullets.length > 0 && (
                      <ul className="space-y-2 pt-3 border-t border-zinc-800">
                        {exp.bullets.map((b, i) => (
                          <li key={i} className="text-sm text-zinc-300 font-medium flex items-start gap-2">
                            <span className="h-2 w-2 rounded-full bg-rose-500 mt-1.5 flex-shrink-0" />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    )}
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
          <section className="space-y-8 border-t-2 border-zinc-900 pt-16">
            <h2 className="text-xs font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2">
              <Code className="h-4 w-4" /> SKILLS & CAPABILITIES
            </h2>
            <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {skills.map((group) => (
                <StaggerItem key={group.id}>
                  <div className="bg-zinc-900 border-2 border-zinc-800 p-6 rounded-3xl h-full">
                    <h3 className="text-xs font-black uppercase tracking-wider text-zinc-400 mb-4">{group.category}</h3>
                    <div className="flex flex-wrap gap-2">
                      {group.skills.map((s, i) => (
                        <motion.span
                          key={i}
                          whileHover={{ scale: 1.05 }}
                          className="px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-black border border-zinc-800 text-white"
                        >
                          {s}
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
          <section className="space-y-8 border-t-2 border-zinc-900 pt-16">
            <h2 className="text-xs font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2">
              <GraduationCap className="h-4 w-4" /> EDUCATION
            </h2>
            <StaggerContainer className="grid md:grid-cols-2 gap-6">
              {education.map((edu) => (
                <StaggerItem key={edu.id}>
                  <div className="bg-zinc-900 border-2 border-zinc-800 p-6 rounded-3xl space-y-2 h-full">
                    <h3 className="font-black text-lg uppercase text-white">{edu.degree} {edu.field ? `in ${edu.field}` : ''}</h3>
                    <p className={`font-bold text-sm uppercase ${themeConfig.accentText}`}>{edu.institution}</p>
                    <p className="text-xs text-zinc-500 font-mono font-bold">{edu.period}</p>
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
          <section className="space-y-8 border-t-2 border-zinc-900 pt-16">
            <h2 className="text-xs font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2">
              <Award className="h-4 w-4" /> VERIFIED CREDENTIALS
            </h2>
            <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((file) => (
                <StaggerItem key={file.id}>
                  <motion.div
                    whileHover={{ y: -4 }}
                    className="bg-zinc-900 border-2 border-zinc-800 p-6 rounded-3xl flex flex-col justify-between space-y-4 hover:border-white transition-all h-full"
                  >
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">{file.category || 'Certificate'}</span>
                      <h3 className="font-black text-base uppercase text-white mt-1 truncate">{file.name}</h3>
                    </div>
                    {file.public_url && (
                      <a
                        href={file.public_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-black uppercase tracking-wider text-rose-400 hover:text-white flex items-center gap-1.5 pt-3 border-t border-zinc-800"
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
          <section className="text-center space-y-6 pt-16 border-t-2 border-zinc-900 max-w-2xl mx-auto">
            <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tighter">{contact.heading}</h2>
            <p className="text-zinc-400 text-lg font-medium">{contact.subheading}</p>
            {contact.email && (
              <a
                href={`mailto:${contact.email}`}
                className={`inline-flex items-center gap-2 px-10 py-5 rounded-2xl text-black font-black uppercase tracking-wider text-base transition-all hover:scale-105 active:scale-95 ${themeConfig.primary}`}
              >
                <Mail className="h-5 w-5" /> {contact.email}
              </a>
            )}
          </section>
        </SectionReveal>
      )}
      </div>
    </div>
  )
}
