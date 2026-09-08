'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Mail, Lock, User, ArrowRight, Check } from 'lucide-react'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from '@/components/ui/toast'

const signupSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Include at least one uppercase letter')
    .regex(/[0-9]/, 'Include at least one number'),
  confirmPassword: z.string(),
}).refine(d => d.password === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})
type SignupForm = z.infer<typeof signupSchema>

export default function SignupPage() {
  const router = useRouter()
  const [done, setDone] = useState(false)
  const supabase = getSupabaseBrowserClient()

  // Pre-fetch dashboard route for zero-latency instant entry after creation
  useEffect(() => {
    router.prefetch('/dashboard')
  }, [router])

  const { register, handleSubmit, formState: { errors, isSubmitting }, watch } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
  })

  const password = watch('password', '')
  const strength = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ]
  const strengthScore = strength.filter(Boolean).length

  async function onSubmit(data: SignupForm) {
    // 1. Create user account
    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: { full_name: data.full_name },
      },
    })

    if (error) {
      toast({ title: 'Signup failed', description: error.message, variant: 'error' })
      return
    }

    // 2. Direct login & fast entry to home
    let session = authData.session
    if (!session) {
      const { data: loginData } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })
      session = loginData?.session
    }

    if (session?.user) {
      // Upsert profile and auto-complete onboarding so user enters home dashboard directly
      await supabase.from('profiles').upsert(
        {
          user_id: session.user.id,
          full_name: data.full_name,
          email: data.email,
          onboarding_completed: true,
        },
        { onConflict: 'user_id' }
      )

      toast({ title: 'Account Created!', description: 'Entering home dashboard...', variant: 'success' })
      router.push('/dashboard')
      router.refresh()
    } else {
      setDone(true)
    }
  }

  async function onGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback?redirect=/dashboard` },
    })
  }

  if (done) {
    return (
      <div className="w-full max-w-md">
        <div className="bg-card rounded-2xl border border-border p-8 shadow-sm text-center">
          <div className="h-14 w-14 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
            <Check className="h-7 w-7 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-xl font-bold mb-2">Check your email</h1>
          <p className="text-sm text-muted-foreground">
            We sent a confirmation link to your email address. Click it to activate your account.
          </p>
          <Link href="/login" className="mt-6 block">
            <Button variant="outline" className="w-full">Back to sign in</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md">
      <div className="bg-card rounded-2xl border border-border p-8 shadow-sm">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">Create your account</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Build ATS-optimized resumes and interactive portfolio in seconds.
          </p>
        </div>

        <Button type="button" variant="outline" className="w-full mb-5 h-11" onClick={onGoogle}
          icon={
            <svg viewBox="0 0 24 24" className="h-4 w-4">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
          }
        >
          Sign up with Google
        </Button>

        <div className="relative mb-5">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
          <div className="relative flex justify-center text-xs text-muted-foreground"><span className="bg-card px-3">or</span></div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <Input label="Full name" type="text" placeholder="Jane Smith" icon={<User className="h-4 w-4" />} error={errors.full_name?.message} autoComplete="name" {...register('full_name')} />
          <Input label="Email" type="email" placeholder="you@example.com" icon={<Mail className="h-4 w-4" />} error={errors.email?.message} autoComplete="email" {...register('email')} />
          <div>
            <Input label="Password" type="password" placeholder="8+ characters" icon={<Lock className="h-4 w-4" />} error={errors.password?.message} autoComplete="new-password" {...register('password')} />
            {password && (
              <div className="mt-2 flex gap-1">
                {[1,2,3,4].map(i => (
                  <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i <= strengthScore ? strengthScore <= 1 ? 'bg-red-400' : strengthScore <= 2 ? 'bg-yellow-400' : strengthScore <= 3 ? 'bg-blue-400' : 'bg-green-400' : 'bg-muted'}`} />
                ))}
              </div>
            )}
          </div>
          <Input label="Confirm password" type="password" placeholder="Repeat password" icon={<Lock className="h-4 w-4" />} error={errors.confirmPassword?.message} autoComplete="new-password" {...register('confirmPassword')} />

          <Button type="submit" className="w-full h-11 mt-2 font-bold" loading={isSubmitting}>
            Create Account & Start <ArrowRight className="h-4 w-4" />
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            By signing up you agree to our{' '}
            <Link href="/terms" className="text-primary hover:underline">Terms</Link>{' '}and{' '}
            <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
          </p>
        </form>

        <p className="mt-5 text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/login" className="text-primary font-medium hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
