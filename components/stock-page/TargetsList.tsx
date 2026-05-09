'use client'
import React from 'react'
import { TStock } from '@/types'
import Button from '@/components/ui/Button'
import TargetPriceForm from './TargetPriceForm'

interface StockUpdates {
  most_recent_price?: number | null
}

interface TargetsListProps {
  stock: TStock
  currentPrice?: number
  onUpdate: (updates: StockUpdates) => Promise<void>
  editTarget: boolean
  setEditTarget: React.Dispatch<React.SetStateAction<boolean>>
}

const TargetsList = ({ stock, currentPrice, onUpdate, editTarget, setEditTarget }: TargetsListProps) => {
  return (
    <div className="mt-4">
      {editTarget ? (
        <TargetPriceForm
          ticker={stock.ticker}
          name={stock.name}
          mostRecentPrice={currentPrice}
          onUpdate={onUpdate}
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
