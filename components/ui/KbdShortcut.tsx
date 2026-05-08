import React from 'react'

interface KbdShortcutProps {
  children: React.ReactNode
}

const KbdShortcut = ({ children }: KbdShortcutProps) => (
  <kbd className="font-[family-name:var(--mono)] text-[10.5px] px-1.5 py-0.5 rounded border border-[var(--rule)] bg-[var(--paper-2)] text-[var(--ink-3)]">
    {children}
  </kbd>
)

export default KbdShortcut
