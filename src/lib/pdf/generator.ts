// ============================================================
// SmartResume AI — PDF Generation Service (SERVER-SIDE ONLY)
// Uses Puppeteer + Chromium to render HTML → PDF
// Never generates PDF from screenshots
// ============================================================

import type { ResumeData, TemplateId } from '@/types'

export interface PDFGenerationOptions {
  resumeData: ResumeData
  templateId: TemplateId
  pageSize?: 'A4' | 'Letter'
}

export interface PDFPreflightResult {
  passed: boolean
  checks: {
    name: string
    status: 'pass' | 'fail' | 'warning'
    message: string
  }[]
}

// Preflight checks before PDF generation
export function preflightCheck(data: ResumeData): PDFPreflightResult {
  const checks: PDFPreflightResult['checks'] = []

  // Content check
  checks.push({
    name: 'Contact Information',
    status: data.personal?.full_name && data.personal?.email ? 'pass' : 'warning',
    message: data.personal?.full_name && data.personal?.email
      ? 'Contact information present'
      : 'Name or email is missing',
  })

  // Summary check
  checks.push({
    name: 'Professional Summary',
    status: data.summary && data.summary.length > 20 ? 'pass' : 'warning',
    message: data.summary && data.summary.length > 20
      ? 'Summary present'
      : 'Professional summary is empty or too short',
  })

  // Content check
  const hasContent = (data.experience?.length ?? 0) > 0 ||
    (data.education?.length ?? 0) > 0 ||
    (data.projects?.length ?? 0) > 0

  checks.push({
    name: 'Resume Content',
    status: hasContent ? 'pass' : 'fail',
    message: hasContent ? 'Resume has content' : 'Resume appears to be empty',
  })

  const passed = checks.every(c => c.status !== 'fail')

  return { passed, checks }
}

// Get Chromium/Puppeteer for the current environment
async function getBrowser() {
  let sparticuzError: any = null;
  try {
    // Try local Chromium (development)
    const puppeteer = await import('puppeteer-core')
    const chromium = await import('@sparticuz/chromium-min')

    const executablePath = await chromium.default.executablePath(
      process.env.CHROMIUM_PATH ?? undefined
    )

    return await puppeteer.default.launch({
      args: chromium.default.args,
      defaultViewport: chromium.default.defaultViewport,
      executablePath,
      headless: true,
    })
  } catch (err) {
    sparticuzError = err;
    // Fallback: try system Chrome
    const puppeteer = await import('puppeteer-core')
    const candidates = [
      process.env.CHROMIUM_PATH,
      'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
      '/usr/bin/google-chrome',
      '/usr/bin/chromium-browser',
      '/usr/bin/chromium',
      '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    ].filter(Boolean) as string[]

    let launchError: any = null;

    for (const path of candidates) {
      try {
        console.log('[PDF] Attempting to launch browser at:', path)
        const browser = await puppeteer.default.launch({
          executablePath: path,
          headless: true,
          args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
        })
        return browser
      } catch (err) {
        console.error(`[PDF] Failed to launch browser at ${path}:`, err)
        launchError = err;
      }
    }

    console.error('[PDF] Sparticuz Error:', sparticuzError)
    console.error('[PDF] Fallback Launch Error:', launchError)

    throw new Error(
      `Chromium not found or failed to launch. Ensure Chrome is installed. Check terminal for details.`
    )
  }
}

export async function generatePDF(options: PDFGenerationOptions): Promise<Buffer> {
  const { resumeData, templateId, pageSize = 'A4' } = options

  // Get the template renderer
  const { renderResumeHTML } = await import('@/templates/renderer')
  const html = renderResumeHTML(resumeData, templateId)

  let browser = null
  let page = null

  try {
    browser = await getBrowser()
    page = await browser.newPage()

    // Set content and wait for fonts to load
    await page.setContent(html, { waitUntil: 'networkidle0', timeout: 30000 })

    // Wait for web fonts (if any)
    await page.evaluateHandle('document.fonts.ready')

    // Generate PDF with proper settings
    const pdfBuffer = await page.pdf({
      format: pageSize === 'A4' ? 'A4' : 'Letter',
      printBackground: true,
      margin: { top: '0', right: '0', bottom: '0', left: '0' },
      preferCSSPageSize: true,
      displayHeaderFooter: false,
    })

    return Buffer.from(pdfBuffer)
  } finally {
    if (page) await page.close().catch(() => {})
    if (browser) await browser.close().catch(() => {})
  }
}

// Fallback: HTML-only export when Chromium unavailable
export function generatePDFFallbackHTML(resumeData: ResumeData, templateId: TemplateId): string {
  // Dynamic import of renderer
  const renderModule = require('@/templates/renderer')
  return renderModule.renderResumeHTML(resumeData, templateId)
}
