// ============================================================
// SmartResume AI — SMTP Email Notifications (SERVER-SIDE ONLY)
// Uses Nodemailer with configured SMTP credentials
// ============================================================

import type { NotificationType } from '@/types'

interface EmailParams {
  to: string
  type: NotificationType
  title: string
  message: string
  data?: Record<string, unknown>
}

// Lazy-load nodemailer to avoid issues in non-Node environments
async function getTransporter() {
  const nodemailer = await import('nodemailer')

  const config = {
    host: process.env.SMTP_HOST ?? 'localhost',
    port: parseInt(process.env.SMTP_PORT ?? '587', 10),
    secure: process.env.SMTP_SECURE === 'true',
    auth: process.env.SMTP_USER ? {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    } : undefined,
  }

  return nodemailer.default.createTransport(config)
}

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME ?? 'Resunio'
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
const FROM = process.env.SMTP_FROM ?? `${APP_NAME} <noreply@resunio.ai>`

function buildEmailHTML(title: string, message: string, ctaText?: string, ctaUrl?: string): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background:#F7F7F5;font-family:-apple-system,BlinkMacSystemFont,'Inter',sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F7F7F5;padding:40px 0">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,.1)">
        <!-- Header -->
        <tr><td style="background:#635BFF;padding:28px 40px">
          <p style="margin:0;font-size:20px;font-weight:700;color:#fff;letter-spacing:-0.3px">${APP_NAME}</p>
        </td></tr>
        <!-- Body -->
        <tr><td style="padding:40px">
          <h1 style="margin:0 0 16px;font-size:22px;font-weight:700;color:#171717;letter-spacing:-0.5px">${title}</h1>
          <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#4B4B4B">${message}</p>
          ${ctaText && ctaUrl ? `
          <a href="${ctaUrl}" style="display:inline-block;background:#635BFF;color:#fff;text-decoration:none;padding:12px 24px;border-radius:8px;font-size:15px;font-weight:600">${ctaText}</a>
          ` : ''}
        </td></tr>
        <!-- Footer -->
        <tr><td style="padding:24px 40px;border-top:1px solid #E7E7E5">
          <p style="margin:0;font-size:13px;color:#6B6B6B">
            You're receiving this email because you have an account at <a href="${APP_URL}" style="color:#635BFF">${APP_NAME}</a>.
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

const EMAIL_TEMPLATES: Record<NotificationType, (data?: Record<string, unknown>) => {
  subject: string
  ctaText?: string
  ctaUrl?: string
}> = {
  welcome: () => ({
    subject: `Welcome to ${APP_NAME}! 🎉`,
    ctaText: 'Create Your Resume',
    ctaUrl: `${APP_URL}/dashboard`,
  }),
  pdf_ready: () => ({
    subject: 'Your resume PDF is ready',
    ctaText: 'Download PDF',
    ctaUrl: `${APP_URL}/resumes`,
  }),
  ats_complete: () => ({
    subject: 'ATS Analysis Complete',
    ctaText: 'View Results',
    ctaUrl: `${APP_URL}/analyzer`,
  }),
  payment_success: (data) => ({
    subject: 'Payment Successful — Resume Unlocked! ✅',
    ctaText: 'Create Resume',
    ctaUrl: `${APP_URL}/resumes/new`,
  }),
  payment_failed: () => ({
    subject: 'Payment Failed',
    ctaText: 'Try Again',
    ctaUrl: `${APP_URL}/resumes`,
  }),
  cooldown_complete: () => ({
    subject: '⏰ Cooldown Complete — Create Your Next Resume',
    ctaText: 'Create Resume',
    ctaUrl: `${APP_URL}/resumes/new`,
  }),
  tailoring_complete: () => ({
    subject: 'Resume Tailoring Complete',
    ctaText: 'View Tailored Resume',
    ctaUrl: `${APP_URL}/resumes`,
  }),
  resume_imported: () => ({
    subject: 'Resume Imported Successfully',
    ctaText: 'Review Resume',
    ctaUrl: `${APP_URL}/resumes`,
  }),
  security_alert: () => ({
    subject: '⚠️ Security Alert',
    ctaText: 'Review Account',
    ctaUrl: `${APP_URL}/settings/security`,
  }),
  general: () => ({
    subject: `Notification from ${APP_NAME}`,
  }),
}

export async function sendEmailNotification(params: EmailParams): Promise<void> {
  // Skip if SMTP is not configured
  if (!process.env.SMTP_HOST || process.env.SMTP_HOST === 'localhost') {
    console.info('[Email] SMTP not configured, skipping email:', params.type)
    return
  }

  const template = EMAIL_TEMPLATES[params.type]?.(params.data) ?? EMAIL_TEMPLATES.general()

  const html = buildEmailHTML(
    params.title,
    params.message,
    template.ctaText,
    template.ctaUrl
  )

  try {
    const transporter = await getTransporter()
    await transporter.sendMail({
      from: FROM,
      to: params.to,
      subject: template.subject,
      html,
      text: `${params.title}\n\n${params.message}`, // Plain text fallback
    })
    console.info('[Email] Sent:', params.type, 'to', params.to)
  } catch (error) {
    console.error('[Email] Failed to send:', error)
    throw error
  }
}

// Send welcome email specifically
export async function sendWelcomeEmail(to: string, name: string): Promise<void> {
  await sendEmailNotification({
    to,
    type: 'welcome',
    title: `Welcome to ${APP_NAME}, ${name || 'there'}! 🎉`,
    message: `We're so glad you're here. Create your first ATS-optimized resume in minutes and take the first step toward your dream job. Your first 3 resumes are completely free.`,
  })
}
