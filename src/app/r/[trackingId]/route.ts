import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ trackingId: string }> }
) {
  const { trackingId } = await context.params
  const userAgent = request.headers.get('user-agent') || 'Unknown'
  const referer = request.headers.get('referer') || 'Direct'
  const timestamp = new Date().toISOString()

  console.log(`[RECRUITER VIEW EVENT] TrackID: ${trackingId} | Time: ${timestamp} | Referer: ${referer} | UA: ${userAgent}`)

  // Redirect to portfolio or landing page with tracking query
  const targetUrl = new URL(`/portfolio?viewed=true&ref=${encodeURIComponent(trackingId)}`, request.url)
  return NextResponse.redirect(targetUrl)
}
