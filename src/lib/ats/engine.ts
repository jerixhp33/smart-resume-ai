// ============================================================
// SmartResume AI — Deterministic ATS Compatibility Engine
// Score is calculated deterministically, AI only for explanations
// ============================================================

import type { ResumeData, ATSScanResult, FormattingIssue, ATSSuggestion } from '@/types'

// ── Text Utilities ────────────────────────────────────────

function extractResumeText(data: ResumeData): string {
  const parts: string[] = []

  parts.push(data.personal?.full_name ?? '')
  parts.push(data.personal?.professional_title ?? '')
  parts.push(data.personal?.email ?? '')
  parts.push(data.summary ?? '')

  for (const exp of data.experience ?? []) {
    parts.push(exp.company, exp.position, exp.description ?? '', ...(exp.bullets ?? []))
  }
  for (const intern of data.internships ?? []) {
    parts.push(intern.company, intern.position, intern.description ?? '', ...(intern.bullets ?? []))
  }
  for (const edu of data.education ?? []) {
    parts.push(edu.institution, edu.degree, edu.field_of_study ?? '')
  }
  for (const skill of data.skills ?? []) {
    parts.push(skill.name, ...(skill.skills ?? []))
  }
  for (const project of data.projects ?? []) {
    parts.push(project.name, project.description ?? '', ...(project.technologies ?? []), ...(project.bullets ?? []))
  }
  for (const cert of data.certifications ?? []) {
    parts.push(cert.name, cert.issuer ?? '')
  }
  for (const ach of data.achievements ?? []) {
    parts.push(ach.title, ach.description ?? '')
  }

  return parts.filter(Boolean).join(' ').toLowerCase()
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s+#]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length > 1)
}

function normalizeKeyword(kw: string): string {
  return kw.toLowerCase().replace(/[^a-z0-9\s+#.]/g, '').trim()
}

// Fuzzy match: checks if the keyword appears as substring
function fuzzyMatch(keyword: string, text: string): boolean {
  const normalized = normalizeKeyword(keyword)
  if (text.includes(normalized)) return true

  // Handle abbreviations like "js" → "javascript"
  const abbrevMap: Record<string, string[]> = {
    'js': ['javascript'],
    'ts': ['typescript'],
    'py': ['python'],
    'ml': ['machine learning'],
    'ai': ['artificial intelligence'],
    'ux': ['user experience'],
    'ui': ['user interface'],
    'sql': ['structured query language', 'mysql', 'postgresql', 'sqlite'],
    'api': ['application programming interface'],
    'ci/cd': ['continuous integration', 'continuous deployment', 'cicd'],
    'aws': ['amazon web services'],
    'gcp': ['google cloud platform'],
    'k8s': ['kubernetes'],
  }

  if (abbrevMap[normalized]) {
    return abbrevMap[normalized].some(full => text.includes(full))
  }

  return false
}

// ── Keyword Extraction from JD ───────────────────────────

export function extractKeywordsFromJD(jdText: string): string[] {
  // Common skill indicators
  const skillPatterns = [
    /experience (?:with|in|using) ([^,.]+)/gi,
    /proficiency (?:in|with) ([^,.]+)/gi,
    /knowledge of ([^,.]+)/gi,
    /familiar(?:ity)? with ([^,.]+)/gi,
    /expertise in ([^,.]+)/gi,
  ]

  const keywords = new Set<string>()

  // Extract from patterns
  for (const pattern of skillPatterns) {
    const matches = jdText.matchAll(pattern)
    for (const match of matches) {
      const extracted = match[1].trim().toLowerCase()
      if (extracted.length < 50) {
        keywords.add(extracted)
      }
    }
  }

  // Extract individual technical terms (capitalized or well-known)
  const techTerms = jdText.match(/\b[A-Z][a-zA-Z+#.]*\b/g) ?? []
  for (const term of techTerms) {
    if (term.length > 1 && term.length < 30) {
      keywords.add(term.toLowerCase())
    }
  }

  // Extract word n-grams
  const tokens = tokenize(jdText)
  for (const token of tokens) {
    if (token.length > 3 && !STOP_WORDS.has(token)) {
      keywords.add(token)
    }
  }

  return Array.from(keywords).slice(0, 100)
}

const STOP_WORDS = new Set([
  'the', 'and', 'for', 'that', 'this', 'with', 'from', 'will', 'have',
  'been', 'are', 'was', 'were', 'can', 'would', 'should', 'could',
  'our', 'your', 'their', 'they', 'you', 'we', 'it', 'is', 'in',
  'of', 'to', 'a', 'an', 'at', 'by', 'on', 'or', 'as', 'be',
  'has', 'had', 'not', 'but', 'what', 'who', 'how', 'all', 'any',
  'may', 'than', 'then', 'when', 'where', 'why', 'do', 'did',
  'also', 'more', 'some', 'such', 'team', 'work', 'role', 'job',
  'position', 'candidate', 'applicant', 'required', 'preferred',
  'ability', 'skills', 'strong', 'excellent', 'good', 'great',
])

// ── Section Detection ─────────────────────────────────────

function detectSections(data: ResumeData): Record<string, boolean> {
  return {
    hasPersonal: !!(data.personal?.full_name && data.personal?.email),
    hasSummary: !!(data.summary && data.summary.length > 20),
    hasExperience: (data.experience?.length ?? 0) > 0,
    hasEducation: (data.education?.length ?? 0) > 0,
    hasSkills: (data.skills?.length ?? 0) > 0 && (data.skills?.[0]?.skills?.length ?? 0) > 0,
    hasProjects: (data.projects?.length ?? 0) > 0,
    hasCertifications: (data.certifications?.length ?? 0) > 0,
    hasInternships: (data.internships?.length ?? 0) > 0,
  }
}

// ── Formatting Checks ─────────────────────────────────────

function checkFormatting(data: ResumeData): FormattingIssue[] {
  const issues: FormattingIssue[] = []

  // Check contact completeness
  if (!data.personal?.email) {
    issues.push({
      type: 'missing_contact',
      severity: 'high',
      message: 'Email address is missing from contact information.',
      fix: 'Add your professional email address.',
    })
  }

  if (!data.personal?.phone) {
    issues.push({
      type: 'missing_contact',
      severity: 'medium',
      message: 'Phone number is missing from contact information.',
      fix: 'Add your phone number.',
    })
  }

  // Check summary length
  if (data.summary && data.summary.length < 50) {
    issues.push({
      type: 'short_summary',
      severity: 'medium',
      message: 'Professional summary is very short.',
      fix: 'Expand your summary to 3-4 sentences highlighting your key value proposition.',
    })
  }

  if (data.summary && data.summary.length > 800) {
    issues.push({
      type: 'long_summary',
      severity: 'low',
      message: 'Professional summary is quite long.',
      fix: 'Shorten your summary to 3-5 concise sentences.',
    })
  }

  // Check bullet quality
  const allBullets = [
    ...(data.experience?.flatMap(e => e.bullets ?? []) ?? []),
    ...(data.internships?.flatMap(i => i.bullets ?? []) ?? []),
  ]

  const weakBullets = allBullets.filter(b => {
    const lower = b.toLowerCase()
    return (
      lower.startsWith('responsible for') ||
      lower.startsWith('helped with') ||
      lower.startsWith('assisted in') ||
      b.length < 20
    )
  })

  if (weakBullets.length > 0) {
    issues.push({
      type: 'weak_bullets',
      severity: 'medium',
      message: `${weakBullets.length} bullet point(s) start with passive phrases.`,
      fix: 'Start bullets with strong action verbs (e.g., "Developed", "Led", "Implemented").',
    })
  }

  // Check for missing LinkedIn
  if (!data.personal?.linkedin) {
    issues.push({
      type: 'missing_linkedin',
      severity: 'low',
      message: 'LinkedIn profile URL is not included.',
      fix: 'Add your LinkedIn profile URL for professional credibility.',
    })
  }

  // Check date consistency
  const expDates = (data.experience ?? []).map(e => e.start_date).filter(Boolean)
  const eduDates = (data.education ?? []).map(e => e.start_date).filter(Boolean)
  if (expDates.length === 0 && eduDates.length === 0) {
    issues.push({
      type: 'missing_dates',
      severity: 'high',
      message: 'No dates found in experience or education sections.',
      fix: 'Add start and end dates to your experience and education entries.',
    })
  }

  return issues
}

// ── Scoring ───────────────────────────────────────────────

interface ScoringInput {
  resumeData: ResumeData
  jobDescription?: string
}

export function calculateATSScore(input: ScoringInput): ATSScanResult {
  const { resumeData, jobDescription } = input
  const resumeText = extractResumeText(resumeData)
  const sections = detectSections(resumeData)
  const formattingIssues = checkFormatting(resumeData)

  // ── Keyword scoring ──────────────────────────────────
  let keywordScore = 50 // baseline
  let matchedKeywords: string[] = []
  let missingKeywords: string[] = []

  if (jobDescription && jobDescription.trim().length > 50) {
    const jdKeywords = extractKeywordsFromJD(jobDescription)
    const relevantKeywords = jdKeywords
      .filter(kw => kw.length > 2 && !STOP_WORDS.has(kw))
      .slice(0, 50)

    matchedKeywords = relevantKeywords.filter(kw => fuzzyMatch(kw, resumeText))
    missingKeywords = relevantKeywords
      .filter(kw => !fuzzyMatch(kw, resumeText))
      .slice(0, 20)

    const matchRatio = relevantKeywords.length > 0
      ? matchedKeywords.length / relevantKeywords.length
      : 0
    keywordScore = Math.round(30 + matchRatio * 70)
  } else {
    // No JD — score based on content richness
    const tokenCount = tokenize(resumeText).length
    keywordScore = Math.min(80, Math.round(30 + tokenCount / 10))
    matchedKeywords = []
    missingKeywords = []
  }

  // ── Skills scoring ───────────────────────────────────
  const skillCount = (resumeData.skills ?? []).reduce(
    (acc, cat) => acc + (cat.skills?.length ?? 0), 0
  )
  const skillsScore = Math.min(100, Math.round(Math.min(skillCount * 8, 60) + 40))

  // ── Experience scoring ───────────────────────────────
  const expCount = (resumeData.experience?.length ?? 0) + (resumeData.internships?.length ?? 0)
  const hasBullets = [...(resumeData.experience ?? []), ...(resumeData.internships ?? [])].every(
    e => (e.bullets?.length ?? 0) > 0
  )
  let experienceScore = 50
  if (expCount > 0) experienceScore += Math.min(30, expCount * 10)
  if (hasBullets) experienceScore += 20
  experienceScore = Math.min(100, experienceScore)

  // ── Formatting scoring ───────────────────────────────
  const highSeverityCount = formattingIssues.filter(i => i.severity === 'high').length
  const medSeverityCount = formattingIssues.filter(i => i.severity === 'medium').length
  const formattingScore = Math.max(
    0,
    100 - highSeverityCount * 20 - medSeverityCount * 10
  )

  // ── Readability scoring ──────────────────────────────
  let readabilityScore = 70
  if (sections.hasSummary) readabilityScore += 10
  if (sections.hasSkills) readabilityScore += 10
  if (sections.hasPersonal) readabilityScore += 10
  readabilityScore = Math.min(100, readabilityScore)

  // ── Overall score ────────────────────────────────────
  const overallScore = Math.round(
    keywordScore * 0.30 +
    skillsScore * 0.20 +
    experienceScore * 0.25 +
    formattingScore * 0.15 +
    readabilityScore * 0.10
  )

  // ── Suggestions ──────────────────────────────────────
  const suggestions: ATSSuggestion[] = []

  if (missingKeywords.length > 5) {
    suggestions.push({
      category: 'Keywords',
      priority: 'high',
      message: `${missingKeywords.length} important keywords from the job description are missing.`,
      action: `Add these keywords if they accurately describe your experience: ${missingKeywords.slice(0, 5).join(', ')}`,
    })
  }

  if (!sections.hasSummary) {
    suggestions.push({
      category: 'Summary',
      priority: 'high',
      message: 'No professional summary found.',
      action: 'Add a 3-4 sentence professional summary at the top of your resume.',
    })
  }

  if (skillCount < 5) {
    suggestions.push({
      category: 'Skills',
      priority: 'medium',
      message: 'Your skills section appears thin.',
      action: 'Add more relevant technical and soft skills.',
    })
  }

  if (!sections.hasExperience && !sections.hasInternships) {
    suggestions.push({
      category: 'Experience',
      priority: 'high',
      message: 'No work experience or internships found.',
      action: 'Add your work experience, internships, or project experience.',
    })
  }

  for (const issue of formattingIssues) {
    if (issue.severity !== 'low') {
      suggestions.push({
        category: 'Formatting',
        priority: issue.severity,
        message: issue.message,
        action: issue.fix,
      })
    }
  }

  return {
    overall_score: overallScore,
    keyword_score: keywordScore,
    skills_score: skillsScore,
    experience_score: experienceScore,
    formatting_score: formattingScore,
    readability_score: readabilityScore,
    matched_keywords: matchedKeywords.slice(0, 30),
    missing_keywords: missingKeywords.slice(0, 20),
    formatting_issues: formattingIssues,
    suggestions: suggestions.slice(0, 10),
    section_scores: {
      personal: sections.hasPersonal ? 100 : 0,
      summary: sections.hasSummary ? 100 : 0,
      experience: sections.hasExperience ? 100 : 0,
      education: sections.hasEducation ? 100 : 0,
      skills: sections.hasSkills ? 100 : 0,
    },
    ai_explanation: '', // Filled by AI service separately
  }
}
