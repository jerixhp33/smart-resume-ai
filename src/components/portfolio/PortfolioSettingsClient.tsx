'use client'

import React, { useState, useRef } from 'react'
import Link from 'next/link'
import { PortfolioSite } from '@/types'
import { updatePortfolioSEOSettingsAction, uploadPortfolioOGImageAction } from '@/features/portfolio/actions'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/components/ui/toast'
import { 
  ArrowLeft, 
  Save, 
  Globe, 
  Share2, 
  Sparkles, 
  Loader2, 
  Check, 
  Palette, 
  ExternalLink,
  Search,
  Upload,
  Image as ImageIcon,
  Trash2,
  CheckCircle2
} from 'lucide-react'

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
    </svg>
  )
}

function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  )
}

import { SharePortfolioModal } from './SharePortfolioModal'

interface PortfolioSettingsClientProps {
  portfolio: PortfolioSite
}

const ACCENT_COLORS = [
  { name: 'Indigo', value: '#6366f1', bgClass: 'bg-indigo-600' },
  { name: 'Violet', value: '#8b5cf6', bgClass: 'bg-violet-600' },
  { name: 'Emerald', value: '#10b981', bgClass: 'bg-emerald-600' },
  { name: 'Cyan', value: '#06b6d4', bgClass: 'bg-cyan-500' },
  { name: 'Amber', value: '#f59e0b', bgClass: 'bg-amber-500' },
  { name: 'Rose', value: '#f43f5e', bgClass: 'bg-rose-500' },
  { name: 'Slate', value: '#475569', bgClass: 'bg-slate-600' },
]

export function PortfolioSettingsClient({ portfolio }: PortfolioSettingsClientProps) {
  const initialSeo = portfolio.seo_metadata || {}

  const [title, setTitle] = useState(initialSeo.title || portfolio.title || '')
  const [description, setDescription] = useState(
    initialSeo.description || portfolio.content?.hero?.summary || ''
  )
  const [keywords, setKeywords] = useState(
    Array.isArray(initialSeo.keywords) ? initialSeo.keywords.join(', ') : ''
  )
  const [ogImage, setOgImage] = useState(initialSeo.og_image || '')
  const [accentColor, setAccentColor] = useState(initialSeo.accent_color || portfolio.theme || '#6366f1')
  const [activeTab, setActiveTab] = useState<'social' | 'twitter' | 'google'>('social')
  const [saving, setSaving] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [shareModalOpen, setShareModalOpen] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const publicUrl = `smartresume.ai/portfolio/${portfolio.username}`

  // Reset image error state whenever ogImage changes
  React.useEffect(() => {
    setImageError(false)
  }, [ogImage])

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!['image/png', 'image/jpeg', 'image/webp', 'image/gif'].includes(file.type)) {
      toast({ title: 'Invalid Image', description: 'Please upload a PNG, JPEG, WebP, or GIF image.', variant: 'error' })
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({ title: 'File Too Large', description: 'Image size must be under 5MB.', variant: 'error' })
      return
    }

    // Instant local preview
    const localPreviewUrl = URL.createObjectURL(file)
    setOgImage(localPreviewUrl)
    setImageError(false)

    setUploadingImage(true)
    const formData = new FormData()
    formData.append('file', file)

    const res = await uploadPortfolioOGImageAction(formData, portfolio.id)
    setUploadingImage(false)

    if (res.error) {
      toast({ title: 'Upload Failed', description: res.error, variant: 'error' })
    } else if (res.publicUrl) {
      setOgImage(res.publicUrl)
      toast({ title: 'Image Uploaded!', description: 'Social share image updated successfully.', variant: 'success' })
    }
  }

  const handleSave = async () => {
    if (!title.trim()) {
      toast({ title: 'Title required', description: 'Please enter a portfolio title.', variant: 'error' })
      return
    }

    setSaving(true)
    const keywordList = keywords
      .split(',')
      .map((k) => k.trim())
      .filter(Boolean)

    const res = await updatePortfolioSEOSettingsAction({
      portfolioId: portfolio.id,
      title: title.trim(),
      description: description.trim(),
      keywords: keywordList,
      ogImage: ogImage.trim(),
      accentColor,
    })

    setSaving(false)

    if (res.error) {
      toast({ title: 'Save Failed', description: res.error, variant: 'error' })
    } else {
      toast({ title: 'Settings Saved', description: 'Your portfolio SEO and social metadata have been updated.', variant: 'success' })
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-6 px-4 sm:px-6 min-h-0 overscroll-contain pb-24">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Link href="/portfolio">
              <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-4 w-4" /> Portfolio Hub
              </Button>
            </Link>
          </div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            Portfolio Settings & SEO
          </h1>
          <p className="text-sm text-muted-foreground">
            Configure how your portfolio appears in search engine results and social media shares.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShareModalOpen(true)}
            className="gap-1.5 border-primary/30 text-primary hover:bg-primary/5"
          >
            <Share2 className="h-3.5 w-3.5" /> Share Portfolio
          </Button>
          <Link href={`/portfolio/${portfolio.username}`} target="_blank">
            <Button variant="outline" size="sm" className="gap-1.5">
              <ExternalLink className="h-3.5 w-3.5" /> View Public Site
            </Button>
          </Link>
          <Button onClick={handleSave} disabled={saving} size="sm" className="gap-1.5">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save Changes
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form Settings */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Globe className="h-4 w-4 text-primary" /> Basic Metadata
              </CardTitle>
              <CardDescription className="text-xs">
                Essential metadata used by browsers, search engines, and preview cards.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="space-y-1.5">
                <label className="font-semibold text-xs text-foreground flex justify-between">
                  <span>Portfolio Page Title</span>
                  <span className="text-muted-foreground font-normal">{title.length}/70 chars</span>
                </label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Alex Morgan | Senior Software Engineer Portfolio"
                  maxLength={70}
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-xs text-foreground flex justify-between">
                  <span>SEO Meta Description</span>
                  <span className="text-muted-foreground font-normal">{description.length}/160 chars</span>
                </label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="A concise summary of your professional expertise, skills, and projects..."
                  className="min-h-[90px]"
                  maxLength={160}
                />
                <p className="text-[11px] text-muted-foreground">
                  Optimal length: 150-160 characters. This snippet appears under your link in search results.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-xs text-foreground">
                  Keywords (Comma Separated)
                </label>
                <Input
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  placeholder="react, typescript, nextjs, full stack developer, portfolio"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-xs text-muted-foreground">Username & URL Slug</label>
                <Input value={portfolio.username} disabled className="bg-muted/50 font-mono text-xs" />
                <p className="text-[10px] text-muted-foreground">
                  To change your handle, use the <span className="font-medium text-foreground">Claim Username</span> option in Portfolio Hub.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Customization & Social Branding */}
          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Palette className="h-4 w-4 text-primary" /> Visual Branding & OG Image
              </CardTitle>
              <CardDescription className="text-xs">
                Customize social sharing image thumbnail and accent theme color.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5 text-sm">
              <div className="space-y-2">
                <label className="font-semibold text-xs text-foreground">Theme Accent Color</label>
                <div className="flex flex-wrap items-center gap-3">
                  {ACCENT_COLORS.map((c) => (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() => setAccentColor(c.value)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                        accentColor === c.value
                          ? 'border-primary bg-primary/10 text-primary ring-2 ring-primary/20'
                          : 'border-border hover:bg-muted text-muted-foreground'
                      }`}
                    >
                      <span className={`w-3.5 h-3.5 rounded-full ${c.bgClass}`} />
                      {c.name}
                      {accentColor === c.value && <Check className="h-3 w-3 ml-auto" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <label className="font-semibold text-xs text-foreground flex items-center justify-between">
                  <span>Social Sharing Image (og:image)</span>
                  <span className="text-muted-foreground font-normal text-[11px]">Recommended: 1200×630px</span>
                </label>

                {/* Direct Upload Dropzone */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageFileChange}
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  className="hidden"
                />

                {ogImage ? (
                  <div className="border border-border rounded-xl p-3 bg-muted/20 flex flex-col sm:flex-row items-center gap-4">
                    <div className="w-full sm:w-40 aspect-[1200/630] rounded-lg overflow-hidden border border-border bg-slate-900 shrink-0 relative flex items-center justify-center">
                      {!imageError ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={ogImage}
                          alt="OG Thumbnail"
                          className="w-full h-full object-cover"
                          onError={() => setImageError(true)}
                        />
                      ) : (
                        <div className="p-2 text-center text-[10px] text-amber-500 font-medium">
                          Failed to load image
                        </div>
                      )}
                    </div>
                    <div className="flex-1 space-y-2 text-xs w-full">
                      <div className="flex items-center gap-1.5 font-medium text-foreground">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                        <span className="truncate max-w-[240px]">
                          {ogImage.startsWith('blob:')
                            ? 'Local Upload Preview'
                            : ogImage.includes('.supabase.co') || ogImage.startsWith('/api/assets/')
                            ? 'Cloud Uploaded Social Banner'
                            : ogImage}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          disabled={uploadingImage}
                          onClick={() => fileInputRef.current?.click()}
                          className="gap-1.5 text-xs h-8"
                        >
                          {uploadingImage ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
                          Replace Image
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setOgImage('')}
                          className="gap-1.5 text-xs h-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-3.5 w-3.5" /> Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => !uploadingImage && fileInputRef.current?.click()}
                    className="border-2 border-dashed border-border hover:border-primary/50 rounded-xl p-6 transition-all text-center cursor-pointer bg-muted/10 hover:bg-primary/5 flex flex-col items-center justify-center gap-2 group"
                  >
                    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                      {uploadingImage ? <Loader2 className="h-5 w-5 animate-spin" /> : <ImageIcon className="h-5 w-5" />}
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-xs font-semibold text-foreground">
                        {uploadingImage ? 'Uploading Image...' : 'Click to Upload Direct Image'}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        PNG, JPG, WebP or GIF up to 5MB
                      </p>
                    </div>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-[11px] text-muted-foreground font-medium">Or enter custom image URL manually:</label>
                  <Input
                    value={ogImage.includes('.supabase.co') || ogImage.startsWith('/api/assets/') ? '' : ogImage}
                    onChange={(e) => setOgImage(e.target.value)}
                    placeholder={
                      ogImage.includes('.supabase.co') || ogImage.startsWith('/api/assets/')
                        ? 'Cloud asset active. Paste external image URL to replace...'
                        : 'https://example.com/images/portfolio-banner.png'
                    }
                    className="text-xs font-mono"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>


        {/* Right Column: Real-Time Live Preview */}
        <div className="lg:col-span-5 space-y-4">
          <div className="sticky top-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold flex items-center gap-2">
                <Share2 className="h-4 w-4 text-primary" /> Live Social & SEO Card Preview
              </h2>
              <div className="flex bg-muted rounded-md p-1 gap-1 border border-border">
                <button
                  type="button"
                  onClick={() => setActiveTab('social')}
                  className={`px-2.5 py-1 text-[11px] font-medium rounded transition-colors flex items-center gap-1 ${
                    activeTab === 'social'
                      ? 'bg-background shadow-xs text-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <LinkedinIcon className="h-3 w-3 text-blue-600" /> LinkedIn
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('twitter')}
                  className={`px-2.5 py-1 text-[11px] font-medium rounded transition-colors flex items-center gap-1 ${
                    activeTab === 'twitter'
                      ? 'bg-background shadow-xs text-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <TwitterIcon className="h-3 w-3 text-sky-500" /> Twitter / X
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('google')}
                  className={`px-2.5 py-1 text-[11px] font-medium rounded transition-colors flex items-center gap-1 ${
                    activeTab === 'google'
                      ? 'bg-background shadow-xs text-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Search className="h-3 w-3 text-emerald-500" /> Google
                </button>
              </div>
            </div>

            {/* LinkedIn Preview Card */}
            {activeTab === 'social' && (
              <div className="border border-border rounded-xl overflow-hidden bg-card shadow-sm">
                <div className="aspect-[1200/630] bg-slate-900 relative overflow-hidden flex items-center justify-center p-6 text-center">
                  {ogImage && !imageError ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={ogImage}
                      alt="OG Preview"
                      className="w-full h-full object-cover"
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <div 
                      className="w-full h-full rounded-lg p-6 flex flex-col justify-between text-left text-white shadow-inner relative overflow-hidden"
                      style={{ background: `linear-gradient(135deg, ${accentColor} 0%, #0f172a 100%)` }}
                    >
                      <div className="flex justify-between items-center z-10">
                        <span className="text-xs font-semibold uppercase tracking-wider opacity-80 flex items-center gap-1">
                          <Sparkles className="h-3 w-3" /> SmartResume AI
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-white/20 backdrop-blur-xs font-mono">
                          {portfolio.username}
                        </span>
                      </div>
                      <div className="space-y-2 z-10">
                        <h3 className="text-xl font-extrabold leading-snug drop-shadow-xs line-clamp-2">
                          {title || 'Your Name | Interactive Portfolio'}
                        </h3>
                        <p className="text-xs opacity-90 line-clamp-2">
                          {description || 'Showcasing verified skills, career milestones, and AI-curated project achievements.'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-3 bg-muted/30 border-t border-border space-y-1">
                  <p className="text-[11px] font-mono text-muted-foreground uppercase tracking-tight">
                    smartresume.ai
                  </p>
                  <h4 className="text-sm font-semibold line-clamp-1 text-foreground">
                    {title || 'Portfolio Title'}
                  </h4>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {description || 'No description set. Add an SEO meta description to display here.'}
                  </p>
                </div>
              </div>
            )}

            {/* Twitter / X Preview Card */}
            {activeTab === 'twitter' && (
              <div className="border border-border rounded-2xl overflow-hidden bg-card shadow-sm p-3 space-y-3">
                <div className="aspect-[2/1] rounded-xl bg-slate-900 relative overflow-hidden flex items-center justify-center">
                  {ogImage && !imageError ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={ogImage}
                      alt="OG Preview"
                      className="w-full h-full object-cover"
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <div 
                      className="w-full h-full p-5 flex flex-col justify-between text-left text-white relative overflow-hidden"
                      style={{ background: `linear-gradient(135deg, ${accentColor} 0%, #1e293b 100%)` }}
                    >
                      <span className="text-xs font-bold tracking-wide uppercase opacity-80">
                        Interactive Portfolio
                      </span>
                      <div>
                        <h3 className="text-lg font-bold line-clamp-1">{title || 'Portfolio Page'}</h3>
                        <p className="text-xs opacity-85 line-clamp-1">{description || 'Professional portfolio card preview'}</p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="space-y-0.5 px-1">
                  <p className="text-xs text-muted-foreground font-mono">{publicUrl}</p>
                  <p className="text-sm font-semibold text-foreground line-clamp-1">{title}</p>
                  <p className="text-xs text-muted-foreground line-clamp-2">{description}</p>
                </div>
              </div>
            )}

            {/* Google Search Snippet Preview */}
            {activeTab === 'google' && (
              <div className="border border-border rounded-xl p-4 bg-card shadow-sm space-y-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-600 flex items-center justify-center font-bold text-[10px]">
                    G
                  </span>
                  <div className="flex flex-col">
                    <span className="text-foreground text-xs font-medium">SmartResume Portfolio</span>
                    <span className="text-[11px] text-muted-foreground font-mono truncate">
                      https://{publicUrl}
                    </span>
                  </div>
                </div>
                <h3 className="text-base text-blue-600 dark:text-blue-400 font-medium hover:underline cursor-pointer line-clamp-1">
                  {title || 'Alex Morgan | Portfolio'}
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                  {description || 'Motivated student seeking an entry-level position. Strong problem-solving abilities and passion for emerging technologies.'}
                </p>
              </div>
            )}

            <Card className="bg-primary/5 border-primary/20 p-4">
              <div className="flex gap-3 items-start">
                <Sparkles className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div className="space-y-1 text-xs">
                  <p className="font-medium text-foreground">SEO Indexing Active</p>
                  <p className="text-muted-foreground">
                    Your portfolio dynamically generates OpenGraph tags, JSON-LD structured data, and XML sitemaps for maximum search engine visibility.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <SharePortfolioModal
        open={shareModalOpen}
        onOpenChange={setShareModalOpen}
        portfolioTitle={title}
        portfolioSummary={description}
        username={portfolio.username}
        accentColor={accentColor}
      />
    </div>
  )
}

