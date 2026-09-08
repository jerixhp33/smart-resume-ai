'use client'

import React, { useState } from 'react'
import type { PortfolioContent, PortfolioTemplateId, PortfolioThemeId, UserFile } from '@/types'
import { THEMES } from './theme-config'
import { Menu, X, Mail } from 'lucide-react'

interface PortfolioNavbarProps {
  content: PortfolioContent
  template?: PortfolioTemplateId
  theme?: PortfolioThemeId
  items?: UserFile[]
}

function getNavbarStyles(template: PortfolioTemplateId = 'modern', theme: PortfolioThemeId = 'indigo') {
  const themeConfig = THEMES[theme] || THEMES.indigo

  switch (template) {
    case 'bold':
      return {
        fontFamily: 'font-sans',
        container: 'backdrop-blur-2xl bg-black/90 border-2 border-zinc-800 text-white shadow-2xl',
        dot: 'bg-rose-500',
        link: 'text-zinc-400 hover:text-white font-bold uppercase tracking-wider text-[11px]',
        button: `px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider text-black ${themeConfig.primary}`,
        mobileMenu: 'bg-black/95 border-2 border-zinc-800 text-white',
      }
    case 'developer':
      return {
        fontFamily: 'font-mono',
        container: 'backdrop-blur-2xl bg-slate-950/90 border border-slate-800 text-slate-100 shadow-2xl',
        dot: 'bg-emerald-400',
        link: 'text-slate-400 hover:text-emerald-400 font-mono text-xs',
        button: 'px-4 py-1.5 rounded-full text-xs font-bold font-mono bg-emerald-500 text-slate-950 hover:bg-emerald-400',
        mobileMenu: 'bg-slate-950/95 border border-slate-800 text-slate-100 font-mono',
      }
    case 'editorial':
      return {
        fontFamily: 'font-serif',
        container: 'backdrop-blur-2xl bg-[#faf8f5]/95 border border-[#e7e5e4] text-[#1c1917] shadow-md',
        dot: 'bg-[#1c1917]',
        link: 'text-[#78716c] hover:text-[#0c0a09] font-sans font-semibold text-xs uppercase tracking-widest',
        button: 'px-4 py-1.5 rounded-full text-xs font-sans font-bold bg-[#0c0a09] text-[#faf8f5] hover:bg-[#292524]',
        mobileMenu: 'bg-[#faf8f5]/98 border border-[#e7e5e4] text-[#1c1917]',
      }
    case 'elegant':
      return {
        fontFamily: 'font-serif',
        container: 'backdrop-blur-2xl bg-slate-950/90 border border-amber-500/20 text-white shadow-2xl',
        dot: 'bg-amber-400',
        link: 'text-slate-300 hover:text-amber-400 font-sans text-xs font-medium',
        button: 'px-4 py-1.5 rounded-full text-xs font-bold bg-amber-500 text-slate-950 hover:bg-amber-400',
        mobileMenu: 'bg-slate-950/95 border border-amber-500/20 text-white',
      }
    case 'creative':
      return {
        fontFamily: 'font-sans',
        container: 'backdrop-blur-2xl bg-slate-950/85 border border-purple-500/30 text-white shadow-2xl',
        dot: 'bg-purple-400',
        link: 'text-purple-200/80 hover:text-white text-xs font-medium',
        button: 'px-4 py-1.5 rounded-full text-xs font-bold bg-white text-slate-950 hover:bg-purple-100',
        mobileMenu: 'bg-slate-950/95 border border-purple-500/30 text-white',
      }
    case 'minimal':
      return {
        fontFamily: 'font-sans',
        container: 'backdrop-blur-2xl bg-background/90 border border-border text-foreground shadow-sm',
        dot: 'bg-foreground',
        link: 'text-muted-foreground hover:text-foreground text-xs font-medium',
        button: 'px-4 py-1.5 rounded-full text-xs font-semibold border border-border bg-card hover:bg-muted text-foreground',
        mobileMenu: 'bg-background/98 border border-border text-foreground',
      }
    case 'professional':
      return {
        fontFamily: 'font-sans',
        container: 'backdrop-blur-2xl bg-slate-900/90 border border-slate-800 text-white shadow-md',
        dot: 'bg-blue-500',
        link: 'text-slate-300 hover:text-white text-xs font-medium',
        button: 'px-4 py-1.5 rounded-full text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700',
        mobileMenu: 'bg-slate-900/98 border border-slate-800 text-white',
      }
    case 'modern':
    default:
      return {
        fontFamily: 'font-sans',
        container: 'backdrop-blur-2xl bg-background/85 border border-border/80 text-foreground shadow-xl',
        dot: 'bg-indigo-500',
        link: 'text-muted-foreground hover:text-foreground text-xs font-medium',
        button: `px-4 py-1.5 rounded-full text-xs font-semibold shadow-sm ${themeConfig.primary} ${themeConfig.primaryHover}`,
        mobileMenu: 'bg-background/95 border border-border text-foreground',
      }
  }
}

export function PortfolioNavbar({ content, template = 'modern', theme = 'indigo', items }: PortfolioNavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { hero, about, experience, education, skills, projects, certifications, contact } = content
  const hidden = content.hidden_sections || {}

  const styles = getNavbarStyles(template, theme)
  const hasCertificates = (items && items.length > 0) || (certifications && certifications.length > 0)

  const navLinks = [
    { label: 'About', href: '#about', show: !hidden.about && Boolean(about) },
    { label: 'Projects', href: '#projects', show: !hidden.projects && Boolean(projects && projects.length > 0) },
    { label: 'Experience', href: '#experience', show: !hidden.experience && Boolean(experience && experience.length > 0) },
    { label: 'Skills', href: '#skills', show: !hidden.skills && Boolean(skills && skills.length > 0) },
    { label: 'Education', href: '#education', show: !hidden.education && Boolean(education && education.length > 0) },
    { label: 'Certificates', href: '#certificates', show: hasCertificates },
    { label: 'Contact', href: '#contact', show: !hidden.contact && Boolean(contact) },
  ].filter((link) => link.show)

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    if (mobileMenuOpen) setMobileMenuOpen(false)

    if (href === '#top') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    const targetId = href.replace('#', '')
    const element = document.getElementById(targetId)
    if (element) {
      const yOffset = -80
      const y = element.getBoundingClientRect().top + window.scrollY + yOffset
      window.scrollTo({ top: y, behavior: 'smooth' })
    } else {
      window.location.hash = href
    }
  }

  return (
    <header className={`sticky top-0 z-50 max-w-6xl mx-auto px-4 sm:px-6 pt-3 pb-2 transition-all duration-300 ${styles.fontFamily}`}>
      <div className={`rounded-full px-5 py-2.5 flex items-center justify-between transition-all duration-300 ${styles.container}`}>
        {/* Brand Name / Logo */}
        <a href="#top" onClick={(e) => handleNavClick(e, '#top')} className="font-extrabold text-sm sm:text-base tracking-tight flex items-center gap-2 group">
          <span className={`w-2.5 h-2.5 rounded-full animate-pulse group-hover:scale-125 transition-transform ${styles.dot}`} />
          <span className="truncate max-w-[160px] sm:max-w-none">{hero.full_name}</span>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 sm:gap-2">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className={`px-3 py-1 rounded-full transition-all duration-200 ${styles.link}`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Action Button & Mobile Toggle */}
        <div className="flex items-center gap-2">
          {contact.email && (
            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, '#contact')}
              className={`hidden sm:inline-flex items-center gap-1.5 transition-all shadow-md hover:scale-105 ${styles.button}`}
            >
              <Mail className="h-3.5 w-3.5" />
              Contact
            </a>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-full opacity-80 hover:opacity-100 transition-opacity focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Floating Glass Mobile Menu */}
      {mobileMenuOpen && (
        <div className={`md:hidden mt-2 p-4 rounded-3xl backdrop-blur-2xl shadow-2xl space-y-2 animate-in fade-in slide-in-from-top-2 duration-200 ${styles.mobileMenu}`}>
          <div className="grid gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className={`px-4 py-2.5 rounded-2xl text-sm font-semibold transition-colors flex items-center justify-between ${styles.link}`}
              >
                <span>{link.label}</span>
                <span className="text-xs opacity-50 font-mono">→</span>
              </a>
            ))}
          </div>

          {contact.email && (
            <div className="pt-2 border-t border-white/10">
              <a
                href="#contact"
                onClick={(e) => handleNavClick(e, '#contact')}
                className={`w-full py-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg ${styles.button}`}
              >
                <Mail className="h-4 w-4" /> Get In Touch
              </a>
            </div>
          )}
        </div>
      )}
    </header>
  )
}
