import type { PortfolioExperienceItem } from '@/types'

/**
 * Returns a human-formatted label for an experience item's employment type,
 * auto-detecting 'Internship' if the role title contains 'intern'.
 */
export function getExperienceTypeLabel(exp: PortfolioExperienceItem): string | null {
  let typeStr = exp.type
  if (!typeStr && exp.role && exp.role.toLowerCase().includes('intern')) {
    typeStr = 'internship'
  }
  if (!typeStr) return null

  const lower = typeStr.toLowerCase().trim()
  if (lower === 'internship' || lower === 'intern') return 'Internship'
  if (lower === 'full-time' || lower === 'fulltime' || lower === 'full time') return 'Full-time'
  if (lower === 'contract') return 'Contract'
  if (lower === 'part-time' || lower === 'parttime' || lower === 'part time') return 'Part-time'
  if (lower === 'freelance') return 'Freelance'
  if (lower === 'leadership') return 'Leadership'

  return typeStr.charAt(0).toUpperCase() + typeStr.slice(1)
}

/**
 * Cleans experience descriptions to prevent identical text duplication when bullet points exist.
 * Returns null if the description is redundant with the bullets.
 */
export function getCleanDescription(description?: string, bullets?: string[]): string | null {
  if (!description || !description.trim()) return null
  if (!bullets || bullets.length === 0) return description.trim()

  const normDesc = description.trim().toLowerCase().replace(/\s+/g, ' ')
  const normBullets = bullets.map((b) => b.trim().toLowerCase().replace(/\s+/g, ' ')).filter(Boolean)
  if (normBullets.length === 0) return description.trim()

  const normBulletsJoined = normBullets.join(' ')
  const firstBulletNorm = normBullets[0] || ''

  // Exact match with joined bullets
  if (normDesc === normBulletsJoined) return null

  // Description is equal to first bullet
  if (normDesc === firstBulletNorm) return null

  // Description contains or is contained in joined bullets
  if (normBulletsJoined.includes(normDesc)) return null
  if (normDesc.includes(normBulletsJoined)) return null

  // If first bullet starts with the same text as description
  if (firstBulletNorm.length > 20 && (firstBulletNorm.startsWith(normDesc) || normDesc.startsWith(firstBulletNorm))) {
    return null
  }

  return description.trim()
}
