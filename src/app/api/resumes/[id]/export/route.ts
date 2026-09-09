import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { generateDOCX } from '@/lib/export/docx-generator'
import { generatePlainText } from '@/lib/export/text-generator'
import type { ResumeData } from '@/types'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const format = request.nextUrl.searchParams.get('format') ?? 'txt'

  const supabase = await getSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // IDOR check: verify ownership
  const { data: resume, error } = await supabase
    .from('resumes')
    .select('name, data')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (error || !resume) {
    return NextResponse.json({ error: 'Resume not found' }, { status: 404 })
  }

  const resumeData = resume.data as ResumeData
  const safeFilename = (resume.name || 'resume').replace(/[^a-z0-9_-]/gi, '_')

  if (format === 'docx') {
    const docxBlob = await generateDOCX(resumeData)
    const buffer = Buffer.from(await docxBlob.arrayBuffer())

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="${safeFilename}.docx"`,
      },
    })
  }

  if (format === 'json') {
    return NextResponse.json(resumeData, {
      status: 200,
      headers: {
        'Content-Disposition': `attachment; filename="${safeFilename}.json"`,
      },
    })
  }

  // Default format = txt
  const plainText = generatePlainText(resumeData)
  return new NextResponse(plainText, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Content-Disposition': `attachment; filename="${safeFilename}.txt"`,
    },
  })
}
