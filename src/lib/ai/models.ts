// ============================================================
// SmartResume AI — AI Model Definitions & Task Router
// ============================================================

import type { AITaskType } from '@/types'

// Model identifiers
export const MODELS = {
  FAST: 'openai/gpt-oss-20b',    // Fast tasks, short content
  QUALITY: 'openai/gpt-oss-120b', // Complex tasks, high quality
} as const

export type ModelId = (typeof MODELS)[keyof typeof MODELS]

// Tasks that use the fast/small model
const FAST_TASKS = new Set<AITaskType>([
  'grammar_fix',
  'short_rewrite',
  'bullet_improve',
  'summary_improve',
  'keyword_extract',
  'interview_generate',
])

// Tasks that use the quality/large model
const QUALITY_TASKS = new Set<AITaskType>([
  'generate_resume',
  'complex_rewrite',
  'jd_analyze',
  'resume_tailor',
  'ats_explain',
  'content_review',
])

export function selectModel(taskType: AITaskType): ModelId {
  if (FAST_TASKS.has(taskType)) return MODELS.FAST
  if (QUALITY_TASKS.has(taskType)) return MODELS.QUALITY
  // Default to fast for unknown tasks
  return MODELS.FAST
}

// Temperature settings per task
export function getTemperature(taskType: AITaskType): number {
  const temperatures: Partial<Record<AITaskType, number>> = {
    grammar_fix: 0.1,       // Very deterministic
    keyword_extract: 0.1,
    jd_analyze: 0.2,
    ats_explain: 0.3,
    bullet_improve: 0.4,
    summary_improve: 0.4,
    resume_tailor: 0.3,
    generate_resume: 0.5,
    short_rewrite: 0.5,
    complex_rewrite: 0.5,
    content_review: 0.3,
    interview_generate: 0.6, // Slightly more variety for questions
  }
  return temperatures[taskType] ?? 0.4
}

export function getMaxTokens(taskType: AITaskType): number {
  const maxTokens: Partial<Record<AITaskType, number>> = {
    grammar_fix: 500,
    keyword_extract: 300,
    bullet_improve: 400,
    summary_improve: 500,
    short_rewrite: 600,
    jd_analyze: 1500,
    ats_explain: 800,
    resume_tailor: 3000,
    generate_resume: 4000,
    complex_rewrite: 2000,
    content_review: 1500,
    interview_generate: 2000,
  }
  return maxTokens[taskType] ?? 1000
}
