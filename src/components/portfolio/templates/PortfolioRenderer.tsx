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
import { AIGeneratedTemplate } from './AIGeneratedTemplate'
import { PortfolioNavbar } from './PortfolioNavbar'
import { getThemeConfig } from './theme-config'

interface PortfolioRendererProps {
  content: PortfolioContent
  template: PortfolioTemplateId | 'ai-generated'
  theme: PortfolioThemeId
  customAccentColor?: string
  aiConfig?: {
    accentHex?: string
    layoutType?: 'matrix-terminal' | 'glass-cards' | 'gold-serif' | 'cyberpunk-neon' | 'standard'
    customCss?: string
  }
  items?: UserFile[]
}

function getTemplateBgClass(template: string): string {
  switch (template) {
    case 'bold':
      return 'bg-black text-white'
    case 'editorial':
      return 'bg-[#faf8f5] text-[#1c1917]'
    case 'minimal':
      return 'bg-background text-foreground'
    case 'ai-generated':
    case 'developer':
    case 'creative':
    case 'elegant':
    case 'professional':
    case 'modern':
    default:
      return 'bg-slate-950 text-slate-100'
  }
}

export function PortfolioRenderer({ content, template, theme, customAccentColor, aiConfig, items }: PortfolioRendererProps) {
  const bgClass = getTemplateBgClass(template)
  const themeConfig = getThemeConfig(theme, customAccentColor)
  const accentHex = customAccentColor || aiConfig?.accentHex || (themeConfig.customHex ?? '#6366f1')

  const renderTemplate = () => {
    if ((template as string) === 'ai-generated') {
      return <AIGeneratedTemplate content={content} theme={theme} aiConfig={{ ...aiConfig, accentHex }} items={items} />
    }

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

  return (
    <div 
      id="top" 
      className={`relative min-h-screen w-full transition-colors duration-300 ${bgClass}`}
      style={{
        '--accent-color': accentHex,
      } as React.CSSProperties}
    >
      <PortfolioNavbar content={content} template={template as PortfolioTemplateId} theme={theme} items={items} />
      {renderTemplate()}
    </div>
  )
}
