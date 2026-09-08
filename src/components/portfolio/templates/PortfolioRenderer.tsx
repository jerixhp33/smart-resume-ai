'use client'

import React from 'react'
import type { PortfolioContent, PortfolioTemplateId, PortfolioThemeId, UserFile } from '@/types'
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
  items?: UserFile[]
}

export function PortfolioRenderer({ content, template, theme, items }: PortfolioRendererProps) {
  switch (template) {
    case 'minimal':
      return <MinimalTemplate content={content} theme={theme} items={items} />
    case 'creative':
      return <CreativeTemplate content={content} theme={theme} items={items} />
    case 'developer':
      return <DeveloperTemplate content={content} theme={theme} items={items} />
    case 'professional':
      return <ProfessionalTemplate content={content} theme={theme} items={items} />
    case 'editorial':
      return <EditorialTemplate content={content} theme={theme} items={items} />
    case 'bold':
      return <BoldTemplate content={content} theme={theme} items={items} />
    case 'elegant':
      return <ElegantTemplate content={content} theme={theme} items={items} />
    case 'modern':
    default:
      return <ModernTemplate content={content} theme={theme} items={items} />
  }
}
