import { describe, it, expect } from 'vitest'
import { mapResumeToPortfolioContent } from '@/lib/portfolio/mapper'
import { PortfolioContentSchema } from '../portfolio-generator'

describe('Portfolio Generator Engine', () => {
  it('should deterministically map resume data to valid portfolio content', () => {
    const resumeData = {
      personal: {
        full_name: 'Manikandan U',
        professional_title: 'Software Developer',
        email: 'mani@example.com',
        phone: '+1234567890',
        location: 'California',
        linkedin: 'https://linkedin.com/in/mani',
        github: 'https://github.com/mani',
        portfolio: '',
        other_links: [],
      },
      summary: 'Experienced software engineer focused on web applications.',
      experience: [
        {
          id: 'exp-1',
          company: 'Acme Corp',
          position: 'Senior Frontend Engineer',
          location: 'San Francisco',
          start_date: '2022',
          end_date: null,
          is_current: true,
          description: 'Building web platform',
          bullets: ['Reduced load time by 40%', 'Led team of 5 engineers'],
        },
      ],
      projects: [
        {
          id: 'proj-1',
          name: 'SmartResume AI',
          description: 'AI resume builder platform',
          technologies: ['Next.js', 'React', 'Tailwind'],
          url: 'https://smartresume.ai',
          github_url: 'https://github.com/example/repo',
          start_date: '2023',
          end_date: null,
          bullets: ['Built with Next.js 16', 'Uses Groq AI'],
        },
      ],
    }

    const portfolioContent = mapResumeToPortfolioContent(resumeData as any, {
      full_name: 'Manikandan U',
      email: 'mani@example.com',
    } as any)

    expect(portfolioContent.hero.full_name).toBe('Manikandan U')
    expect(portfolioContent.hero.title).toBe('Software Developer')
    expect(portfolioContent.experience.length).toBe(1)
    expect(portfolioContent.projects.length).toBe(1)

    // Validate with Zod schema
    const zodResult = PortfolioContentSchema.safeParse(portfolioContent)
    expect(zodResult.success).toBe(true)
  })
})
