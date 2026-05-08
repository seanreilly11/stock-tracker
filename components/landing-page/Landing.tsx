import React, { useEffect, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import LandingBanner from '@/components/landing-page/Banner'
import Features from '@/components/landing-page/Features'
import Stats from '@/components/landing-page/Stats'
import LoaderFullscreen from '@/components/common/LoaderFullscreen'
import { useAuth } from '@/lib/hooks/useAuth'

const Landing = () => {
  const [showLoader, setShowLoader] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    if (user) setShowLoader(false)
    const t = setTimeout(() => setShowLoader(false), 1000)
    return () => clearTimeout(t)
  }, [user])

  return (
    <div className="min-h-screen bg-[var(--paper)]">
      {showLoader && <LoaderFullscreen />}

      {/* Top nav */}
      <div className="flex items-center justify-between px-8 py-4 border-b border-[var(--rule)]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-[2px] bg-[var(--ink)] inline-block" />
          <span className="font-[family-name:var(--serif)] text-lg font-medium tracking-[-0.01em] text-[var(--ink)]">
            Bullrush
          </span>
        </div>
        <a href="/login" className="inline-flex items-center gap-1 font-[family-name:var(--mono)] text-xs uppercase tracking-[0.06em] text-[var(--ink-2)] hover:text-[var(--ink)] transition-colors">
          Sign in <ArrowRight size={12} />
        </a>
      </div>

      {/* Content */}
      <div className="space-y-24 pb-24 px-4">
        <LandingBanner />
        <Stats />
        <Features />
      </div>
    </div>
  )
}

export default Landing
