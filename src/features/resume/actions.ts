'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { getSupabaseServerClient, getSupabaseServiceClient } from '@/lib/supabase/server'
import { checkResumeCreationEligibility } from '@/lib/payments/payment-service'
import { createNotification } from '@/lib/notifications/createNotification'
import { parseResumeText } from '@/features/ai/actions'
import type { ResumeData, TemplateId } from '@/types'
import { createDefaultResumeData } from '@/utils/defaultResumeData'
import { z } from 'zod'

// ── Auth helper ─────────────────────────────────────────
async function requireAuth() {
  const supabase = await getSupabaseServerClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) redirect('/login')
  return user
}

// ── Create Resume ────────────────────────────────────────
export async function createResume(params?: {
  name?: string
  templateId?: TemplateId
  data?: Partial<ResumeData>
}) {
  const user = await requireAuth()
  const serviceClient = getSupabaseServiceClient()

  // Server-side entitlement check — never trust client
  const eligibility = await checkResumeCreationEligibility(user.id)

  if (!eligibility.can_create) {
    if (eligibility.reason === 'cooldown_active') {
      return {
        error: 'cooldown',
        cooldown_expires_at: eligibility.cooldown_expires_at,
        next_unlock_option: eligibility.next_unlock_option,
      }
    }
    return { error: 'no_credits' }
  }

  const resumeData = createDefaultResumeData(params?.data as ResumeData | undefined)

  const { data: resume, error } = await serviceClient
    .from('resumes')
    .insert({
      user_id: user.id,
      name: params?.name ?? 'My Resume',
      template_id: params?.templateId ?? 'ats-classic',
      data: resumeData as unknown as Record<string, unknown>,
    })
    .select()
    .single()

  if (error || !resume) {
    console.error('[Resume] Create failed:', error)
    return { error: 'Failed to create resume. Please try again.' }
  }

  // Create initial version
  await serviceClient.from('resume_versions').insert({
    resume_id: resume.id,
    version_number: 1,
    description: 'Initial version',
    data: resumeData as unknown as Record<string, unknown>,
  })

  // Update free resume count in entitlements
  if (eligibility.reason === 'free') {
    await serviceClient
      .from('user_entitlements')
      .upsert(
        { user_id: user.id, free_resume_count: eligibility.free_count + 1 },
        { onConflict: 'user_id' }
      )
  }

  // Deduct paid credit if used
  if (eligibility.reason === 'paid_credits' || eligibility.reason === 'cooldown_expired') {
    // Only deduct if it was a paid credit
    if (eligibility.paid_credits > 0) {
      await serviceClient.rpc('deduct_paid_resume_credit', { p_user_id: user.id })
    }
  }

  await createNotification({
    userId: user.id,
    type: 'general',
    title: 'Resume Created',
    message: `"${params?.name ?? 'My Resume'}" has been created. Start editing it now!`,
  })

  revalidatePath('/resumes')
  revalidatePath('/dashboard')

  return { success: true, resumeId: resume.id }
}

// ── Autosave Resume ──────────────────────────────────────
export async function autosaveResume(params: {
  resumeId: string
  data: ResumeData
  name: string
  templateId: TemplateId
}) {
  const user = await requireAuth()
  const serviceClient = getSupabaseServiceClient()

  // Verify ownership — never trust client-provided user_id
  const { data: existing } = await serviceClient
    .from('resumes')
    .select('id, user_id')
    .eq('id', params.resumeId)
    .eq('user_id', user.id) // RLS enforced at DB too
    .single()

  if (!existing) return { error: 'Resume not found or access denied' }

  const { error } = await serviceClient
    .from('resumes')
    .update({
      data: params.data as unknown as Record<string, unknown>,
      name: params.name,
      template_id: params.templateId,
    })
    .eq('id', params.resumeId)
    .eq('user_id', user.id)

  if (error) return { error: 'Autosave failed' }

  return { success: true, savedAt: new Date().toISOString() }
}

// ── Save Version ─────────────────────────────────────────
export async function saveResumeVersion(params: {
  resumeId: string
  description?: string
}) {
  const user = await requireAuth()
  const serviceClient = getSupabaseServiceClient()

  // Verify ownership
  const { data: resume } = await serviceClient
    .from('resumes')
    .select('id, data')
    .eq('id', params.resumeId)
    .eq('user_id', user.id)
    .single()

  if (!resume) return { error: 'Resume not found' }

  // Get next version number
  const { data: versions } = await serviceClient
    .from('resume_versions')
    .select('version_number')
    .eq('resume_id', params.resumeId)
    .order('version_number', { ascending: false })
    .limit(1)

  const nextVersion = (versions?.[0]?.version_number ?? 0) + 1

  const { error } = await serviceClient.from('resume_versions').insert({
    resume_id: params.resumeId,
    version_number: nextVersion,
    description: params.description ?? `Version ${nextVersion}`,
    data: resume.data,
  })

  if (error) return { error: 'Failed to save version' }

  return { success: true, versionNumber: nextVersion }
}

// ── Restore Version ──────────────────────────────────────
export async function restoreResumeVersion(params: {
  resumeId: string
  versionId: string
}) {
  const user = await requireAuth()
  const serviceClient = getSupabaseServiceClient()

  // Verify ownership of resume
  const { data: resume } = await serviceClient
    .from('resumes')
    .select('id')
    .eq('id', params.resumeId)
    .eq('user_id', user.id)
    .single()

  if (!resume) return { error: 'Resume not found' }

  // Get version
  const { data: version } = await serviceClient
    .from('resume_versions')
    .select('data')
    .eq('id', params.versionId)
    .eq('resume_id', params.resumeId)
    .single()

  if (!version) return { error: 'Version not found' }

  // Save current as new version before restoring
  await saveResumeVersion({
    resumeId: params.resumeId,
    description: 'Auto-saved before restore',
  })

  // Restore
  await serviceClient
    .from('resumes')
    .update({ data: version.data })
    .eq('id', params.resumeId)
    .eq('user_id', user.id)

  revalidatePath(`/builder/${params.resumeId}`)
  return { success: true, data: version.data }
}

// ── Get Version Content for Diff Comparison ──────────────
export async function getResumeVersionContentAction(params: {
  resumeId: string
  versionId: string
}) {
  const user = await requireAuth()
  const serviceClient = getSupabaseServiceClient()

  const { data: version, error } = await serviceClient
    .from('resume_versions')
    .select('id, version_number, description, data, created_at')
    .eq('id', params.versionId)
    .eq('resume_id', params.resumeId)
    .single()

  if (error || !version) return { error: 'Version content not found' }
  return { version }
}


// ── Get User Resumes ─────────────────────────────────────
export async function getUserResumes() {
  const user = await requireAuth()
  const supabase = await getSupabaseServerClient()

  const { data, error } = await supabase
    .from('resumes')
    .select('id, name, template_id, ats_score, created_at, updated_at, is_public')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false })

  if (error) return { error: error.message, resumes: [] }
  return { resumes: data ?? [] }
}

// ── Get Single Resume ────────────────────────────────────
export async function getResume(resumeId: string) {
  const user = await requireAuth()
  const supabase = await getSupabaseServerClient()

  const { data, error } = await supabase
    .from('resumes')
    .select('*')
    .eq('id', resumeId)
    .eq('user_id', user.id)
    .single()

  if (error || !data) return { error: 'Resume not found' }
  return { resume: data }
}

// ── Duplicate Resume ─────────────────────────────────────
export async function duplicateResume(resumeId: string) {
  const user = await requireAuth()
  const serviceClient = getSupabaseServiceClient()

  const { data: original } = await serviceClient
    .from('resumes')
    .select('*')
    .eq('id', resumeId)
    .eq('user_id', user.id)
    .single()

  if (!original) return { error: 'Resume not found' }

  // Check eligibility for new resume
  const eligibility = await checkResumeCreationEligibility(user.id)
  if (!eligibility.can_create) {
    return { error: 'cooldown', cooldown_expires_at: eligibility.cooldown_expires_at }
  }

  const { data: copy, error } = await serviceClient
    .from('resumes')
    .insert({
      user_id: user.id,
      name: `${original.name} (Copy)`,
      template_id: original.template_id,
      data: original.data,
    })
    .select()
    .single()

  if (error) return { error: 'Failed to duplicate' }

  revalidatePath('/resumes')
  return { success: true, resumeId: copy.id }
}

// ── Delete Resume ────────────────────────────────────────
export async function deleteResume(resumeId: string) {
  const user = await requireAuth()
  const serviceClient = getSupabaseServiceClient()

  const { error } = await serviceClient
    .from('resumes')
    .delete()
    .eq('id', resumeId)
    .eq('user_id', user.id)

  if (error) return { error: 'Failed to delete resume' }

  revalidatePath('/resumes')
  revalidatePath('/dashboard')
  return { success: true }
}

// ── Update ATS Score ─────────────────────────────────────
export async function updateResumeATSScore(resumeId: string, score: number) {
  const user = await requireAuth()
  const serviceClient = getSupabaseServiceClient()

  await serviceClient
    .from('resumes')
    .update({ ats_score: score })
    .eq('id', resumeId)
    .eq('user_id', user.id)
}

// ── Toggle Public Sharing ────────────────────────────────
export async function toggleResumeSharing(resumeId: string, isPublic: boolean) {
  const user = await requireAuth()
  const serviceClient = getSupabaseServiceClient()

  let slug = null

  if (isPublic) {
    // Fetch resume data to get the name
    const { data: resumeRecord } = await serviceClient
      .from('resumes')
      .select('data')
      .eq('id', resumeId)
      .single()

    const resumeData = resumeRecord?.data as any
    const fullName = resumeData?.personal?.full_name || 'resume'
    
    // Create base slug
    const baseSlug = fullName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'resume'
    
    // Try base slug first, then append a short random suffix if taken
    const { data: existing } = await serviceClient
      .from('resumes')
      .select('id')
      .eq('public_slug', baseSlug)
      .neq('id', resumeId)
      .maybeSingle()

    slug = existing ? `${baseSlug}-${crypto.randomUUID().slice(0, 6)}` : baseSlug
  }

  const { error } = await serviceClient
    .from('resumes')
    .update({ is_public: isPublic, public_slug: slug })
    .eq('id', resumeId)
    .eq('user_id', user.id)

  if (error) return { error: 'Failed to update sharing' }
  return { success: true, slug }
}

// ── Import Resume via AI ──────────────────────────────────
export async function importResumeFromText(text: string) {
  // First extract the data via AI
  const parsed = await parseResumeText(text)
  if (parsed.error || !parsed.data) {
    return { error: parsed.error || 'Failed to parse resume text.' }
  }

  // Use the parsed data to create the resume
  const createResult = await createResume({
    name: 'Imported Resume',
    data: parsed.data
  })

  if (createResult.error) {
    return { error: createResult.error }
  }

  return { resumeId: createResult.resumeId }
}
