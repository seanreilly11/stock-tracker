'use client'
import React from 'react'
import Link from 'next/link'
import { TStock } from '@/types'
import useFetchStockPrices from '@/lib/queries/useFetchStockPrices'
import MiniRail from './MiniRail'

interface StockCardProps {
  stock: TStock
}

const StockCard = ({ stock }: StockCardProps) => {
  const { data: prices, isLoading } = useFetchStockPrices(stock.ticker)
  const todaysPrices = prices?.ticker.day.c !== 0
  const livePrice = todaysPrices ? prices?.ticker.day.c : prices?.ticker.prevDay.c
  const changePerc = prices?.ticker.todaysChangePerc ?? 0
  const isUp = changePerc >= 0

  if (isLoading) {
    return (
      <div className="rounded-lg border border-[var(--rule)] bg-[var(--paper)] p-4 animate-pulse">
        <div className="h-4 bg-[var(--paper-3)] rounded w-1/3 mb-2" />
        <div className="h-3 bg-[var(--paper-3)] rounded w-2/3" />
      </div>
    )
  }

  return (
    <Link
      href={`/stocks/${stock.ticker}`}
      className="block rounded-lg border border-[var(--rule)] bg-[var(--paper)] p-4 transition-all hover:-translate-y-px hover:border-[var(--ink-4)] hover:shadow-[0_8px_20px_-12px_oklch(20%_0.01_60_/_0.18)] cursor-pointer"
    >
      {/* Header: ticker + price */}
      <div className="flex items-baseline justify-between gap-2 mb-1">
        <div className="flex items-center gap-1.5">
          <span className="font-[family-name:var(--mono)] text-sm font-medium tracking-wide text-[var(--ink)]">
            {stock.ticker}
          </span>
          {stock.tag === 'core' && (
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--ink-3)]" title="Core position" />
          )}
        </div>
        <div className="flex items-baseline gap-2">
          {livePrice && (
            <span className="font-[family-name:var(--mono)] text-sm text-[var(--ink)]">
              ${livePrice.toFixed(2)}
            </span>
          )}
          {changePerc !== 0 && (
            <span className={`font-[family-name:var(--mono)] text-xs ${isUp ? 'text-[var(--green)]' : 'text-[var(--accent)]'}`}>
              {isUp ? '▲' : '▼'} {Math.abs(changePerc).toFixed(2)}%
            </span>
          )}
        </div>
      </div>

      {/* Company name */}
      <p className="text-xs text-[var(--ink-3)] truncate mb-1">{stock.name}</p>

      {/* Mini price rail */}
      <MiniRail stock={stock} currentPrice={livePrice} />

      {/* Footer: status */}
      <div className="flex items-center gap-1.5 mt-2">
        <span className="w-1.5 h-1.5 rounded-full bg-[var(--ink-4)]" />
        <span className="font-[family-name:var(--mono)] text-[10px] uppercase tracking-wider text-[var(--ink-3)]">
          {stock.tag ?? 'watching'}
        </span>
      </div>
    </Link>
  )
}

export default StockCard
