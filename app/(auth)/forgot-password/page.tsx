/* eslint-disable react/no-unescaped-entities */
'use client'
import React, { useState } from 'react'
import { resetPassword } from '@/server/actions/auth'
import { useForm } from 'react-hook-form'
import Link from 'next/link'
import Button from '@/components/ui/Button'

type FormData = { email: string }

const Page = () => {
  const [loading, setLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [error, setError] = useState('')
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>()

  const onSubmit = handleSubmit(async ({ email }) => {
    if (!email) return
    setLoading(true)
    try {
      await resetPassword(email)
      setEmailSent(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  })

  return (
    <div className="w-full max-w-sm">
      <div className="rounded-lg border border-[var(--rule)] bg-[var(--paper)] px-8 py-8">
        <div className="mb-6">
          <h1 className="font-[family-name:var(--serif)] text-2xl font-medium text-[var(--ink)] mb-1">
            Reset password
          </h1>
          <p className="text-sm text-[var(--ink-3)]">
            {emailSent ? "Check your inbox for a reset link." : "Enter your email and we'll send a reset link."}
          </p>
        </div>

        {emailSent ? (
          <div className="flex flex-col gap-4">
            <div className="p-4 rounded-md bg-[var(--green-soft)] border border-[var(--green-line)] text-sm text-[var(--green)]">
              Reset email sent. Check your spam folder if you don't see it.
            </div>
            <Link href="/login">
              <Button variant="default" className="w-full justify-center">
                Back to sign in
              </Button>
            </Link>
          </div>
        ) : (
          <form className="flex flex-col gap-4" onSubmit={onSubmit}>
            <div className="flex flex-col gap-1.5">
              <label className="font-[family-name:var(--mono)] text-[11px] uppercase tracking-[0.08em] text-[var(--ink-2)]">
                Email
              </label>
              <input
                className={[
                  'w-full rounded-md border px-3 py-2 text-sm bg-[var(--paper)] text-[var(--ink)]',
                  'placeholder:text-[var(--ink-4)] outline-none focus:border-[var(--ink-3)] transition-colors',
                  errors.email ? 'border-[var(--accent)]' : 'border-[var(--rule)]',
                ].join(' ')}
                type="email"
                placeholder="you@example.com"
                {...register('email', { required: { value: true, message: 'Please enter your email' } })}
              />
              {errors.email && <p className="text-xs text-[var(--accent)]">{errors.email.message}</p>}
            </div>

            {error && <p className="text-xs text-[var(--accent)]">{error}</p>}

            <Button loading={loading} type="submit" variant="primary" className="w-full justify-center">
              Send reset email
            </Button>
          </form>
        )}
      </div>

      <p className="mt-4 text-center text-sm text-[var(--ink-3)]">
        Remembered it?{' '}
        <Link href="/login" className="text-[var(--ink)] font-medium hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  )
}

export default Page
