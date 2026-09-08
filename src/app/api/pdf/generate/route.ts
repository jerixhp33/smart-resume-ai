import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServerClient, getSupabaseServiceClient } from '@/lib/supabase/server'
import { generatePDF, preflightCheck } from '@/lib/pdf/generator'
import { createNotification } from '@/lib/notifications/createNotification'
import type { ResumeData, TemplateId } from '@/types'

export async function POST(request: NextRequest) {
  try {
    // Auth check
    const supabase = await getSupabaseServerClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { resumeId, resumeData, templateId, pageSize } = body as {
      resumeId: string
      resumeData: ResumeData
      templateId: TemplateId
      pageSize?: 'A4' | 'Letter'
    }

    if (!resumeId || !resumeData) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 })
    }

    // Verify ownership
    const serviceClient = getSupabaseServiceClient()
    const { data: resume } = await serviceClient
      .from('resumes')
      .select('id')
      .eq('id', resumeId)
      .eq('user_id', user.id)
      .single()

    if (!resume) {
      return NextResponse.json({ error: 'Resume not found' }, { status: 404 })
    }

    // Preflight checks
    const preflight = preflightCheck(resumeData)
    if (!preflight.passed) {
      return NextResponse.json({
        error: 'Resume failed preflight check',
        checks: preflight.checks,
        preflightFailed: true,
      }, { status: 422 })
    }

    // Generate PDF
    const pdfBuffer = await generatePDF({
      resumeData,
      templateId: templateId ?? 'ats-classic',
      pageSize: pageSize ?? 'A4',
    })

    // Send notification
    await createNotification({
      userId: user.id,
      type: 'pdf_ready',
      title: 'PDF Ready',
      message: 'Your resume PDF has been generated and is ready to download.',
      data: { resumeId },
    })

    // Return PDF binary
    return new NextResponse(pdfBuffer as any, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="resume-${Date.now()}.pdf"`,
        'Content-Length': pdfBuffer.length.toString(),
      },
    })
  } catch (error) {
    console.error('[PDF] Generation failed:', error)

    return NextResponse.json({
      error: error instanceof Error ? error.message : 'PDF generation failed. Your resume is saved.',
      retryable: true,
    }, { status: 500 })
  }
}
