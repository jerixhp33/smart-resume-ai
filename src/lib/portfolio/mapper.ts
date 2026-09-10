// ============================================================
// SmartResume AI — Pure Client-Safe Portfolio Mapper
// No server or AI client imports allowed in this file
// ============================================================

import type { ResumeData, Profile, PortfolioContent } from '@/types'

/**
 * Safely extracts the first sentence of a text without breaking on abbreviations (B.Sc., M.Sc., Ph.D., Dr., etc.)
 */
function getFirstSentence(text: string): string {
  if (!text) return ''
  const trimmed = text.trim()
  const sentenceEndPattern = /(?<!\b(?:B\.Sc|M\.Sc|Ph\.D|B\.Tech|M\.Tech|B\.E|M\.E|B\.S|M\.S|Dr|Mr|Mrs|Ms|Inc|Ltd|vs|[A-Z]))[.!?]\s+/i
  const match = trimmed.match(sentenceEndPattern)
  
  if (match && match.index !== undefined) {
    return trimmed.slice(0, match.index + 1)
  }
  return trimmed
}

/**
 * Deterministic mapping function from resume & profile data to portfolio content
 * Ultra-robust parser for all variants of parsed resume schemas
 */
export function mapResumeToPortfolioContent(
  resumeData: Partial<ResumeData> | Record<string, any>,
  profile?: Partial<Profile> | null
): PortfolioContent {
  const r: any = resumeData || {}
  const prof: any = profile || {}
  
  // Extract personal info from any possible key variant
  const p = r.personal || r.personal_info || r.personalInfo || r.basics || r.contact || {}
  const fullName = p.full_name || p.fullName || p.name || prof.full_name || 'Candidate'
  const title = p.professional_title || p.title || p.label || p.headline || prof.headline || 'Software Developer & Specialist'
  const email = p.email || prof.email || ''
  const location = p.location || prof.location || ''
  
  const fullSummary = (r.summary || r.about || r.objective || r.biography || prof.bio || '').toString().trim()
  const firstSentence = getFirstSentence(fullSummary)

  const hero = {
    full_name: fullName,
    title: title,
    tagline: `Building high-impact digital solutions and scalable products.`,
    summary: (firstSentence && firstSentence.length > 10)
      ? firstSentence
      : fullSummary || `Specializing in building modern, scalable software applications and user-centered solutions.`,
    avatar_url: profile?.avatar_url || undefined,
    location: location || undefined,
    availability: 'Available for opportunities',
    cta_primary_label: 'View My Work',
    cta_primary_url: '#projects',
    cta_secondary_label: 'Get In Touch',
    cta_secondary_url: '#contact',
  }

  const bioText = fullSummary || `${fullName} is a ${title} dedicated to delivering high-impact technical solutions and user-centered products.`

  const about = {
    biography: bioText,
    career_direction: 'Focused on designing intuitive systems, writing clean maintainable code, and driving product innovation.',
    highlights: [
      'Proven expertise in modern software engineering principles',
      'Track record of building responsive, user-centered web applications',
      'Strong commitment to performance, accessibility, and clean architecture',
    ],
    strengths: ['Problem Solving', 'Technical Leadership', 'Rapid Prototyping', 'System Design'],
    interests: ['Artificial Intelligence', 'Open Source', 'Web Performance'],
  }

  // Work Experience parser (handles arrays of experience / internships)
  const rawExp = [
    ...(Array.isArray(r.experience) ? r.experience : []),
    ...(Array.isArray(r.internships) ? r.internships : []),
    ...(Array.isArray(r.work_history) ? r.work_history : []),
  ]

  const experience = rawExp.map((exp: any, idx: number) => {
    const comp = exp.company || exp.organization || exp.employer || 'Company'
    const roleName = exp.position || exp.role || exp.title || exp.jobTitle || 'Software Engineer'
    const period = exp.period || `${exp.start_date || ''}${exp.start_date || exp.end_date ? ' - ' : ''}${exp.is_current ? 'Present' : exp.end_date || ''}` || '2023 - Present'
    const desc = exp.description || exp.summary || (Array.isArray(exp.bullets) ? exp.bullets.join('. ') : '') || 'Contributed to core development and project goals.'
    const bullets = Array.isArray(exp.bullets) && exp.bullets.length > 0 ? exp.bullets : [desc]

    return {
      id: exp.id || `exp-${idx}`,
      company: comp,
      role: roleName,
      location: exp.location || undefined,
      period,
      is_current: exp.is_current || false,
      description: desc,
      bullets,
    }
  })

  // Education parser
  const rawEdu = Array.isArray(r.education) ? r.education : Array.isArray(r.academic) ? r.academic : []
  const education = rawEdu.map((edu: any, idx: number) => ({
    id: edu.id || `edu-${idx}`,
    institution: edu.institution || edu.school || edu.college || edu.university || 'University',
    degree: edu.degree || edu.qualification || 'Degree',
    field: edu.field_of_study || edu.field || edu.major || 'Computer Science',
    period: edu.period || `${edu.start_date || ''}${edu.start_date || edu.end_date ? ' - ' : ''}${edu.is_current ? 'Present' : edu.end_date || ''}` || 'Completed',
    gpa: edu.gpa || undefined,
    achievements: Array.isArray(edu.achievements) ? edu.achievements : [],
  }))

  // Skills parser (handles arrays of category objects OR array of skill strings)
  const rawSkills = Array.isArray(r.skills) ? r.skills : []
  let parsedSkillGroups: Array<{ id: string; category: string; skills: string[] }> = []

  if (rawSkills.length > 0) {
    if (typeof rawSkills[0] === 'string') {
      // Direct array of skill strings e.g. ['JavaScript', 'React', 'Node.js']
      parsedSkillGroups = [{
        id: 'skill-core',
        category: 'Technical Skills',
        skills: rawSkills as string[],
      }]
    } else {
      // Array of skill objects e.g. [{ name: 'Frontend', skills: ['React'] }]
      parsedSkillGroups = rawSkills.map((cat: any, idx: number) => {
        const catName = cat.name || cat.category || cat.title || cat.group || 'Technical Skills'
        let skillList: string[] = []
        if (Array.isArray(cat.skills)) {
          skillList = cat.skills.map((s: any) => (typeof s === 'string' ? s : s.name || s.title || String(s)))
        } else if (Array.isArray(cat.keywords)) {
          skillList = cat.keywords
        } else if (typeof cat.skill === 'string') {
          skillList = [cat.skill]
        }
        return {
          id: cat.id || `skill-${idx}`,
          category: catName,
          skills: skillList.length > 0 ? skillList : ['Core Technology'],
        }
      })
    }
  } else {
    parsedSkillGroups = [{
      id: 'skill-core',
      category: 'Core Stack',
      skills: ['Software Development', 'Problem Solving', 'Web Technologies'],
    }]
  }

  // Projects parser
  const rawProjects = Array.isArray(r.projects) ? r.projects : []
  const projects = rawProjects.map((proj: any, idx: number) => {
    const titleName = proj.name || proj.title || proj.projectName || `Project ${idx + 1}`
    const descText = proj.description || proj.summary || proj.details || 'Full-stack application built with modern architecture.'
    const techList = Array.isArray(proj.technologies) 
      ? proj.technologies 
      : Array.isArray(proj.techStack) 
      ? proj.techStack 
      : ['React', 'TypeScript']

    return {
      id: proj.id || `proj-${idx}`,
      title: titleName,
      tagline: (Array.isArray(proj.bullets) && proj.bullets[0]) || 'Innovative web application built for real-world impact.',
      description: descText,
      technologies: techList,
      github_url: proj.github_url || proj.github || undefined,
      live_url: proj.url || proj.live_url || proj.link || undefined,
      highlights: Array.isArray(proj.bullets) ? proj.bullets : [descText],
      problem: 'Addressing key user workflows with efficiency and scalability.',
      solution: 'Designed and deployed a responsive application using industry best practices.',
      result: 'Delivered a high-performance experience with seamless interaction.',
    }
  })

  // Certifications parser
  const rawCerts = Array.isArray(r.certifications) ? r.certifications : []
  const certifications = rawCerts.map((cert: any, idx: number) => ({
    id: cert.id || `cert-${idx}`,
    title: cert.name || cert.title || 'Professional Certification',
    issuer: cert.issuer || cert.organization || 'Issuing Authority',
    date: cert.date || cert.issue_date || 'Verified',
    credential_url: cert.credential_url || cert.url || undefined,
  }))

  const contact = {
    heading: "Let's build something meaningful together.",
    subheading: 'Interested in working together or discussing potential opportunities? Feel free to reach out.',
    email: email || profile?.email || '',
    phone: p.phone || undefined,
    location: location || undefined,
    linkedin_url: p.linkedin || p.linkedin_url || undefined,
    github_url: p.github || p.github_url || undefined,
    website_url: p.portfolio || p.website || undefined,
  }

  return {
    hero,
    about,
    experience,
    education,
    skills: parsedSkillGroups,
    projects,
    certifications,
    achievements: [],
    contact,
    section_order: ['hero', 'about', 'projects', 'experience', 'skills', 'education', 'certifications', 'contact'],
    hidden_sections: {},
  }
}

/**
 * Enriches a portfolio content object with any missing sections from resume data
 */
export function enrichContentWithResume(
  content: PortfolioContent,
  resumeData?: Partial<ResumeData> | Record<string, any> | null,
  profile?: Partial<Profile> | null
): PortfolioContent {
  if (!resumeData) return content
  const mapped = mapResumeToPortfolioContent(resumeData, profile)

  let heroSummary = content.hero?.summary || mapped.hero.summary
  let aboutBio = content.about?.biography || mapped.about.biography

  if (heroSummary && aboutBio && heroSummary.trim() === aboutBio.trim()) {
    const fullText = aboutBio.trim()
    const firstSentence = getFirstSentence(fullText)
    if (firstSentence && firstSentence !== fullText) {
      heroSummary = firstSentence
    } else {
      heroSummary = content.hero?.tagline || `Building high-impact digital solutions and scalable products.`
    }
  }

  return {
    ...content,
    hero: {
      ...mapped.hero,
      ...content.hero,
      full_name: content.hero?.full_name && content.hero.full_name !== 'Candidate' ? content.hero.full_name : mapped.hero.full_name,
      title: content.hero?.title && content.hero.title !== 'Software Developer & Specialist' ? content.hero.title : mapped.hero.title,
      summary: heroSummary,
    },
    about: {
      ...mapped.about,
      ...content.about,
      biography: aboutBio && !aboutBio.startsWith('is a specialist') ? aboutBio : mapped.about.biography,
    },
    experience: (content.experience && content.experience.length > 0) ? content.experience : mapped.experience,
    education: (content.education && content.education.length > 0) ? content.education : mapped.education,
    skills: (content.skills && content.skills.length > 0 && content.skills[0].skills.length > 0) ? content.skills : mapped.skills,
    projects: (content.projects && content.projects.length > 0) ? content.projects : mapped.projects,
    certifications: (content.certifications && content.certifications.length > 0) ? content.certifications : mapped.certifications,
    achievements: (content.achievements && content.achievements.length > 0) ? content.achievements : mapped.achievements,
    contact: {
      ...mapped.contact,
      ...content.contact,
      email: content.contact?.email || mapped.contact.email,
      github_url: content.contact?.github_url || mapped.contact.github_url,
      linkedin_url: content.contact?.linkedin_url || mapped.contact.linkedin_url,
    },
  }
}
