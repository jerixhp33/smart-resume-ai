'use client'

import React from 'react'
import type { PortfolioContent, PortfolioTemplateId, PortfolioThemeId } from '@/types'
import { ModernTemplate } from './ModernTemplate'
import { MinimalTemplate } from './MinimalTemplate'
import { CreativeTemplate } from './CreativeTemplate'
import { DeveloperTemplate } from './DeveloperTemplate'
import { ProfessionalTemplate } from './ProfessionalTemplate'
import { EditorialTemplate } from './EditorialTemplate'
import { BoldTemplate } from './BoldTemplate'
import { ElegantTemplate } from './ElegantTemplate'

interface PortfolioRendererProps {
  content: PortfolioContent
  template: PortfolioTemplateId
  theme: PortfolioThemeId
}

export function PortfolioRenderer({ content, template, theme }: PortfolioRendererProps) {
  switch (template) {
    case 'minimal':
      return <MinimalTemplate content={content} theme={theme} />
    case 'creative':
      return <CreativeTemplate content={content} theme={theme} />
    case 'developer':
      return <DeveloperTemplate content={content} theme={theme} />
    case 'professional':
      return <ProfessionalTemplate content={content} theme={theme} />
    case 'editorial':
      return <EditorialTemplate content={content} theme={theme} />
    case 'bold':
      return <BoldTemplate content={content} theme={theme} />
    case 'elegant':
      return <ElegantTemplate content={content} theme={theme} />
    case 'modern':
    default:
      return <ModernTemplate content={content} theme={theme} />
  }
}
