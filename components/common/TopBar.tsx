import React from 'react'

interface TopBarProps {
  breadcrumbs: React.ReactNode[]
  actions?: React.ReactNode
}

const TopBar = ({ breadcrumbs, actions }: TopBarProps) => {
  return (
    <div className="flex items-center justify-between px-4 sm:px-8 py-3 sm:py-4 border-b border-[var(--rule)] bg-[var(--paper)] sticky top-0 z-10">
      <div className="flex items-center gap-2.5 font-[family-name:var(--mono)] text-[11px] uppercase tracking-[0.04em] text-[var(--ink-3)]">
        {breadcrumbs.map((crumb, i) => (
          <React.Fragment key={i}>
            {i > 0 && (
              <span className="w-1 h-1 rounded-full bg-[var(--ink-4)]" />
            )}
            {crumb}
          </React.Fragment>
        ))}
      </div>
      {actions && (
        <div className="flex items-center gap-2">{actions}</div>
      )}
    </div>
  )
}

export default TopBar
