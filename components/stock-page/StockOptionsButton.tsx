'use client'
import React, { useState } from 'react'
import { MoreHorizontal, Plus, Star, StarOff, Trash2 } from 'lucide-react'
import { UseMutationResult, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/lib/hooks/useAuth'
import { TStock, TStockPrice } from '@/types'
import { addStock, addToNextToBuy, getUserNextBuyStocks, removeFromNextToBuy, removeStock } from '@/lib/api/db'
import { PopupType } from '@/lib/hooks/usePopup'
import Button from '@/components/ui/Button'

interface StockUpdates {
  most_recent_price?: number | null
}

interface StockOptionsButtonProps {
  name: string
  ticker: string
  prices: TStockPrice
  savedStock: TStock | { error: string }
  updateMutation: UseMutationResult<TStock, Error, StockUpdates, unknown>
  messagePopup: (type: PopupType, content: string, duration?: number) => void
  setEditTarget: React.Dispatch<React.SetStateAction<boolean>>
}

const StockOptionsButton = ({
  ticker, name, prices, savedStock, messagePopup, setEditTarget,
}: StockOptionsButtonProps) => {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)

  const { data: nextStocks } = useQuery({
    queryKey: ['nextStocks', user?.id],
    queryFn: () => getUserNextBuyStocks(user!.id),
    enabled: !!user?.id,
    staleTime: Infinity,
  })

  const removeMutation = useMutation({
    mutationFn: () => {
      const stockId = 'id' in savedStock ? savedStock.id : ''
      return removeStock(stockId)
    },
    onSuccess: () => {
      messagePopup('success', 'Removed from watchlist.')
      queryClient.invalidateQueries({ queryKey: ['stocks', user?.id] })
    },
  })

  const addMutation = useMutation({
    mutationFn: () => addStock(user!.id, ticker, name),
    onSuccess: () => {
      messagePopup('success', 'Added to watchlist.')
      queryClient.invalidateQueries({ queryKey: ['stocks', user?.id] })
    },
  })

  const addNextBuyMutation = useMutation({
    mutationFn: () => addToNextToBuy(user!.id, ticker),
    onSuccess: () => {
      messagePopup('success', 'Added to next to buy.')
      queryClient.invalidateQueries({ queryKey: ['nextStocks', user?.id] })
    },
    onError: (err: Error) => messagePopup('error', err.message),
  })

  const removeNextBuyMutation = useMutation({
    mutationFn: () => removeFromNextToBuy(user!.id, ticker),
    onSuccess: () => {
      messagePopup('success', 'Removed from next to buy.')
      queryClient.invalidateQueries({ queryKey: ['nextStocks', user?.id] })
    },
  })

  const inNextBuy = nextStocks?.includes(ticker)
  const isTracked = 'id' in savedStock && !('error' in savedStock)

  const close = () => setOpen(false)

  const menuItems = [
    isTracked
      ? { icon: <Trash2 size={13} />, label: 'Remove from watchlist', danger: true, action: () => { removeMutation.mutate(); close() } }
      : { icon: <Plus size={13} />, label: 'Add to watchlist', danger: false, action: () => { addMutation.mutate(); close() } },
    inNextBuy
      ? { icon: <StarOff size={13} />, label: 'Remove from next to buy', danger: false, action: () => { removeNextBuyMutation.mutate(); close() } }
      : { icon: <Star size={13} />, label: 'Add to next to buy', danger: false, action: () => { addNextBuyMutation.mutate(); close() } },
  ]

  return (
    <div className="relative">
      <Button variant="ghost" size="sm" onClick={() => setOpen(p => !p)} aria-label="Options">
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
