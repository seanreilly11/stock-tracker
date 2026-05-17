import Link from "next/link";

export interface RelatedCard {
  ticker: string;
  name: string;
  sector: string | null;
  price: number;
  changePercent: number;
}

interface Props {
  cards: RelatedCard[];
}

const RelatedStocks = ({ cards }: Props) => {
  if (!cards.length) return null;

  return (
    <section className="mt-9">
      <div className="flex items-baseline gap-3 mb-3.5">
        <span className="font-[family-name:var(--mono)] text-[10px] uppercase tracking-[0.10em] text-[var(--ink-3)]">
          Related
        </span>
        <span className="font-[family-name:var(--mono)] text-[10px] text-[var(--ink-4)]">
          click to open
        </span>
      </div>

      <div className="grid gap-[10px]" style={{ gridTemplateColumns: "repeat(4, minmax(0, 1fr))" }}>
        {cards.map((c) => (
          <Link
            key={c.ticker}
            href={`/stocks/${c.ticker}`}
            className="flex flex-col gap-[10px] p-[14px_14px_12px] bg-[var(--paper)] border border-[var(--rule)] rounded-md text-left cursor-pointer transition-all no-underline hover:border-[var(--ink-3)] hover:bg-[var(--paper-2)] active:translate-y-px"
          >
            {/* Head */}
            <div className="flex items-baseline justify-between gap-2">
              <span className="font-[family-name:var(--mono)] font-medium text-[14px] tracking-[0.04em] text-[var(--ink)]">
                {c.ticker}
              </span>
              <span
                className="font-[family-name:var(--mono)] text-[11px]"
                style={{ color: c.changePercent >= 0 ? "var(--green)" : "var(--accent)" }}
              >
                {c.changePercent >= 0 ? "▲" : "▼"} {Math.abs(c.changePercent).toFixed(2)}%
              </span>
            </div>

            {/* Name */}
            <div
              className="font-[family-name:var(--serif)] text-[14.5px] leading-[1.3] text-[var(--ink-2)] line-clamp-2"
              style={{ minHeight: "2.6em" }}
            >
              {c.name}
            </div>

            {/* Foot */}
            <div className="flex items-center justify-between gap-2 border-t border-[var(--rule-soft)] pt-2 mt-auto">
              {c.sector ? (
                <span className="font-[family-name:var(--mono)] text-[10px] uppercase tracking-[0.06em] text-[var(--ink-4)] truncate">
                  {c.sector}
                </span>
              ) : (
                <span />
              )}
              <span className="font-[family-name:var(--mono)] text-[12.5px] text-[var(--ink)] flex-shrink-0">
                ${c.price.toFixed(2)}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default RelatedStocks;
