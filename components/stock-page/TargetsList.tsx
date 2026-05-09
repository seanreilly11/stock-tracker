'use client'
import { useTransition } from 'react'
import { Trash2 } from 'lucide-react'
import { TStock, TTarget } from '@/types'
import { removeTargetAction } from '@/lib/actions/stocks'
import TargetPriceForm from './TargetPriceForm'

interface TargetsListProps {
  stock: TStock
  ticker: string
  targets: TTarget[]
  currentPrice?: number
}

const KIND_STYLES: Record<TTarget['kind'], string> = {
  buy:  'bg-[oklch(94%_0.04_145)] text-[var(--green)]',
  sell: 'bg-[var(--accent-soft)] text-[var(--accent)]',
  stop: 'bg-[var(--accent-soft)] text-[var(--accent)]',
}

function TargetRow({ target, ticker }: { target: TTarget; ticker: string }) {
  const [isPending, startTransition] = useTransition()

  const handleDelete = () => {
    startTransition(() => removeTargetAction(target.id, ticker))
  }

  return (
    <div className="flex items-center gap-3 py-2.5 border-t border-[var(--rule)] first:border-t-0">
      <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-[family-name:var(--mono)] font-semibold uppercase tracking-[0.08em] ${KIND_STYLES[target.kind]}`}>
        {target.kind}
      </span>
      <span className="font-[family-name:var(--mono)] text-sm text-[var(--ink)]">
        ${target.price.toFixed(2)}
      </span>
      {target.label && (
        <span className="flex-1 text-sm text-[var(--ink-3)] truncate">{target.label}</span>
      )}
      <span className={`ml-auto w-1.5 h-1.5 rounded-full flex-shrink-0 ${target.status === 'triggered' ? 'bg-[var(--accent)]' : 'bg-[var(--green)]'}`} />
      <button
        onClick={handleDelete}
        disabled={isPending}
        className="text-[var(--ink-4)] hover:text-[var(--accent)] transition-colors disabled:opacity-40"
        aria-label="Delete target"
      >
        <Trash2 size={13} />
      </button>
    </div>
  )
}

const TargetsList = ({ stock, ticker, targets, currentPrice }: TargetsListProps) => {
  return (
    <div className="mt-4">
      {targets.length > 0 && (
        <div className="border border-[var(--rule)] rounded-lg px-3 py-1 mb-3">
          {targets.map(t => (
            <TargetRow key={t.id} target={t} ticker={ticker} />
          ))}
        </div>
      )}
      <TargetPriceForm
        stockId={stock.id}
        ticker={ticker}
        currentPrice={currentPrice}
      />
    </div>
  )
}

export default TargetsList
