'use client'

import React from 'react'
import { usePortfolioStore } from '@/features/portfolio/usePortfolioStore'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import {
  Eye,
  EyeOff,
  Layout,
  User,
  Briefcase,
  GraduationCap,
  Code,
  FolderGit2,
  Award,
  Mail,
  Plus,
  Trash2,
} from 'lucide-react'

const SECTIONS = [
  { id: 'hero', title: 'Hero Section', icon: User },
  { id: 'about', title: 'About Bio', icon: Layout },
  { id: 'projects', title: 'Projects', icon: FolderGit2 },
  { id: 'experience', title: 'Work Experience', icon: Briefcase },
  { id: 'skills', title: 'Skills & Tech', icon: Code },
  { id: 'education', title: 'Education', icon: GraduationCap },
  { id: 'certifications', title: 'Certifications', icon: Award },
  { id: 'contact', title: 'Contact & CTA', icon: Mail },
]

export function LeftNavigationPanel() {
  const content = usePortfolioStore((s) => s.content)
  const activeSection = usePortfolioStore((s) => s.activeSection)
  const setActiveSection = usePortfolioStore((s) => s.setActiveSection)
  const toggleSectionVisibility = usePortfolioStore((s) => s.toggleSectionVisibility)
  const updateHero = usePortfolioStore((s) => s.updateHero)
  const updateAbout = usePortfolioStore((s) => s.updateAbout)
  const updateContact = usePortfolioStore((s) => s.updateContact)
  
  const updateProjectItem = usePortfolioStore((s) => s.updateProjectItem)
  const addProjectItem = usePortfolioStore((s) => s.addProjectItem)
  const deleteProjectItem = usePortfolioStore((s) => s.deleteProjectItem)

  const updateExperienceItem = usePortfolioStore((s) => s.updateExperienceItem)
  const addExperienceItem = usePortfolioStore((s) => s.addExperienceItem)
  const deleteExperienceItem = usePortfolioStore((s) => s.deleteExperienceItem)

  const updateEducationItem = usePortfolioStore((s) => s.updateEducationItem)
  const addEducationItem = usePortfolioStore((s) => s.addEducationItem)
  const deleteEducationItem = usePortfolioStore((s) => s.deleteEducationItem)

  const updateSkillGroup = usePortfolioStore((s) => s.updateSkillGroup)
  const addSkillGroup = usePortfolioStore((s) => s.addSkillGroup)
  const deleteSkillGroup = usePortfolioStore((s) => s.deleteSkillGroup)

  const updateCertificationItem = usePortfolioStore((s) => s.updateCertificationItem)
  const addCertificationItem = usePortfolioStore((s) => s.addCertificationItem)
  const deleteCertificationItem = usePortfolioStore((s) => s.deleteCertificationItem)

  if (!content) return null

  const hiddenMap = content.hidden_sections || {}

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Section Selector Tabs */}
      <div className="p-3 border-b border-border bg-muted/20">
        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Sections</p>
        <div className="space-y-1">
          {SECTIONS.map(({ id, title, icon: Icon }) => {
            const isHidden = !!hiddenMap[id]
            const isActive = activeSection === id

            return (
              <div
                key={id}
                onClick={() => setActiveSection(id)}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                  isActive
                    ? 'bg-primary/10 text-primary font-bold shadow-xs'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="h-3.5 w-3.5" />
                  <span>{title}</span>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleSectionVisibility(id, !isHidden)
                  }}
                  className="p-1 hover:text-foreground text-muted-foreground rounded"
                  title={isHidden ? "Show Section" : "Hide Section"}
                >
                  {isHidden ? <EyeOff className="h-3.5 w-3.5 text-muted-foreground/60" /> : <Eye className="h-3.5 w-3.5 text-emerald-500" />}
                </button>
              </div>
            )
          })}
        </div>
      </div>

      {/* Editor Form for Active Section */}
      <div data-lenis-prevent className="flex-1 p-4 overflow-y-auto space-y-4">
        <div className="flex items-center justify-between border-b border-border/50 pb-2">
          <p className="text-xs font-bold uppercase tracking-wider text-primary">
            Editing: {SECTIONS.find((s) => s.id === activeSection)?.title || activeSection}
          </p>
        </div>

        {/* HERO SECTION */}
        {activeSection === 'hero' && (
          <div className="space-y-3 text-xs">
            <div>
              <label className="font-semibold text-muted-foreground">Full Name</label>
              <Input
                value={content.hero.full_name || ''}
                onChange={(e) => updateHero({ full_name: e.target.value })}
                className="mt-1 h-8 text-xs"
                placeholder="e.g. Manikandan U"
              />
            </div>
            <div>
              <label className="font-semibold text-muted-foreground">Professional Title</label>
              <Input
                value={content.hero.title || ''}
                onChange={(e) => updateHero({ title: e.target.value })}
                className="mt-1 h-8 text-xs"
                placeholder="e.g. Senior Full Stack Engineer"
              />
            </div>
            <div>
              <label className="font-semibold text-muted-foreground">Hero Summary</label>
              <Textarea
                value={content.hero.summary || ''}
                onChange={(e) => updateHero({ summary: e.target.value })}
                className="mt-1 text-xs min-h-[80px]"
                placeholder="Brief high-impact introduction..."
              />
            </div>
            <div>
              <label className="font-semibold text-muted-foreground">Availability Badge</label>
              <Input
                value={content.hero.availability || ''}
                onChange={(e) => updateHero({ availability: e.target.value })}
                className="mt-1 h-8 text-xs"
                placeholder="e.g. Available for New Roles"
              />
            </div>
          </div>
        )}

        {/* ABOUT BIO SECTION */}
        {activeSection === 'about' && (
          <div className="space-y-3 text-xs">
            <div>
              <label className="font-semibold text-muted-foreground">Biography Narrative</label>
              <Textarea
                value={content.about.biography || ''}
                onChange={(e) => updateAbout({ biography: e.target.value })}
                className="mt-1 text-xs min-h-[140px]"
                placeholder="Detailed career history and background..."
              />
            </div>
            <div>
              <label className="font-semibold text-muted-foreground">Career Direction / Focus</label>
              <Input
                value={content.about.career_direction || ''}
                onChange={(e) => updateAbout({ career_direction: e.target.value })}
                className="mt-1 h-8 text-xs"
                placeholder="e.g. Building scalable cloud systems and AI apps"
              />
            </div>
          </div>
        )}

        {/* PROJECTS SECTION */}
        {activeSection === 'projects' && (
          <div className="space-y-4 text-xs">
            {(content.projects || []).map((proj, idx) => (
              <div key={proj.id || idx} className="p-3 border border-border rounded-xl space-y-2.5 bg-muted/10 relative group">
                <div className="flex items-center justify-between">
                  <p className="font-bold text-xs text-primary">Project #{idx + 1}</p>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteProjectItem(idx)}
                    className="h-6 w-6 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-muted-foreground">Title</label>
                  <Input
                    value={proj.title || ''}
                    onChange={(e) => updateProjectItem(idx, { title: e.target.value })}
                    className="h-7 text-xs mt-0.5"
                    placeholder="Project Name"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-muted-foreground">Tagline</label>
                  <Input
                    value={proj.tagline || ''}
                    onChange={(e) => updateProjectItem(idx, { tagline: e.target.value })}
                    className="h-7 text-xs mt-0.5"
                    placeholder="Short summary line"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-muted-foreground">Description</label>
                  <Textarea
                    value={proj.description || ''}
                    onChange={(e) => updateProjectItem(idx, { description: e.target.value })}
                    className="text-xs min-h-[60px] mt-0.5"
                    placeholder="Detailed project explanation..."
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-muted-foreground">Technologies (comma-separated)</label>
                  <Input
                    value={Array.isArray(proj.technologies) ? proj.technologies.join(', ') : ''}
                    onChange={(e) =>
                      updateProjectItem(idx, {
                        technologies: e.target.value.split(',').map((t) => t.trim()).filter(Boolean),
                      })
                    }
                    className="h-7 text-xs mt-0.5"
                    placeholder="React, TypeScript, Tailwind"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-semibold text-muted-foreground">Live URL</label>
                    <Input
                      value={proj.live_url || ''}
                      onChange={(e) => updateProjectItem(idx, { live_url: e.target.value })}
                      className="h-7 text-xs mt-0.5"
                      placeholder="https://..."
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-muted-foreground">GitHub URL</label>
                    <Input
                      value={proj.github_url || ''}
                      onChange={(e) => updateProjectItem(idx, { github_url: e.target.value })}
                      className="h-7 text-xs mt-0.5"
                      placeholder="https://github..."
                    />
                  </div>
                </div>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={addProjectItem}
              className="w-full gap-1.5 text-xs h-8 border-dashed"
            >
              <Plus className="h-3.5 w-3.5" /> Add Project
            </Button>
          </div>
        )}

        {/* WORK EXPERIENCE SECTION */}
        {activeSection === 'experience' && (
          <div className="space-y-4 text-xs">
            {(content.experience || []).map((exp, idx) => (
              <div key={exp.id || idx} className="p-3 border border-border rounded-xl space-y-2.5 bg-muted/10">
                <div className="flex items-center justify-between">
                  <p className="font-bold text-xs text-primary">Experience #{idx + 1}</p>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteExperienceItem(idx)}
                    className="h-6 w-6 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-muted-foreground">Role / Position</label>
                  <Input
                    value={exp.role || ''}
                    onChange={(e) => updateExperienceItem(idx, { role: e.target.value })}
                    className="h-7 text-xs mt-0.5"
                    placeholder="e.g. Senior Developer"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-muted-foreground">Company Name</label>
                  <Input
                    value={exp.company || ''}
                    onChange={(e) => updateExperienceItem(idx, { company: e.target.value })}
                    className="h-7 text-xs mt-0.5"
                    placeholder="e.g. Acme Corp"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-semibold text-muted-foreground">Period / Dates</label>
                    <Input
                      value={exp.period || ''}
                      onChange={(e) => updateExperienceItem(idx, { period: e.target.value })}
                      className="h-7 text-xs mt-0.5"
                      placeholder="e.g. 2022 - Present"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-muted-foreground">Location</label>
                    <Input
                      value={exp.location || ''}
                      onChange={(e) => updateExperienceItem(idx, { location: e.target.value })}
                      className="h-7 text-xs mt-0.5"
                      placeholder="e.g. Remote"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-muted-foreground">Description</label>
                  <Textarea
                    value={exp.description || ''}
                    onChange={(e) => updateExperienceItem(idx, { description: e.target.value })}
                    className="text-xs min-h-[50px] mt-0.5"
                    placeholder="Overview of role..."
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-muted-foreground">Bullet Points (1 per line)</label>
                  <Textarea
                    value={Array.isArray(exp.bullets) ? exp.bullets.join('\n') : ''}
                    onChange={(e) =>
                      updateExperienceItem(idx, {
                        bullets: e.target.value.split('\n').filter(Boolean),
                      })
                    }
                    className="text-xs min-h-[60px] mt-0.5 font-mono text-[11px]"
                    placeholder="Achieved X by implementing Y&#10;Led team of 4 engineers"
                  />
                </div>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={addExperienceItem}
              className="w-full gap-1.5 text-xs h-8 border-dashed"
            >
              <Plus className="h-3.5 w-3.5" /> Add Work Experience
            </Button>
          </div>
        )}

        {/* SKILLS & TECH SECTION */}
        {activeSection === 'skills' && (
          <div className="space-y-4 text-xs">
            {(content.skills || []).map((sk, idx) => (
              <div key={sk.id || idx} className="p-3 border border-border rounded-xl space-y-2.5 bg-muted/10">
                <div className="flex items-center justify-between">
                  <p className="font-bold text-xs text-primary">Skill Group #{idx + 1}</p>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteSkillGroup(idx)}
                    className="h-6 w-6 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-muted-foreground">Category Name</label>
                  <Input
                    value={sk.category || ''}
                    onChange={(e) => updateSkillGroup(idx, { category: e.target.value })}
                    className="h-7 text-xs mt-0.5"
                    placeholder="e.g. Frontend Engineering"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-muted-foreground">Skills (comma-separated)</label>
                  <Textarea
                    value={Array.isArray(sk.skills) ? sk.skills.join(', ') : ''}
                    onChange={(e) =>
                      updateSkillGroup(idx, {
                        skills: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                      })
                    }
                    className="text-xs min-h-[50px] mt-0.5"
                    placeholder="React, Next.js, TypeScript, Tailwind CSS"
                  />
                </div>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={addSkillGroup}
              className="w-full gap-1.5 text-xs h-8 border-dashed"
            >
              <Plus className="h-3.5 w-3.5" /> Add Skill Category
            </Button>
          </div>
        )}

        {/* EDUCATION SECTION */}
        {activeSection === 'education' && (
          <div className="space-y-4 text-xs">
            {(content.education || []).map((edu, idx) => (
              <div key={edu.id || idx} className="p-3 border border-border rounded-xl space-y-2.5 bg-muted/10">
                <div className="flex items-center justify-between">
                  <p className="font-bold text-xs text-primary">Education #{idx + 1}</p>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteEducationItem(idx)}
                    className="h-6 w-6 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-muted-foreground">Institution / University</label>
                  <Input
                    value={edu.institution || ''}
                    onChange={(e) => updateEducationItem(idx, { institution: e.target.value })}
                    className="h-7 text-xs mt-0.5"
                    placeholder="e.g. Stanford University"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-semibold text-muted-foreground">Degree</label>
                    <Input
                      value={edu.degree || ''}
                      onChange={(e) => updateEducationItem(idx, { degree: e.target.value })}
                      className="h-7 text-xs mt-0.5"
                      placeholder="e.g. B.Sc."
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-muted-foreground">Field of Study</label>
                    <Input
                      value={edu.field || ''}
                      onChange={(e) => updateEducationItem(idx, { field: e.target.value })}
                      className="h-7 text-xs mt-0.5"
                      placeholder="e.g. Computer Science"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-semibold text-muted-foreground">Period / Dates</label>
                    <Input
                      value={edu.period || ''}
                      onChange={(e) => updateEducationItem(idx, { period: e.target.value })}
                      className="h-7 text-xs mt-0.5"
                      placeholder="e.g. 2019 - 2023"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-muted-foreground">GPA (optional)</label>
                    <Input
                      value={edu.gpa || ''}
                      onChange={(e) => updateEducationItem(idx, { gpa: e.target.value })}
                      className="h-7 text-xs mt-0.5"
                      placeholder="e.g. 3.8 / 4.0"
                    />
                  </div>
                </div>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={addEducationItem}
              className="w-full gap-1.5 text-xs h-8 border-dashed"
            >
              <Plus className="h-3.5 w-3.5" /> Add Education
            </Button>
          </div>
        )}

        {/* CERTIFICATIONS SECTION */}
        {activeSection === 'certifications' && (
          <div className="space-y-4 text-xs">
            {(content.certifications || []).map((cert, idx) => (
              <div key={cert.id || idx} className="p-3 border border-border rounded-xl space-y-2.5 bg-muted/10">
                <div className="flex items-center justify-between">
                  <p className="font-bold text-xs text-primary">Certification #{idx + 1}</p>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteCertificationItem(idx)}
                    className="h-6 w-6 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-muted-foreground">Certification Title</label>
                  <Input
                    value={cert.title || ''}
                    onChange={(e) => updateCertificationItem(idx, { title: e.target.value })}
                    className="h-7 text-xs mt-0.5"
                    placeholder="e.g. AWS Solutions Architect"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-semibold text-muted-foreground">Issuer</label>
                    <Input
                      value={cert.issuer || ''}
                      onChange={(e) => updateCertificationItem(idx, { issuer: e.target.value })}
                      className="h-7 text-xs mt-0.5"
                      placeholder="e.g. Amazon Web Services"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-muted-foreground">Date</label>
                    <Input
                      value={cert.date || ''}
                      onChange={(e) => updateCertificationItem(idx, { date: e.target.value })}
                      className="h-7 text-xs mt-0.5"
                      placeholder="e.g. 2023"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-muted-foreground">Credential Link</label>
                  <Input
                    value={cert.credential_url || ''}
                    onChange={(e) => updateCertificationItem(idx, { credential_url: e.target.value })}
                    className="h-7 text-xs mt-0.5"
                    placeholder="https://..."
                  />
                </div>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={addCertificationItem}
              className="w-full gap-1.5 text-xs h-8 border-dashed"
            >
              <Plus className="h-3.5 w-3.5" /> Add Certification
            </Button>
          </div>
        )}

        {/* CONTACT & CTA SECTION */}
        {activeSection === 'contact' && (
          <div className="space-y-3 text-xs">
            <div>
              <label className="font-semibold text-muted-foreground">Heading Title</label>
              <Input
                value={content.contact.heading || ''}
                onChange={(e) => updateContact({ heading: e.target.value })}
                className="mt-1 h-8 text-xs"
                placeholder="e.g. Let's Build Something Together"
              />
            </div>
            <div>
              <label className="font-semibold text-muted-foreground">Subheading / Message</label>
              <Textarea
                value={content.contact.subheading || ''}
                onChange={(e) => updateContact({ subheading: e.target.value })}
                className="mt-1 text-xs min-h-[50px]"
                placeholder="Call to action details..."
              />
            </div>
            <div>
              <label className="font-semibold text-muted-foreground">Email Address</label>
              <Input
                value={content.contact.email || ''}
                onChange={(e) => updateContact({ email: e.target.value })}
                className="mt-1 h-8 text-xs"
                placeholder="name@example.com"
              />
            </div>
            <div>
              <label className="font-semibold text-muted-foreground">Phone Number</label>
              <Input
                value={content.contact.phone || ''}
                onChange={(e) => updateContact({ phone: e.target.value })}
                className="mt-1 h-8 text-xs"
                placeholder="+1 (555) 000-0000"
              />
            </div>
            <div>
              <label className="font-semibold text-muted-foreground">Location</label>
              <Input
                value={content.contact.location || ''}
                onChange={(e) => updateContact({ location: e.target.value })}
                className="mt-1 h-8 text-xs"
                placeholder="San Francisco, CA"
              />
            </div>
            <div>
              <label className="font-semibold text-muted-foreground">GitHub URL</label>
              <Input
                value={content.contact.github_url || ''}
                onChange={(e) => updateContact({ github_url: e.target.value })}
                className="mt-1 h-8 text-xs"
                placeholder="https://github.com/..."
              />
            </div>
            <div>
              <label className="font-semibold text-muted-foreground">LinkedIn URL</label>
              <Input
                value={content.contact.linkedin_url || ''}
                onChange={(e) => updateContact({ linkedin_url: e.target.value })}
                className="mt-1 h-8 text-xs"
                placeholder="https://linkedin.com/in/..."
              />
            </div>
            <div>
              <label className="font-semibold text-muted-foreground">Website / Portfolio URL</label>
              <Input
                value={content.contact.website_url || ''}
                onChange={(e) => updateContact({ website_url: e.target.value })}
                className="mt-1 h-8 text-xs"
                placeholder="https://..."
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
