'use client'
import { useState, useTransition } from 'react'
import { X } from 'lucide-react'
import { SearchedStockPolygon } from '@/types'
import { addStockWithConfigAction } from '@/lib/actions/stocks'
import Button from '@/components/ui/Button'

type Conviction = 'low' | 'medium' | 'high'
type Tag = 'core' | 'starter' | 'speculative' | 'watch'

interface AddStockModalProps {
  stock: SearchedStockPolygon
  onClose: () => void
}

const CONVICTIONS: [Conviction, string, string][] = [
  ['low',    'Low',    'Sniffing around'],
  ['medium', 'Medium', 'Building a position'],
  ['high',   'High',   'Core holding'],
]

const TAGS: Tag[] = ['core', 'starter', 'speculative', 'watch']

const AddStockModal = ({ stock, onClose }: AddStockModalProps) => {
  const [conviction, setConviction] = useState<Conviction | null>(null)
  const [tag, setTag] = useState<Tag | null>(null)
  const [buyPrice, setBuyPrice] = useState('')
  const [buyNote, setBuyNote] = useState('')
  const [trimPrice, setTrimPrice] = useState('')
  const [trimNote, setTrimNote] = useState('')
  const [thesis, setThesis] = useState('')
  const [isPending, startTransition] = useTransition()

  const handleSubmit = () => {
    startTransition(async () => {
      await addStockWithConfigAction(stock.ticker, stock.name, {
        conviction: conviction ?? undefined,
        tag: tag ?? undefined,
        buyPrice:  buyPrice  ? parseFloat(buyPrice)  : undefined,
        buyNote:   buyNote   || undefined,
        trimPrice: trimPrice ? parseFloat(trimPrice) : undefined,
        trimNote:  trimNote  || undefined,
        thesis:    thesis    || undefined,
      })
      onClose()
    })
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[oklch(20%_0.012_60_/_0.36)] backdrop-blur-sm"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="w-full max-w-lg bg-[var(--paper)] border border-[var(--rule)] rounded-lg shadow-xl flex flex-col max-h-[calc(100vh-48px)] overflow-hidden">

        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-[var(--rule)]">
          <div>
            <p className="font-[family-name:var(--mono)] text-[10px] uppercase tracking-[0.1em] text-[var(--ink-3)] mb-1">
              Add to watchlist
            </p>
            <h2 className="font-[family-name:var(--serif)] text-xl text-[var(--ink)]">
              {stock.name}
              <span className="font-[family-name:var(--mono)] text-base text-[var(--ink-3)] ml-2">{stock.ticker}</span>
            </h2>
          </div>
          <button onClick={onClose} className="text-[var(--ink-3)] hover:text-[var(--ink)] p-1 transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-5">

          {/* Conviction */}
          <div>
            <p className="font-[family-name:var(--mono)] text-[10px] uppercase tracking-[0.1em] text-[var(--ink-2)] font-semibold mb-2">
              Conviction
            </p>
            <div className="grid grid-cols-3 gap-2">
              {CONVICTIONS.map(([v, label, sub]) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setConviction(v === conviction ? null : v)}
                  className={`flex flex-col gap-0.5 p-2.5 text-left rounded border transition-colors ${
                    conviction === v
                      ? 'border-[var(--ink)] bg-[var(--paper-2)]'
                      : 'border-[var(--rule)] bg-[var(--paper)] hover:bg-[var(--paper-2)]'
                  }`}
                >
                  <span className="text-sm font-semibold text-[var(--ink)]">{label}</span>
                  <span className="text-[11px] text-[var(--ink-3)] leading-snug">{sub}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tag */}
          <div>
            <p className="font-[family-name:var(--mono)] text-[10px] uppercase tracking-[0.1em] text-[var(--ink-2)] font-semibold mb-2">
              Tag
            </p>
            <div className="flex gap-2 flex-wrap">
              {TAGS.map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTag(t === tag ? null : t)}
                  className={`px-3 py-1 rounded text-sm border transition-colors ${
                    tag === t
                      ? 'bg-[var(--ink)] text-[var(--paper)] border-[var(--ink)]'
                      : 'bg-[var(--paper)] text-[var(--ink-2)] border-[var(--rule)] hover:bg-[var(--paper-2)]'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Initial targets */}
          <div>
            <p className="font-[family-name:var(--mono)] text-[10px] uppercase tracking-[0.1em] text-[var(--ink-2)] font-semibold mb-2">
              Initial targets{' '}
              <span className="font-normal text-[var(--ink-3)] text-[11px] normal-case tracking-normal">optional</span>
            </p>
            <div className="grid grid-cols-2 gap-3">
              {/* Buy */}
              <div className={`flex flex-col gap-2 p-3 rounded border transition-colors ${buyPrice ? 'border-[oklch(80%_0.07_145)] bg-[var(--paper-2)]' : 'border-[var(--rule)]'}`}>
                <div className="flex items-center gap-2">
                  <span className="font-[family-name:var(--mono)] text-[9px] uppercase tracking-[0.1em] font-semibold px-1.5 py-0.5 rounded bg-[oklch(94%_0.04_145)] text-[var(--green)] shrink-0">
                    Buy at
                  </span>
                  <div className="flex items-center gap-1 flex-1 border border-[var(--rule)] rounded px-2 py-1 bg-[var(--paper)] min-w-0">
                    <span className="font-[family-name:var(--mono)] text-[var(--ink-3)] text-xs">$</span>
                    <input
                      type="text" inputMode="decimal" placeholder="0.00"
                      value={buyPrice}
                      onChange={e => { if (/^[\d.]*$/.test(e.target.value)) setBuyPrice(e.target.value) }}
                      className="flex-1 bg-transparent outline-none font-[family-name:var(--mono)] text-sm text-[var(--ink)] placeholder:text-[var(--ink-4)] w-0"
                    />
                  </div>
                </div>
                <input
                  type="text" placeholder="Why this price?"
                  value={buyNote} onChange={e => setBuyNote(e.target.value)}
                  className="bg-transparent border-b border-[var(--rule)] outline-none text-xs text-[var(--ink-2)] placeholder:text-[var(--ink-4)] pb-1 focus:border-[var(--ink-3)]"
                />
              </div>

              {/* Trim */}
              <div className={`flex flex-col gap-2 p-3 rounded border transition-colors ${trimPrice ? 'border-[var(--accent-line)] bg-[var(--paper-2)]' : 'border-[var(--rule)]'}`}>
                <div className="flex items-center gap-2">
                  <span className="font-[family-name:var(--mono)] text-[9px] uppercase tracking-[0.1em] font-semibold px-1.5 py-0.5 rounded bg-[var(--accent-soft)] text-[var(--accent)] shrink-0">
                    Trim at
                  </span>
                  <div className="flex items-center gap-1 flex-1 border border-[var(--rule)] rounded px-2 py-1 bg-[var(--paper)] min-w-0">
                    <span className="font-[family-name:var(--mono)] text-[var(--ink-3)] text-xs">$</span>
                    <input
                      type="text" inputMode="decimal" placeholder="0.00"
                      value={trimPrice}
                      onChange={e => { if (/^[\d.]*$/.test(e.target.value)) setTrimPrice(e.target.value) }}
                      className="flex-1 bg-transparent outline-none font-[family-name:var(--mono)] text-sm text-[var(--ink)] placeholder:text-[var(--ink-4)] w-0"
                    />
                  </div>
                </div>
                <input
                  type="text" placeholder="Why this price?"
                  value={trimNote} onChange={e => setTrimNote(e.target.value)}
                  className="bg-transparent border-b border-[var(--rule)] outline-none text-xs text-[var(--ink-2)] placeholder:text-[var(--ink-4)] pb-1 focus:border-[var(--ink-3)]"
                />
              </div>
            </div>
          </div>

          {/* Thesis */}
          <div>
            <p className="font-[family-name:var(--mono)] text-[10px] uppercase tracking-[0.1em] text-[var(--ink-2)] font-semibold mb-2">
              Thesis seed{' '}
              <span className="font-normal text-[var(--ink-3)] text-[11px] normal-case tracking-normal">optional · flesh out later</span>
            </p>
            <textarea
              rows={3}
              placeholder="What has to be true? What breaks the thesis?"
              value={thesis}
              onChange={e => setThesis(e.target.value)}
              className="w-full font-[family-name:var(--serif)] text-sm leading-relaxed text-[var(--ink)] placeholder:text-[var(--ink-3)] bg-[var(--paper-2)] border border-[var(--rule)] rounded p-3 outline-none resize-none focus:border-[var(--ink-3)] focus:bg-[var(--paper)] transition-colors"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[var(--rule)] bg-[var(--paper-2)]">
          <Button variant="ghost" size="sm" onClick={onClose}>Cancel</Button>
          <Button variant="primary" size="sm" onClick={handleSubmit} loading={isPending}>
            Add to watchlist
          </Button>
        </div>
      </div>
    </div>
  )
}

export default AddStockModal
