'use client'
import { useState, useTransition } from 'react'
import { addTargetAction } from '@/lib/actions/stocks'
import { TTarget } from '@/types'
import Button from '@/components/ui/Button'

interface TargetPriceFormProps {
  stockId?: string
  ticker: string
  name: string
  currentPrice?: number
}

const TargetPriceForm = ({ stockId, ticker, name, currentPrice }: TargetPriceFormProps) => {
  const [kind, setKind] = useState<TTarget['kind']>('buy')
  const [price, setPrice] = useState('')
  const [label, setLabel] = useState('')
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (e: { preventDefault(): void }) => {
    e.preventDefault()
    const p = parseFloat(price)
    if (!p || p <= 0) return
    startTransition(async () => {
      await addTargetAction(stockId, ticker, name, kind, p, label)
      setPrice('')
      setLabel('')
    })
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-wrap sm:flex-nowrap items-center gap-2 pt-3 border-t border-[var(--rule)]"
    >
      <select
        value={kind}
        onChange={e => setKind(e.target.value as TTarget['kind'])}
        className="bg-transparent border border-[var(--rule)] rounded px-2 py-1 font-[family-name:var(--mono)] text-[11px] uppercase tracking-[0.06em] text-[var(--ink-2)] outline-none cursor-pointer"
      >
        <option value="buy">Buy</option>
        <option value="sell">Sell</option>
        <option value="stop">Stop</option>
      </select>
      <div className="flex items-center border border-[var(--rule)] rounded px-2 py-1 gap-1">
        <span className="font-[family-name:var(--mono)] text-[var(--ink-3)] text-sm">$</span>
        <input
          type="text"
          inputMode="decimal"
          placeholder={currentPrice ? currentPrice.toFixed(2) : '0.00'}
          value={price}
          onChange={e => {
            if (/^[\d.]*$/.test(e.target.value)) setPrice(e.target.value)
          }}
          className="bg-transparent outline-none font-[family-name:var(--mono)] text-sm text-[var(--ink)] w-20 placeholder:text-[var(--ink-4)]"
          aria-label="Target price"
        />
      </div>
      <input
        type="text"
        placeholder="Label (e.g. Add on pullback)"
        value={label}
        onChange={e => setLabel(e.target.value)}
        className="flex-1 bg-transparent border border-[var(--rule)] rounded px-2 py-1 text-sm text-[var(--ink)] placeholder:text-[var(--ink-4)] outline-none"
      />
      <Button size="sm" variant="primary" type="submit" loading={isPending}>
        Add target
      </Button>
    </form>
  )
}

export default TargetPriceForm
