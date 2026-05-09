"use client";
import { use, useMemo } from "react";
import Link from "next/link";
import { TrendingUp, TrendingDown } from "lucide-react";
import { TStock, TStockPrice } from "@/types";
import { getStockPrices } from "@/lib/api/stocks";
import MiniRail from "./MiniRail";

interface StockCardProps {
  stock: TStock;
}

const StockCard = ({ stock }: StockCardProps) => {
  const pricesPromise = useMemo(
    () => getStockPrices(stock.ticker).catch(() => null),
    [stock.ticker],
  );
  const prices: TStockPrice | null = use(pricesPromise);

  const changePerc = prices?.ticker?.todaysChangePerc ?? 0;
  const isUp = changePerc >= 0;
  const livePrice = prices?.ticker?.day?.c || prices?.ticker?.prevDay?.c || 120;

  return (
    <Link
      href={`/stocks/${stock.ticker}`}
      className="block rounded-lg border border-[var(--rule)] bg-[var(--paper)] p-4 transition-all hover:-translate-y-px hover:border-[var(--ink-4)] hover:shadow-[0_8px_20px_-12px_oklch(20%_0.01_60_/_0.18)] cursor-pointer"
    >
      <div className="flex items-baseline justify-between gap-2 mb-1">
        <div className="flex items-center gap-1.5">
          <span className="font-[family-name:var(--mono)] text-sm font-medium tracking-wide text-[var(--ink)]">
            {stock.ticker}
          </span>
          {stock.tag === "core" && (
            <span
              className="w-1.5 h-1.5 rounded-full bg-[var(--ink-3)]"
              title="Core position"
            />
          )}
        </div>
        <div className="flex items-baseline gap-2">
          {livePrice && (
            <span className="font-[family-name:var(--mono)] text-sm text-[var(--ink)]">
              ${livePrice.toFixed(2)}
            </span>
          )}
          {changePerc !== 0 && (
            <span
              className={`inline-flex items-center gap-0.5 font-[family-name:var(--mono)] text-xs ${isUp ? "text-[var(--green)]" : "text-[var(--accent)]"}`}
            >
              {isUp ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
              {Math.abs(changePerc).toFixed(2)}%
            </span>
          )}
        </div>
      </div>

      <p className="text-xs text-[var(--ink-3)] truncate mb-1">{stock.name}</p>

      <MiniRail stock={stock} currentPrice={livePrice} />

      <div className="flex items-center gap-1.5 mt-2">
        <span className="w-1.5 h-1.5 rounded-full bg-[var(--ink-4)]" />
        <span className="font-[family-name:var(--mono)] text-[10px] uppercase tracking-wider text-[var(--ink-3)]">
          {stock.tag ?? "watching"}
        </span>
      </div>
    </Link>
  );
};

export default StockCard;
