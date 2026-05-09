'use client'
import React, { useState, useTransition } from 'react'
import { MoreHorizontal, Plus, Star, StarOff, Trash2 } from 'lucide-react'
import { TStock } from '@/types'
import { PopupType } from '@/lib/hooks/usePopup'
import {
  addStockAction,
  removeStockAction,
  addToNextToBuyAction,
  removeFromNextToBuyAction,
} from '@/lib/actions/stocks'
import Button from '@/components/ui/Button'

interface StockOptionsButtonProps {
  name: string
  ticker: string
  savedStock: TStock | { error: string }
  nextStocks: string[]
  messagePopup: (type: PopupType, content: string, duration?: number) => void
  setEditTarget: React.Dispatch<React.SetStateAction<boolean>>
}

const StockOptionsButton = ({
  ticker, name, savedStock, nextStocks, messagePopup, setEditTarget,
}: StockOptionsButtonProps) => {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const inNextBuy = nextStocks.includes(ticker)
  const isTracked = 'id' in savedStock && !('error' in savedStock)
  const close = () => setOpen(false)

  const run = (action: () => Promise<void>, successMsg: string) => {
    close()
    startTransition(async () => {
      try {
        await action()
        messagePopup('success', successMsg)
      } catch (err) {
        messagePopup('error', (err as Error).message)
      }
    })
  }

  const menuItems = [
    isTracked
      ? {
          icon: <Trash2 size={13} />,
          label: 'Remove from watchlist',
          danger: true,
          action: () => run(
            () => removeStockAction(('id' in savedStock ? savedStock.id : '') as string),
            'Removed from watchlist.'
          ),
        }
      : {
          icon: <Plus size={13} />,
          label: 'Add to watchlist',
          danger: false,
          action: () => run(() => addStockAction(ticker, name), 'Added to watchlist.'),
        },
    inNextBuy
      ? {
          icon: <StarOff size={13} />,
          label: 'Remove from next to buy',
          danger: false,
          action: () => run(() => removeFromNextToBuyAction(ticker), 'Removed from next to buy.'),
        }
      : {
          icon: <Star size={13} />,
          label: 'Add to next to buy',
          danger: false,
          action: () => run(() => addToNextToBuyAction(ticker), 'Added to next to buy.'),
        },
  ]

  return (
    <div className="relative">
      <Button variant="ghost" size="sm" onClick={() => setOpen(p => !p)} aria-label="Options" loading={isPending}>
        <MoreHorizontal size={15} />
      </Button>
      {open && (
        <>
          <div className="absolute right-0 top-9 z-20 w-52 rounded-lg border border-[var(--rule)] bg-[var(--paper)] shadow-lg overflow-hidden">
            {menuItems.map(({ icon, label, action, danger }) => (
              <button
                key={label}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-sm transition-colors ${danger ? 'text-[var(--accent)] hover:bg-[var(--accent-soft)]' : 'text-[var(--ink-2)] hover:bg-[var(--paper-2)]'}`}
                onClick={action}
              >
                {icon} {label}
              </button>
            ))}
          </div>
          <div className="fixed inset-0 z-10" onClick={close} />
        </>
      )}
    </div>
  )
}

export default StockOptionsButton
