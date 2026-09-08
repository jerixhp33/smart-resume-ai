'use client'

import React from 'react'
import type { PortfolioContent, PortfolioThemeId, UserFile } from '@/types'
import { THEMES } from './theme-config'
import { Briefcase, GraduationCap, Award, ExternalLink, Mail, Code } from 'lucide-react'
import { GithubIcon } from '@/components/ui/icons'

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
    <div className="min-h-screen bg-black text-white font-sans antialiased max-w-6xl mx-auto px-6 py-20 space-y-24">
      {/* Header / Hero */}
      {!hidden.hero && (
        <header className="space-y-6">
          <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${themeConfig.badgeBg}`}>
            AVAILABLE FOR HIRE
          </span>
          <h1 className="text-6xl sm:text-8xl font-black tracking-tighter uppercase leading-none">
            {hero.full_name}
          </h1>
          <p className={`text-2xl sm:text-4xl font-extrabold uppercase bg-gradient-to-r ${themeConfig.gradient} bg-clip-text text-transparent`}>
            {hero.title}
          </p>
          <p className="text-xl text-zinc-300 font-medium max-w-3xl leading-relaxed">{hero.summary}</p>

          <div className="flex flex-wrap items-center gap-4 pt-4">
            {contact.email && (
              <a
                href={`mailto:${contact.email}`}
                className={`px-8 py-4 rounded-2xl text-black font-black uppercase tracking-wider text-sm transition-all hover:scale-105 ${themeConfig.primary}`}
              >
                {hero.cta_primary_label || "Get In Touch"}
              </a>
            )}
            {contact.github_url && (
              <a
                href={contact.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 rounded-2xl bg-zinc-900 border-2 border-zinc-800 text-white font-black uppercase tracking-wider text-sm hover:border-white transition-all flex items-center gap-2"
              >
                <GithubIcon className="h-4 w-4" /> GitHub
              </a>
            )}
          </div>
        </header>
      )}

      {/* About Section */}
      {!hidden.about && about && (
        <section id="about" className="space-y-6 border-t-2 border-zinc-900 pt-16">
          <h2 className="text-xs font-black uppercase tracking-widest text-zinc-500">ABOUT ME</h2>
          <div className="bg-zinc-900/80 border-2 border-zinc-800 p-8 rounded-3xl space-y-4">
            {about.biography && about.biography.trim() !== hero.summary?.trim() && (
              <p className="text-xl text-zinc-200 leading-relaxed font-medium whitespace-pre-line">{about.biography}</p>
            )}
            {about.career_direction && (
              <p className="text-base text-zinc-400 font-bold italic border-l-4 border-white pl-4 py-1">
                {about.career_direction}
              </p>
            )}
            {about.highlights && about.highlights.length > 0 && (
              <div className="pt-2 border-t border-zinc-800 space-y-2">
                <h3 className="text-xs font-black uppercase tracking-widest text-zinc-500">KEY HIGHLIGHTS</h3>
                <ul className="space-y-2">
                  {about.highlights.map((h, i) => (
                    <li key={i} className="text-zinc-300 text-sm flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-white flex-shrink-0" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Projects Section */}
      {!hidden.projects && projects && projects.length > 0 && (
        <section id="projects" className="space-y-8 border-t-2 border-zinc-900 pt-16">
          <h2 className="text-xs font-black uppercase tracking-widest text-zinc-500">FEATURED PROJECTS</h2>
          <div className="grid gap-6">
            {projects.map((p) => (
              <div key={p.id} className="bg-zinc-900 border-2 border-zinc-800 hover:border-white p-8 rounded-3xl transition-all space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <h3 className="text-3xl font-black">{p.title}</h3>
                  <div className="flex items-center gap-3">
                    {p.github_url && (
                      <a href={p.github_url} target="_blank" rel="noopener noreferrer" className="p-2 rounded-xl bg-zinc-800 hover:bg-white hover:text-black transition-colors">
                        <GithubIcon className="h-5 w-5" />
                      </a>
                    )}
                    {p.live_url && (
                      <a href={p.live_url} target="_blank" rel="noopener noreferrer" className="p-2 rounded-xl bg-zinc-800 hover:bg-white hover:text-black transition-colors">
                        <ExternalLink className="h-5 w-5" />
                      </a>
                    )}
                  </div>
                </div>
                <p className="text-zinc-400 text-base leading-relaxed">{p.description}</p>
                <div className="flex flex-wrap gap-2 pt-2">
                  {p.technologies.map((t, i) => (
                    <span key={i} className="px-3.5 py-1.5 rounded-xl bg-zinc-800 text-zinc-200 text-xs font-bold uppercase tracking-wider">{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Experience Section */}
      {!hidden.experience && experience && experience.length > 0 && (
        <section id="experience" className="space-y-8 border-t-2 border-zinc-900 pt-16">
          <h2 className="text-xs font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2">
            <Briefcase className="h-4 w-4" /> EXPERIENCE & CONTRIBUTIONS
          </h2>
          <div className="space-y-6">
            {experience.map((exp) => (
              <div key={exp.id} className="bg-zinc-900 border-2 border-zinc-800 p-8 rounded-3xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-2xl font-black text-white">{exp.role}</h3>
                    <p className={`text-lg font-bold bg-gradient-to-r ${themeConfig.gradient} bg-clip-text text-transparent`}>{exp.company}</p>
                  </div>
                  <span className="px-4 py-1.5 rounded-full bg-zinc-800 text-zinc-300 text-xs font-black tracking-wider uppercase w-fit">{exp.period}</span>
                </div>
                {exp.description && <p className="text-zinc-300 text-base leading-relaxed">{exp.description}</p>}
                {exp.bullets && exp.bullets.length > 0 && (
                  <ul className="space-y-2 pt-2 border-t border-zinc-800">
                    {exp.bullets.map((b, i) => (
                      <li key={i} className="text-zinc-400 text-sm flex items-start gap-2">
                        <span className="h-2 w-2 rounded-full bg-white mt-1.5 flex-shrink-0" />
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
        <section id="skills" className="space-y-8 border-t-2 border-zinc-900 pt-16">
          <h2 className="text-xs font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2">
            <Code className="h-4 w-4" /> SKILLS & CAPABILITIES
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {skills.map((group) => (
              <div key={group.id} className="bg-zinc-900 border-2 border-zinc-800 p-6 rounded-3xl space-y-4">
                <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400">{group.category}</h3>
                <div className="flex flex-wrap gap-2">
                  {group.skills.map((s, i) => (
                    <span key={i} className="px-3 py-1.5 rounded-xl bg-zinc-800 text-white text-xs font-bold">{s}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education Section */}
      {!hidden.education && education && education.length > 0 && (
        <section id="education" className="space-y-8 border-t-2 border-zinc-900 pt-16">
          <h2 className="text-xs font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2">
            <GraduationCap className="h-4 w-4" /> EDUCATION
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {education.map((edu) => (
              <div key={edu.id} className="bg-zinc-900 border-2 border-zinc-800 p-6 rounded-3xl space-y-2">
                <h3 className="text-xl font-black text-white">{edu.degree} {edu.field ? `in ${edu.field}` : ''}</h3>
                <p className="text-zinc-300 font-bold text-sm">{edu.institution}</p>
                <p className="text-xs font-black text-zinc-500 uppercase tracking-widest">{edu.period}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Verified Certificates & Credentials */}
      {items && items.length > 0 && (
        <section id="certificates" className="space-y-8 border-t-2 border-zinc-900 pt-16">
          <h2 className="text-xs font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2">
            <Award className="h-4 w-4" /> VERIFIED CERTIFICATES & CREDENTIALS
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((file) => (
              <div key={file.id} className="bg-zinc-900 border-2 border-zinc-800 p-6 rounded-3xl space-y-4 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">{file.category || 'Certificate'}</span>
                  <h3 className="text-base font-black text-white truncate mt-1">{file.name}</h3>
                </div>
                {file.public_url && (
                  <a
                    href={file.public_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-black uppercase tracking-wider text-white hover:underline flex items-center gap-1 pt-2 border-t border-zinc-800"
                  >
                    View Credential <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Contact Footer */}
      {!hidden.contact && contact && (
        <footer id="contact" className="space-y-8 border-t-2 border-zinc-900 pt-16 text-center max-w-3xl mx-auto">
          <h2 className="text-4xl font-black tracking-tight uppercase">{contact.heading}</h2>
          <p className="text-zinc-400 text-lg font-medium">{contact.subheading}</p>
          {contact.email && (
            <a
              href={`mailto:${contact.email}`}
              className={`inline-flex items-center gap-3 px-10 py-5 rounded-3xl text-black font-black uppercase tracking-wider text-base transition-all hover:scale-105 ${themeConfig.primary}`}
            >
              <Mail className="h-5 w-5" /> {contact.email}
            </a>
          )}
        </footer>
      )}
    </div>
  )
}
