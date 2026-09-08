'use client'

import React, { useState } from 'react'
import type { PortfolioContent, UserFile } from '@/types'
import { Menu, X, Mail } from 'lucide-react'

interface PortfolioNavbarProps {
  content: PortfolioContent
  items?: UserFile[]
}

export function PortfolioNavbar({ content, items }: PortfolioNavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { hero, about, experience, education, skills, projects, certifications, contact } = content
  const hidden = content.hidden_sections || {}

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

  return (
    <header className="sticky top-3 z-50 max-w-5xl mx-auto px-4 my-2 transition-all duration-300">
      <div className="backdrop-blur-xl bg-slate-950/80 border border-white/15 shadow-2xl rounded-full px-5 py-2.5 flex items-center justify-between">
        {/* Brand Name / Logo */}
        <a href="#top" className="font-extrabold text-sm sm:text-base tracking-tight text-white flex items-center gap-2 group">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse group-hover:scale-125 transition-transform" />
          <span className="truncate max-w-[160px] sm:max-w-none">{hero.full_name}</span>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1.5 text-xs font-semibold text-slate-300">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="px-3.5 py-1.5 rounded-full hover:text-white hover:bg-white/10 transition-all duration-200"
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
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold bg-white text-slate-950 hover:bg-slate-200 transition-all shadow-md hover:scale-105"
            >
              <Mail className="h-3.5 w-3.5" />
              Contact
            </a>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Floating Glass Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 p-4 rounded-3xl backdrop-blur-2xl bg-slate-950/95 border border-white/15 shadow-2xl space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="grid gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2.5 rounded-2xl text-sm font-semibold text-slate-200 hover:text-white hover:bg-white/10 transition-colors flex items-center justify-between"
              >
                <span>{link.label}</span>
                <span className="text-xs text-slate-500 font-mono">→</span>
              </a>
            ))}
          </div>

          {contact.email && (
            <div className="pt-2 border-t border-white/10">
              <a
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3 rounded-2xl bg-white text-slate-950 text-xs font-bold flex items-center justify-center gap-2 shadow-lg"
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
