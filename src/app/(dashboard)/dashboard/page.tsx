import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { checkResumeCreationEligibility } from '@/lib/payments/payment-service'
import { Plus, Sparkles, Upload, ScanSearch, Zap, TrendingUp, ArrowRight, Clock, Globe, Wand2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ResumeCard } from '@/components/dashboard/ResumeCard'
import { EligibilityBanner } from '@/components/dashboard/EligibilityBanner'
import { formatRelativeTime, formatATSScore } from '@/utils/format'

export const metadata = { title: 'Dashboard' }

export default async function DashboardPage() {
  const supabase = await getSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [profileResult, resumesResult, eligibility] = await Promise.all([
    supabase.from('profiles').select('full_name, career_goal').eq('user_id', user.id).single(),
    supabase.from('resumes')
      .select('id, name, template_id, ats_score, updated_at, is_public, public_slug, public_views')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })
      .limit(6),
    checkResumeCreationEligibility(user.id),
  ])

  const profile = profileResult.data
  const resumes = resumesResult.data ?? []
  const greeting = getGreeting()
  const firstName = profile?.full_name?.split(' ')[0] ?? 'there'

  // Compute overall health score
  const avgATS = resumes.length > 0
    ? Math.round(resumes.reduce((s, r) => s + (r.ats_score ?? 0), 0) / resumes.length)
    : null

  const QUICK_ACTIONS = [
    { label: 'AI Code Studio', href: '/code-studio', icon: Wand2, color: 'text-purple-500 bg-purple-50 dark:bg-purple-950/30' },
    { label: 'Create with AI', href: '/resumes/new', icon: Sparkles, color: 'text-purple-500 bg-purple-50 dark:bg-purple-950/30' },
    { label: 'Upload Resume', href: '/resumes/import', icon: Upload, color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/30' },
    { label: 'Analyze Job', href: '/analyzer', icon: ScanSearch, color: 'text-green-500 bg-green-50 dark:bg-green-950/30' },
  ]

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            {greeting}, {firstName} 👋
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {resumes.length === 0
              ? "Let's build your first resume."
              : `You have ${resumes.length} resume${resumes.length > 1 ? 's' : ''}. Keep improving!`}
          </p>
        </div>
        <Link href="/resumes/new">
          <Button className="gap-2 h-10 shadow-sm">
            <Plus className="h-4 w-4" />
            Create Resume
          </Button>
        </Link>
      </div>

      {/* Eligibility banner (cooldown / locked) */}
      <EligibilityBanner eligibility={eligibility} />

      {/* Quick actions */}
      <section>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {QUICK_ACTIONS.map(action => (
            <Link key={action.href} href={action.href}>
              <div className="bg-card border border-border rounded-xl p-4 hover:shadow-sm hover:border-primary/20 transition-all cursor-pointer group">
                <div className={`h-9 w-9 rounded-lg flex items-center justify-center mb-3 ${action.color}`}>
                  <action.icon className="h-4 w-4" />
                </div>
                <p className="text-sm font-medium group-hover:text-primary transition-colors">{action.label}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Resume health */}
      {avgATS !== null && (
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold">Resume Health Score</p>
                <p className="text-xs text-muted-foreground">Average ATS score across all resumes</p>
              </div>
            </div>
            <div className="text-right">
              <p className={`text-3xl font-bold ${formatATSScore(avgATS).color}`}>{avgATS}</p>
              <p className="text-xs text-muted-foreground">/100</p>
            </div>
          </div>
        </Card>
      )}

      {/* Resumes */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold">My Resumes</h2>
          {resumes.length > 0 && (
            <Link href="/resumes" className="text-sm text-primary hover:underline flex items-center gap-1">
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>

        {resumes.length === 0 ? (
          <div className="border-2 border-dashed border-border rounded-xl p-12 text-center">
            <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center mx-auto mb-4">
              <Plus className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="font-medium mb-1">No resumes yet</p>
            <p className="text-sm text-muted-foreground mb-4">Create your first resume and let AI help you shine.</p>
            <Link href="/resumes/new">
              <Button>Create my first resume</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {resumes.map(resume => (
              <ResumeCard key={resume.id} resume={resume} />
            ))}
            {eligibility.can_create && (
              <Link href="/resumes/new" className="border-2 border-dashed border-border rounded-xl p-6 flex flex-col items-center justify-center gap-2 hover:border-primary/40 hover:bg-primary/5 transition-all cursor-pointer group">
                <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                  <Plus className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                </div>
                <p className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">New Resume</p>
              </Link>
            )}
          </div>
        )}
      </section>
    </div>
  )
}

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}
