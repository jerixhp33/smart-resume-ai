'use client'

import React from 'react'
import { useResumeStore } from '@/features/resume/store'
import { Palette, Type } from 'lucide-react'

const COLORS = [
  { name: 'Classic Black', value: '#000000' },
  { name: 'Navy Blue', value: '#1E3A8A' },
  { name: 'Royal Blue', value: '#2563EB' },
  { name: 'Emerald', value: '#059669' },
  { name: 'Forest', value: '#166534' },
  { name: 'Burgundy', value: '#9F1239' },
  { name: 'Purple', value: '#6D28D9' },
  { name: 'Slate', value: '#475569' },
]

const FONTS = [
  { name: 'Inter (Sans-serif)', value: '"Inter", sans-serif' },
  { name: 'Roboto (Sans-serif)', value: '"Roboto", sans-serif' },
  { name: 'Merriweather (Serif)', value: '"Merriweather", serif' },
  { name: 'Playfair (Serif)', value: '"Playfair Display", serif' },
  { name: 'Fira Code (Monospace)', value: '"Fira Code", monospace' },
]

export function ThemePanel() {
  const { data, updateData } = useResumeStore()
  
  const currentTheme = data.theme || { primaryColor: '#000000', fontFamily: '"Inter", sans-serif' }

  function handleColorChange(color: string) {
    updateData(draft => ({
      ...draft,
      theme: { ...currentTheme, primaryColor: color }
    }))
  }

  function handleFontChange(font: string) {
    updateData(draft => ({
      ...draft,
      theme: { ...currentTheme, fontFamily: font }
    }))
  }

  return (
    <div className="space-y-8 animate-in">
      <div>
        <h2 className="text-xl font-bold tracking-tight">Theme & Design</h2>
        <p className="text-sm text-muted-foreground mt-1 mb-6">
          Customize the visual appearance of your resume. These settings apply to all templates.
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-3">
          <Palette className="h-4 w-4 text-primary" />
          <h3 className="font-semibold text-sm">Primary Color</h3>
        </div>
        
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
          {COLORS.map((color) => (
            <button
              key={color.value}
              onClick={() => handleColorChange(color.value)}
              className={`w-10 h-10 rounded-full border-2 transition-transform hover:scale-110 ${
                currentTheme.primaryColor === color.value 
                  ? 'border-primary ring-2 ring-primary ring-offset-2 ring-offset-background scale-110' 
                  : 'border-transparent'
              }`}
              style={{ backgroundColor: color.value }}
              title={color.name}
            />
          ))}
        </div>
      </div>

      <div className="space-y-4 pt-6 border-t border-border/50">
        <div className="flex items-center gap-2 mb-3">
          <Type className="h-4 w-4 text-primary" />
          <h3 className="font-semibold text-sm">Typography</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {FONTS.map((font) => (
            <button
              key={font.value}
              onClick={() => handleFontChange(font.value)}
              className={`p-3 text-left rounded-lg border transition-all ${
                currentTheme.fontFamily === font.value
                  ? 'border-primary bg-primary/5 text-primary'
                  : 'border-border hover:border-primary/50'
              }`}
              style={{ fontFamily: font.value }}
            >
              <span className="block text-sm font-medium">{font.name}</span>
              <span className="block text-xs opacity-70 mt-1">The quick brown fox jumps over the lazy dog.</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
