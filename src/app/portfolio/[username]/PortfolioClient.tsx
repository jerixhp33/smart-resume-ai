'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FileText, ExternalLink, Briefcase, GraduationCap, Code, Award, Mail, ChevronDown } from 'lucide-react'
import { format } from 'date-fns'

export function PortfolioClient({ profile, resume, items }: { profile: any, resume: any, items: any[] }) {
  const [activeSection, setActiveSection] = useState('hero')

  const resumeData = resume?.data || {}
  const { personal, summary, experience, education, projects, skills } = resumeData

  const name = personal?.full_name || profile.full_name || 'Professional'
  const title = personal?.professional_title || profile.career_goal?.replace('_', ' ') || 'Portfolio'

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'experience', 'projects', 'education', 'skills', 'credentials']
      let current = 'hero'
      for (const id of sections) {
        const el = document.getElementById(id)
        if (el && window.scrollY >= el.offsetTop - 150) {
          current = id
        }
      }
      setActiveSection(current)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { id: 'experience', label: 'Experience' },
    { id: 'projects', label: 'Projects' },
    { id: 'education', label: 'Education' },
    { id: 'skills', label: 'Skills' },
    { id: 'credentials', label: 'Credentials' }
  ].filter(nav => {
    if (nav.id === 'experience') return experience?.length > 0
    if (nav.id === 'projects') return projects?.length > 0
    if (nav.id === 'education') return education?.length > 0
    if (nav.id === 'skills') return skills?.length > 0
    if (nav.id === 'credentials') return items?.length > 0
    return false
  })

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 scroll-smooth">
      {/* Sticky Navigation */}
      {navItems.length > 0 && (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-border shadow-sm">
          <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
            <span className="font-bold text-lg">{name.split(' ')[0]}</span>
            <div className="hidden md:flex items-center gap-6">
              {navItems.map(nav => (
                <a 
                  key={nav.id}
                  href={`#${nav.id}`}
                  className={`text-sm font-medium transition-colors ${activeSection === nav.id ? 'text-primary' : 'text-muted-foreground hover:text-slate-900'}`}
                >
                  {nav.label}
                </a>
              ))}
            </div>
            {personal?.email && (
              <a href={`mailto:${personal.email}`} className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium hover:scale-105 transition-transform flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Contact
              </a>
            )}
          </div>
        </nav>
      )}

      {/* Hero Section */}
      <section id="hero" className="min-h-[80vh] flex flex-col justify-center items-center text-center px-6 pt-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
            <span className="text-3xl font-bold text-primary">{name.charAt(0)}</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-4 text-slate-900">{name}</h1>
          <p className="text-xl md:text-2xl text-muted-foreground font-medium capitalize mb-6">{title}</p>
          
          {summary && (
            <p className="max-w-2xl mx-auto text-lg text-slate-600 leading-relaxed mb-10">
              {summary}
            </p>
          )}

          <div className="flex flex-wrap items-center justify-center gap-4">
            {personal?.linkedin && (
              <a href={personal.linkedin} target="_blank" className="px-6 py-3 bg-white border border-border shadow-sm rounded-full font-medium hover:bg-slate-50 transition-colors">
                LinkedIn
              </a>
            )}
            {personal?.github && (
              <a href={personal.github} target="_blank" className="px-6 py-3 bg-slate-900 text-white rounded-full font-medium hover:bg-slate-800 transition-colors">
                GitHub
              </a>
            )}
            {personal?.portfolio && (
              <a href={personal.portfolio} target="_blank" className="px-6 py-3 bg-white border border-border shadow-sm rounded-full font-medium hover:bg-slate-50 transition-colors">
                Website
              </a>
            )}
          </div>
        </motion.div>

        {navItems.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 1 }} className="mt-20 animate-bounce">
            <a href={`#${navItems[0].id}`} className="text-muted-foreground">
              <ChevronDown className="h-8 w-8" />
            </a>
          </motion.div>
        )}
      </section>

      {/* Experience Section */}
      {experience?.length > 0 && (
        <section id="experience" className="py-24 bg-white px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 flex items-center gap-3">
              <Briefcase className="h-8 w-8 text-primary" /> Experience
            </h2>
            <div className="space-y-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
              {experience.map((exp: any, i: number) => (
                <motion.div 
                  key={exp.id || i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5 }}
                  className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
                >
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-primary text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                    <Briefcase className="h-4 w-4" />
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 bg-slate-50 rounded-2xl border border-border shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-xl">{exp.position}</h3>
                    </div>
                    <p className="text-primary font-medium mb-1">{exp.company}</p>
                    <p className="text-sm text-muted-foreground mb-4 font-mono">
                      {exp.start_date} — {exp.is_current ? 'Present' : exp.end_date}
                    </p>
                    <ul className="text-sm text-slate-600 space-y-2 list-disc pl-4">
                      {exp.bullets?.map((b: string, idx: number) => (
                        <li key={idx}>{b}</li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Projects Section */}
      {projects?.length > 0 && (
        <section id="projects" className="py-24 bg-slate-50 px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 flex items-center gap-3">
              <Code className="h-8 w-8 text-primary" /> Projects
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {projects.map((proj: any, i: number) => (
                <motion.div 
                  key={proj.id || i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="bg-white p-8 rounded-3xl border border-border shadow-sm hover:shadow-lg transition-all"
                >
                  <h3 className="text-2xl font-bold mb-3">{proj.name}</h3>
                  <p className="text-slate-600 mb-6 line-clamp-3">{proj.description}</p>
                  
                  {proj.technologies && proj.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-8">
                      {proj.technologies.map((tech: string, idx: number) => (
                        <span key={idx} className="px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-4">
                    {proj.url && (
                      <a href={proj.url} target="_blank" className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors">
                        <ExternalLink className="h-4 w-4" /> Live Demo
                      </a>
                    )}
                    {proj.github_url && (
                      <a href={proj.github_url} target="_blank" className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors">
                        <Code className="h-4 w-4" /> Source
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Education Section */}
      {education?.length > 0 && (
        <section id="education" className="py-24 bg-white px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 flex items-center gap-3">
              <GraduationCap className="h-8 w-8 text-primary" /> Education
            </h2>
            <div className="grid gap-6">
              {education.map((edu: any, i: number) => (
                <motion.div 
                  key={edu.id || i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="p-8 bg-slate-50 border border-border rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  <div>
                    <h3 className="text-xl font-bold mb-1">{edu.degree} in {edu.field_of_study}</h3>
                    <p className="text-lg text-slate-700 font-medium">{edu.institution}</p>
                    {edu.location && <p className="text-muted-foreground text-sm mt-1">{edu.location}</p>}
                  </div>
                  <div className="md:text-right">
                    <p className="font-mono text-sm bg-white px-3 py-1 rounded-md border border-border inline-block mb-2">
                      {edu.start_date} — {edu.is_current ? 'Present' : edu.end_date}
                    </p>
                    {edu.gpa && <p className="text-primary font-medium text-sm">GPA: {edu.gpa}</p>}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Skills Section */}
      {skills?.length > 0 && (
        <section id="skills" className="py-24 bg-slate-900 text-white px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 flex items-center gap-3">
              <Award className="h-8 w-8 text-primary" /> Skills & Expertise
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {skills.map((cat: any, i: number) => (
                <motion.div 
                  key={cat.id || i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <h3 className="text-lg font-bold text-primary mb-4 border-b border-white/10 pb-2">{cat.name}</h3>
                  <div className="flex flex-wrap gap-2">
                    {cat.skills.map((skill: string, idx: number) => (
                      <span key={idx} className="px-3 py-1.5 bg-white/10 rounded-lg text-sm font-medium hover:bg-primary hover:text-white transition-colors cursor-default">
                        {skill}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Credentials Gallery Section */}
      {items?.length > 0 && (
        <section id="credentials" className="py-24 bg-slate-50 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center">Verified Credentials</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {items.map((item: any, i: number) => {
                const isImage = item.mime_type.startsWith('image/')
                return (
                  <motion.a 
                    key={item.id} 
                    href={item.public_url || '#'} 
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: Math.min(i * 0.05, 0.5) }}
                    className="group block bg-white border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all hover:border-primary/50"
                  >
                    <div className="aspect-video bg-muted flex items-center justify-center relative overflow-hidden">
                      {isImage && item.public_url ? (
                        <img src={item.public_url} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <FileText className="h-12 w-12 text-slate-400 group-hover:scale-110 transition-transform duration-500" />
                      )}
                      <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/20 transition-colors flex items-center justify-center">
                        <ExternalLink className="h-10 w-10 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" />
                      </div>
                    </div>
                    <div className="p-5 text-center">
                      <h3 className="font-bold text-sm truncate text-slate-900" title={item.name}>{item.name.replace(/\.[^/.]+$/, "")}</h3>
                      <p className="text-xs text-muted-foreground mt-2">
                        {format(new Date(item.created_at), 'MMM yyyy')}
                      </p>
                    </div>
                  </motion.a>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-12 bg-white text-center border-t border-border">
        <a 
          href="/"
          target="_blank"
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-primary transition-colors"
        >
          <span className="text-xl">✨</span>
          Powered by SmartResume AI
        </a>
      </footer>
    </div>
  )
}
