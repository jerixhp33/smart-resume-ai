'use client'

import React from 'react'
import { useResumeStore } from '@/features/resume/store'
import { Input } from '@/components/ui/input'
import { User, Mail, Phone, MapPin, Link, Code, Globe } from 'lucide-react'

export function PersonalSection() {
  const { data, updateData } = useResumeStore()
  const personal = data.personal

  function update(field: string, value: string) {
    updateData(d => ({
      ...d,
      personal: { ...d.personal, [field]: value },
    }))
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-1">Personal Information</h2>
        <p className="text-sm text-muted-foreground">Your contact and identity details — always displayed at the top of your resume.</p>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Full Name"
            placeholder="Jane Smith"
            icon={<User className="h-4 w-4" />}
            value={personal?.full_name ?? ''}
            onChange={e => update('full_name', e.target.value)}
            enableAI
            onAIChange={val => update('full_name', val)}
            required
          />
          <Input
            label="Professional Title"
            placeholder="Software Engineer"
            value={personal?.professional_title ?? ''}
            onChange={e => update('professional_title', e.target.value)}
            enableAI
            onAIChange={val => update('professional_title', val)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            icon={<Mail className="h-4 w-4" />}
            value={personal?.email ?? ''}
            onChange={e => update('email', e.target.value)}
            required
          />
          <Input
            label="Phone"
            type="tel"
            placeholder="+91 98765 43210"
            icon={<Phone className="h-4 w-4" />}
            value={personal?.phone ?? ''}
            onChange={e => update('phone', e.target.value)}
          />
        </div>

        <Input
          label="Location"
          placeholder="Mumbai, Maharashtra"
          icon={<MapPin className="h-4 w-4" />}
          value={personal?.location ?? ''}
          onChange={e => update('location', e.target.value)}
          hint="City, State or City, Country"
          enableAI
          onAIChange={val => update('location', val)}
        />

        <div className="pt-2 border-t border-border">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Online Profiles</p>
          <div className="space-y-3">
            <Input
              label="LinkedIn"
              placeholder="linkedin.com/in/yourname"
              icon={<Link className="h-4 w-4" />}
              value={personal?.linkedin ?? ''}
              onChange={e => update('linkedin', e.target.value)}
            />
            <Input
              label="GitHub"
              placeholder="github.com/yourname"
              icon={<Code className="h-4 w-4" />}
              value={personal?.github ?? ''}
              onChange={e => update('github', e.target.value)}
            />
            <Input
              label="Portfolio / Website"
              placeholder="yourportfolio.com"
              icon={<Globe className="h-4 w-4" />}
              value={personal?.portfolio ?? ''}
              onChange={e => update('portfolio', e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
