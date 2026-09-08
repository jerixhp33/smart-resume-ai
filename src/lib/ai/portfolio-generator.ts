// ============================================================
// SmartResume AI — AI Portfolio Generation Engine
// Uses Groq AI with Zod Schema Validation & Deterministic Fallback
// ============================================================

import { z } from 'zod'
import { callAI, parseAIJSON } from './client'
import type { ResumeData, Profile, PortfolioContent } from '@/types'
import { mapResumeToPortfolioContent } from '@/lib/portfolio/mapper'

// Zod validation schema for generated portfolio content
export const PortfolioContentSchema = z.object({
  hero: z.object({
    full_name: z.string(),
    title: z.string(),
    tagline: z.string(),
    summary: z.string(),
    avatar_url: z.string().optional(),
    location: z.string().optional(),
    availability: z.string().optional(),
    cta_primary_label: z.string().optional(),
    cta_primary_url: z.string().optional(),
    cta_secondary_label: z.string().optional(),
    cta_secondary_url: z.string().optional(),
  }),
  about: z.object({
    biography: z.string(),
    career_direction: z.string().optional(),
    highlights: z.array(z.string()).optional(),
    strengths: z.array(z.string()).optional(),
    interests: z.array(z.string()).optional(),
  }),
  experience: z.array(
    z.object({
      id: z.string(),
      company: z.string(),
      role: z.string(),
      location: z.string().optional(),
      period: z.string(),
      is_current: z.boolean().optional(),
      description: z.string(),
      bullets: z.array(z.string()),
    })
  ),
  education: z.array(
    z.object({
      id: z.string(),
      institution: z.string(),
      degree: z.string(),
      field: z.string(),
      period: z.string(),
      gpa: z.string().optional(),
      achievements: z.array(z.string()).optional(),
    })
  ),
  skills: z.array(
    z.object({
      id: z.string(),
      category: z.string(),
      skills: z.array(z.string()),
    })
  ),
  projects: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      tagline: z.string(),
      description: z.string(),
      technologies: z.array(z.string()),
      github_url: z.string().optional(),
      live_url: z.string().optional(),
      image_url: z.string().optional(),
      highlights: z.array(z.string()).optional(),
      problem: z.string().optional(),
      solution: z.string().optional(),
      result: z.string().optional(),
    })
  ),
  certifications: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      issuer: z.string(),
      date: z.string(),
      credential_url: z.string().optional(),
    })
  ),
  achievements: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      description: z.string(),
      date: z.string().optional(),
    })
  ),
  contact: z.object({
    heading: z.string(),
    subheading: z.string(),
    email: z.string(),
    phone: z.string().optional(),
    location: z.string().optional(),
    linkedin_url: z.string().optional(),
    github_url: z.string().optional(),
    twitter_url: z.string().optional(),
    website_url: z.string().optional(),
  }),
})

/**
 * Generate portfolio content using Groq AI
 */
export async function generateAIPortfolio(
  resumeData: Partial<ResumeData>,
  profile?: Partial<Profile> | null,
  userId?: string
): Promise<PortfolioContent> {
  const fallback = mapResumeToPortfolioContent(resumeData, profile)

  const systemPrompt = `You are a world-class AI portfolio copywriter and design strategist.
Your task is to transform structured resume data into an elite, highly compelling personal portfolio website dataset.

STRICT FACTUAL ACCURACY RULES:
1. NEVER fabricate or invent companies, job titles, degrees, dates, certifications, projects, awards, URLs, or metrics.
2. Only use factual credentials provided in the input resume data.
3. You may improve wording, structure, presentation, taglines, and bio narratives.
4. Output strictly valid JSON conforming to the requested schema.`

  const userPrompt = `Transform this resume into a polished portfolio dataset:

RESUME DATA:
${JSON.stringify(resumeData, null, 2)}

PROFILE META:
${JSON.stringify(profile || {}, null, 2)}

Output JSON format matching:
{
  "hero": { "full_name": "...", "title": "...", "tagline": "...", "summary": "...", "location": "...", "availability": "..." },
  "about": { "biography": "...", "career_direction": "...", "highlights": [...], "strengths": [...], "interests": [...] },
  "experience": [...],
  "education": [...],
  "skills": [...],
  "projects": [...],
  "certifications": [...],
  "achievements": [...],
  "contact": { "heading": "...", "subheading": "...", "email": "..." }
}`

  try {
    const aiResponse = await callAI({
      taskType: 'generate_portfolio',
      systemPrompt,
      userPrompt,
      userId,
    })

    const parsed = parseAIJSON(aiResponse.content, PortfolioContentSchema)
    return {
      ...parsed,
      section_order: fallback.section_order,
      hidden_sections: fallback.hidden_sections,
    }
  } catch (error) {
    console.warn('[AI Portfolio Autobuilder] AI generation failed, falling back to deterministic mapping:', error)
    return fallback
  }
}
