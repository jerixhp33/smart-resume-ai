// ============================================================
// SmartResume AI — Plain Text Resume Generator
// ============================================================

import type { ResumeData } from '@/types'

export function generatePlainText(data: ResumeData): string {
  const lines: string[] = []
  const { personal } = data

  // Header
  if (personal?.full_name) lines.push(personal.full_name.toUpperCase())
  if (personal?.professional_title) lines.push(personal.professional_title)
  const contactParts: string[] = []
  if (personal?.email) contactParts.push(personal.email)
  if (personal?.phone) contactParts.push(personal.phone)
  if (personal?.location) contactParts.push(personal.location)
  if (contactParts.length) lines.push(contactParts.join(' | '))
  const linkParts: string[] = []
  if (personal?.linkedin) linkParts.push(personal.linkedin)
  if (personal?.github) linkParts.push(personal.github)
  if (personal?.portfolio) linkParts.push(personal.portfolio)
  if (linkParts.length) lines.push(linkParts.join(' | '))
  lines.push('')

  // Summary
  if (data.summary?.trim()) {
    lines.push('=== PROFESSIONAL SUMMARY ===')
    lines.push(data.summary.trim())
    lines.push('')
  }

  // Experience
  const visibleExp = data.experience?.filter(e => !e.hidden) ?? []
  if (visibleExp.length) {
    lines.push('=== EXPERIENCE ===')
    for (const exp of visibleExp) {
      const dateRange = exp.is_current ? `${exp.start_date} - Present` : `${exp.start_date} - ${exp.end_date ?? ''}`
      lines.push(`${exp.position} | ${exp.company}${exp.location ? ` | ${exp.location}` : ''} | ${dateRange}`)
      if (exp.description) lines.push(exp.description)
      for (const b of exp.bullets ?? []) {
        lines.push(`  • ${b}`)
      }
      lines.push('')
    }
  }

  // Internships
  const visibleIntern = data.internships?.filter(e => !e.hidden) ?? []
  if (visibleIntern.length) {
    lines.push('=== INTERNSHIPS ===')
    for (const exp of visibleIntern) {
      const dateRange = exp.is_current ? `${exp.start_date} - Present` : `${exp.start_date} - ${exp.end_date ?? ''}`
      lines.push(`${exp.position} | ${exp.company}${exp.location ? ` | ${exp.location}` : ''} | ${dateRange}`)
      if (exp.description) lines.push(exp.description)
      for (const b of exp.bullets ?? []) {
        lines.push(`  • ${b}`)
      }
      lines.push('')
    }
  }

  // Education
  const visibleEdu = data.education?.filter(e => !e.hidden) ?? []
  if (visibleEdu.length) {
    lines.push('=== EDUCATION ===')
    for (const edu of visibleEdu) {
      const dateRange = edu.is_current ? `${edu.start_date} - Present` : `${edu.start_date} - ${edu.end_date ?? ''}`
      lines.push(`${edu.degree}${edu.field_of_study ? ` in ${edu.field_of_study}` : ''} | ${edu.institution} | ${dateRange}`)
      if (edu.gpa) lines.push(`  GPA: ${edu.gpa}`)
      for (const a of edu.achievements ?? []) {
        lines.push(`  • ${a}`)
      }
      lines.push('')
    }
  }

  // Skills
  const visibleSkills = data.skills?.filter(s => !s.hidden) ?? []
  if (visibleSkills.length) {
    lines.push('=== SKILLS ===')
    for (const cat of visibleSkills) {
      lines.push(`${cat.name}: ${cat.skills.join(', ')}`)
    }
    lines.push('')
  }

  // Projects
  const visibleProjects = data.projects?.filter(p => !p.hidden) ?? []
  if (visibleProjects.length) {
    lines.push('=== PROJECTS ===')
    for (const proj of visibleProjects) {
      lines.push(`${proj.name}${proj.technologies?.length ? ` (${proj.technologies.join(', ')})` : ''}`)
      if (proj.description) lines.push(proj.description)
      for (const b of proj.bullets ?? []) {
        lines.push(`  • ${b}`)
      }
      if (proj.url) lines.push(`  Link: ${proj.url}`)
      lines.push('')
    }
  }

  // Certifications
  const visibleCerts = data.certifications?.filter(c => !c.hidden) ?? []
  if (visibleCerts.length) {
    lines.push('=== CERTIFICATIONS ===')
    for (const cert of visibleCerts) {
      lines.push(`${cert.name} | ${cert.issuer}${cert.date ? ` | ${cert.date}` : ''}`)
    }
    lines.push('')
  }

  // Languages
  const visibleLangs = data.languages?.filter(l => !l.hidden) ?? []
  if (visibleLangs.length) {
    lines.push('=== LANGUAGES ===')
    lines.push(visibleLangs.map(l => `${l.language} (${l.proficiency})`).join(', '))
    lines.push('')
  }

  return lines.join('\n')
}
