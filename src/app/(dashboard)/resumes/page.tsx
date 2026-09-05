import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { checkResumeCreationEligibility } from '@/lib/payments/payment-service'
import { Plus, Upload, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ResumeCard } from '@/components/dashboard/ResumeCard'
import { EligibilityBanner } from '@/components/dashboard/EligibilityBanner'
import { Badge } from '@/components/ui/badge'

export const metadata = { title: 'My Resumes' }

export default async function ResumesPage() {
  const supabase = await getSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [resumesResult, eligibility] = await Promise.all([
    supabase
      .from('resumes')
      .select('id, name, template_id, ats_score, updated_at, is_public, public_slug, public_views')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false }),
    checkResumeCreationEligibility(user.id),
  ])

  const resumes = resumesResult.data ?? []
  const freeRemaining = Math.max(0, 3 - eligibility.free_count)

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Resumes</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {resumes.length} resume{resumes.length !== 1 ? 's' : ''} · {freeRemaining > 0 ? `${freeRemaining} free slot${freeRemaining > 1 ? 's' : ''} remaining` : 'Free slots used'}
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/resumes/import">
            <Button variant="outline" className="gap-2">
              <Upload className="h-4 w-4" /> Import Resume
            </Button>
          </Link>
          {eligibility.can_create && (
            <Link href="/resumes/new">
              <Button className="gap-2">
                <Plus className="h-4 w-4" /> New Resume
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Eligibility banner */}
      <EligibilityBanner eligibility={eligibility} />

      {/* Resume grid */}
      {resumes.length === 0 ? (
        <div className="border-2 border-dashed border-border rounded-2xl p-16 text-center">
          <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
            <FileText className="h-7 w-7 text-primary" />
          </div>
          <h2 className="text-lg font-semibold mb-2">No resumes yet</h2>
          <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
            Create your first resume with AI assistance or import an existing PDF/Word document.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/resumes/new">
              <Button className="gap-2 w-full sm:w-auto">
                <Plus className="h-4 w-4" /> Create with AI
              </Button>
            </Link>
            <Link href="/resumes/import">
              <Button variant="outline" className="gap-2 w-full sm:w-auto">
                <Upload className="h-4 w-4" /> Import existing
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {resumes.map(resume => (
            <ResumeCard key={resume.id} resume={resume} />
          ))}
          {eligibility.can_create && (
            <Link href="/resumes/new">
              <div className="border-2 border-dashed border-border rounded-xl p-6 h-full min-h-[220px] flex flex-col items-center justify-center gap-3 hover:border-primary/40 hover:bg-primary/5 transition-all cursor-pointer group">
                <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                  <Plus className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-muted-foreground group-hover:text-primary transition-colors">Create New Resume</p>
                  {freeRemaining > 0 && (
                    <p className="text-xs text-muted-foreground mt-0.5">{freeRemaining} free slot{freeRemaining > 1 ? 's' : ''} left</p>
                  )}
                </div>
              </div>
            </Link>
          )}
        </div>
      )}
    </div>
  )
}
