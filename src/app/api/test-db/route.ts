import { getPublicPortfolio } from '@/features/portfolio/actions'
import { NextResponse } from 'next/server'

export async function GET() {
  const result = await getPublicPortfolio('manikandan')
  return NextResponse.json(result)
}
