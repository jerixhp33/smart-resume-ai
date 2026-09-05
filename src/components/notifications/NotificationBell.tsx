'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Bell, X, CheckCheck } from 'lucide-react'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import { formatRelativeTime } from '@/utils/format'
import type { Notification } from '@/types'
import { cn } from '@/utils/cn'

interface NotificationBellProps {
  userId: string
}

export function NotificationBell({ userId }: NotificationBellProps) {
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const supabase = getSupabaseBrowserClient()

  const unreadCount = notifications.filter(n => !n.is_read).length

  const fetchNotifications = useCallback(async () => {
    const { data } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(20)
    if (data) setNotifications(data as Notification[])
  }, [userId, supabase])

  // Initial fetch
  useEffect(() => { fetchNotifications() }, [fetchNotifications])

  // Supabase Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel(`notifications:${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          setNotifications(prev => [payload.new as Notification, ...prev])
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [userId, supabase])

  async function markRead(id: string) {
    await fetch('/api/notifications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notificationId: id }),
    })
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, is_read: true } : n)
    )
  }

  async function markAllRead() {
    await fetch('/api/notifications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ markAll: true }),
    })
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
  }

  const typeIcon: Record<string, string> = {
    ats_complete: '📊',
    pdf_ready: '📄',
    payment_success: '✅',
    payment_failed: '❌',
    cooldown_complete: '⏰',
    tailoring_complete: '✨',
    welcome: '🎉',
    security_alert: '🔒',
    general: '🔔',
  }

  return (
    <div className="relative w-full">
      <button
        onClick={() => setOpen(!open)}
        className="relative flex items-center gap-3 w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
      >
        <Bell className="h-4 w-4" />
        <span className="font-medium">Notifications</span>
        {unreadCount > 0 && (
          <span className="ml-auto h-5 w-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />

          {/* Panel */}
          <div className="absolute bottom-full left-0 mb-2 w-80 bg-popover border border-border rounded-xl shadow-xl z-50 animate-in">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <h3 className="text-sm font-semibold">Notifications</h3>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-xs text-primary hover:underline flex items-center gap-1"
                  >
                    <CheckCheck className="h-3 w-3" /> Mark all read
                  </button>
                )}
                <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="text-center py-8 text-sm text-muted-foreground">
                  <Bell className="h-8 w-8 mx-auto mb-2 opacity-30" />
                  No notifications yet
                </div>
              ) : (
                notifications.map(n => (
                  <button
                    key={n.id}
                    onClick={() => markRead(n.id)}
                    className={cn(
                      'w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-muted transition-colors border-b border-border/50 last:border-0',
                      !n.is_read && 'bg-primary/5'
                    )}
                  >
                    <span className="text-lg flex-shrink-0 mt-0.5">
                      {typeIcon[n.type] ?? '🔔'}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className={cn('text-xs font-medium truncate', !n.is_read && 'text-foreground')}>
                        {n.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{n.message}</p>
                      <p className="text-[10px] text-muted-foreground mt-1">
                        {formatRelativeTime(n.created_at)}
                      </p>
                    </div>
                    {!n.is_read && (
                      <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-1.5" />
                    )}
                  </button>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
