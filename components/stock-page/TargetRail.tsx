import { TTarget } from '@/types'

interface TargetRailProps {
  targets: TTarget[]
  currentPrice?: number
}

const KIND_COLOR: Record<TTarget['kind'], string> = {
  buy:  'var(--green)',
  sell: 'var(--accent)',
  stop: 'var(--accent)',
}

const TargetRail = ({ targets, currentPrice }: TargetRailProps) => {
  if (!currentPrice && targets.length === 0) return null

  if (targets.length === 0) {
    return (
      <div className="mt-5 relative h-14">
        <div className="absolute inset-x-0 top-1/2 h-px bg-[var(--rule)]" />
        <div className="absolute left-1/2 -translate-x-1/2" style={{ top: 'calc(50% - 4px)' }}>
          <div className="w-2 h-2 rounded-full bg-[var(--ink)]" />
        </div>
        {currentPrice && (
          <span
            className="absolute left-1/2 -translate-x-1/2 font-[family-name:var(--mono)] text-[10px] text-[var(--ink)] whitespace-nowrap"
            style={{ top: 'calc(50% + 8px)' }}
          >
            ${currentPrice.toFixed(2)} now
          </span>
        )}
      </div>
    )
  }

  const allPrices = [...targets.map(t => t.price), ...(currentPrice ? [currentPrice] : [])]
  const min = Math.min(...allPrices)
  const max = Math.max(...allPrices)
  const pad = (max - min) * 0.2 || currentPrice! * 0.1
  const lo = min - pad
  const hi = max + pad
  const range = hi - lo

  const pct = (p: number) => `${((p - lo) / range) * 100}%`

  return (
    <div className="mt-5 relative h-16 mx-1">
      {/* Track */}
      <div className="absolute inset-x-0 h-px bg-[var(--rule)]" style={{ top: '50%' }} />

      {/* Target pips */}
      {targets.map(t => (
        <div
          key={t.id}
          className="absolute -translate-x-1/2"
          style={{ left: pct(t.price), top: 0, bottom: 0 }}
        >
          {/* Label above track */}
          <div
            className="absolute left-1/2 -translate-x-1/2 text-center whitespace-nowrap"
            style={{ bottom: 'calc(50% + 6px)' }}
          >
            <div
              className="font-[family-name:var(--mono)] text-[9px] uppercase tracking-[0.06em]"
              style={{ color: KIND_COLOR[t.kind] }}
            >
              {t.kind}
            </div>
            <div
              className="font-[family-name:var(--mono)] text-[11px]"
              style={{ color: KIND_COLOR[t.kind] }}
            >
              ${t.price.toFixed(2)}
            </div>
          </div>
          {/* Pip dot on track */}
          <div
            className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full"
            style={{ top: '50%', background: KIND_COLOR[t.kind] }}
          />
        </div>
      ))}

      {/* Now dot + label */}
      {currentPrice && (
        <div
          className="absolute -translate-x-1/2"
          style={{ left: pct(currentPrice), top: 0, bottom: 0 }}
        >
          <div
            className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[var(--ink)]"
            style={{ top: '50%' }}
          />
          <span
            className="absolute left-1/2 -translate-x-1/2 font-[family-name:var(--mono)] text-[10px] text-[var(--ink)] whitespace-nowrap"
            style={{ top: 'calc(50% + 8px)' }}
          >
            ${currentPrice.toFixed(2)} now
          </span>
        </div>
      )}
    </div>
  )
}

export default TargetRail
