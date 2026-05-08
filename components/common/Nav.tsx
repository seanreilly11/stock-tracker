'use client'
import React from 'react'
import Link from 'next/link'
import { useAuth } from '@/lib/hooks/useAuth'
import MenuDropdown from '@/components/ui/MenuDropdown'
import Button from '@/components/ui/Button'

const Nav = () => {
  const { user } = useAuth()
  return (
    <nav className="flex items-center justify-between px-8 py-4 border-b border-[var(--rule)] bg-[var(--paper)]">
      <Link href="/" className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-[2px] bg-[var(--ink)] inline-block" />
        <span className="font-[family-name:var(--serif)] text-lg font-medium tracking-[-0.01em] text-[var(--ink)]">
          Bullrush
        </span>
      </Link>
      <div className="flex items-center gap-4">
        {user ? (
          <MenuDropdown />
        ) : (
          <Link href="/login">
            <Button variant="ghost" size="sm">Sign in</Button>
          </Link>
        )}
      </div>
    </nav>
  )
}

export default Nav
