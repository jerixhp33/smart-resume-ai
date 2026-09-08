// ============================================================
// SmartResume AI — Pure Client-Safe Portfolio Mapper
// No server or AI client imports allowed in this file
// ============================================================

import type { ResumeData, Profile, PortfolioContent } from '@/types'

/**
 * Deterministic mapping function from resume & profile data to portfolio content
 */
export function mapResumeToPortfolioContent(
  resumeData: Partial<ResumeData>,
  profile?: Partial<Profile> | null
): PortfolioContent {
  const p = resumeData.personal || {
    full_name: profile?.full_name || 'Professional',
    professional_title: 'Specialist',
    email: profile?.email || '',
    phone: '',
    location: '',
    linkedin: '',
    github: '',
    portfolio: '',
    other_links: [],
  }

  const hero = {
    full_name: p.full_name || profile?.full_name || 'Professional',
    title: p.professional_title || 'Software Developer & Specialist',
    tagline: `Building high-impact digital solutions and scalable products.`,
    summary: resumeData.summary || `Passionate professional driven to deliver innovative solutions and technical excellence.`,
    avatar_url: profile?.avatar_url || undefined,
    location: p.location || undefined,
    availability: 'Available for opportunities',
    cta_primary_label: 'View My Work',
    cta_primary_url: '#projects',
    cta_secondary_label: 'Get In Touch',
    cta_secondary_url: '#contact',
  }

  const about = {
    biography: resumeData.summary || `${p.full_name} is a ${p.professional_title} with experience delivering innovative technical projects.`,
    career_direction: 'Focused on designing intuitive systems, writing clean maintainable code, and driving product innovation.',
    highlights: [
      'Proven expertise in modern software engineering principles',
      'Track record of building responsive, user-centered web applications',
      'Strong commitment to performance, accessibility, and clean architecture',
    ],
    strengths: ['Problem Solving', 'Technical Leadership', 'Rapid Prototyping', 'System Design'],
    interests: ['Artificial Intelligence', 'Open Source', 'Web Performance'],
  }

  const experience = (resumeData.experience || []).map((exp, idx) => ({
    id: exp.id || `exp-${idx}`,
    company: exp.company,
    role: exp.position,
    location: exp.location || undefined,
    period: `${exp.start_date || ''} - ${exp.is_current ? 'Present' : exp.end_date || ''}`,
    is_current: exp.is_current,
    description: exp.description || '',
    bullets: exp.bullets || [],
  }))

  const education = (resumeData.education || []).map((edu, idx) => ({
    id: edu.id || `edu-${idx}`,
    institution: edu.institution,
    degree: edu.degree,
    field: edu.field_of_study || '',
    period: `${edu.start_date || ''} - ${edu.is_current ? 'Present' : edu.end_date || ''}`,
    gpa: edu.gpa || undefined,
    achievements: edu.achievements || [],
  }))

  const skills = (resumeData.skills || []).map((cat, idx) => ({
    id: cat.id || `skill-${idx}`,
    category: cat.name,
    skills: cat.skills || [],
  }))

  const projects = (resumeData.projects || []).map((proj, idx) => ({
    id: proj.id || `proj-${idx}`,
    title: proj.name,
    tagline: proj.bullets?.[0] || 'Innovative application built with modern architecture.',
    description: proj.description || '',
    technologies: proj.technologies || [],
    github_url: proj.github_url || undefined,
    live_url: proj.url || undefined,
    highlights: proj.bullets || [],
    problem: 'Addressing key user workflows with efficiency and scalability.',
    solution: 'Designed and deployed a responsive application using industry best practices.',
    result: 'Delivered a high-performance experience with seamless interaction.',
  }))

  const certifications = (resumeData.certifications || []).map((cert, idx) => ({
    id: cert.id || `cert-${idx}`,
    title: cert.name,
    issuer: cert.issuer,
    date: cert.date,
    credential_url: cert.credential_url || undefined,
  }))

  const achievements = (resumeData.achievements || []).map((ach, idx) => ({
    id: ach.id || `ach-${idx}`,
    title: ach.title,
    description: ach.description,
    date: ach.date || undefined,
  }))

  const contact = {
    heading: "Let's build something meaningful together.",
    subheading: 'Interested in working together or discussing potential opportunities? Feel free to reach out.',
    email: p.email || profile?.email || '',
    phone: p.phone || undefined,
    location: p.location || undefined,
    linkedin_url: p.linkedin || undefined,
    github_url: p.github || undefined,
    website_url: p.portfolio || undefined,
  }

  return {
    hero,
    about,
    experience,
    education,
    skills,
    projects,
    certifications,
    achievements,
    contact,
    section_order: ['hero', 'about', 'projects', 'experience', 'skills', 'education', 'certifications', 'achievements', 'contact'],
    hidden_sections: {},
  }
}
