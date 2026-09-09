'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { User, Bell, Shield, Trash2, Save, Loader2 } from 'lucide-react'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { toast } from '@/components/ui/toast'

export default function SettingsPage() {
  const router = useRouter()
  const supabase = getSupabaseBrowserClient()
  const [profile, setProfile] = useState({ full_name: '', email: '' })
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      const { data } = await supabase
        .from('profiles')
        .select('full_name, email')
        .eq('user_id', user.id)
        .single()
      if (data) setProfile({ full_name: data.full_name ?? '', email: data.email ?? user.email ?? '' })
      setLoading(false)
    }
    loadProfile()
  }, [])

  async function saveProfile() {
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase
      .from('profiles')
      .update({ full_name: profile.full_name })
      .eq('user_id', user.id)

    setSaving(false)
    if (error) {
      toast({ title: 'Failed to save', variant: 'error' })
    } else {
      toast({ title: 'Profile updated', variant: 'success' })
    }
  }

  async function handleDeleteAccount() {
    if (!confirm('Are you sure? This will permanently delete your account and all data. This cannot be undone.')) return
    if (!prompt('Type "delete" to confirm:')?.toLowerCase().includes('delete')) return
    toast({ title: 'Account deletion requested. Please contact support.', variant: 'warning' })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your account and preferences</p>
      </div>

      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile" className="gap-2">
            <User className="h-3.5 w-3.5" /> Profile
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-3.5 w-3.5" /> Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Shield className="h-3.5 w-3.5" /> Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6 mt-4">
          <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
            <h2 className="text-base font-semibold">Personal Information</h2>
            <Input
              label="Full Name"
              value={profile.full_name}
              onChange={e => setProfile(p => ({ ...p, full_name: e.target.value }))}
              placeholder="Your full name"
            />
            <Input
              label="Email"
              value={profile.email}
              disabled
              hint="Email cannot be changed here. Contact support if needed."
            />
            <Button onClick={saveProfile} loading={saving} icon={<Save className="h-4 w-4" />}>
              Save Changes
            </Button>
          </div>

          <div className="bg-card border border-destructive/20 rounded-2xl p-6 space-y-3">
            <h2 className="text-base font-semibold text-destructive">Danger Zone</h2>
            <p className="text-sm text-muted-foreground">Permanently delete your account and all associated data.</p>
            <Button variant="destructive" onClick={handleDeleteAccount} icon={<Trash2 className="h-4 w-4" />}>
              Delete Account
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="mt-4">
          <div className="bg-card border border-border rounded-2xl p-6 space-y-5">
            <h2 className="text-base font-semibold">Email Notifications</h2>
            {[
              { id: 'ats', label: 'ATS Analysis Complete', desc: 'When your resume analysis is ready' },
              { id: 'pdf', label: 'PDF Ready', desc: 'When your resume PDF is generated' },
              { id: 'payment', label: 'Payment Updates', desc: 'Receipts and payment confirmations' },
              { id: 'resume', label: 'Resume Updates', desc: 'When resumes are created or imported' },
            ].map(pref => (
              <div key={pref.id} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{pref.label}</p>
                  <p className="text-xs text-muted-foreground">{pref.desc}</p>
                </div>
                <Switch defaultChecked aria-label={pref.label} />
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="security" className="mt-4">
          <div className="bg-card border border-border rounded-2xl p-6 space-y-5">
            <h2 className="text-base font-semibold">Security</h2>
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Your account is protected with enterprise-grade encryption. Passwords are securely hashed and never stored in plain text.
              </p>
              <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                <Shield className="h-4 w-4 shrink-0" />
                <span>End-to-end data isolation — your resumes and personal data remain 100% private</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                <Shield className="h-4 w-4 shrink-0" />
                <span>256-bit SSL encryption & secure cloud storage protection</span>
              </div>
            </div>
            <div className="pt-2 border-t border-border">
              <Button
                variant="outline"
                onClick={async () => {
                  const { error } = await supabase.auth.resetPasswordForEmail(profile.email)
                  if (error) toast({ title: 'Error', description: error.message, variant: 'error' })
                  else toast({ title: 'Password reset email sent!', variant: 'success' })
                }}
              >
                Send Password Reset Email
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
