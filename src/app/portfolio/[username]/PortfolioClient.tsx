'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FileText, ExternalLink, Briefcase, GraduationCap, Code, Award, Mail, ChevronDown } from 'lucide-react'
import { format } from 'date-fns'
import Image from 'next/image'
import { pageVariants, staggerContainer, fadeInUp, cardHover } from '@/lib/animations'
import { SplitText } from '@/components/ui/SplitText'
import { MagneticButton } from '@/components/ui/MagneticButton'
import { StaggerContainer as CustomStagger, ScrollReveal } from '@/components/ui/Animations'
import { TransitionLink } from '@/components/ui/TransitionLink'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function PortfolioClient({ profile, resume, items }: { profile: any, resume: any, items: any[] }) {
  const [activeSection, setActiveSection] = useState('hero')
  const skillsRef = useRef<HTMLElement>(null)
  const skillsContainerRef = useRef<HTMLDivElement>(null)

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

  // Skills GSAP ScrollTrigger
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mediaQuery.matches || !skillsRef.current || !skillsContainerRef.current) return

    const bars = skillsContainerRef.current.querySelectorAll('.skill-bar-fill')
    
    // Set initial state
    gsap.set(bars, { width: '0%' })

    const st = ScrollTrigger.create({
      trigger: skillsRef.current,
      start: "top center",
      end: "bottom center",
      scrub: 1,
      animation: gsap.to(bars, {
        width: (i, target) => target.dataset.width || '100%',
        ease: 'none',
        stagger: 0.1
      })
    })

    return () => {
      st.kill()
    }
  }, [skills])

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
    <AnimatePresence mode="wait">
      <motion.div 
        key="portfolio-page"
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="min-h-screen bg-slate-50 font-sans text-slate-900 overflow-x-hidden"
      >
        {/* Sticky Navigation */}
        {navItems.length > 0 && (
          <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-border shadow-sm">
            <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
              <span className="font-bold text-lg">{name.split(' ')[0]}</span>
              <div className="hidden md:flex items-center gap-6">
                {navItems.map(nav => (
                  <TransitionLink 
                    key={nav.id}
                    href={`#${nav.id}`}
                    className={`text-sm font-medium transition-colors ${activeSection === nav.id ? 'text-primary' : 'text-muted-foreground hover:text-slate-900'}`}
                  >
                    {nav.label}
                  </TransitionLink>
                ))}
              </div>
              {personal?.email && (
                <MagneticButton>
                  <a href={`mailto:${personal.email}`} className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium hover:scale-105 transition-transform flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Contact
                  </a>
                </MagneticButton>
              )}
            </div>
          </nav>
        )}

        {/* Hero Section */}
        <section id="hero" className="min-h-[80vh] flex flex-col justify-center items-center text-center px-6 pt-20 relative">
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner" style={{ viewTransitionName: 'resume-hero' }}>
            <span className="text-3xl font-bold text-primary">{name.charAt(0)}</span>
          </div>
          <SplitText text={name} className="text-5xl md:text-7xl font-extrabold tracking-tight mb-4 text-slate-900" />
          <motion.p 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.5 }}
            className="text-xl md:text-2xl text-muted-foreground font-medium capitalize mb-6"
          >
            {title}
          </motion.p>
          
          {summary && (
            <motion.p 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 0.5 }}
              className="max-w-2xl mx-auto text-lg text-slate-600 leading-relaxed mb-10"
            >
              {summary}
            </motion.p>
          )}

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.2 }}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            {personal?.linkedin && (
              <MagneticButton>
                <a href={personal.linkedin} target="_blank" className="px-6 py-3 bg-white border border-border shadow-sm rounded-full font-medium hover:bg-slate-50 transition-colors block">
                  LinkedIn
                </a>
              </MagneticButton>
            )}
            {personal?.github && (
              <MagneticButton>
                <a href={personal.github} target="_blank" className="px-6 py-3 bg-slate-900 text-white rounded-full font-medium hover:bg-slate-800 transition-colors block">
                  GitHub
                </a>
              </MagneticButton>
            )}
            {personal?.portfolio && (
              <MagneticButton>
                <a href={personal.portfolio} target="_blank" className="px-6 py-3 bg-white border border-border shadow-sm rounded-full font-medium hover:bg-slate-50 transition-colors block">
                  Website
                </a>
              </MagneticButton>
            )}
          </motion.div>

          {navItems.length > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5, duration: 1 }} className="mt-20 animate-bounce">
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
              <CustomStagger className="space-y-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
                {experience.map((exp: any, i: number) => (
                  <motion.div 
                    key={exp.id || i}
                    variants={fadeInUp}
                    className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
                  >
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-primary text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                      <Briefcase className="h-4 w-4" />
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 bg-slate-50 rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow">
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
              </CustomStagger>
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
              <CustomStagger className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {projects.map((proj: any, i: number) => (
                  <motion.div 
                    key={proj.id || i}
                    layoutId={`resume-card-${proj.id || i}`}
                    style={{ viewTransitionName: `resume-card-${proj.id || i}` }}
                    variants={fadeInUp}
                    whileHover={cardHover}
                    className="bg-white p-8 rounded-3xl border border-border shadow-sm transition-colors cursor-pointer"
                  >
                    <h3 className="text-2xl font-bold mb-3">{proj.name}</h3>
                    <p className="text-slate-600 mb-6 line-clamp-3">{proj.description}</p>
                    
                    {proj.technologies && proj.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-8">
                        {proj.technologies.map((tech: string, idx: number) => (
                          <span key={idx} className="px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full badge-hover-ring">
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex gap-4">
                      {proj.url && (
                        <TransitionLink href={proj.url} target="_blank" className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors">
                          <ExternalLink className="h-4 w-4" /> Live Demo
                        </TransitionLink>
                      )}
                      {proj.github_url && (
                        <TransitionLink href={proj.github_url} target="_blank" className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors">
                          <Code className="h-4 w-4" /> Source
                        </TransitionLink>
                      )}
                    </div>
                  </motion.div>
                ))}
              </CustomStagger>
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
              <CustomStagger className="grid gap-6">
                {education.map((edu: any, i: number) => (
                  <motion.div 
                    key={edu.id || i}
                    variants={fadeInUp}
                    whileHover={{ scale: 1.01 }}
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
              </CustomStagger>
            </div>
          </section>
        )}

        {/* Skills Section (GSAP Animated Bars) */}
        {skills?.length > 0 && (
          <section id="skills" ref={skillsRef} className="py-24 bg-slate-900 text-white px-6">
            <div className="max-w-5xl mx-auto" ref={skillsContainerRef}>
              <h2 className="text-3xl font-bold mb-12 flex items-center gap-3">
                <Award className="h-8 w-8 text-primary" /> Skills & Expertise
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {skills.map((cat: any, i: number) => (
                  <div key={cat.id || i}>
                    <h3 className="text-lg font-bold text-primary mb-4 border-b border-white/10 pb-2">{cat.name}</h3>
                    <div className="flex flex-col gap-3">
                      {cat.skills.map((skill: string, idx: number) => {
                        const randomWidth = Math.floor(Math.random() * 40) + 60 + '%' // 60-100% width
                        return (
                          <div key={idx} className="group">
                            <div className="flex justify-between text-sm mb-1 font-medium">
                              <span>{skill}</span>
                            </div>
                            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                              <div 
                                className="skill-bar-fill h-full bg-primary rounded-full relative badge-hover-ring" 
                                data-width={randomWidth}
                              />
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
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
              <CustomStagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {items.map((item: any, i: number) => {
                  const isImage = item.mime_type.startsWith('image/')
                  return (
                    <motion.a 
                      key={item.id} 
                      href={item.public_url || '#'} 
                      target="_blank"
                      rel="noopener noreferrer"
                      variants={fadeInUp}
                      whileHover={cardHover}
                      className="group block bg-white border border-border rounded-xl overflow-hidden shadow-sm transition-all hover:border-primary/50"
                    >
                      <div className="aspect-video bg-muted flex items-center justify-center relative overflow-hidden">
                        {isImage && item.public_url ? (
                          <Image src={item.public_url} alt={item.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
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
              </CustomStagger>
            </div>
          </section>
        )}

        {/* Footer */}
        <footer className="py-12 bg-white text-center border-t border-border overflow-hidden">
          <ScrollReveal>
            <TransitionLink 
              href="/"
              className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-primary transition-colors group"
            >
              <span className="text-xl group-hover:rotate-12 transition-transform">✨</span>
              Powered by SmartResume AI
            </TransitionLink>
          </ScrollReveal>
        </footer>
      </motion.div>
    </AnimatePresence>
  )
}
