// ============================================================
// SmartResume AI — Resume Template Renderer
// Renders structured resume data to ATS-safe HTML for PDF
// ============================================================

import type { ResumeData, TemplateId } from '@/types'

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return ''
  try {
    const date = new Date(dateStr + '-01')
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  } catch {
    return dateStr
  }
}

function formatDateRange(start: string, end: string | null, isCurrent: boolean): string {
  const startFormatted = formatDate(start)
  const endFormatted = isCurrent ? 'Present' : formatDate(end)
  return `${startFormatted} — ${endFormatted}`
}

function esc(text: string | null | undefined): string {
  if (!text) return ''
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function safeUrl(url: string): string {
  if (!url) return '#'
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return `https://${url}`
  }
  return url
}

// ── Base ATS Renderer ───────────────────────────────────────
// Shared logic for generating ATS-compatible HTML.
// Different templates just inject different CSS and header layouts.

function renderATSTemplate(data: ResumeData, css: string, headerAlign: 'center' | 'left' = 'center'): string {
  const { personal, summary, experience, internships, education, skills, projects, certifications, achievements, languages } = data
  const sections: string[] = []

  // Header
  const headerStyle = headerAlign === 'left' ? 'text-align: left;' : 'text-align: center;'
  sections.push(`
    <div class="header" style="${headerStyle} margin-bottom: 12px;">
      <div class="name">${esc(personal?.full_name ?? '')}</div>
      ${personal?.professional_title ? `<div class="title">${esc(personal.professional_title)}</div>` : ''}
      <div class="contact-row">
        ${[
          personal?.location ? esc(personal.location) : '',
          personal?.phone ? esc(personal.phone) : '',
          personal?.email ? `<a href="mailto:${esc(personal.email)}">${esc(personal.email)}</a>` : '',
          personal?.linkedin ? `<a href="${safeUrl(personal.linkedin)}">LinkedIn</a>` : '',
          personal?.github ? `<a href="${safeUrl(personal.github)}">GitHub</a>` : '',
          personal?.portfolio ? `<a href="${safeUrl(personal.portfolio)}">Portfolio</a>` : '',
        ].filter(Boolean).join(' &nbsp;|&nbsp; ')}
      </div>
    </div>
  `)

  // Summary
  if (summary) {
    sections.push(`
      <div class="section-title">Career Objective</div>
      <p class="summary-text">${esc(summary)}</p>
    `)
  }

  // Skills
  if ((skills ?? []).filter(s => !s.hidden).length > 0) {
    const skillsHTML = skills!.filter(s => !s.hidden).map(cat => `
      <div class="skill-group">
        ${cat.name ? `<span class="skill-label">${esc(cat.name)}: </span>` : ''}
        ${(cat.skills ?? []).map(s => esc(s)).join(', ')}
      </div>
    `).join('')
    sections.push(`<div class="section-title">Technical Skills</div><div class="skills-row">${skillsHTML}</div>`)
  }
  
  // Experience
  const allExperience = (experience ?? []).filter(e => !e.hidden)
  if (allExperience.length > 0) {
    const expHTML = allExperience.map(exp => `
      <div class="entry">
        <div class="entry-header">
          <div class="entry-title"><strong>${esc(exp.position)}</strong> &mdash; ${esc(exp.company)}${exp.location ? `, ${esc(exp.location)}` : ''}</div>
          <div class="entry-date">${formatDateRange(exp.start_date, exp.end_date, exp.is_current)}</div>
        </div>
        ${exp.description ? `<div class="entry-desc">${esc(exp.description)}</div>` : ''}
        ${(exp.bullets ?? []).length > 0 ? `<ul>${exp.bullets!.map(b => `<li>${esc(b)}</li>`).join('')}</ul>` : ''}
      </div>
    `).join('')
    sections.push(`<div class="section-title">Experience</div>${expHTML}`)
  }

  // Internships
  const allInternships = (internships ?? []).filter(e => !e.hidden)
  if (allInternships.length > 0) {
    const internHTML = allInternships.map(exp => `
      <div class="entry">
        <div class="entry-header">
          <div class="entry-title"><strong>${esc(exp.position)}</strong> &mdash; ${esc(exp.company)}${exp.location ? `, ${esc(exp.location)}` : ''}</div>
          <div class="entry-date">${formatDateRange(exp.start_date, exp.end_date, exp.is_current)}</div>
        </div>
        ${exp.description ? `<div class="entry-desc">${esc(exp.description)}</div>` : ''}
        ${(exp.bullets ?? []).length > 0 ? `<ul>${exp.bullets!.map(b => `<li>${esc(b)}</li>`).join('')}</ul>` : ''}
      </div>
    `).join('')
    sections.push(`<div class="section-title">Internship Experience</div>${internHTML}`)
  }

  // Education
  if ((education ?? []).filter(e => !e.hidden).length > 0) {
    const eduHTML = education!.filter(e => !e.hidden).map(edu => `
      <div class="entry">
        <div class="entry-header">
          <div class="entry-title"><strong>${esc(edu.degree)}</strong>${edu.field_of_study ? ` ${esc(edu.field_of_study)}` : ''}</div>
          <div class="entry-date">${formatDateRange(edu.start_date, edu.end_date, edu.is_current)}</div>
        </div>
        <div class="entry-subtitle">${esc(edu.institution)}${edu.location ? `, ${esc(edu.location)}` : ''}</div>
        ${edu.gpa ? `<div class="entry-desc">GPA: ${esc(edu.gpa)}</div>` : ''}
      </div>
    `).join('')
    sections.push(`<div class="section-title">Education</div>${eduHTML}`)
  }

  // Projects
  if ((projects ?? []).filter(p => !p.hidden).length > 0) {
    const projHTML = projects!.filter(p => !p.hidden).map(proj => `
      <div class="entry">
        <div class="entry-header">
          <div class="entry-title">
            <strong>${proj.url ? `<a href="${safeUrl(proj.url)}">${esc(proj.name)}</a>` : esc(proj.name)}</strong>
          </div>
          ${proj.start_date ? `<div class="entry-date">${formatDateRange(proj.start_date, proj.end_date, false)}</div>` : ''}
        </div>
        ${(proj.technologies ?? []).length > 0 ? `<div class="entry-desc" style="color: var(--muted-color); font-style: italic; margin-top: 1px;">${proj.technologies!.map(t => esc(t)).join(', ')}</div>` : ''}
        ${proj.description ? `<div class="entry-desc" style="margin-top: 3px;">${esc(proj.description)}</div>` : ''}
        ${(proj.bullets ?? []).length > 0 ? `<ul>${proj.bullets!.map(b => `<li>${esc(b)}</li>`).join('')}</ul>` : ''}
      </div>
    `).join('')
    sections.push(`<div class="section-title">Academic Projects</div>${projHTML}`)
  }

  // Certifications
  if ((certifications ?? []).filter(c => !c.hidden).length > 0) {
    const certHTML = certifications!.filter(c => !c.hidden).map(cert => `
      <div class="entry">
        <div class="entry-header">
          <div class="entry-title"><strong>${esc(cert.name)}</strong> &mdash; ${esc(cert.issuer)}</div>
          ${cert.date ? `<div class="entry-date">${formatDate(cert.date)}</div>` : ''}
        </div>
      </div>
    `).join('')
    sections.push(`<div class="section-title">Certifications</div>${certHTML}`)
  }

  // Achievements
  if ((achievements ?? []).filter(a => !a.hidden).length > 0) {
    const achHTML = `<ul>${achievements!.filter(a => !a.hidden).map(a =>
      `<li><strong>${esc(a.title)}</strong>${a.description ? `: ${esc(a.description)}` : ''}</li>`
    ).join('')}</ul>`
    sections.push(`<div class="section-title">Achievements</div>${achHTML}`)
  }

  // Languages
  if ((languages ?? []).filter(l => !l.hidden).length > 0) {
    const langText = languages!.filter(l => !l.hidden)
      .map(l => `${esc(l.language)} (${esc(l.proficiency)})`)
      .join(', ')
    sections.push(`<div class="section-title">Languages</div><div class="entry-desc">${langText}</div>`)
  }

  const baseCSS = `
    * { margin: 0; padding: 0; box-sizing: border-box; }
    @page { margin: 0.75in; size: A4; }
    body { padding: 0.75in; background: white; max-width: 21cm; margin: 0 auto; }
    @media print { body { padding: 0; margin: 0; } a { color: inherit; text-decoration: none; } }
    @media (max-width: 600px) {
      body { padding: 1.5rem 1rem; font-size: 110%; }
      .header { margin-bottom: 20px !important; }
      .name { font-size: 1.8rem !important; }
      .section-title { margin-top: 24px !important; }
      .entry-header { flex-direction: column; gap: 4px; }
      .entry-date { margin-left: 0 !important; }
    }
    .entry { margin-bottom: 12px; }
    .entry-header { display: flex; justify-content: space-between; align-items: flex-start; }
    .entry-date { white-space: nowrap; margin-left: 10px; }
    ul { margin: 3px 0 0 18px; }
    li { margin-bottom: 2px; }
    .skills-row { display: flex; flex-direction: column; gap: 2px; }
    .skill-label { font-weight: bold; }
  `

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Resume — ${esc(personal?.full_name ?? 'Resume')}</title>
  <style>
    :root { 
      --muted-color: #555; 
      --primary-color: ${data.theme?.primaryColor || '#000000'};
      --font-family: ${data.theme?.fontFamily || 'inherit'};
    }
    ${baseCSS}
    ${css}
  </style>
</head>
<body>
  ${sections.join('\n')}
</body>
</html>`
}

// ── Template Implementations ──────────────────────────────

const TEMPLATES = {
  'ats-classic': (data: ResumeData) => renderATSTemplate(data, `
    body { font-family: var(--font-family, Arial, Helvetica, sans-serif); font-size: 10.5pt; line-height: 1.35; color: #1a1a1a; }
    .name { font-size: 22pt; font-weight: bold; color: var(--primary-color, #1B4F8E); text-transform: uppercase; margin-bottom: 4px; }
    .title { font-size: 11pt; color: #333; margin-bottom: 4px; }
    .contact-row { font-size: 10pt; color: #333; }
    .contact-row a { color: #333; text-decoration: none; }
    .section-title { font-size: 11.5pt; font-weight: bold; text-transform: uppercase; color: var(--primary-color, #1B4F8E); border-bottom: 1.5px solid var(--primary-color, #1B4F8E); padding-bottom: 2px; margin: 14px 0 8px; }
    .entry-title { font-size: 10.5pt; }
    .entry-subtitle { font-size: 10.5pt; color: #333; font-style: italic; }
    .entry-date { font-size: 10pt; color: #555; font-style: italic; }
    .entry-desc { font-size: 10.5pt; color: #333; margin-top: 2px; }
    li { font-size: 10.5pt; }
    .summary-text { font-size: 10.5pt; line-height: 1.4; text-align: justify; }
  `, 'center'),

  'ats-modern': (data: ResumeData) => renderATSTemplate(data, `
    body { font-family: var(--font-family, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif); font-size: 10pt; line-height: 1.4; color: #222; }
    .name { font-size: 24pt; font-weight: 800; color: #0F172A; letter-spacing: -0.5px; margin-bottom: 4px; }
    .title { font-size: 11pt; color: var(--primary-color, #3B82F6); font-weight: 500; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 1px; }
    .contact-row { font-size: 9.5pt; color: #475569; }
    .contact-row a { color: var(--primary-color, #3B82F6); text-decoration: none; }
    .section-title { font-size: 11pt; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #0F172A; border-bottom: 2px solid #E2E8F0; padding-bottom: 4px; margin: 16px 0 10px; }
    .entry-title { font-size: 10.5pt; color: #0F172A; }
    .entry-subtitle { font-size: 10pt; color: #475569; }
    .entry-date { font-size: 9.5pt; color: #64748B; font-weight: 500; }
    .entry-desc { font-size: 10pt; color: #334155; margin-top: 2px; }
    li { font-size: 10pt; color: #334155; }
    .summary-text { font-size: 10pt; line-height: 1.5; color: #334155; }
    :root { --muted-color: #64748B; }
  `, 'left'),

  'ats-minimal': (data: ResumeData) => renderATSTemplate(data, `
    body { font-family: var(--font-family, -apple-system, BlinkMacSystemFont, "Helvetica Neue", Helvetica, Arial, sans-serif); font-size: 10.5pt; line-height: 1.4; color: #000; }
    .name { font-size: 20pt; font-weight: 600; color: var(--primary-color, #000); margin-bottom: 4px; }
    .title { font-size: 11pt; color: #666; margin-bottom: 6px; }
    .contact-row { font-size: 9.5pt; color: #444; }
    .contact-row a { color: #444; text-decoration: none; }
    .section-title { font-size: 10.5pt; font-weight: 600; text-transform: uppercase; color: var(--primary-color, #000); margin: 16px 0 8px; border-bottom: 1px solid var(--primary-color, #000); padding-bottom: 2px; }
    .entry-title { font-size: 10.5pt; }
    .entry-subtitle { font-size: 10.5pt; color: #444; }
    .entry-date { font-size: 10pt; color: #666; }
    .entry-desc { font-size: 10.5pt; color: #222; margin-top: 2px; }
    li { font-size: 10.5pt; color: #222; }
    .summary-text { font-size: 10.5pt; line-height: 1.4; color: #222; }
    :root { --muted-color: #666; }
  `, 'center'),

  'ats-professional': (data: ResumeData) => renderATSTemplate(data, `
    body { font-family: var(--font-family, 'Times New Roman', Times, serif); font-size: 11pt; line-height: 1.35; color: #000; }
    .name { font-size: 24pt; font-weight: bold; color: var(--primary-color, #000); margin-bottom: 2px; text-transform: uppercase; }
    .title { font-size: 12pt; color: #333; margin-bottom: 4px; font-style: italic; }
    .contact-row { font-size: 10.5pt; color: #000; border-top: 1px solid var(--primary-color, #000); border-bottom: 1px solid var(--primary-color, #000); padding: 4px 0; margin-top: 8px; }
    .contact-row a { color: #000; text-decoration: none; }
    .section-title { font-size: 12pt; font-weight: bold; text-transform: uppercase; color: var(--primary-color, #000); margin: 14px 0 8px; border-bottom: 1px solid var(--primary-color, #000); }
    .entry-title { font-size: 11pt; }
    .entry-subtitle { font-size: 11pt; color: #222; font-style: italic; }
    .entry-date { font-size: 10.5pt; color: #000; font-weight: bold; }
    .entry-desc { font-size: 11pt; color: #222; margin-top: 2px; }
    li { font-size: 11pt; color: #222; }
    .summary-text { font-size: 11pt; line-height: 1.35; color: #222; }
    :root { --muted-color: #444; }
  `, 'center'),

  'minimal': (data: ResumeData) => renderATSTemplate(data, `
    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 10pt; font-weight: 300; color: #333; }
    .name { font-size: 22pt; font-weight: 200; color: #111; margin-bottom: 2px; letter-spacing: 2px; }
    .title { font-size: 11pt; color: #666; margin-bottom: 8px; font-weight: 400; letter-spacing: 1px; text-transform: uppercase; }
    .contact-row { font-size: 9pt; color: #777; }
    .section-title { font-size: 10pt; font-weight: 400; text-transform: uppercase; letter-spacing: 2px; color: #111; margin: 20px 0 10px; border-bottom: 1px solid #eee; padding-bottom: 4px; }
    .entry-title { font-size: 10pt; font-weight: 500; }
    .entry-subtitle { font-size: 10pt; color: #555; }
    .entry-date { font-size: 9pt; color: #999; }
    .entry-desc { font-size: 10pt; color: #444; }
    li { font-size: 10pt; color: #444; margin-bottom: 4px; }
    :root { --muted-color: #999; }
  `, 'center'),

  'modern': (data: ResumeData) => renderATSTemplate(data, `
    body { font-family: 'Inter', Roboto, sans-serif; font-size: 10pt; color: #1f2937; }
    .name { font-size: 26pt; font-weight: 900; color: #111827; letter-spacing: -1px; margin-bottom: 4px; }
    .title { font-size: 12pt; color: #4f46e5; font-weight: 600; margin-bottom: 6px; }
    .contact-row { font-size: 9.5pt; color: #4b5563; }
    .contact-row a { color: #4f46e5; }
    .section-title { font-size: 12pt; font-weight: 800; text-transform: uppercase; color: #111827; margin: 18px 0 10px; display: inline-block; border-bottom: 3px solid #4f46e5; padding-bottom: 2px; }
    .entry { margin-bottom: 14px; border-left: 2px solid #e5e7eb; padding-left: 12px; }
    .entry-title { font-size: 11pt; font-weight: 700; color: #111827; }
    .entry-subtitle { font-size: 10pt; color: #4b5563; }
    .entry-date { font-size: 9.5pt; color: #6b7280; font-weight: 500; }
    li { font-size: 10pt; color: #374151; }
    :root { --muted-color: #6b7280; }
  `, 'left'),

  'tech': (data: ResumeData) => renderATSTemplate(data, `
    body { font-family: 'Courier New', Courier, monospace; font-size: 9.5pt; color: #333; }
    .name { font-size: 20pt; font-weight: bold; color: #059669; margin-bottom: 4px; }
    .name::before { content: "> "; color: #ccc; }
    .title { font-size: 11pt; color: #4b5563; margin-bottom: 6px; }
    .contact-row { font-size: 9pt; color: #666; }
    .section-title { font-size: 11pt; font-weight: bold; color: #059669; margin: 16px 0 8px; border-bottom: 1px dashed #d1d5db; padding-bottom: 4px; }
    .section-title::before { content: "./"; color: #9ca3af; }
    .entry-title { font-size: 10pt; font-weight: bold; }
    .entry-subtitle { font-size: 9.5pt; color: #4b5563; }
    .entry-date { font-size: 9pt; color: #9ca3af; }
    li { font-size: 9.5pt; color: #444; }
    li::marker { content: "» "; color: #059669; }
    :root { --muted-color: #9ca3af; }
  `, 'left'),

  'creative': (data: ResumeData) => renderATSTemplate(data, `
    body { font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif; font-size: 10pt; color: #2d3748; }
    .header { background: #fdf2f8; padding: 20px; border-radius: 12px; margin-bottom: 20px !important; }
    .name { font-size: 24pt; font-weight: 800; color: #db2777; margin-bottom: 4px; }
    .title { font-size: 12pt; color: #9d174d; font-weight: 600; margin-bottom: 6px; }
    .contact-row { font-size: 9.5pt; color: #831843; }
    .contact-row a { color: #db2777; }
    .section-title { font-size: 12pt; font-weight: 700; color: #db2777; margin: 16px 0 10px; background: #fdf2f8; padding: 4px 12px; border-radius: 20px; display: inline-block; }
    .entry-title { font-size: 10.5pt; font-weight: 700; color: #9d174d; }
    .entry-subtitle { font-size: 10pt; color: #4a5568; }
    .entry-date { font-size: 9.5pt; color: #f472b6; font-weight: 600; }
    li { font-size: 10pt; color: #4a5568; }
    :root { --muted-color: #f472b6; }
  `, 'center'),

  'student': (data: ResumeData) => renderATSTemplate(data, `
    body { font-family: 'Georgia', serif; font-size: 10.5pt; line-height: 1.4; color: #1a202c; }
    .name { font-size: 22pt; font-weight: bold; color: #2b6cb0; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px; }
    .title { font-size: 11pt; color: #4a5568; font-style: italic; margin-bottom: 6px; }
    .contact-row { font-size: 10pt; color: #4a5568; }
    .section-title { font-size: 11.5pt; font-weight: bold; text-transform: uppercase; color: #2b6cb0; margin: 16px 0 8px; border-bottom: 2px solid #2b6cb0; }
    .entry-title { font-size: 10.5pt; font-weight: bold; }
    .entry-subtitle { font-size: 10.5pt; color: #2d3748; }
    .entry-date { font-size: 10pt; color: #718096; font-style: italic; }
    li { font-size: 10.5pt; color: #2d3748; }
    :root { --muted-color: #718096; }
  `, 'center'),

  'graduate': (data: ResumeData) => renderATSTemplate(data, `
    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 10pt; line-height: 1.4; color: #222; }
    .name { font-size: 24pt; font-weight: bold; color: #000; margin-bottom: 2px; }
    .title { font-size: 11pt; color: #008080; font-weight: 600; margin-bottom: 4px; text-transform: uppercase; }
    .contact-row { font-size: 9.5pt; color: #555; }
    .section-title { font-size: 11pt; font-weight: bold; text-transform: uppercase; color: #008080; margin: 16px 0 8px; border-bottom: 1px solid #008080; padding-bottom: 2px; }
    .entry-title { font-size: 10.5pt; font-weight: bold; }
    .entry-subtitle { font-size: 10pt; color: #444; }
    .entry-date { font-size: 9.5pt; color: #666; }
    li { font-size: 10pt; color: #333; }
    :root { --muted-color: #666; }
  `, 'left'),
}

// ── Template Registry ─────────────────────────────────────

export function renderResumeHTML(data: ResumeData, templateId: TemplateId): string {
  const renderFn = TEMPLATES[templateId as keyof typeof TEMPLATES]
  if (renderFn) {
    return renderFn(data)
  }
  
  // Fallback to ATS Classic if template is missing or not implemented yet
  return TEMPLATES['ats-classic'](data)
}

// Template metadata
export const TEMPLATE_METADATA = [
  {
    id: 'ats-classic' as TemplateId,
    name: 'ATS Classic',
    category: 'ats' as const,
    description: 'Single-column, maximum ATS compatibility',
    is_ats_optimized: true,
    preview_image: '/templates/ats-classic.png',
    features: ['Single column', 'Standard headings', 'Clean typography', 'Maximum compatibility'],
  },
  {
    id: 'ats-modern' as TemplateId,
    name: 'ATS Modern',
    category: 'ats' as const,
    description: 'Modern look with full ATS compatibility',
    is_ats_optimized: true,
    preview_image: '/templates/ats-modern.png',
    features: ['Modern design', 'ATS safe', 'Accent colors', 'Clean layout'],
  },
  {
    id: 'ats-minimal' as TemplateId,
    name: 'ATS Minimal',
    category: 'ats' as const,
    description: 'Ultra-clean, distraction-free layout',
    is_ats_optimized: true,
    preview_image: '/templates/ats-minimal.png',
    features: ['Minimal design', 'Maximum whitespace', 'Clean lines', 'ATS safe'],
  },
  {
    id: 'ats-professional' as TemplateId,
    name: 'ATS Professional',
    category: 'ats' as const,
    description: 'Corporate professional style',
    is_ats_optimized: true,
    preview_image: '/templates/ats-professional.png',
    features: ['Professional tone', 'Bold headers', 'Clean sections', 'ATS safe'],
  },
  {
    id: 'minimal' as TemplateId,
    name: 'Minimal',
    category: 'modern' as const,
    description: 'Elegant minimal design',
    is_ats_optimized: false,
    preview_image: '/templates/minimal.png',
    features: ['Elegant layout', 'Modern typography', 'Subtle accents'],
  },
  {
    id: 'modern' as TemplateId,
    name: 'Modern',
    category: 'modern' as const,
    description: 'Contemporary two-column layout',
    is_ats_optimized: false,
    preview_image: '/templates/modern.png',
    features: ['Two columns', 'Color accents', 'Modern fonts', 'Bold headings'],
  },
  {
    id: 'tech' as TemplateId,
    name: 'Tech',
    category: 'modern' as const,
    description: 'Designed for developers and engineers',
    is_ats_optimized: false,
    preview_image: '/templates/tech.png',
    features: ['Tech focused', 'Skills prominence', 'Project highlight', 'Monospace accents'],
  },
  {
    id: 'creative' as TemplateId,
    name: 'Creative',
    category: 'modern' as const,
    description: 'For creative professionals',
    is_ats_optimized: false,
    preview_image: '/templates/creative.png',
    features: ['Unique layout', 'Color blocks', 'Creative typography'],
  },
  {
    id: 'student' as TemplateId,
    name: 'Student',
    category: 'fresher' as const,
    description: 'Perfect for students and freshers',
    is_ats_optimized: true,
    preview_image: '/templates/student.png',
    features: ['Education first', 'Projects highlight', 'Skills focused', 'ATS safe'],
  },
  {
    id: 'graduate' as TemplateId,
    name: 'Graduate',
    category: 'fresher' as const,
    description: 'Fresh graduate looking for first job',
    is_ats_optimized: true,
    preview_image: '/templates/graduate.png',
    features: ['Clean layout', 'Education prominent', 'Internship focus', 'ATS safe'],
  },
]
