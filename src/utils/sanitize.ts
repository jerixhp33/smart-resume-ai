/**
 * SmartResume AI — Input Sanitization Utility
 * Cleans user inputs to protect against XSS and injection vulnerabilities
 */

/**
 * Strips HTML tags and script protocols from string inputs.
 */
export function sanitizeText(input: string | null | undefined): string {
  if (!input) return ''

  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove <script> tags
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/data:text\/html/gi, '') // Remove data HTML URIs
    .trim()
}

/**
 * Escapes special HTML characters for safe rendering in raw contexts.
 */
export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

/**
 * Recursively sanitizes string fields within an object/array.
 */
export function sanitizeObject<T>(obj: T): T {
  if (typeof obj === 'string') {
    return sanitizeText(obj) as unknown as T
  }
  if (Array.isArray(obj)) {
    return obj.map(sanitizeObject) as unknown as T
  }
  if (obj !== null && typeof obj === 'object') {
    const sanitized: Record<string, unknown> = {}
    for (const key of Object.keys(obj as object)) {
      sanitized[key] = sanitizeObject((obj as Record<string, unknown>)[key])
    }
    return sanitized as T
  }
  return obj
}
