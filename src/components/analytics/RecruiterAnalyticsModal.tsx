'use client'

import React, { useState } from 'react'
import { 
  BarChart3, 
  Eye, 
  Link as LinkIcon, 
  Copy, 
  Check, 
  Plus, 
  Globe, 
  Clock, 
  ExternalLink,
  ShieldCheck,
  X
} from 'lucide-react'
import { toast } from '@/components/ui/toast'

interface TrackingLink {
  id: string
  label: string
  company: string
  url: string
  views: number
  lastViewed: string | null
  createdAt: string
}

interface RecruiterAnalyticsModalProps {
  isOpen: boolean
  onClose: () => void
  username?: string
}

export function RecruiterAnalyticsModal({ isOpen, onClose, username = 'alexmorgan' }: RecruiterAnalyticsModalProps) {
  const [links, setLinks] = useState<TrackingLink[]>([
    {
      id: 'rec-google-1',
      label: 'Senior Staff Engineer App',
      company: 'Google Cloud',
      url: `https://resunio.ai/r/rec-google-1`,
      views: 4,
      lastViewed: '10 mins ago',
      createdAt: 'Sep 8, 2026',
    },
    {
      id: 'rec-stripe-2',
      label: 'Lead PM Application',
      company: 'Stripe',
      url: `https://resunio.ai/r/rec-stripe-2`,
      views: 9,
      lastViewed: '2 hours ago',
      createdAt: 'Sep 6, 2026',
    },
    {
      id: 'rec-meta-3',
      label: 'General Share Portfolio',
      company: 'Meta HR Team',
      url: `https://resunio.ai/r/rec-meta-3`,
      views: 2,
      lastViewed: 'Yesterday',
      createdAt: 'Sep 4, 2026',
    },
  ])

  const [newCompany, setNewCompany] = useState('')
  const [newLabel, setNewLabel] = useState('')
  const [copiedId, setCopiedId] = useState<string | null>(null)

  if (!isOpen) return null

  const handleCreateLink = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCompany.trim() || !newLabel.trim()) return

    const slug = newCompany.toLowerCase().replace(/[^a-z0-9]/g, '') + '-' + Math.floor(Math.random() * 1000)
    const newLink: TrackingLink = {
      id: slug,
      label: newLabel.trim(),
      company: newCompany.trim(),
      url: `https://resunio.ai/r/${slug}`,
      views: 0,
      lastViewed: null,
      createdAt: 'Just now',
    }

    setLinks([newLink, ...links])
    setNewCompany('')
    setNewLabel('')
    toast({ title: 'Recruiter Link Created!', description: 'Link copied to tracking table.', variant: 'success' })
  }

  const handleCopyLink = (url: string, id: string) => {
    navigator.clipboard.writeText(url)
    setCopiedId(id)
    toast({ title: 'Copied Recruiter Link', description: url, variant: 'success' })
    setTimeout(() => setCopiedId(null), 2000)
  }

  const totalViews = links.reduce((acc, curr) => acc + curr.views, 0)

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
              <BarChart3 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-foreground tracking-tight">Recruiter Live View Analytics</h3>
              <p className="text-xs text-muted-foreground">Generate unique tracking links for job applications & track when recruiters view your resume.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-muted/40 p-4 rounded-2xl border border-border/60">
            <span className="text-2xl font-black text-primary">{totalViews}</span>
            <p className="text-[10px] font-semibold text-muted-foreground uppercase">Total Recruiter Opens</p>
          </div>
          <div className="bg-muted/40 p-4 rounded-2xl border border-border/60">
            <span className="text-2xl font-black text-emerald-500">{links.length}</span>
            <p className="text-[10px] font-semibold text-muted-foreground uppercase">Active Tracking Links</p>
          </div>
          <div className="bg-muted/40 p-4 rounded-2xl border border-border/60">
            <span className="text-2xl font-black text-amber-500">100%</span>
            <p className="text-[10px] font-semibold text-muted-foreground uppercase">Verified Delivery</p>
          </div>
        </div>

        {/* Create New Link Form */}
        <form onSubmit={handleCreateLink} className="bg-slate-950 text-white p-4 rounded-2xl space-y-3 border border-slate-800">
          <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <Plus className="h-4 w-4 text-primary" /> Create New Recruiter Tracking Link
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              value={newCompany}
              onChange={(e) => setNewCompany(e.target.value)}
              placeholder="Company Name (e.g. Netflix)"
              className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <input
              type="text"
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              placeholder="Label (e.g. Lead Staff Engineer Application)"
              className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <button
            type="submit"
            disabled={!newCompany.trim() || !newLabel.trim()}
            className="w-full bg-gradient-to-r from-primary via-indigo-600 to-violet-600 text-white font-bold text-xs py-2 rounded-xl hover:scale-[1.01] disabled:opacity-50 transition-all"
          >
            Generate Custom Link
          </button>
        </form>

        {/* Links Table */}
        <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
          <p className="text-xs font-bold text-foreground">Your Tracking Links</p>
          {links.map((link) => (
            <div key={link.id} className="bg-card border border-border p-3.5 rounded-xl flex items-center justify-between gap-3 hover:border-primary/40 transition-colors">
              <div className="space-y-0.5 min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-foreground truncate">{link.label}</span>
                  <span className="text-[10px] font-semibold bg-primary/10 text-primary px-2 py-0.5 rounded-full border border-primary/20">{link.company}</span>
                </div>
                <p className="text-[11px] font-mono text-muted-foreground truncate">{link.url}</p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right">
                  <span className="text-xs font-black text-emerald-500 flex items-center gap-1">
                    <Eye className="h-3.5 w-3.5" /> {link.views} views
                  </span>
                  <span className="text-[10px] text-muted-foreground font-mono block">
                    {link.lastViewed ? link.lastViewed : 'No views yet'}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleCopyLink(link.url, link.id)}
                  className="p-2 bg-muted hover:bg-primary/10 hover:text-primary rounded-lg text-muted-foreground transition-colors"
                >
                  {copiedId === link.id ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="border-t border-border pt-4 flex justify-between items-center text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-emerald-500" /> Real-time notification webhooks enabled
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-muted hover:bg-muted/80 text-foreground font-bold rounded-xl transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  )
}
