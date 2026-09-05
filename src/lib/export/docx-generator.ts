// ============================================================
// SmartResume AI — DOCX Resume Generator
// ============================================================

import {
  Document, Packer, Paragraph, TextRun, HeadingLevel,
  AlignmentType, BorderStyle, TabStopPosition, TabStopType,
} from 'docx'
import type { ResumeData } from '@/types'

function sectionHeading(text: string): Paragraph {
  return new Paragraph({
    children: [new TextRun({ text: text.toUpperCase(), bold: true, size: 22, font: 'Calibri' })],
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 240, after: 80 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: '999999' } },
  })
}

function entryHeader(left: string, right: string): Paragraph {
  return new Paragraph({
    tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
    children: [
      new TextRun({ text: left, bold: true, size: 21, font: 'Calibri' }),
      new TextRun({ text: '\t', font: 'Calibri' }),
      new TextRun({ text: right, italics: true, size: 19, color: '555555', font: 'Calibri' }),
    ],
    spacing: { before: 120, after: 0 },
  })
}

function entrySubtitle(text: string): Paragraph {
  return new Paragraph({
    children: [new TextRun({ text, italics: true, size: 20, color: '444444', font: 'Calibri' })],
    spacing: { before: 20, after: 40 },
  })
}

function bulletPoint(text: string): Paragraph {
  return new Paragraph({
    children: [new TextRun({ text, size: 20, font: 'Calibri' })],
    bullet: { level: 0 },
    spacing: { before: 20, after: 20 },
  })
}

function bodyText(text: string): Paragraph {
  return new Paragraph({
    children: [new TextRun({ text, size: 20, font: 'Calibri' })],
    spacing: { before: 40, after: 40 },
  })
}

export async function generateDOCX(data: ResumeData): Promise<Blob> {
  const sections: Paragraph[] = []
  const { personal } = data

  // Name
  if (personal?.full_name) {
    sections.push(new Paragraph({
      children: [new TextRun({ text: personal.full_name, bold: true, size: 36, font: 'Calibri' })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 40 },
    }))
  }

  // Title
  if (personal?.professional_title) {
    sections.push(new Paragraph({
      children: [new TextRun({ text: personal.professional_title, size: 22, color: '555555', font: 'Calibri' })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 40 },
    }))
  }

  // Contact
  const contactParts: string[] = []
  if (personal?.email) contactParts.push(personal.email)
  if (personal?.phone) contactParts.push(personal.phone)
  if (personal?.location) contactParts.push(personal.location)
  if (personal?.linkedin) contactParts.push(personal.linkedin)
  if (personal?.github) contactParts.push(personal.github)
  if (contactParts.length) {
    sections.push(new Paragraph({
      children: [new TextRun({ text: contactParts.join('  •  '), size: 18, color: '666666', font: 'Calibri' })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 120 },
    }))
  }

  // Summary
  if (data.summary?.trim()) {
    sections.push(sectionHeading('Professional Summary'))
    sections.push(bodyText(data.summary.trim()))
  }

  // Experience
  const visibleExp = data.experience?.filter(e => !e.hidden) ?? []
  if (visibleExp.length) {
    sections.push(sectionHeading('Experience'))
    for (const exp of visibleExp) {
      const dateRange = exp.is_current ? `${exp.start_date} – Present` : `${exp.start_date} – ${exp.end_date ?? ''}`
      sections.push(entryHeader(exp.position, dateRange))
      sections.push(entrySubtitle(`${exp.company}${exp.location ? `, ${exp.location}` : ''}`))
      for (const b of exp.bullets ?? []) {
        sections.push(bulletPoint(b))
      }
    }
  }

  // Education
  const visibleEdu = data.education?.filter(e => !e.hidden) ?? []
  if (visibleEdu.length) {
    sections.push(sectionHeading('Education'))
    for (const edu of visibleEdu) {
      const dateRange = edu.is_current ? `${edu.start_date} – Present` : `${edu.start_date} – ${edu.end_date ?? ''}`
      sections.push(entryHeader(`${edu.degree}${edu.field_of_study ? ` in ${edu.field_of_study}` : ''}`, dateRange))
      sections.push(entrySubtitle(`${edu.institution}${edu.location ? `, ${edu.location}` : ''}${edu.gpa ? ` | GPA: ${edu.gpa}` : ''}`))
    }
  }

  // Skills
  const visibleSkills = data.skills?.filter(s => !s.hidden) ?? []
  if (visibleSkills.length) {
    sections.push(sectionHeading('Skills'))
    for (const cat of visibleSkills) {
      sections.push(new Paragraph({
        children: [
          new TextRun({ text: `${cat.name}: `, bold: true, size: 20, font: 'Calibri' }),
          new TextRun({ text: cat.skills.join(', '), size: 20, font: 'Calibri' }),
        ],
        spacing: { before: 20, after: 20 },
      }))
    }
  }

  // Projects
  const visibleProjects = data.projects?.filter(p => !p.hidden) ?? []
  if (visibleProjects.length) {
    sections.push(sectionHeading('Projects'))
    for (const proj of visibleProjects) {
      sections.push(entryHeader(proj.name, proj.technologies?.join(', ') ?? ''))
      if (proj.description) sections.push(bodyText(proj.description))
      for (const b of proj.bullets ?? []) {
        sections.push(bulletPoint(b))
      }
    }
  }

  // Internships
  const visibleIntern = data.internships?.filter(e => !e.hidden) ?? []
  if (visibleIntern.length) {
    sections.push(sectionHeading('Internships'))
    for (const exp of visibleIntern) {
      const dateRange = exp.is_current ? `${exp.start_date} – Present` : `${exp.start_date} – ${exp.end_date ?? ''}`
      sections.push(entryHeader(exp.position, dateRange))
      sections.push(entrySubtitle(`${exp.company}${exp.location ? `, ${exp.location}` : ''}`))
      if (exp.description) sections.push(bodyText(exp.description))
      for (const b of exp.bullets ?? []) {
        sections.push(bulletPoint(b))
      }
    }
  }

  // Certifications
  const visibleCerts = data.certifications?.filter(c => !c.hidden) ?? []
  if (visibleCerts.length) {
    sections.push(sectionHeading('Certifications'))
    for (const cert of visibleCerts) {
      sections.push(bulletPoint(`${cert.name} — ${cert.issuer}${cert.date ? ` (${cert.date})` : ''}`))
    }
  }

  // Achievements
  const visibleAchievements = data.achievements?.filter(a => !a.hidden) ?? []
  if (visibleAchievements.length) {
    sections.push(sectionHeading('Achievements'))
    for (const ach of visibleAchievements) {
      sections.push(bulletPoint(`${ach.title}${ach.description ? ` — ${ach.description}` : ''}`))
    }
  }

  // Languages
  const visibleLangs = data.languages?.filter(l => !l.hidden) ?? []
  if (visibleLangs.length) {
    sections.push(sectionHeading('Languages'))
    sections.push(new Paragraph({
      children: [
        new TextRun({
          text: visibleLangs.map(l => `${l.language} (${l.proficiency})`).join('  •  '),
          size: 20,
          font: 'Calibri',
        }),
      ],
      spacing: { before: 20, after: 20 },
    }))
  }

  // Volunteer Work
  const visibleVolunteer = data.volunteer_work?.filter(v => !v.hidden) ?? []
  if (visibleVolunteer.length) {
    sections.push(sectionHeading('Volunteer Work'))
    for (const vol of visibleVolunteer) {
      const dateRange = vol.is_current ? `${vol.start_date} – Present` : `${vol.start_date} – ${vol.end_date ?? ''}`
      sections.push(entryHeader(vol.role, dateRange))
      sections.push(entrySubtitle(vol.organization))
      if (vol.description) sections.push(bodyText(vol.description))
    }
  }

  const doc = new Document({
    sections: [{
      properties: {
        page: {
          margin: { top: 720, bottom: 720, left: 720, right: 720 },
        },
      },
      children: sections,
    }],
  })

  return Packer.toBlob(doc)
}
