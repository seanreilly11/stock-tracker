import React from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import Button from '@/components/ui/Button'

const LandingBanner = () => (
  <div className="max-w-2xl mx-auto py-24 px-4 text-center">
    {/* Eyebrow */}
    <div className="flex items-center justify-center gap-2 font-[family-name:var(--mono)] text-[11px] uppercase tracking-[0.08em] text-[var(--ink-3)] mb-6">
      <span className="w-2 h-2 rounded-[2px] bg-[var(--ink)] inline-block" />
      <span>Bullrush</span>
      <span className="w-1 h-1 rounded-full bg-[var(--ink-4)]" />
      <span>Stock research notebook</span>
    </div>

    <h1 className="font-[family-name:var(--serif)] text-5xl sm:text-6xl font-medium leading-tight tracking-[-0.02em] text-[var(--ink)] mb-6">
      Keep track of your stocks in one place.
    </h1>

    <p className="text-lg text-[var(--ink-2)] leading-relaxed mb-10 max-w-xl mx-auto">
      Track your stocks alongside real-time prices, write timestamped notes and thesis,
      set price targets, and stay ready to act when your next paycheck lands.
    </p>

    <div className="flex items-center justify-center gap-3">
      <Link href="/register">
        <Button variant="primary" size="md">
          Get started <ArrowRight size={14} />
        </Button>
      </Link>
      <Link href="/login">
        <Button variant="default" size="md">
          Sign in
        </Button>
      </Link>
    </div>
  </div>
)

export default LandingBanner
