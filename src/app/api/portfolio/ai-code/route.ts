import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { callAI } from '@/lib/ai/client'

export async function POST(request: NextRequest) {
  try {
    const supabase = await getSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { prompt, currentTemplate } = await request.json()
    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
    }

    // Call Groq AI to generate custom accent color, template layout, and custom CSS
    let suggestedHex = '#06b6d4'
    let suggestedTemplate = 'cyberpunk-neon'
    let generatedCss = ''
    let codeSnippet = ''

    try {
      const aiRes = await callAI({
        taskType: 'generate_portfolio',
        systemPrompt: `You are an expert AI web developer and designer. Analyze the user's natural language design prompt and generate visual styling JSON.
Return JSON ONLY:
{
  "suggestedHex": "#HEX_COLOR",
  "suggestedTemplate": "cyberpunk-neon" | "matrix-terminal" | "gold-serif" | "glass-cards" | "standard",
  "generatedCss": "/* CSS rules */",
  "codeCommentary": "// Generated Component layout..."
}`,
        userPrompt: `Design Prompt: "${prompt}"`,
        userId: user.id,
      })

      const cleaned = aiRes.content.match(/\{[\s\S]*\}/)?.[0] || '{}'
      const parsed = JSON.parse(cleaned)
      if (parsed.suggestedHex) suggestedHex = parsed.suggestedHex
      if (parsed.suggestedTemplate) suggestedTemplate = parsed.suggestedTemplate
      if (parsed.generatedCss) generatedCss = parsed.generatedCss
      if (parsed.codeCommentary) codeSnippet = parsed.codeCommentary
    } catch (e) {
      // Rule-based fallback if Groq AI key is rate-limited or unavailable
      const lower = prompt.toLowerCase()
      if (lower.includes('cyan') || lower.includes('neon') || lower.includes('matrix') || lower.includes('cyber')) {
        suggestedHex = '#06b6d4'
        suggestedTemplate = 'cyberpunk-neon'
        generatedCss = `.portfolio-card { backdrop-filter: blur(16px); border: 1px solid rgba(6, 182, 212, 0.3); box-shadow: 0 0 20px rgba(6, 182, 212, 0.15); }`
      } else if (lower.includes('emerald') || lower.includes('green') || lower.includes('terminal')) {
        suggestedHex = '#10b981'
        suggestedTemplate = 'matrix-terminal'
        generatedCss = `.portfolio-card { backdrop-filter: blur(16px); border: 1px solid rgba(16, 185, 129, 0.3); }`
      } else if (lower.includes('rose') || lower.includes('pink') || lower.includes('crimson')) {
        suggestedHex = '#f43f5e'
        suggestedTemplate = 'cyberpunk-neon'
        generatedCss = `.portfolio-card { backdrop-filter: blur(16px); border: 1px solid rgba(244, 63, 94, 0.3); }`
      } else if (lower.includes('gold') || lower.includes('amber') || lower.includes('luxury') || lower.includes('elegant')) {
        suggestedHex = '#f59e0b'
        suggestedTemplate = 'gold-serif'
        generatedCss = `.portfolio-card { backdrop-filter: blur(16px); border: 1px solid rgba(245, 158, 11, 0.3); }`
      } else if (lower.includes('violet') || lower.includes('purple') || lower.includes('bold')) {
        suggestedHex = '#8b5cf6'
        suggestedTemplate = 'glass-cards'
        generatedCss = `.portfolio-card { backdrop-filter: blur(16px); border: 1px solid rgba(139, 92, 246, 0.3); }`
      } else {
        suggestedHex = '#6366f1'
        suggestedTemplate = 'glass-cards'
        generatedCss = `.portfolio-card { backdrop-filter: blur(16px); border: 1px solid rgba(99, 102, 241, 0.3); }`
      }
    }

    return NextResponse.json({
      success: true,
      suggestedHex,
      suggestedTemplate,
      generatedCss,
      codeSnippet,
      message: `AI generated custom CSS & accent color ${suggestedHex}`
    })
  } catch (err) {
    console.error('AI Code Prompt error:', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
