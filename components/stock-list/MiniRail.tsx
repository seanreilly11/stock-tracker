'use client'
import React from 'react'
import { TStock } from '@/types'

interface MiniRailProps {
  stock: TStock
  currentPrice?: number
}

const MiniRail = ({ stock, currentPrice }: MiniRailProps) => {
  const price = currentPrice ?? stock.most_recent_price
  if (!price) return <div className="h-3 my-1" />

  // For now: show a flat rail with a single "now" marker at 50% (center)
  // When targets are added, this will show their positions relative to price
  const nowPct = 50

  return (
    <div className="relative h-3 my-1 mx-0.5">
      <div className="absolute inset-x-0 top-1/2 h-px bg-[var(--rule)]" />
      <div
        className="absolute top-0.5 bottom-0.5 w-0.5 bg-[var(--ink)] -translate-x-1/2"
        style={{ left: `${nowPct}%` }}
      />
    </div>
  )
}

export default MiniRail
