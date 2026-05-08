/* eslint-disable react/no-unescaped-entities */
'use client'
import React, { useEffect, useState } from 'react'
import { signIn } from '@/server/actions/auth'
import { useAuth } from '@/lib/hooks/useAuth'
import { useForm } from 'react-hook-form'
import Link from 'next/link'
import { AuthError } from '@supabase/supabase-js'
import { redirect } from 'next/navigation'
import Button from '@/components/ui/Button'
import AuthInput from '@/components/ui/AuthInput'

type FormData = { email: string; password: string }

const Page = () => {
  const { user } = useAuth()
  const [authError, setAuthError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>()

  const onSubmit = handleSubmit(async ({ email, password }) => {
    setIsLoading(true)
    try {
      await signIn(email, password)
    } catch (error) {
      const msg = error instanceof AuthError ? error.message : 'Sign in failed'
      setAuthError(msg.includes('Invalid login credentials') ? 'Invalid email or password' : msg)
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
            Sign in
          </h1>
          <p className="text-sm text-[var(--ink-3)]">
            Welcome back to your research notebook.
          </p>
        </div>

        <form className="flex flex-col gap-4" onSubmit={onSubmit}>
          <div className="flex flex-col gap-1.5">
            <label className="font-[family-name:var(--mono)] text-[11px] uppercase tracking-[0.08em] text-[var(--ink-2)]">
              Email
            </label>
            <AuthInput
              type="email"
              placeholder="you@example.com"
              register={register}
              errors={errors}
              name="email"
              options={{ required: { value: true, message: 'Please enter your email' } }}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="font-[family-name:var(--mono)] text-[11px] uppercase tracking-[0.08em] text-[var(--ink-2)]">
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-xs text-[var(--ink-3)] hover:text-[var(--ink)] transition-colors"
              >
                Forgot password?
              </Link>
            </div>
            <AuthInput
              type="password"
              placeholder="••••••••"
              register={register}
              name="password"
              errors={errors}
              options={{ required: { value: true, message: 'Please enter your password' } }}
            />
          </div>

          {authError && (
            <p className="text-xs text-[var(--accent)]">{authError}</p>
          )}

          <Button loading={isLoading} type="submit" variant="primary" className="w-full justify-center mt-1">
            Sign in
          </Button>
        </form>
      </div>

      <p className="mt-4 text-center text-sm text-[var(--ink-3)]">
        No account?{' '}
        <Link href="/register" className="text-[var(--ink)] font-medium hover:underline">
          Register here
        </Link>
      </p>
    </div>
  )
}

export default Page
