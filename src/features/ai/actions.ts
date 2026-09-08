'use server'

import { getSupabaseServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { callAI, parseAIJSON, logAIUsage, AIError } from '@/lib/ai/client'
import { SYSTEM_PROMPTS, buildSummaryImprovePrompt, buildJDAnalyzePrompt, buildResumeTailorPrompt, buildBulletGeneratePrompt, buildInterviewQuestionsPrompt, buildCoverLetterPrompt, buildATSScorePrompt } from '@/lib/ai/prompts'
import type { ResumeData, JobAnalysis, AIImprovement, InterviewQuestion } from '@/types'
import { z } from 'zod'

async function requireAuth() {
  const supabase = await getSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  return user
}

function wrapAIError(error: unknown): { error: string; retryable: boolean } {
  if (error instanceof AIError) {
    return { error: error.message, retryable: error.retryable }
  }
  return { error: 'AI service temporarily unavailable. Your content is safe.', retryable: true }
}

// ── Improve Text ─────────────────────────────────────────
export async function improveText(params: {
  text: string
  instruction: 'improve' | 'professional' | 'ats' | 'concise' | 'grammar' | 'rewrite' | 'keywords'
  context?: string
  jobKeywords?: string[]
}): Promise<{ result?: AIImprovement; error?: string; retryable?: boolean }> {
  const user = await requireAuth()

  const instructionMap = {
    improve: 'Improve the writing quality, clarity, and impact of this text.',
    professional: 'Rewrite this text to sound more professional and polished.',
    ats: 'Rewrite this text to be more ATS-friendly, using relevant industry keywords naturally.',
    concise: 'Make this text more concise while preserving all key information.',
    grammar: 'Fix all grammar, spelling, punctuation, capitalization, and tense issues. Ensure proper Title Case is accurately applied to names, job titles, project names, and proper nouns.',
    rewrite: 'Completely rewrite this text while preserving the same meaning and facts.',
    keywords: `Naturally incorporate these keywords if they accurately describe the content: ${params.jobKeywords?.join(', ')}`,
  }

  const prompt = `${instructionMap[params.instruction]}

IMPORTANT RULES:
- Do NOT add skills, achievements, companies, or experience not in the original
- Do NOT fabricate metrics or statistics
- Only improve what is already there
${params.context ? `Context: ${params.context}` : ''}

Original text:
${params.text}

Return JSON only:
{
  "original": "${params.text.slice(0, 100)}...",
  "improved": "...",
  "changes_made": ["change 1", "change 2"],
  "keywords_added": []
}`

  try {
    const response = await callAI({
      taskType: 'grammar_fix',
      systemPrompt: SYSTEM_PROMPTS.BASE,
      userPrompt: prompt,
      userId: user.id,
    })

    const schema = z.object({
      original: z.string(),
      improved: z.string(),
      changes_made: z.array(z.string()),
      keywords_added: z.array(z.string()).default([]),
    })

    const result = parseAIJSON(response.content, schema)
    await logAIUsage({
      userId: user.id,
      taskType: 'grammar_fix',
      model: response.model,
      promptTokens: response.promptTokens,
      completionTokens: response.completionTokens,
      totalTokens: response.totalTokens,
    })

    return { result: result as AIImprovement }
  } catch (error) {
    return wrapAIError(error)
  }
}

// ── Improve Summary ──────────────────────────────────────
export async function improveSummary(params: {
  summary: string
  jobTitle: string
}): Promise<{ result?: AIImprovement; error?: string }> {
  const user = await requireAuth()

  try {
    const response = await callAI({
      taskType: 'summary_improve',
      systemPrompt: SYSTEM_PROMPTS.BASE,
      userPrompt: buildSummaryImprovePrompt(params.summary, params.jobTitle),
      userId: user.id,
    })

    const schema = z.object({
      improved: z.string(),
      changes: z.array(z.string()),
    })
    const parsed = parseAIJSON(response.content, schema)
    await logAIUsage({ userId: user.id, taskType: 'summary_improve', model: response.model, promptTokens: response.promptTokens, completionTokens: response.completionTokens, totalTokens: response.totalTokens })

    return {
      result: {
        original: params.summary,
        improved: parsed.improved,
        changes_made: parsed.changes,
        keywords_added: [],
      },
    }
  } catch (error) {
    return wrapAIError(error)
  }
}

// ── Generate Bullets ─────────────────────────────────────
export async function generateBullets(params: {
  role: string
  company: string
  context: string
}): Promise<{ bullets?: string[]; error?: string }> {
  const user = await requireAuth()

  try {
    const response = await callAI({
      taskType: 'bullet_improve',
      systemPrompt: SYSTEM_PROMPTS.BULLET_IMPROVE,
      userPrompt: buildBulletGeneratePrompt(params.role, params.company, params.context),
      userId: user.id,
    })

    const schema = z.object({ bullets: z.array(z.string()).min(1).max(7) })
    const parsed = parseAIJSON(response.content, schema)
    await logAIUsage({ userId: user.id, taskType: 'bullet_improve', model: response.model, promptTokens: response.promptTokens, completionTokens: response.completionTokens, totalTokens: response.totalTokens })

    return { bullets: parsed.bullets }
  } catch (error) {
    return wrapAIError(error)
  }
}

// ── Analyze Job Description ──────────────────────────────
export async function analyzeJobDescription(
  jobDescription: string
): Promise<{ analysis?: JobAnalysis; error?: string }> {
  const user = await requireAuth()

  if (jobDescription.trim().length < 100) {
    return { error: 'Job description is too short. Please paste the full job posting.' }
  }

  try {
    const response = await callAI({
      taskType: 'jd_analyze',
      systemPrompt: SYSTEM_PROMPTS.KEYWORD_EXTRACT,
      userPrompt: buildJDAnalyzePrompt(jobDescription),
      userId: user.id,
    })

    const schema = z.object({
      job_title: z.string(),
      company: z.string().nullable().optional(),
      required_skills: z.array(z.string()),
      preferred_skills: z.array(z.string()),
      responsibilities: z.array(z.string()),
      education_requirements: z.array(z.string()),
      experience_requirements: z.string(),
      tools_and_technologies: z.array(z.string()),
      important_keywords: z.array(z.string()),
      soft_skills: z.array(z.string()),
      industry: z.string(),
      summary: z.string(),
    })

    const analysis = parseAIJSON(response.content, schema)
    await logAIUsage({ userId: user.id, taskType: 'jd_analyze', model: response.model, promptTokens: response.promptTokens, completionTokens: response.completionTokens, totalTokens: response.totalTokens })

    return { analysis: analysis as JobAnalysis }
  } catch (error) {
    return wrapAIError(error)
  }
}

// ── Tailor Resume to JD ──────────────────────────────────
export async function tailorResumeToJob(params: {
  resumeData: ResumeData
  jobDescription: string
  jobAnalysis: JobAnalysis
}): Promise<{
  tailoredData?: ResumeData
  changes?: Array<{ section: string; field: string; original: string; improved: string; reason: string }>
  matchedKeywords?: string[]
  missingRequirements?: string[]
  error?: string
}> {
  const user = await requireAuth()

  try {
    const response = await callAI({
      taskType: 'resume_tailor',
      systemPrompt: SYSTEM_PROMPTS.BASE,
      userPrompt: buildResumeTailorPrompt(params.resumeData, params.jobDescription, params.jobAnalysis),
      userId: user.id,
    })

    const changeSchema = z.object({
      section: z.string().nullish().catch(''),
      field: z.string().nullish().catch(''),
      original: z.string().nullish().catch(''),
      improved: z.string().nullish().catch(''),
      reason: z.string().nullish().catch(''),
    }).catch({ section: '', field: '', original: '', improved: '', reason: '' })

    const schema = z.object({
      tailored_data: z.record(z.unknown()).catch({}),
      changes: z.array(changeSchema).nullish().catch([]),
      matched_keywords: z.array(z.string()).nullish().catch([]),
      missing_requirements: z.array(z.string()).nullish().catch([]),
      recommendations: z.array(z.string()).nullish().catch([]),
    }).catch({
      tailored_data: {},
      changes: [],
      matched_keywords: [],
      missing_requirements: [],
      recommendations: []
    })

    const parsed = parseAIJSON(response.content, schema) as any
    await logAIUsage({ userId: user.id, taskType: 'resume_tailor', model: response.model, promptTokens: response.promptTokens, completionTokens: response.completionTokens, totalTokens: response.totalTokens })

    return {
      tailoredData: parsed.tailored_data as ResumeData,
      changes: parsed.changes,
      matchedKeywords: parsed.matched_keywords,
      missingRequirements: parsed.missing_requirements,
    }
  } catch (error) {
    return wrapAIError(error)
  }
}

// ── Generate Interview Questions ─────────────────────────
export async function generateInterviewQuestions(params: {
  resumeData: ResumeData
  jobDescription?: string
}): Promise<{ questions?: InterviewQuestion[]; error?: string }> {
  const user = await requireAuth()

  try {
    const response = await callAI({
      taskType: 'interview_generate',
      systemPrompt: SYSTEM_PROMPTS.INTERVIEW_GENERATE,
      userPrompt: buildInterviewQuestionsPrompt(params.resumeData, params.jobDescription),
      userId: user.id,
    })

    const schema = z.object({
      questions: z.array(z.object({
        id: z.string(),
        category: z.enum(['hr', 'technical', 'resume_based', 'jd_based', 'behavioral']),
        question: z.string(),
        guidance: z.string(),
        difficulty: z.enum(['easy', 'medium', 'hard']),
      })),
    })

    const parsed = parseAIJSON(response.content, schema)
    await logAIUsage({ userId: user.id, taskType: 'interview_generate', model: response.model, promptTokens: response.promptTokens, completionTokens: response.completionTokens, totalTokens: response.totalTokens })

    return { questions: parsed.questions as InterviewQuestion[] }
  } catch (error) {
    return wrapAIError(error)
  }
}

// ── Parse Imported Resume Text ───────────────────────────
export async function parseResumeText(text: string): Promise<{ data?: ResumeData; error?: string }> {
  const user = await requireAuth()

  try {
    const expectedSchema = `
{
  "personal": {
    "full_name": "", "professional_title": "", "email": "", "phone": "", "location": "", "linkedin": "", "github": "", "portfolio": ""
  },
  "summary": "",
  "experience": [{ "company": "", "position": "", "location": "", "start_date": "", "end_date": "", "is_current": false, "description": "", "bullets": [""] }],
  "education": [{ "institution": "", "degree": "", "field_of_study": "", "location": "", "start_date": "", "end_date": "", "is_current": false, "gpa": "", "achievements": [""] }],
  "skills": [{ "name": "Technical Skills", "skills": [""] }],
  "projects": [{ "name": "", "description": "", "technologies": [""], "url": "", "github_url": "", "start_date": "", "end_date": "", "bullets": [""] }],
  "languages": [{ "language": "", "proficiency": "native|fluent|professional|conversational|basic" }],
  "certifications": [{ "name": "", "issuer": "", "date": "", "expiry_date": "", "credential_url": "", "credential_id": "" }],
  "internships": [{ "company": "", "position": "", "location": "", "start_date": "", "end_date": "", "is_current": false, "description": "", "bullets": [""] }],
  "achievements": [{ "title": "", "description": "", "date": "" }],
  "volunteer_work": [{ "organization": "", "role": "", "start_date": "", "end_date": "", "is_current": false, "description": "" }]
}`

    const response = await callAI({
      taskType: 'resume_tailor', // Reusing an existing task type category for rate limits
      systemPrompt: SYSTEM_PROMPTS.IMPORT_RESUME,
      userPrompt: `Parse the following unstructured resume/profile text into the following JSON schema:\n\nSCHEMA:\n${expectedSchema}\n\nTEXT:\n${text}`,
      userId: user.id,
    })

    // Create a flexible but structured zod schema matching ResumeData
    const schema = z.object({
      personal: z.object({
        full_name: z.string().default(''),
        professional_title: z.string().default(''),
        email: z.string().default(''),
        phone: z.string().default(''),
        location: z.string().default(''),
        linkedin: z.string().default(''),
        github: z.string().default(''),
        portfolio: z.string().default(''),
        other_links: z.array(z.object({ label: z.string(), url: z.string() })).default([]),
      }).default({}),
      summary: z.string().default(''),
      experience: z.array(z.object({
        id: z.string().optional(),
        company: z.string().default(''),
        position: z.string().default(''),
        location: z.string().default(''),
        start_date: z.string().default(''),
        end_date: z.string().default(''),
        is_current: z.boolean().default(false),
        description: z.string().default(''),
        bullets: z.array(z.string()).default([]),
      })).default([]),
      education: z.array(z.object({
        id: z.string().optional(),
        institution: z.string().default(''),
        degree: z.string().default(''),
        field_of_study: z.string().default(''),
        location: z.string().default(''),
        start_date: z.string().default(''),
        end_date: z.string().default(''),
        is_current: z.boolean().default(false),
        gpa: z.string().default(''),
        achievements: z.array(z.string()).default([]),
      })).default([]),
      skills: z.array(z.object({
        id: z.string().optional(),
        name: z.string().default(''),
        skills: z.array(z.string()).default([]),
      })).default([]),
      projects: z.array(z.object({
        id: z.string().optional(),
        name: z.string().default(''),
        description: z.string().default(''),
        technologies: z.array(z.string()).default([]),
        url: z.string().default(''),
        github_url: z.string().default(''),
        start_date: z.string().default(''),
        end_date: z.string().default(''),
        bullets: z.array(z.string()).default([]),
      })).default([]),
      internships: z.array(z.object({
        id: z.string().optional(),
        company: z.string().default(''),
        position: z.string().default(''),
        location: z.string().default(''),
        start_date: z.string().default(''),
        end_date: z.string().default(''),
        is_current: z.boolean().default(false),
        description: z.string().default(''),
        bullets: z.array(z.string()).default([]),
      })).default([]),
      certifications: z.array(z.object({
        id: z.string().optional(),
        name: z.string().default(''),
        issuer: z.string().default(''),
        date: z.string().default(''),
        expiry_date: z.string().default(''),
        credential_url: z.string().default(''),
        credential_id: z.string().default(''),
      })).default([]),
      languages: z.array(z.object({
        id: z.string().optional(),
        language: z.string().default(''),
        proficiency: z.enum(['native', 'fluent', 'professional', 'conversational', 'basic']).default('conversational'),
      })).default([]),
      achievements: z.array(z.object({
        id: z.string().optional(),
        title: z.string().default(''),
        description: z.string().default(''),
        date: z.string().default(''),
      })).default([]),
      volunteer_work: z.array(z.object({
        id: z.string().optional(),
        organization: z.string().default(''),
        role: z.string().default(''),
        start_date: z.string().default(''),
        end_date: z.string().default(''),
        is_current: z.boolean().default(false),
        description: z.string().default(''),
      })).default([]),
    }).passthrough()

    const parsed = parseAIJSON(response.content, schema)
    
    // Ensure IDs exist for list items
    const uuid = () => crypto.randomUUID()
    if (parsed.experience) parsed.experience = parsed.experience.map((e: any) => ({ ...e, id: e.id || uuid() }))
    if (parsed.education) parsed.education = parsed.education.map((e: any) => ({ ...e, id: e.id || uuid() }))
    if (parsed.skills) parsed.skills = parsed.skills.map((s: any) => ({ ...s, id: s.id || uuid() }))
    if (parsed.projects) parsed.projects = parsed.projects.map((p: any) => ({ ...p, id: p.id || uuid() }))
    if (parsed.internships) parsed.internships = parsed.internships.map((i: any) => ({ ...i, id: i.id || uuid() }))
    if (parsed.certifications) parsed.certifications = parsed.certifications.map((c: any) => ({ ...c, id: c.id || uuid() }))
    if (parsed.languages) parsed.languages = parsed.languages.map((l: any) => ({ ...l, id: l.id || uuid() }))
    if (parsed.achievements) parsed.achievements = parsed.achievements.map((a: any) => ({ ...a, id: a.id || uuid() }))
    if (parsed.volunteer_work) parsed.volunteer_work = parsed.volunteer_work.map((v: any) => ({ ...v, id: v.id || uuid() }))

    await logAIUsage({ userId: user.id, taskType: 'resume_tailor', model: response.model, promptTokens: response.promptTokens, completionTokens: response.completionTokens, totalTokens: response.totalTokens })

    return { data: parsed as unknown as ResumeData }
  } catch (error) {
    return wrapAIError(error)
  }
}

export async function generateCoverLetter(params: {
  resumeData: ResumeData
  jobDescription: string
}): Promise<{ coverLetter?: string; error?: string }> {
  const user = await requireAuth()

  try {
    const response = await callAI({
      taskType: 'resume_tailor', // Uses pro model, good for full generation
      systemPrompt: SYSTEM_PROMPTS.BASE, // Using BASE system prompt for professional output
      userPrompt: buildCoverLetterPrompt(params.resumeData, params.jobDescription),
      userId: user.id,
    })

    const schema = z.object({
      cover_letter_text: z.string(),
    })

    const parsed = parseAIJSON(response.content, schema)

    await logAIUsage({
      userId: user.id,
      taskType: 'resume_tailor',
      model: response.model,
      promptTokens: response.promptTokens,
      completionTokens: response.completionTokens,
      totalTokens: response.totalTokens,
    })

    return { coverLetter: parsed.cover_letter_text }
  } catch (error) {
    return wrapAIError(error)
  }
}

export async function calculateATSScore(params: {
  resumeData: ResumeData
  jobDescription: string
}): Promise<{ score?: number; matchedKeywords?: string[]; missingKeywords?: string[]; feedback?: string; error?: string }> {
  const user = await requireAuth()

  try {
    const response = await callAI({
      taskType: 'resume_tailor',
      systemPrompt: SYSTEM_PROMPTS.BASE,
      userPrompt: buildATSScorePrompt(params.resumeData, params.jobDescription),
      userId: user.id,
    })

    const schema = z.object({
      score: z.number().min(0).max(100),
      matched_keywords: z.array(z.string()),
      missing_keywords: z.array(z.string()),
      feedback: z.string(),
    })

    const parsed = parseAIJSON(response.content, schema)

    await logAIUsage({
      userId: user.id,
      taskType: 'resume_tailor',
      model: response.model,
      promptTokens: response.promptTokens,
      completionTokens: response.completionTokens,
      totalTokens: response.totalTokens,
    })

    return {
      score: parsed.score,
      matchedKeywords: parsed.matched_keywords,
      missingKeywords: parsed.missing_keywords,
      feedback: parsed.feedback,
    }
  } catch (error) {
    return wrapAIError(error)
  }
}
