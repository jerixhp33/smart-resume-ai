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
  Upload,
  Wand2,
  Loader2,
  Check,
  Image as ImageIcon,
} from 'lucide-react'
import { removeImageBackground } from '@/utils/removeBackground'

const SECTIONS = [
  { id: 'ai-builder', title: '✨ AI Template Studio', icon: Wand2 },
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
  
  const [isRemovingBg, setIsRemovingBg] = React.useState(false)

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const result = event.target?.result as string
      if (result) {
        updateHero({ avatar_url: result })
      }
    }
    reader.readAsDataURL(file)
  }

  const handleAutoRemoveBg = async () => {
    if (!content?.hero?.avatar_url) return
    try {
      setIsRemovingBg(true)
      const cleanPhoto = await removeImageBackground(content.hero.avatar_url)
      updateHero({ avatar_url: cleanPhoto })
    } catch (err) {
      console.error('Failed to remove background:', err)
    } finally {
      setIsRemovingBg(false)
    }
  }

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
      {/* Compact Section Selector Tabs Bar */}
      <div className="p-3 border-b border-border bg-muted/20">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Select Section</p>
          <span className="text-[10px] text-primary font-bold">
            {SECTIONS.find((s) => s.id === activeSection)?.title}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          {SECTIONS.map(({ id, title, icon: Icon }) => {
            const isHidden = !!hiddenMap[id]
            const isActive = activeSection === id

            return (
              <div
                key={id}
                onClick={() => setActiveSection(id)}
                className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[11px] font-medium cursor-pointer transition-all ${
                  isActive
                    ? 'bg-primary text-primary-foreground font-bold shadow-sm'
                    : 'bg-card border border-border/70 text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <div className="flex items-center gap-1.5 truncate">
                  <Icon className="h-3.5 w-3.5 flex-shrink-0" />
                  <span className="truncate">{title.replace(' Section', '').replace(' Bio', '').replace(' & CTA', '')}</span>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleSectionVisibility(id, !isHidden)
                  }}
                  className="p-0.5 hover:opacity-100 text-current opacity-75 rounded"
                  title={isHidden ? "Show Section" : "Hide Section"}
                >
                  {isHidden ? (
                    <EyeOff className="h-3 w-3 opacity-50" />
                  ) : (
                    <Eye className={`h-3 w-3 ${isActive ? 'text-emerald-300' : 'text-emerald-500'}`} />
                  )}
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

        {/* AI TEMPLATE STUDIO SECTION */}
        {activeSection === 'ai-builder' && (
          <div className="space-y-4 text-xs bg-slate-950 text-white p-4 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
              <Wand2 className="h-4 w-4" /> AI Dynamic Template Studio
            </div>
            <p className="text-slate-300 text-xs leading-relaxed">
              Type any prompt to generate a brand-new custom portfolio template, write custom CSS live, and visualize in 60fps real-time.
            </p>
            <div className="pt-2">
              <Button
                onClick={() => {
                  const btn = document.querySelector('[data-ai-prompt-studio-btn]') as HTMLButtonElement
                  if (btn) btn.click()
                }}
                className="w-full bg-gradient-to-r from-primary via-indigo-600 to-purple-600 text-white font-bold text-xs py-2.5 rounded-xl shadow-md hover:scale-[1.01] transition-transform"
              >
                Launch Prompt & Code Studio 🚀
              </Button>
            </div>
          </div>
        )}

        {/* HERO SECTION */}
        {activeSection === 'hero' && (
          <div className="space-y-3 text-xs">
            {/* Profile Photo / Avatar Upload */}
            <div className="space-y-2 pb-3 border-b border-border/60 bg-primary/5 p-3 rounded-xl border border-primary/20">
              <div className="flex items-center justify-between">
                <label className="font-bold text-xs text-primary flex items-center gap-1.5">
                  <ImageIcon className="h-3.5 w-3.5 text-primary" /> Profile Photo / Headshot
                </label>
                {content.hero.avatar_url && (
                  <span className="text-[10px] text-emerald-500 font-bold flex items-center gap-1">
                    <Check className="h-3 w-3" /> Photo Attached
                  </span>
                )}
              </div>

              {content.hero.avatar_url ? (
                <div className="flex items-center gap-3 p-2.5 rounded-xl border border-border bg-card">
                  <img
                    src={content.hero.avatar_url}
                    alt="Avatar preview"
                    className="h-12 w-12 rounded-xl object-cover border border-border shadow-xs bg-slate-900"
                  />
                  <div className="flex-1 space-y-1">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={isRemovingBg}
                      onClick={handleAutoRemoveBg}
                      className="w-full h-7 text-[11px] gap-1.5 text-purple-600 dark:text-purple-400 border-purple-500/30 hover:bg-purple-500/10 font-medium"
                    >
                      {isRemovingBg ? (
                        <>
                          <Loader2 className="h-3 w-3 animate-spin" /> Auto Removing BG...
                        </>
                      ) : (
                        <>
                          <Wand2 className="h-3 w-3 text-purple-500" /> Auto Remove BG
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => updateHero({ avatar_url: '' })}
                      className="w-full h-6 text-[10px] text-destructive hover:bg-destructive/10"
                    >
                      Remove Photo
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <label className="flex flex-col items-center justify-center p-3 border-2 border-dashed border-primary/40 bg-card hover:bg-primary/5 rounded-xl cursor-pointer transition-colors text-center">
                    <Upload className="h-4 w-4 text-primary mb-1" />
                    <span className="text-xs font-bold text-primary">Upload Profile Photo</span>
                    <span className="text-[10px] text-muted-foreground mt-0.5">JPG, PNG, WebP up to 5MB</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </label>

                  <div>
                    <label className="text-[10px] text-muted-foreground font-medium">Or Paste Image URL</label>
                    <Input
                      value={content.hero.avatar_url || ''}
                      onChange={(e) => updateHero({ avatar_url: e.target.value })}
                      className="mt-0.5 h-7 text-xs bg-card"
                      placeholder="https://..."
                    />
                  </div>
                </div>
              )}
            </div>

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
                <div>
                  <label className="text-[10px] font-semibold text-muted-foreground">App Preview Image URL</label>
                  <Input
                    value={proj.image_url || ''}
                    onChange={(e) => updateProjectItem(idx, { image_url: e.target.value })}
                    className="h-7 text-xs mt-0.5"
                    placeholder="https://... (App screenshot or mockup image)"
                  />
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
                      placeholder="e.g. 2025-05 - 2025-06"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-muted-foreground">Location</label>
                    <Input
                      value={exp.location || ''}
                      onChange={(e) => updateExperienceItem(idx, { location: e.target.value })}
                      className="h-7 text-xs mt-0.5"
                      placeholder="e.g. Chennai, India"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-muted-foreground">Experience Type</label>
                  <select
                    value={exp.type || (exp.role?.toLowerCase().includes('intern') ? 'internship' : 'full-time')}
                    onChange={(e) => updateExperienceItem(idx, { type: e.target.value })}
                    className="w-full h-7 text-xs mt-0.5 rounded-md border border-input bg-background px-2 py-1 text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                  >
                    <option value="internship">Internship</option>
                    <option value="full-time">Full-time</option>
                    <option value="contract">Contract</option>
                    <option value="part-time">Part-time</option>
                    <option value="freelance">Freelance</option>
                    <option value="leadership">Leadership / Volunteer</option>
                  </select>
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
