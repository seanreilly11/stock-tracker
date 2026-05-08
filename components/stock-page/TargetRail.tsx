import React from 'react'
import { TStock } from '@/types'

interface TargetRailProps {
  stock: TStock
  currentPrice?: number
}

const TargetRail = ({ stock, currentPrice }: TargetRailProps) => {
  const price = currentPrice ?? stock.most_recent_price
  if (!price) return null

  return (
    <div className="mt-5 p-4 rounded-lg border border-[var(--rule)] bg-[var(--paper-2)]">
      <div className="flex items-baseline justify-between mb-3">
        <h3 className="font-[family-name:var(--mono)] text-[11px] uppercase tracking-[0.08em] text-[var(--ink-3)] font-medium">
          Price rail
        </h3>
        <span className="font-[family-name:var(--mono)] text-[10px] uppercase tracking-[0.06em] text-[var(--ink-4)]">
          No targets set
        </span>
      </div>
      {/* Visual rail */}
      <div className="relative h-16 mt-1.5">
        <div className="absolute inset-x-0 top-8 h-px bg-[var(--rule)]" />
        {/* Now marker at 50% since no targets */}
        <div className="absolute left-1/2 top-6 bottom-6 w-0.5 -translate-x-1/2 bg-[var(--ink)]" />
        <span className="absolute left-1/2 -translate-x-1/2 top-0 font-[family-name:var(--mono)] text-[10px] text-[var(--ink)] whitespace-nowrap">
          ${price.toFixed(2)} now
        </span>
      </div>
    </div>
  )
}

export default TargetRail
