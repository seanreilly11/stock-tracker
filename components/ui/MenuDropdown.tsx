'use client'
import React, { useState } from 'react'
import { User } from 'lucide-react'
import { useAuth } from '@/lib/hooks/useAuth'
import { signOutUser } from '@/server/actions/auth'

const MenuDropdown = () => {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <button
        className="flex items-center justify-center w-8 h-8 rounded-md border border-[var(--rule)] bg-[var(--paper)] text-[var(--ink-2)] hover:bg-[var(--paper-2)] transition-colors"
        type="button"
        onClick={() => setOpen(prev => !prev)}
        aria-label="Open user menu"
      >
        <User size={15} />
      </button>

      {open && (
        <>
          <div className="absolute right-0 top-10 z-20 w-48 rounded-lg border border-[var(--rule)] bg-[var(--paper)] shadow-lg overflow-hidden">
            <div className="px-4 py-3 border-b border-[var(--rule)]">
              <div className="text-sm font-medium text-[var(--ink)] truncate">
                {user?.user_metadata?.name || 'Account'}
              </div>
              <div className="text-xs text-[var(--ink-3)] truncate mt-0.5">
                {user?.email}
              </div>
            </div>
            <div className="py-1">
              <button
                className="w-full text-left px-4 py-2 text-sm text-[var(--ink-2)] hover:bg-[var(--paper-2)] transition-colors"
                onClick={() => signOutUser()}
              >
                Sign out
              </button>
            </div>
          </div>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setOpen(false)}
          />
        </>
      )}
    </div>
  )
}

export default MenuDropdown
