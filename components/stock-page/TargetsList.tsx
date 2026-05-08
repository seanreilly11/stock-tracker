'use client'
import React from 'react'
import { TStock } from '@/types'
import Button from '@/components/ui/Button'
import TargetPriceForm from './TargetPriceForm'
import { UseMutationResult } from '@tanstack/react-query'

interface StockUpdates {
  most_recent_price?: number | null
}

interface TargetsListProps {
  stock: TStock
  currentPrice?: number
  updateMutation: UseMutationResult<TStock, Error, StockUpdates, unknown>
  editTarget: boolean
  setEditTarget: React.Dispatch<React.SetStateAction<boolean>>
}

const TargetsList = ({ stock, currentPrice, updateMutation, editTarget, setEditTarget }: TargetsListProps) => {
  return (
    <div className="mt-4">
      {editTarget ? (
        <TargetPriceForm
          ticker={stock.ticker}
          name={stock.name}
          mostRecentPrice={currentPrice}
          updateMutation={updateMutation}
        />
      ) : (
        <div className="flex items-center justify-between py-3 border-t border-[var(--rule)]">
          <p className="text-sm text-[var(--ink-3)] font-[family-name:var(--serif)] italic">
            No targets set yet.
          </p>
          <Button size="sm" variant="ghost" onClick={() => setEditTarget(true)}>
            + Add target
          </Button>
        </div>
      )}
    </div>
  )
}

export default TargetsList
