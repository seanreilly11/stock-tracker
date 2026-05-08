import React from 'react'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--paper)] flex flex-col items-center justify-center px-4 py-16">
      {/* Brand mark */}
      <div className="mb-8 flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-[3px] bg-[var(--ink)] inline-block" />
        <span className="font-[family-name:var(--serif)] text-[19px] font-medium tracking-[-0.01em] text-[var(--ink)]">
          Bullrush
        </span>
      </div>
      {children}
    </div>
  )
}
