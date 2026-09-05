'use server'

import { getSupabaseServiceClient, getSupabaseServerClient } from '@/lib/supabase/server'
import type { Profile, UserFile, Resume } from '@/types'

export async function claimUsernameAction(username: string) {
  const supabase = await getSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  // Check if username is taken
  const serviceClient = getSupabaseServiceClient()
  const { data: existing } = await serviceClient
    .from('profiles')
    .select('id')
    .eq('username', username.toLowerCase())
    .single()

  if (existing) {
    return { error: 'Username is already taken. Please choose another.' }
  }

  const { error } = await supabase
    .from('profiles')
    .update({ username: username.toLowerCase() })
    .eq('user_id', user.id)

  if (error) return { error: error.message }
  return { success: true, username: username.toLowerCase() }
}

export async function getPublicPortfolio(username: string) {
  // Use service client to bypass RLS for public access
  const supabase = getSupabaseServiceClient()

  // 1. Fetch the user profile by username
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username.toLowerCase())
    .single()

  if (profileError || !profile) {
    return { error: 'Portfolio not found.' }
  }

  // 2. Fetch the user's latest Resume to build the portfolio
  const { data: resumes } = await supabase
    .from('resumes')
    .select('*')
    .eq('user_id', profile.user_id)
    .order('updated_at', { ascending: false })
    .limit(1)
    
  const resume = resumes && resumes.length > 0 ? (resumes[0] as Resume) : null

  // 3. Fetch all certificates for this user
  const { data: files } = await supabase
    .from('user_files')
    .select('*')
    .eq('user_id', profile.user_id)
    .eq('category', 'certificates')
    .order('created_at', { ascending: false })

  // 4. Generate signed URLs for the files so they can be viewed publicly
  const filesWithUrls = files ? await Promise.all(
    (files as UserFile[]).map(async (file) => {
      const { data } = await supabase.storage
        .from('user_files')
        .createSignedUrl(file.storage_path, 3600) // 1 hour expiry

      return {
        ...file,
        public_url: data?.signedUrl || null,
      }
    })
  ) : []

  return {
    profile: profile as Profile & { username?: string },
    resume,
    items: filesWithUrls,
  }
}
