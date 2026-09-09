import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServiceClient } from '@/lib/supabase/server'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path } = await params
    if (!path || path.length === 0) {
      return new NextResponse('Asset Path Required', { status: 400 })
    }

    const storagePath = path.join('/')
    const supabase = getSupabaseServiceClient()

    // Download asset directly from Supabase Storage using service role
    const { data, error } = await supabase.storage
      .from('user_files')
      .download(storagePath)

    if (error || !data) {
      return new NextResponse('Asset Not Found', { status: 404 })
    }

    const arrayBuffer = await data.arrayBuffer()
    const contentType = data.type || 'image/png'

    return new NextResponse(arrayBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch (err) {
    console.error('Asset proxy error:', err)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
