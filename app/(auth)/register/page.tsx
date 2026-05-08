'use client'
import React, { useEffect, useState } from 'react'
import { signUp } from '@/server/actions/auth'
import { useAuth } from '@/lib/hooks/useAuth'
import { useForm } from 'react-hook-form'
import Link from 'next/link'
import { AuthError } from '@supabase/supabase-js'
import { redirect } from 'next/navigation'
import Button from '@/components/ui/Button'
import AuthInput from '@/components/ui/AuthInput'

type FormData = { name: string; email: string; password: string }

const Page = () => {
  const { user } = useAuth()
  const [authError, setAuthError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>()

  const onSubmit = handleSubmit(async ({ email, password, name }) => {
    setIsLoading(true)
    try {
      await signUp(email, password, name)
    } catch (error) {
      const msg = error instanceof AuthError ? error.message : 'Registration failed'
      setAuthError(msg.includes('User already registered') ? 'An account with this email already exists' : msg)
    } finally {
      setIsLoading(false)
    }
  })

  useEffect(() => { if (user) redirect('/') }, [user])

  return (
    <div className="w-full max-w-sm">
      <div className="rounded-lg border border-[var(--rule)] bg-[var(--paper)] px-8 py-8">
        <div className="mb-6">
          <h1 className="font-[family-name:var(--serif)] text-2xl font-medium text-[var(--ink)] mb-1">
            Create account
          </h1>
          <p className="text-sm text-[var(--ink-3)]">
            Start your stock research notebook.
          </p>
        </div>

        <form className="flex flex-col gap-4" onSubmit={onSubmit}>
          <div className="flex flex-col gap-1.5">
            <label className="font-[family-name:var(--mono)] text-[11px] uppercase tracking-[0.08em] text-[var(--ink-2)]">Name</label>
            <AuthInput
              type="text" placeholder="Your name"
              register={register} name="name" errors={errors}
              options={{ required: { value: true, message: 'Please enter your name' } }}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-[family-name:var(--mono)] text-[11px] uppercase tracking-[0.08em] text-[var(--ink-2)]">Email</label>
            <AuthInput
              type="email" placeholder="you@example.com"
              register={register} name="email" errors={errors}
              options={{
                required: { value: true, message: 'Please enter your email' },
                pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Invalid email address' },
              }}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-[family-name:var(--mono)] text-[11px] uppercase tracking-[0.08em] text-[var(--ink-2)]">Password</label>
            <AuthInput
              type="password" placeholder="••••••••"
              register={register} name="password" errors={errors}
              options={{
                required: { value: true, message: 'Please choose a password' },
                minLength: { value: 6, message: 'Password should be at least 6 characters' },
              }}
            />
          </div>

          {authError && <p className="text-xs text-[var(--accent)]">{authError}</p>}

          <Button loading={isLoading} type="submit" variant="primary" className="w-full justify-center mt-1">
            Create account
          </Button>
        </form>
      </div>

      <p className="mt-4 text-center text-sm text-[var(--ink-3)]">
        Already have an account?{' '}
        <Link href="/login" className="text-[var(--ink)] font-medium hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  )
}

export default Page
