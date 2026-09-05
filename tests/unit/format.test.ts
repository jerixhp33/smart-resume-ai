import { describe, it, expect } from 'vitest'
import { formatDate, formatDateRange, formatBytes, formatCurrency, formatATSScore, truncate } from '@/utils/format'

describe('formatDate', () => {
  it('formats YYYY-MM to readable date', () => {
    const result = formatDate('2023-06')
    expect(result).toMatch(/Jun.*2023|June.*2023/)
  })

  it('returns empty string for null/undefined', () => {
    expect(formatDate(null)).toBe('')
    expect(formatDate(undefined)).toBe('')
  })

  it('handles invalid date gracefully', () => {
    const result = formatDate('invalid')
    expect(typeof result).toBe('string')
  })
})

describe('formatDateRange', () => {
  it('shows Present when is_current is true', () => {
    const result = formatDateRange('2022-01', null, true)
    expect(result).toContain('Present')
  })

  it('shows end date when not current', () => {
    const result = formatDateRange('2021-06', '2023-12', false)
    expect(result).toContain('2021')
    expect(result).toContain('2023')
  })
})

describe('formatBytes', () => {
  it('formats bytes correctly', () => {
    expect(formatBytes(500)).toBe('500 B')
    expect(formatBytes(1024)).toBe('1.0 KB')
    expect(formatBytes(1024 * 1024)).toBe('1.0 MB')
  })

  it('handles 0 bytes', () => {
    expect(formatBytes(0)).toBe('0 B')
  })
})

describe('formatCurrency', () => {
  it('converts paise to rupees', () => {
    const result = formatCurrency(9900)
    expect(result).toContain('99')
  })
})

describe('formatATSScore', () => {
  it('returns excellent for high scores', () => {
    const result = formatATSScore(85)
    expect(result.label).toBe('Excellent')
    expect(result.color).toContain('green')
  })

  it('returns good for mid scores', () => {
    const result = formatATSScore(65)
    expect(result.label).toBe('Good')
    expect(result.color).toContain('yellow')
  })

  it('returns needs work for low scores', () => {
    const result = formatATSScore(30)
    expect(result.label).toBe('Needs Work')
    expect(result.color).toContain('red')
  })

  it('handles edge case scores', () => {
    expect(() => formatATSScore(0)).not.toThrow()
    expect(() => formatATSScore(100)).not.toThrow()
  })
})

describe('truncate', () => {
  it('does not truncate short text', () => {
    expect(truncate('Hello', 10)).toBe('Hello')
  })

  it('truncates long text with ellipsis', () => {
    const result = truncate('This is a very long text that exceeds the limit', 10)
    expect(result.length).toBeLessThanOrEqual(10)
    expect(result.endsWith('...')).toBe(true)
  })

  it('handles exact length', () => {
    expect(truncate('Hello', 5)).toBe('Hello')
  })
})
