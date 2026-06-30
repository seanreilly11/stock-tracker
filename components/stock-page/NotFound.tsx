import React from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import Button from '@/components/ui/Button'

interface NotFoundProps {
  error: { status?: string; message?: string }
}

const NotFound = ({ error }: NotFoundProps) => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-8">
    <p className="font-[family-name:var(--mono)] text-[11px] uppercase tracking-[0.08em] text-[var(--ink-3)]">
      {error.status === 'NOT_FOUND' ? '404' : '500'}
    </p>
    <h1 className="font-[family-name:var(--serif)] text-3xl text-[var(--ink)]">
      {error.status === 'NOT_FOUND' ? 'Ticker not found.' : 'Something went wrong.'}
    </h1>
    <p className="text-sm text-[var(--ink-3)]">
      {error.status === 'NOT_FOUND'
        ? "We don't have data for that ticker."
        : error.message ?? 'An unexpected error occurred.'}
    </p>
    <Link href="/">
      <Button variant="default"><ArrowLeft size={14} /> Back home</Button>
    </Link>
  </div>
)

export default NotFound
