import { redirect } from 'next/navigation'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { DashboardNav } from '@/components/layout/DashboardNav'
import { MobileNav } from '@/components/layout/MobileNav'
import { Toaster } from '@/components/ui/toast'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await getSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // Redirect to onboarding if not completed
  const { data: profile } = await supabase
    .from('profiles')
    .select('onboarding_completed')
    .eq('user_id', user.id)
    .single()

  if (profile && !profile.onboarding_completed) {
    redirect('/onboarding')
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop sidebar */}
      <DashboardNav userId={user.id} />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen lg:ml-64">
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8">
          {children}
        </main>
      </div>

      {/* Mobile bottom nav */}
      <MobileNav />

      <Toaster />
    </div>
  )
}
