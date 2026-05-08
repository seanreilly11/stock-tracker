'use client'
import React from 'react'
import { TStock } from '@/types'
import StockCard from './StockCard'
import EmptyState from '@/components/common/EmptyState'
import useFetchUserStocks from '@/lib/queries/useFetchUserStocks'

const StockList = () => {
  const { data: savedStocks, error, isLoading } = useFetchUserStocks()

  if (isLoading) {
    return (
      <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-3 mt-6">
        {[0, 1, 2, 3].map(i => (
          <div key={i} className="h-28 rounded-lg border border-[var(--rule)] bg-[var(--paper-2)] animate-pulse" />
        ))}
      </div>
    )
  }

  if (error) {
    return <p className="text-sm text-[var(--accent)] mt-6">{error.message}</p>
  }

  if (!savedStocks || savedStocks.length === 0) {
    return <EmptyState page="Home" />
  }

  // Group by sector if available; otherwise single group
  const grouped = savedStocks.reduce<Record<string, TStock[]>>((acc, stock) => {
    const key = stock.sector ?? 'Watchlist'
    ;(acc[key] ??= []).push(stock)
    return acc
  }, {})

  const sectors = Object.keys(grouped)
  const showSectors = sectors.length > 1 || sectors[0] !== 'Watchlist'

  return (
    <div className="mt-8">
      {showSectors ? (
        sectors.map(sector => (
          <div key={sector} className="mb-8">
            <div className="flex items-center gap-3 mb-4 font-[family-name:var(--mono)] text-[11px] uppercase tracking-[0.08em] text-[var(--ink-3)]">
              <span>{sector}</span>
              <span className="flex-1 h-px bg-[var(--rule)]" />
              <span className="text-[var(--ink-4)]">{grouped[sector].length}</span>
            </div>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-3">
              {grouped[sector].map(stock => (
                <StockCard key={stock.ticker} stock={stock} />
              ))}
            </div>
          </div>
        ))
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-3">
          {savedStocks.map((stock: TStock) => (
            <StockCard key={stock.ticker} stock={stock} />
          ))}
        </div>
      )}
    </div>
  )
}

export default StockList
