'use client'

import React from 'react'
import { useResumeStore } from '@/features/resume/store'
import { Textarea } from '@/components/ui/textarea'
import { AIImproveButton } from '@/components/ai/AIImproveButton'

export function SummarySection() {
  const { data, updateData } = useResumeStore()

  function update(value: string) {
    updateData(d => ({ ...d, summary: value }))
  }

  const charCount = data.summary?.length ?? 0
  const ideal = charCount >= 200 && charCount <= 600

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-1">Professional Summary</h2>
        <p className="text-sm text-muted-foreground">
          A 3–4 sentence snapshot of who you are, your key skills, and your career goal. Shown at the top of your resume — make it count.
        </p>
      </div>

      <div className="space-y-2">
        <Textarea
          label="Summary"
          placeholder="Motivated Computer Science graduate with 2 years of experience in React and Node.js. Passionate about building scalable web applications and improving developer experience. Looking for a frontend engineer role in a fast-growing startup where I can contribute and grow."
          rows={6}
          value={data.summary ?? ''}
          onChange={e => update(e.target.value)}
          className="resize-none"
        />

        <div className="flex items-center justify-between">
          <AIImproveButton
            text={data.summary ?? ''}
            onAccept={update}
            context={`Professional title: ${data.personal?.professional_title ?? ''}`}
            modes={['improve', 'professional', 'ats', 'concise']}
          />
          <span className={`text-xs ${ideal ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}`}>
            {charCount} chars {ideal ? '✓ ideal length' : charCount < 200 ? '— aim for 200+' : '— consider shortening'}
          </span>
        </div>
      </div>

      <div className="bg-muted/50 rounded-xl p-4 text-xs text-muted-foreground space-y-1.5">
        <p className="font-semibold text-foreground">Tips for a great summary:</p>
        <ul className="space-y-1 list-disc list-inside">
          <li>Start with your job title or key identity (e.g., "Software Engineer with 3 years…")</li>
          <li>Mention 2–3 core skills or technologies relevant to your target role</li>
          <li>State what you're looking for or what you bring to a team</li>
          <li>Keep it to 3–4 sentences, 200–600 characters</li>
          <li>Use ATS-friendly keywords found in job descriptions</li>
        </ul>
      </div>
    </div>
  )
}
