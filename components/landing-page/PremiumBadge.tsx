import React, { ReactNode } from 'react'

interface PremiumBadgeProps {
  children: ReactNode
  className?: string
  premium?: boolean
  text?: string
}

const PremiumBadge = ({ children, className, premium, text = 'Premium' }: PremiumBadgeProps) => (
  <div className={`relative ${className ?? ''}`}>
    {premium && (
      <span className="absolute -top-2 -right-2 z-10 font-[family-name:var(--mono)] text-[10px] uppercase tracking-[0.06em] px-2 py-0.5 rounded bg-[var(--ink)] text-[var(--paper)]">
        {text}
      </span>
    )}
    {children}
  </div>
)

export default PremiumBadge
