'use client'
import React, { useState } from 'react'
import { User } from 'lucide-react'
import { signOutUser } from '@/server/actions/auth'

interface MenuDropdownProps {
  name?: string | null
  email?: string | null
}

const MenuDropdown = ({ name, email }: MenuDropdownProps) => {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <button
        className="flex items-center justify-center w-8 h-8 rounded-md border border-[var(--rule)] bg-[var(--paper)] text-[var(--ink-2)] hover:bg-[var(--paper-2)] transition-colors"
        type="button"
        onClick={() => setOpen(prev => !prev)}
        aria-label="Open user menu"
        suppressHydrationWarning
      >
        <User size={15} />
      </button>

      {open && (
        <>
          <div className="absolute right-0 top-10 z-20 w-48 rounded-lg border border-[var(--rule)] bg-[var(--paper)] shadow-lg overflow-hidden">
            <div className="px-4 py-3 border-b border-[var(--rule)]">
              <div className="text-sm font-medium text-[var(--ink)] truncate">
                {name || 'Account'}
              </div>
              <div className="text-xs text-[var(--ink-3)] truncate mt-0.5">
                {email}
              </div>
            </div>
            <div className="py-1">
              <button
                type="button"
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
