'use client'

import React from 'react'
import type { PortfolioContent, PortfolioThemeId } from '@/types'
import { THEMES } from './theme-config'
import { Briefcase, GraduationCap, Mail, Phone, MapPin, Award } from 'lucide-react'

interface TemplateProps {
  content: PortfolioContent
  theme: PortfolioThemeId
}

export function ProfessionalTemplate({ content, theme }: TemplateProps) {
  const themeConfig = THEMES[theme] || THEMES.blue
  const { hero, about, experience, education, skills, projects, contact } = content

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-sans antialiased">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white py-16 border-b border-slate-800">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">{hero.full_name}</h1>
            <p className="text-lg text-blue-400 font-medium mt-1">{hero.title}</p>
            {hero.location && <p className="text-xs text-slate-400 mt-2 flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{hero.location}</p>}
          </div>
          {contact.email && (
            <a href={`mailto:${contact.email}`} className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-colors shadow-sm">
              Connect via Email
            </a>
          )}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12 space-y-12">
        {/* Executive Summary */}
        <section className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-8 shadow-sm">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">Executive Summary</h2>
          <p className="text-base text-slate-700 dark:text-slate-200 leading-relaxed">{hero.summary}</p>
        </section>

        {/* Experience Timeline */}
        {experience && experience.length > 0 && (
          <section className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-8 shadow-sm space-y-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-4">
              <Briefcase className="h-5 w-5 text-blue-600" />
              Professional Experience
            </h2>
            <div className="space-y-6">
              {experience.map((exp) => (
                <div key={exp.id} className="space-y-2">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">{exp.role} <span className="font-medium text-slate-600 dark:text-slate-300">— {exp.company}</span></h3>
                    <span className="text-xs text-slate-500 font-semibold">{exp.period}</span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300">{exp.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
