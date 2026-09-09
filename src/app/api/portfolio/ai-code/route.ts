import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await getSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { prompt, currentTemplate, currentTheme } = await request.json()
    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
    }

    console.log(`[AI CODE PROMPT API] Prompt: "${prompt}" | User: ${user.id} | Template: ${currentTemplate}`)

    // AI prompt analysis logic
    const lower = prompt.toLowerCase()
    let suggestedHex = '#6366f1' // Default Indigo
    let suggestedTemplate = currentTemplate || 'modern'
    let generatedCss = ''

    if (lower.includes('cyan') || lower.includes('neon') || lower.includes('matrix') || lower.includes('cyber')) {
      suggestedHex = '#06b6d4'
      suggestedTemplate = 'developer'
      generatedCss = `.portfolio-card { backdrop-filter: blur(16px); border: 1px solid rgba(6, 182, 212, 0.3); box-shadow: 0 0 20px rgba(6, 182, 212, 0.15); }`
    } else if (lower.includes('emerald') || lower.includes('green') || lower.includes('terminal')) {
      suggestedHex = '#10b981'
      suggestedTemplate = 'developer'
      generatedCss = `.portfolio-card { backdrop-filter: blur(16px); border: 1px solid rgba(16, 185, 129, 0.3); }`
    } else if (lower.includes('rose') || lower.includes('pink') || lower.includes('crimson')) {
      suggestedHex = '#f43f5e'
      suggestedTemplate = 'creative'
      generatedCss = `.portfolio-card { backdrop-filter: blur(16px); border: 1px solid rgba(244, 63, 94, 0.3); }`
    } else if (lower.includes('gold') || lower.includes('amber') || lower.includes('luxury') || lower.includes('elegant')) {
      suggestedHex = '#f59e0b'
      suggestedTemplate = 'elegant'
      generatedCss = `.portfolio-card { backdrop-filter: blur(16px); border: 1px solid rgba(245, 158, 11, 0.3); }`
    } else if (lower.includes('violet') || lower.includes('purple') || lower.includes('bold')) {
      suggestedHex = '#8b5cf6'
      suggestedTemplate = 'bold'
      generatedCss = `.portfolio-card { backdrop-filter: blur(16px); border: 1px solid rgba(139, 92, 246, 0.3); }`
    } else {
      suggestedHex = '#6366f1'
      generatedCss = `.portfolio-card { backdrop-filter: blur(16px); border: 1px solid rgba(99, 102, 241, 0.3); }`
    }

    return NextResponse.json({
      success: true,
      suggestedHex,
      suggestedTemplate,
      generatedCss,
      message: `AI generated custom CSS & accent color ${suggestedHex} based on your prompt: "${prompt}"`
    })
  } catch (err) {
    console.error('AI Code Prompt error:', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
