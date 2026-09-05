'use server'

import { getSupabaseServerClient, getSupabaseServiceClient } from '@/lib/supabase/server'
import type { CareerGoal, ExperienceLevel } from '@/types'

export async function completeOnboarding(goal: CareerGoal, experience: ExperienceLevel) {
  const supabase = await getSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { error: 'Not authenticated' }
  }

  // Use the service client to bypass RLS. This ensures that even if the 
  // database trigger failed to create the profile row initially, we can 
  // confidently upsert the row without being blocked by RLS policies.
  const serviceClient = getSupabaseServiceClient()
  
  const { error } = await serviceClient.from('profiles').upsert({
    user_id: user.id,
    email: user.email ?? '',
    career_goal: goal,
    experience_level: experience,
    onboarding_completed: true,
  }, { onConflict: 'user_id' })

  if (error) {
    console.error('[Onboarding] Error:', error)
    return { error: error.message }
  }

  return { success: true }
}
