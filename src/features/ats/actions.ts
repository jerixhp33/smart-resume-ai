'use server'

import { getSupabaseServerClient, getSupabaseServiceClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { calculateATSScore } from '@/lib/ats/engine'
import { callAI, AIError } from '@/lib/ai/client'
import { SYSTEM_PROMPTS, buildCoverLetterPrompt } from '@/lib/ai/prompts'
import { updateResumeATSScore } from '@/features/resume/actions'
import { createNotification } from '@/lib/notifications/createNotification'
import type { ResumeData, ATSScanResult } from '@/types'

async function requireAuth() {
  const supabase = await getSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  return user
}

// ── Run ATS Analysis ─────────────────────────────────────
export async function runATSAnalysis(params: {
  resumeId: string
  resumeData: ResumeData
  jobDescription?: string
}): Promise<{ result?: ATSScanResult; error?: string }> {
  const user = await requireAuth()
  const serviceClient = getSupabaseServiceClient()

  // Verify resume ownership
  const { data: resume } = await serviceClient
    .from('resumes')
    .select('id')
    .eq('id', params.resumeId)
    .eq('user_id', user.id)
    .single()

  if (!resume) return { error: 'Resume not found' }

  // 1. Calculate deterministic score
  const result = calculateATSScore({
    resumeData: params.resumeData,
    jobDescription: params.jobDescription,
  })

  // 2. Get AI explanation (non-blocking — use basic explanation on failure)
  try {
    const explanationPrompt = `Provide a clear, actionable explanation of these ATS scan results for a job seeker.
Scores: Overall ${result.overall_score}/100, Keywords ${result.keyword_score}/100, Skills ${result.skills_score}/100, Experience ${result.experience_score}/100, Formatting ${result.formatting_score}/100.
Top issues: ${result.suggestions.slice(0, 3).map(s => s.message).join('; ')}.
Missing keywords: ${result.missing_keywords.slice(0, 5).join(', ')}.
Be encouraging, specific, and practical. Keep it to 2-3 short paragraphs.`

    const aiResponse = await callAI({
      taskType: 'ats_explain',
      systemPrompt: SYSTEM_PROMPTS.ATS_EXPLAIN,
      userPrompt: explanationPrompt,
      userId: user.id,
    })
    result.ai_explanation = aiResponse.content
  } catch {
    result.ai_explanation = generateFallbackExplanation(result)
  }

  // 3. Store scan result
  await serviceClient.from('ats_scans').insert({
    user_id: user.id,
    resume_id: params.resumeId,
    job_description: params.jobDescription ?? null,
    result: result as unknown as Record<string, unknown>,
  })

  // 4. Update resume's ATS score
  await updateResumeATSScore(params.resumeId, result.overall_score)

  // 5. Send notification
  await createNotification({
    userId: user.id,
    type: 'ats_complete',
    title: 'ATS Analysis Complete',
    message: `Your resume scored ${result.overall_score}/100 for ATS compatibility.`,
    data: { score: result.overall_score, resumeId: params.resumeId },
  })

  return { result }
}

function generateFallbackExplanation(result: ATSScanResult): string {
  const scoreLabel = result.overall_score >= 80 ? 'excellent' : result.overall_score >= 60 ? 'good' : 'fair'
  return `Your resume has an ${scoreLabel} ATS compatibility score of ${result.overall_score}/100. ${
    result.missing_keywords.length > 0
      ? `Adding keywords like "${result.missing_keywords.slice(0, 3).join('", "')}" could improve your score.`
      : 'Your keyword coverage looks solid.'
  } ${result.suggestions.length > 0 ? result.suggestions[0].action : 'Keep improving your content for better results.'}`
}

// ── Get ATS History ──────────────────────────────────────
export async function getATSScanHistory(resumeId: string) {
  const user = await requireAuth()
  const supabase = await getSupabaseServerClient()

  const { data, error } = await supabase
    .from('ats_scans')
    .select('id, result, created_at')
    .eq('resume_id', resumeId)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(10)

  if (error) return { scans: [], error: error.message }
  return { scans: data ?? [] }
}

// ── Autofill Missing Keyword ──────────────────────────────
export async function autofillKeywordAction(params: {
  resumeId: string
  keyword: string
  jobDescription?: string
}): Promise<{ suggestedBullet?: string; error?: string }> {
  const user = await requireAuth()
  const serviceClient = getSupabaseServiceClient()

  const { data: resume } = await serviceClient
    .from('resumes')
    .select('data')
    .eq('id', params.resumeId)
    .eq('user_id', user.id)
    .single()

  if (!resume) return { error: 'Resume not found' }

  try {
    const prompt = `The job seeker is missing the keyword "${params.keyword}" in their resume for ATS compatibility.
Generate a concise, professional bullet point or skill highlight incorporating "${params.keyword}" tailored to their background.
Do NOT invent fake metrics or experience. Keep it realistic and ATS-friendly.

Candidate background summary:
${JSON.stringify((resume.data as ResumeData)?.experience?.slice(0, 2) ?? [])}

${params.jobDescription ? `Target Job Description:\n${params.jobDescription}` : ''}

Return JSON: { "suggestedBullet": "..." }`

    const aiResponse = await callAI({
      taskType: 'bullet_improve',
      systemPrompt: SYSTEM_PROMPTS.BULLET_IMPROVE,
      userPrompt: prompt,
      userId: user.id,
    })

    const parsed = JSON.parse(aiResponse.content.replace(/```json|```/g, '').trim())
    return { suggestedBullet: parsed.suggestedBullet || parsed.improved || `Proficient in ${params.keyword} with hands-on experience across key projects.` }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'AI generation failed'
    return { error: msg }
  }
}

// ── Generate Tailored Cover Letter ────────────────────────
export async function generateCoverLetterAction(params: {
  resumeId: string
  jobDescription: string
}): Promise<{ coverLetter?: string; error?: string }> {
  const user = await requireAuth()
  const serviceClient = getSupabaseServiceClient()

  const { data: resume } = await serviceClient
    .from('resumes')
    .select('data')
    .eq('id', params.resumeId)
    .eq('user_id', user.id)
    .single()

  if (!resume) return { error: 'Resume not found' }

  try {
    const prompt = buildCoverLetterPrompt(resume.data as ResumeData, params.jobDescription)
    const aiResponse = await callAI({
      taskType: 'cover_letter',
      systemPrompt: SYSTEM_PROMPTS.BASE,
      userPrompt: prompt,
      userId: user.id,
    })

    const parsed = JSON.parse(aiResponse.content.replace(/```json|```/g, '').trim())
    return { coverLetter: parsed.cover_letter_text }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Cover letter generation failed'
    return { error: msg }
  }
}

