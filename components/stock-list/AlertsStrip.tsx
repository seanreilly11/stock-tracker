import Link from "next/link"
import { TriggeredAlert } from "@/lib/data"
import CheckPricesButton from "@/components/stock-list/CheckPricesButton"
import EmptyState from "@/components/common/EmptyState"
import { EIBell } from "@/components/ui/EmptyIcons"

interface AlertsStripProps {
  alerts: TriggeredAlert[]
}

function timeAgo(dateStr: string | null): string {
  if (!dateStr) return ""
  const diff = (Date.now() - new Date(dateStr).getTime()) / 1000
  if (diff < 60)    return `${Math.floor(diff)}s ago`
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

const PIP_SYMBOL: Record<string, string> = { buy: "↓", sell: "↑", stop: "⚑" }
const PIP_CLASS: Record<string, string> = {
  buy:  "bg-[var(--green-soft)] text-[var(--green)] border-[var(--green-line)]",
  sell: "bg-[var(--paper-2)] text-[var(--ink)] border-[var(--rule)]",
  stop: "bg-[var(--accent-soft)] text-[var(--accent)] border-[var(--accent-line)]",
}

const AlertsStrip = ({ alerts }: AlertsStripProps) => {
  const isEmpty = alerts.length === 0
  return (
    <section>
      <div className="flex items-baseline justify-between border-b border-[var(--rule)] pb-2 mb-1">
        <span className="font-[family-name:var(--mono)] text-[11px] uppercase tracking-[0.08em] text-[var(--ink-3)]">
          Today&apos;s alerts
        </span>
        {isEmpty ? (
          <span className="font-[family-name:var(--serif)] italic text-[12px] text-[var(--ink-4)]">
            a quiet inbox is a good thing
          </span>
        ) : (
          <CheckPricesButton />
        )}
      </div>
      {isEmpty ? (
        <EmptyState
          size="sm"
          variant="card"
          icon={<EIBell />}
          title="Nothing triggered today"
          body="When a price you wrote down is hit, the alert lands here — and in your email."
        />
      ) : (
        <div className="flex flex-col border-t border-[var(--rule-soft)]">
          {alerts.slice(0, 3).map(alert => (
            <Link
              key={alert.id}
              href={`/stocks/${alert.ticker}`}
              className="grid gap-2 sm:gap-3 items-center px-1 py-2.5 border-b border-[var(--rule-soft)] hover:bg-[var(--paper-2)] transition-colors text-left grid-cols-[22px_1fr_auto] sm:grid-cols-[22px_52px_1fr_auto]"
            >
              <span className={`w-[22px] h-[22px] rounded-full border inline-flex items-center justify-center font-[family-name:var(--mono)] text-[11px] ${PIP_CLASS[alert.kind]}`}>
                {PIP_SYMBOL[alert.kind]}
              </span>
              <span className="hidden sm:inline font-[family-name:var(--mono)] font-medium text-[12.5px] text-[var(--ink)]">
                {alert.ticker}
              </span>
              <span className="font-[family-name:var(--mono)] text-[11px] uppercase tracking-[0.06em] text-[var(--ink-2)]">
                <span className="sm:hidden font-medium text-[var(--ink)]">{alert.ticker} · </span>
                {alert.kind} ${alert.price.toFixed(2)}
              </span>
              <span className="font-[family-name:var(--mono)] text-[10.5px] uppercase tracking-[0.06em] text-[var(--ink-4)]">
                {timeAgo(alert.triggered_at)}
              </span>
            </Link>
          ))}
        </div>
      )}
    </section>
  )
}

export default AlertsStrip
