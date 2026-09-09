'use server'

import { getSupabaseServiceClient, getSupabaseServerClient } from '@/lib/supabase/server'
import type { Profile, UserFile, Resume, PortfolioSite, PortfolioTemplateId, PortfolioThemeId, MotionLevel, PortfolioContent } from '@/types'
import { generateAIPortfolio } from '@/lib/ai/portfolio-generator'
import { mapResumeToPortfolioContent } from '@/lib/portfolio/mapper'
import { revalidatePath } from 'next/cache'

export async function claimUsernameAction(username: string) {
  const supabase = await getSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const cleanUsername = username.toLowerCase().trim().replace(/[^a-z0-9-]/g, '')
  if (cleanUsername.length < 3) {
    return { error: 'Username must be at least 3 characters long.' }
  }

  // Check reserved words
  const reserved = ['admin', 'api', 'dashboard', 'settings', 'portfolio', 'builder', 'create', 'login', 'signup', 'auth']
  if (reserved.includes(cleanUsername)) {
    return { error: 'This username is reserved.' }
  }

  // Check if username is taken
  const serviceClient = getSupabaseServiceClient()
  const { data: existing } = await serviceClient
    .from('profiles')
    .select('id, user_id')
    .eq('username', cleanUsername)
    .maybeSingle()

  if (existing && existing.user_id !== user.id) {
    return { error: 'Username is already taken. Please choose another.' }
  }

  // Update profile
  const { error: profileErr } = await supabase
    .from('profiles')
    .update({ username: cleanUsername })
    .eq('user_id', user.id)

  if (profileErr) return { error: profileErr.message }

  // Update existing portfolio site if present
  await supabase
    .from('portfolio_sites')
    .update({ username: cleanUsername, slug: cleanUsername })
    .eq('user_id', user.id)

  return { success: true, username: cleanUsername }
}

export async function checkUsernameAvailability(username: string) {
  const clean = username.toLowerCase().trim().replace(/[^a-z0-9-]/g, '')
  if (clean.length < 3) return { available: false, reason: 'Too short' }

  const reserved = ['admin', 'api', 'dashboard', 'settings', 'portfolio', 'builder', 'create', 'login', 'signup', 'auth']
  if (reserved.includes(clean)) return { available: false, reason: 'Reserved' }

  const serviceClient = getSupabaseServiceClient()
  const { data } = await serviceClient
    .from('profiles')
    .select('id')
    .eq('username', clean)
    .maybeSingle()

  return { available: !data, username: clean }
}

export async function createPortfolioFromResumeAction(params: {
  resumeId?: string
  template?: PortfolioTemplateId
  motionLevel?: MotionLevel
  theme?: PortfolioThemeId
}) {
  const supabase = await getSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  // 1. Get user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .single()

  // Ensure username exists
  let username = profile?.username
  if (!username) {
    const defaultUsername = `user-${user.id.slice(0, 8)}`
    username = defaultUsername
    await supabase.from('profiles').update({ username: defaultUsername }).eq('user_id', user.id)
  }

  // 2. Fetch selected or latest resume
  let resumeData: any = {}
  if (params.resumeId) {
    const { data: res } = await supabase.from('resumes').select('*').eq('id', params.resumeId).single()
    resumeData = res?.data || {}
  } else {
    const { data: resumes } = await supabase
      .from('resumes')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })
      .limit(1)
    if (resumes && resumes.length > 0) {
      resumeData = resumes[0].data || {}
    }
  }

  // 3. Generate portfolio content using Groq AI (with Zod schema & fallback)
  const portfolioContent = await generateAIPortfolio(resumeData, profile, user.id)

  const template = params.template || 'modern'
  const motionLevel = params.motionLevel || 'smooth'
  const theme = params.theme || 'indigo'
  const title = `${portfolioContent.hero.full_name} | Portfolio`

  const seoMetadata = {
    title,
    description: portfolioContent.hero.summary,
    keywords: [portfolioContent.hero.full_name, portfolioContent.hero.title, 'portfolio', 'resume'],
  }

  // 4. Upsert portfolio site record in Supabase
  const serviceClient = getSupabaseServiceClient()
  const { data: site, error } = await serviceClient
    .from('portfolio_sites')
    .upsert(
      {
        user_id: user.id,
        username,
        slug: username,
        title,
        theme,
        template,
        motion_level: motionLevel,
        content: portfolioContent,
        seo_metadata: seoMetadata,
        published: true,
      },
      { onConflict: 'user_id' }
    )
    .select()
    .single()

  if (error) {
    console.error('Failed to save portfolio_site:', error)
    return { error: error.message }
  }

  revalidatePath('/portfolio')
  return { success: true, portfolio: site as PortfolioSite }
}

export async function getUserPortfolioAction() {
  const supabase = await getSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { data: site } = await supabase
    .from('portfolio_sites')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle()

  return { portfolio: site as PortfolioSite | null }
}

export async function getPortfolioByIdAction(portfolioId: string) {
  const supabase = await getSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { data: site, error } = await supabase
    .from('portfolio_sites')
    .select('*')
    .eq('id', portfolioId)
    .eq('user_id', user.id)
    .single()

  if (error || !site) return { error: 'Portfolio not found' }
  return { portfolio: site as PortfolioSite }
}

export async function savePortfolioContentAction(params: {
  portfolioId: string
  content: PortfolioContent
  theme?: PortfolioThemeId
  template?: PortfolioTemplateId
  motionLevel?: MotionLevel
  title?: string
}) {
  const supabase = await getSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const updateData: any = {
    content: params.content,
    updated_at: new Date().toISOString(),
  }

  if (params.theme) updateData.theme = params.theme
  if (params.template) updateData.template = params.template
  if (params.motionLevel) updateData.motion_level = params.motionLevel
  if (params.title) updateData.title = params.title

  const { error } = await supabase
    .from('portfolio_sites')
    .update(updateData)
    .eq('id', params.portfolioId)
    .eq('user_id', user.id)

  if (error) return { error: error.message }
  return { success: true }
}

export async function publishPortfolioAction(portfolioId: string, published: boolean) {
  const supabase = await getSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { error } = await supabase
    .from('portfolio_sites')
    .update({ published, updated_at: new Date().toISOString() })
    .eq('id', portfolioId)
    .eq('user_id', user.id)

  if (error) return { error: error.message }
  revalidatePath('/portfolio')
  return { success: true, published }
}

export async function getPublicPortfolio(username: string) {
  const supabase = getSupabaseServiceClient()
  const cleanUsername = username.toLowerCase()

  // 1 & 2. Fetch portfolio_sites and profiles in parallel for maximum performance
  const [siteRes, profileRes] = await Promise.all([
    supabase.from('portfolio_sites').select('id, user_id, username, slug, title, theme, template, motion_level, content, seo_metadata, published, created_at, updated_at').eq('username', cleanUsername).maybeSingle(),
    supabase.from('profiles').select('full_name, username, avatar_url, bio, headline, user_id').eq('username', cleanUsername).maybeSingle(),
  ])

  const site = siteRes.data
  const profile = profileRes.data

  // 3. Fetch latest resume (only public-safe fields)
  let resume: Resume | null = null
  if (profile) {
    const { data: resumes } = await supabase
      .from('resumes')
      .select('id, name, template_id, data, ats_score, created_at, updated_at')
      .eq('user_id', profile.user_id)
      .order('updated_at', { ascending: false })
      .limit(1)
    if (resumes && resumes.length > 0) {
      resume = resumes[0] as Resume
    }
  }

  // 4. Fetch user certificates/files (only public-safe fields)
  let filesWithUrls: UserFile[] = []
  if (profile) {
    const { data: files } = await supabase
      .from('user_files')
      .select('id, name, original_name, storage_path, size, mime_type, category, created_at')
      .eq('user_id', profile.user_id)
      .order('created_at', { ascending: false })

    if (files && files.length > 0) {
      filesWithUrls = (files as UserFile[]).map((file) => {
        const publicUrlData = supabase.storage
          .from('user_files')
          .getPublicUrl(file.storage_path)
        return { ...file, public_url: publicUrlData?.data?.publicUrl || null } as UserFile & { public_url: string | null }
      })
    }
  }

  return {
    site: site as PortfolioSite | null,
    profile: profile as Profile | null,
    resume,
    items: filesWithUrls,
  }
}

export async function trackPortfolioViewAction(portfolioId: string, referrer?: string, userAgent?: string) {
  const supabase = getSupabaseServiceClient()
  try {
    await supabase.from('portfolio_views').insert({
      portfolio_id: portfolioId,
      referrer: referrer || null,
      user_agent: userAgent || null,
    })
  } catch {
    // Analytics failures must not break user experience
  }
}

export async function getPortfolioAnalyticsAction(portfolioId: string) {
  const supabase = await getSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  // Use count query for total (efficient — doesn't load all rows)
  const { count: totalViews } = await supabase
    .from('portfolio_views')
    .select('*', { count: 'exact', head: true })
    .eq('portfolio_id', portfolioId)

  // Fetch only recent views for display
  const { data: recentViews } = await supabase
    .from('portfolio_views')
    .select('id, referrer, user_agent, created_at')
    .eq('portfolio_id', portfolioId)
    .order('created_at', { ascending: false })
    .limit(100)

  const referrersMap: Record<string, number> = {}
  recentViews?.forEach((v) => {
    const ref = v.referrer || 'Direct / Bookmark'
    referrersMap[ref] = (referrersMap[ref] || 0) + 1
  })

  const referrersList = Object.entries(referrersMap)
    .map(([source, count]) => ({ source, count }))
    .sort((a, b) => b.count - a.count)

  return {
    totalViews: totalViews ?? 0,
    recentViews: (recentViews || []).slice(0, 20),
    topReferrers: referrersList.slice(0, 10),
  }
}

// ── Update Portfolio SEO & Social Settings ───────────────
export async function updatePortfolioSEOSettingsAction(params: {
  portfolioId: string
  title: string
  description: string
  keywords: string[]
  ogImage?: string
  accentColor?: string
}) {
  const supabase = await getSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { data: site } = await supabase
    .from('portfolio_sites')
    .select('seo_metadata')
    .eq('id', params.portfolioId)
    .eq('user_id', user.id)
    .single()

  if (!site) return { error: 'Portfolio not found' }

  const updatedSeo = {
    ...(site.seo_metadata || {}),
    title: params.title,
    description: params.description,
    keywords: params.keywords,
    og_image: params.ogImage || undefined,
    accent_color: params.accentColor || undefined,
  }

  const { error } = await supabase
    .from('portfolio_sites')
    .update({
      title: params.title,
      seo_metadata: updatedSeo,
    })
    .eq('id', params.portfolioId)
    .eq('user_id', user.id)

  if (error) return { error: error.message }
  revalidatePath('/portfolio')
  revalidatePath(`/portfolio/settings/${params.portfolioId}`)
  return { success: true }
}

// ── Upload Portfolio OG Image Direct ────────────────────
export async function uploadPortfolioOGImageAction(formData: FormData) {
  const supabase = await getSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const file = formData.get('file') as File
  if (!file) return { error: 'No file provided' }

  const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/gif']
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { error: 'Invalid file type. Please upload a PNG, JPEG, WebP, or GIF image.' }
  }

  if (file.size > 5 * 1024 * 1024) {
    return { error: 'Image file size must be less than 5MB.' }
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
  const storagePath = `${user.id}/og_${Date.now()}_${safeName}`

  const { error: uploadError } = await supabase.storage
    .from('user_files')
    .upload(storagePath, file, {
      upsert: true,
      contentType: file.type,
    })

  if (uploadError) {
    console.error('OG Image upload failed:', uploadError)
    return { error: 'Failed to upload image. Please try again.' }
  }

  // Return proxied native asset URL (masks Supabase infrastructure URL)
  return { publicUrl: `/api/assets/${storagePath}` }
}




