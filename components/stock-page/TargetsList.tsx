'use client'
import { useTransition } from 'react'
import { Trash2, Pencil } from 'lucide-react'
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
  buy:  'bg-[oklch(94%_0.04_145)] text-[var(--green)] border border-[var(--green-line)]',
  sell: 'bg-transparent text-[var(--ink)] border border-[var(--ink)]',
  stop: 'bg-[var(--accent-soft)] text-[var(--accent)] border border-[var(--accent-line)]',
}

const StatusDot = ({ status }: { status: TTarget['status'] }) => (
  <span className={`inline-flex items-center gap-1.5 font-[family-name:var(--mono)] text-[10px] uppercase tracking-[0.06em] ${status === 'triggered' ? 'text-[var(--accent)]' : 'text-[var(--ink-3)]'}`}>
    <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${status === 'triggered' ? 'bg-[var(--accent)] animate-pulse' : 'bg-[var(--green)]'}`} />
    {status}
  </span>
)

function TargetRow({ target, ticker }: { target: TTarget; ticker: string }) {
  const [isPending, startTransition] = useTransition()
  const triggered = target.status === 'triggered'

  const handleDelete = () => {
    startTransition(() => removeTargetAction(target.id, ticker))
  }

  return (
    <div
      className={`grid gap-3 py-2.5 border-t border-[var(--rule)] first:border-t-0 items-center ${triggered ? 'bg-[var(--accent-soft)] -mx-3 px-3 rounded' : ''}`}
      style={{ gridTemplateColumns: '50px 80px 1fr 110px 80px' }}
    >
      <span className={`inline-flex items-center justify-center px-1.5 py-0.5 rounded text-[9px] font-[family-name:var(--mono)] font-semibold uppercase tracking-[0.08em] ${KIND_STYLES[target.kind]}`}>
        {target.kind}
      </span>
      <span className="font-[family-name:var(--mono)] text-sm text-[var(--ink)]">
        ${target.price.toFixed(2)}
      </span>
      <div className="min-w-0">
        {target.label && (
          <div className="text-sm text-[var(--ink)] font-medium truncate">{target.label}</div>
        )}
        {target.note && (
          <div className="text-xs text-[var(--ink-3)] mt-0.5 truncate">{target.note}</div>
        )}
      </div>
      <StatusDot status={target.status} />
      <div className="flex justify-end gap-1">
        <button
          className="w-[26px] h-[26px] inline-flex items-center justify-center rounded border border-transparent text-[var(--ink-3)] hover:bg-[var(--paper-2)] hover:border-[var(--rule)] transition-colors"
          aria-label="Edit target"
          title="Edit"
        >
          <Pencil size={12} />
        </button>
        <button
          onClick={handleDelete}
          disabled={isPending}
          className="w-[26px] h-[26px] inline-flex items-center justify-center rounded border border-transparent text-[var(--ink-3)] hover:bg-[var(--paper-2)] hover:border-[var(--rule)] hover:text-[var(--accent)] transition-colors disabled:opacity-40"
          aria-label="Delete target"
          title="Delete"
        >
          <Trash2 size={12} />
        </button>
      </div>
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
