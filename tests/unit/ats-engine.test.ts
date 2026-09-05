import { describe, it, expect } from 'vitest'
import { calculateATSScore, extractKeywordsFromJD } from '@/lib/ats/engine'
import type { ResumeData } from '@/types'

const mockResumeData: ResumeData = {
  personal: {
    full_name: 'Jane Smith',
    professional_title: 'Software Engineer',
    email: 'jane@example.com',
    phone: '+1-555-0100',
    location: 'San Francisco, CA',
    linkedin: 'linkedin.com/in/janesmith',
    github: '',
    portfolio: '',
    other_links: [],
  },
  summary: 'Experienced software engineer with 3 years of experience building React and Node.js applications. Passionate about clean code and developer experience.',
  experience: [
    {
      id: 'exp1',
      company: 'Tech Corp',
      position: 'Software Engineer',
      location: 'San Francisco',
      start_date: '2022-01',
      end_date: null,
      is_current: true,
      description: 'Full-stack development with React and Node.js',
      bullets: [
        'Developed RESTful APIs serving 10,000+ daily users',
        'Improved application performance by optimizing database queries',
        'Led team of 3 engineers on feature development',
      ],
    },
  ],
  internships: [],
  education: [
    {
      id: 'edu1',
      institution: 'State University',
      degree: 'Bachelor of Science',
      field_of_study: 'Computer Science',
      location: 'San Francisco',
      start_date: '2018-09',
      end_date: '2022-05',
      is_current: false,
      gpa: '3.8',
      achievements: [],
    },
  ],
  skills: [
    {
      id: 'sk1',
      name: 'Programming Languages',
      skills: ['JavaScript', 'TypeScript', 'Python', 'SQL'],
    },
    {
      id: 'sk2',
      name: 'Frameworks',
      skills: ['React', 'Node.js', 'Express'],
    },
  ],
  projects: [],
  certifications: [],
  achievements: [],
  languages: [],
  volunteer_work: [],
  publications: [],
  custom_sections: [],
}

describe('ATS Engine', () => {
  describe('calculateATSScore', () => {
    it('returns a score between 0 and 100', () => {
      const result = calculateATSScore({ resumeData: mockResumeData })
      expect(result.overall_score).toBeGreaterThanOrEqual(0)
      expect(result.overall_score).toBeLessThanOrEqual(100)
    })

    it('gives higher score when resume has all key sections', () => {
      const result = calculateATSScore({ resumeData: mockResumeData })
      expect(result.overall_score).toBeGreaterThan(50)
    })

    it('returns lower score for empty resume', () => {
      const emptyResume: ResumeData = {
        personal: { full_name: '', professional_title: '', email: '', phone: '', location: '', linkedin: '', github: '', portfolio: '', other_links: [] },
        summary: '',
        experience: [],
        internships: [],
        education: [],
        skills: [],
        projects: [],
        certifications: [],
        achievements: [],
        languages: [],
        volunteer_work: [],
        publications: [],
        custom_sections: [],
      }
      const result = calculateATSScore({ resumeData: emptyResume })
      expect(result.overall_score).toBeLessThan(50)
    })

    it('matches keywords from job description', () => {
      const jd = 'We are looking for a React developer with TypeScript experience and Node.js knowledge.'
      const result = calculateATSScore({ resumeData: mockResumeData, jobDescription: jd })
      expect(result.matched_keywords.length).toBeGreaterThan(0)
      // React, TypeScript, Node.js should all match
      const matchedLower = result.matched_keywords.map(k => k.toLowerCase())
      expect(matchedLower.some(k => k.includes('react') || k.includes('typescript') || k.includes('node'))).toBe(true)
    })

    it('identifies missing keywords from job description', () => {
      const jd = 'Looking for a Kubernetes expert with Go and Rust experience in distributed systems.'
      const result = calculateATSScore({ resumeData: mockResumeData, jobDescription: jd })
      expect(result.missing_keywords.length).toBeGreaterThan(0)
    })

    it('provides formatting issues for incomplete resume', () => {
      const incompleteResume: ResumeData = {
        ...mockResumeData,
        personal: { ...mockResumeData.personal, email: '', phone: '' },
      }
      const result = calculateATSScore({ resumeData: incompleteResume })
      expect(result.formatting_issues.length).toBeGreaterThan(0)
    })

    it('always returns a suggestions array', () => {
      const jd = 'Docker, Kubernetes, CI/CD, AWS, Go, Rust experience required'
      const result = calculateATSScore({ resumeData: mockResumeData, jobDescription: jd })
      // Should always return an array (may be empty for perfect resumes)
      expect(Array.isArray(result.suggestions)).toBe(true)
      // Each suggestion should have required fields
      for (const s of result.suggestions) {
        expect(s).toHaveProperty('category')
        expect(s).toHaveProperty('priority')
        expect(s).toHaveProperty('message')
        expect(s).toHaveProperty('action')
      }
    })

    it('has all required score sub-components', () => {
      const result = calculateATSScore({ resumeData: mockResumeData })
      expect(result).toHaveProperty('keyword_score')
      expect(result).toHaveProperty('skills_score')
      expect(result).toHaveProperty('experience_score')
      expect(result).toHaveProperty('formatting_score')
      expect(result).toHaveProperty('readability_score')
    })

    it('section_scores reflect section completeness', () => {
      const result = calculateATSScore({ resumeData: mockResumeData })
      expect(result.section_scores.personal).toBe(100)
      expect(result.section_scores.experience).toBe(100)
      expect(result.section_scores.education).toBe(100)
    })
  })

  describe('extractKeywordsFromJD', () => {
    it('extracts keywords from job description', () => {
      const jd = 'We need a React developer with 3+ years of experience in TypeScript, Node.js, and PostgreSQL. Knowledge of Docker and AWS is preferred.'
      const keywords = extractKeywordsFromJD(jd)
      expect(keywords.length).toBeGreaterThan(0)
      expect(Array.isArray(keywords)).toBe(true)
    })

    it('returns unique keywords', () => {
      const jd = 'React React React developer developer developer'
      const keywords = extractKeywordsFromJD(jd)
      const unique = new Set(keywords)
      expect(unique.size).toBe(keywords.length)
    })

    it('handles empty job description', () => {
      const keywords = extractKeywordsFromJD('')
      expect(Array.isArray(keywords)).toBe(true)
    })
  })
})
