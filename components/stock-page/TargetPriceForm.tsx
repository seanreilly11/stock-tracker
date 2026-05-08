'use client'
import React, { FormEvent, KeyboardEvent, useState } from 'react'
import { UseMutationResult } from '@tanstack/react-query'
import { TStock } from '@/types'
import Button from '@/components/ui/Button'

interface StockUpdates {
  most_recent_price?: number | null
}

interface TargetPriceFormProps {
  ticker: string
  name: string
  savedTargetPrice?: number | null
  mostRecentPrice?: number
  updateMutation: UseMutationResult<TStock, Error, StockUpdates, unknown>
}

const TargetPriceForm = ({ mostRecentPrice, updateMutation }: TargetPriceFormProps) => {
  const [value, setValue] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    updateMutation.mutate({ most_recent_price: mostRecentPrice ?? null })
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!/[0-9.]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Enter') {
      e.preventDefault()
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-2 border-b border-[var(--ink-3)] pb-2"
    >
      <span className="font-[family-name:var(--mono)] text-[var(--ink-3)] text-sm">$</span>
      <input
        className="bg-transparent border-none outline-none font-[family-name:var(--mono)] text-sm text-[var(--ink)] w-24 placeholder:text-[var(--ink-4)]"
        autoFocus
        type="text"
        maxLength={7}
        value={value}
        onChange={e => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        inputMode="numeric"
        placeholder="0.00"
        aria-label="Target price"
      />
      <Button size="sm" variant="primary" type="submit">Set</Button>
    </form>
  )
}

export default TargetPriceForm
