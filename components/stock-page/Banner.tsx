'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import StockOptionsButton from './StockOptionsButton'
import TargetRail from './TargetRail'
import TargetsList from './TargetsList'
import { updateStock } from '@/lib/api/db'
import { useAuth } from '@/lib/hooks/useAuth'
import usePopup from '@/lib/hooks/usePopup'
import useFetchUserStock from '@/lib/queries/useFetchUserStock'
import useFetchStockPrices from '@/lib/queries/useFetchStockPrices'

interface StockUpdates {
  most_recent_price?: number | null
}

interface BannerDetails {
  homepage_url?: string
  name?: string
  description?: string
  sic_description?: string
  branding?: { logo_url?: string; icon_url?: string }
  type?: string
}

interface BannerProps {
  name?: string
  ticker: string
  details?: BannerDetails
}

const TAG_CLASSES: Record<string, string> = {
  core:        'border-[var(--ink)] text-[var(--ink)]',
  starter:     'border-[var(--rule)] bg-[var(--paper-2)] text-[var(--ink-2)]',
  speculative: 'border-[var(--accent-line)] bg-[var(--accent-soft)] text-[var(--accent)]',
  watch:       'border-[var(--rule)] text-[var(--ink-3)]',
}

const Banner = ({ ticker, name, details }: BannerProps) => {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const { messagePopup, contextHolder } = usePopup()
  const [editTarget, setEditTarget] = useState(false)

  const { data: savedStock, isLoading: loadingSavedStock } = useFetchUserStock(ticker)
  const { data: prices } = useFetchStockPrices(ticker)

  const todaysPrices = prices?.ticker?.day?.c !== 0
  const currentPrice = todaysPrices ? prices?.ticker?.day?.c : prices?.ticker?.prevDay?.c
  const changePerc = prices?.ticker?.todaysChangePerc ?? 0
  const isUp = changePerc >= 0

  const updateMutation = useMutation({
    mutationFn: (updates: StockUpdates) => updateStock(savedStock!.id, updates),
    onSuccess: () => {
      messagePopup('success', 'Updated!')
      queryClient.invalidateQueries({ queryKey: ['stock', user?.id, ticker] })
      queryClient.invalidateQueries({ queryKey: ['stocks', user?.id] })
    },
    onSettled: () => setEditTarget(false),
  })

  const tag = savedStock?.tag
  const conviction = savedStock?.conviction

  return (
    <>
      {contextHolder}
      <header className="pt-9 pb-6 border-b border-[var(--rule)]">
        {/* Eyebrow */}
        <div className="flex items-center gap-3.5 font-[family-name:var(--mono)] text-[11px] uppercase tracking-[0.08em] text-[var(--ink-3)] mb-3">
          {tag && (
            <span className={`inline-flex items-center px-1.5 py-0.5 border rounded text-[10px] font-[family-name:var(--mono)] ${TAG_CLASSES[tag] ?? TAG_CLASSES.watch}`}>
              {tag}
            </span>
          )}
          {conviction && <span>conviction: {conviction}</span>}
          {details?.sic_description && <span>{details.sic_description}</span>}
        </div>

        {/* Title row */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-baseline gap-3.5">
            {details?.branding?.icon_url && (
              <Image
                src={`${details.branding.icon_url}?apiKey=${process.env.NEXT_PUBLIC_POLYGON_API_KEY}`}
                alt={`${name} logo`}
                width={32}
                height={32}
                className="rounded-sm"
              />
            )}
            <h1 className="font-[family-name:var(--serif)] text-4xl font-medium leading-tight tracking-tight text-[var(--ink)]">
              {name ?? ticker}
            </h1>
            <span className="font-[family-name:var(--mono)] text-base text-[var(--ink-3)] tracking-[0.04em]">
              {ticker}
            </span>
          </div>

          {/* Options */}
          <StockOptionsButton
            name={name ?? ticker}
            ticker={ticker}
            prices={prices!}
            savedStock={savedStock ?? { error: 'not found' }}
            messagePopup={messagePopup}
            updateMutation={updateMutation}
            setEditTarget={setEditTarget}
          />
        </div>

        {/* Quote */}
        {currentPrice && (
          <div className="flex items-baseline gap-4 mt-3.5 font-[family-name:var(--mono)]">
            <span className="text-[22px] text-[var(--ink)]">${currentPrice.toFixed(2)}</span>
            <span className={`inline-flex items-center gap-1 text-sm ${isUp ? 'text-[var(--green)]' : 'text-[var(--accent)]'}`}>
              {isUp ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
              {Math.abs(changePerc).toFixed(2)}%
            </span>
          </div>
        )}

        {/* Target rail + targets list */}
        {!loadingSavedStock && savedStock && (
          <>
            <TargetRail stock={savedStock} currentPrice={currentPrice} />
            <TargetsList
              stock={savedStock}
              currentPrice={currentPrice}
              updateMutation={updateMutation}
              editTarget={editTarget}
              setEditTarget={setEditTarget}
            />
          </>
        )}
      </header>
    </>
  )
}

export default Banner
