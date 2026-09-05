// ============================================================
// SmartResume AI — AI Client (SERVER-SIDE ONLY)
// Never import this in client components
// ============================================================

import Groq from 'groq-sdk'
import { getKeyManager } from './key-manager'
import { selectModel, getTemperature, getMaxTokens } from './models'
import type { AITaskType } from '@/types'
import { z } from 'zod'

export class AIError extends Error {
  constructor(
    message: string,
    public code: string,
    public retryable: boolean = false
  ) {
    super(message)
    this.name = 'AIError'
  }
}

interface AIRequestOptions {
  taskType: AITaskType
  systemPrompt: string
  userPrompt: string
  userId?: string
}

interface AIResponse {
  content: string
  model: string
  promptTokens: number
  completionTokens: number
  totalTokens: number
}

const MAX_RETRIES = 3

export async function callAI(options: AIRequestOptions): Promise<AIResponse> {
  const manager = getKeyManager()

  if (!manager.hasKeys()) {
    throw new AIError(
      'AI service is not configured. Please add GROQ_API_KEY to environment.',
      'NO_KEYS',
      false
    )
  }

  const model = selectModel(options.taskType)
  const temperature = getTemperature(options.taskType)
  const maxTokens = getMaxTokens(options.taskType)

  let lastError: Error | null = null

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    const apiKey = manager.getAvailableKey()

    if (!apiKey) {
      throw new AIError(
        'All AI service keys are currently unavailable. Please try again in a moment.',
        'ALL_KEYS_UNAVAILABLE',
        true
      )
    }

    try {
      const groq = new Groq({ apiKey })

      const completion = await groq.chat.completions.create({
        model,
        messages: [
          { role: 'system', content: options.systemPrompt },
          { role: 'user', content: options.userPrompt },
        ],
        temperature,
        max_tokens: maxTokens,
      })

      manager.reportSuccess(apiKey)

      const content = completion.choices[0]?.message?.content ?? ''
      const usage = completion.usage

      return {
        content,
        model,
        promptTokens: usage?.prompt_tokens ?? 0,
        completionTokens: usage?.completion_tokens ?? 0,
        totalTokens: usage?.total_tokens ?? 0,
      }
    } catch (error: unknown) {
      manager.reportFailure(apiKey)
      lastError = error instanceof Error ? error : new Error(String(error))

      const errorMessage = lastError.message.toLowerCase()
      const isRateLimit = errorMessage.includes('rate limit') || errorMessage.includes('429')
      const isServerError = errorMessage.includes('50') || errorMessage.includes('timeout') || errorMessage.includes('network') || errorMessage.includes('fetch') || errorMessage.includes('econnreset')

      // Only retry on transient errors
      if (!isRateLimit && !isServerError) {
        break
      }

      // Wait before retrying
      if (attempt < MAX_RETRIES - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)))
      }
    }
  }

  if (lastError) {
    console.error('[AI] Generation failed. Last error:', lastError)
  }

  throw new AIError(
    lastError ? `AI service temporarily unavailable (${lastError.message}). Your content is safe.` : 'AI service temporarily unavailable. Your content is safe.',
    'GENERATION_FAILED',
    true
  )
}

// Parse JSON from AI response safely
export function parseAIJSON<T>(content: string, schema: z.ZodType<T>): T {
  // Extract JSON if it's wrapped in conversational text
  let cleaned = content.trim()
  const jsonMatch = cleaned.match(/\{[\s\S]*\}|\[[\s\S]*\]/)
  if (jsonMatch) {
    cleaned = jsonMatch[0]
  }

  let parsed: unknown
  try {
    parsed = JSON.parse(cleaned)
  } catch {
    throw new AIError(
      'AI returned an unexpected response format. Please try again.',
      'PARSE_ERROR',
      true
    )
  }

  const result = schema.safeParse(parsed)
  if (!result.success) {
    console.error('[AI SCHEMA ERROR]', result.error)
    console.error('[AI PARSED DATA]', JSON.stringify(parsed, null, 2))
    throw new AIError(
      'AI response did not match expected structure. Please try again.',
      'SCHEMA_ERROR',
      true
    )
  }

  return result.data
}

// Log AI usage to Supabase (server-side)
export async function logAIUsage(params: {
  userId: string
  taskType: AITaskType
  model: string
  promptTokens: number
  completionTokens: number
  totalTokens: number
}): Promise<void> {
  try {
    const { getSupabaseServiceClient } = await import('@/lib/supabase/server')
    const supabase = getSupabaseServiceClient()
    await supabase.from('ai_usage').insert({
      user_id: params.userId,
      task_type: params.taskType,
      model: params.model,
      prompt_tokens: params.promptTokens,
      completion_tokens: params.completionTokens,
      total_tokens: params.totalTokens,
    })
  } catch {
    // Non-critical — don't fail the request if logging fails
    console.warn('[AI] Failed to log usage')
  }
}
