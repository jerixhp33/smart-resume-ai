// ============================================================
// SmartResume AI — Notification Service (SERVER-SIDE ONLY)
// Creates in-app (Supabase) + SMTP email notifications
// ============================================================

import { getSupabaseServiceClient } from '@/lib/supabase/server'
import type { NotificationType } from '@/types'

export interface CreateNotificationParams {
  userId: string
  type: NotificationType
  title: string
  message: string
  data?: Record<string, unknown>
  sendEmail?: boolean
  userEmail?: string
}

export async function createNotification(params: CreateNotificationParams): Promise<void> {
  const supabase = getSupabaseServiceClient()

  // Create in-app notification (Supabase Realtime will push to client)
  const { error } = await supabase.from('notifications').insert({
    user_id: params.userId,
    type: params.type,
    title: params.title,
    message: params.message,
    data: params.data ?? {},
    is_read: false,
  })

  if (error) {
    console.error('[Notifications] Failed to create in-app notification:', error)
  }

  // Send email if requested and email is available
  if (params.sendEmail && params.userEmail) {
    try {
      const { sendEmailNotification } = await import('./emailNotification')
      await sendEmailNotification({
        to: params.userEmail,
        type: params.type,
        title: params.title,
        message: params.message,
        data: params.data,
      })
    } catch (emailError) {
      // Non-critical: log but don't fail the notification
      console.error('[Notifications] Email send failed:', emailError)
    }
  }
}

export async function markNotificationRead(
  notificationId: string,
  userId: string
): Promise<void> {
  const supabase = getSupabaseServiceClient()
  await supabase
    .from('notifications')
    .update({ is_read: true, read_at: new Date().toISOString() })
    .eq('id', notificationId)
    .eq('user_id', userId) // Security: ensure ownership
}

export async function markAllNotificationsRead(userId: string): Promise<void> {
  const supabase = getSupabaseServiceClient()
  await supabase
    .from('notifications')
    .update({ is_read: true, read_at: new Date().toISOString() })
    .eq('user_id', userId)
    .eq('is_read', false)
}
