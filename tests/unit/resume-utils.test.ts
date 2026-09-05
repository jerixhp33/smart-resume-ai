import { describe, it, expect } from 'vitest'
import { createDefaultResumeData, createEmptyExperience, createEmptyEducation, createEmptyProject } from '@/utils/defaultResumeData'

describe('defaultResumeData', () => {
  describe('createDefaultResumeData', () => {
    it('creates a valid resume data structure', () => {
      const data = createDefaultResumeData()
      expect(data).toHaveProperty('personal')
      expect(data).toHaveProperty('summary')
      expect(data).toHaveProperty('experience')
      expect(data).toHaveProperty('education')
      expect(data).toHaveProperty('skills')
      expect(data).toHaveProperty('projects')
      expect(data).toHaveProperty('certifications')
      expect(data).toHaveProperty('achievements')
      expect(data).toHaveProperty('languages')
      expect(data).toHaveProperty('volunteer_work')
      expect(data).toHaveProperty('publications')
      expect(data).toHaveProperty('custom_sections')
    })

    it('initializes arrays as empty', () => {
      const data = createDefaultResumeData()
      expect(data.experience).toEqual([])
      expect(data.education).toEqual([])
      expect(data.certifications).toEqual([])
      expect(data.achievements).toEqual([])
    })

    it('initializes summary as empty string', () => {
      const data = createDefaultResumeData()
      expect(data.summary).toBe('')
    })

    it('creates default skills category', () => {
      const data = createDefaultResumeData()
      expect(data.skills.length).toBeGreaterThan(0)
      expect(data.skills[0]).toHaveProperty('name')
      expect(data.skills[0]).toHaveProperty('skills')
    })

    it('applies overrides correctly', () => {
      const data = createDefaultResumeData({ summary: 'Custom summary' } as any)
      expect(data.summary).toBe('Custom summary')
      // Other fields should still be defaults
      expect(data.experience).toEqual([])
    })
  })

  describe('createEmptyExperience', () => {
    it('creates experience with unique id', () => {
      const exp1 = createEmptyExperience()
      const exp2 = createEmptyExperience()
      expect(exp1.id).toBeTruthy()
      expect(exp2.id).toBeTruthy()
      expect(exp1.id).not.toBe(exp2.id)
    })

    it('has all required fields', () => {
      const exp = createEmptyExperience()
      expect(exp).toHaveProperty('id')
      expect(exp).toHaveProperty('company')
      expect(exp).toHaveProperty('position')
      expect(exp).toHaveProperty('start_date')
      expect(exp).toHaveProperty('bullets')
      expect(Array.isArray(exp.bullets)).toBe(true)
    })

    it('starts with is_current as false', () => {
      const exp = createEmptyExperience()
      expect(exp.is_current).toBe(false)
    })
  })

  describe('createEmptyEducation', () => {
    it('creates education with unique id', () => {
      const edu1 = createEmptyEducation()
      const edu2 = createEmptyEducation()
      expect(edu1.id).not.toBe(edu2.id)
    })

    it('has all required fields', () => {
      const edu = createEmptyEducation()
      expect(edu).toHaveProperty('institution')
      expect(edu).toHaveProperty('degree')
      expect(edu).toHaveProperty('field_of_study')
      expect(edu).toHaveProperty('gpa')
    })
  })

  describe('createEmptyProject', () => {
    it('initializes technologies as empty array', () => {
      const proj = createEmptyProject()
      expect(Array.isArray(proj.technologies)).toBe(true)
      expect(proj.technologies).toHaveLength(0)
    })
  })
})
