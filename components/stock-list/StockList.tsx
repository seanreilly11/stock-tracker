import { Suspense } from "react";
import { TStock } from "@/types";
import { polygonFetch } from "@/lib/api/polygon";
import StockCard from "./StockCard";
import EmptyState from "@/components/common/EmptyState";
import { getStockPrices } from "@/lib/api/stocks";

interface StockListProps {
  stocks: TStock[];
}

const StockCardSkeleton = () => (
  <div className="rounded-lg border border-[var(--rule)] bg-[var(--paper)] p-4 animate-pulse">
    <div className="h-4 bg-[var(--paper-3)] rounded w-1/3 mb-2" />
    <div className="h-3 bg-[var(--paper-3)] rounded w-2/3" />
  </div>
);

const StockList = ({ stocks }: StockListProps) => {
  if (!stocks || stocks.length === 0) {
    return <EmptyState page="Home" />;
  }

  const grouped = stocks.reduce<Record<string, TStock[]>>((acc, stock) => {
    const key = stock.sector ?? "Watchlist";
    (acc[key] ??= []).push(stock);
    return acc;
  }, {});

  const sectors = Object.keys(grouped);
  const showSectors = sectors.length > 1 || sectors[0] !== "Watchlist";

  const renderCard = (stock: TStock) => {
    const pricePromise = getStockPrices(stock.ticker).catch(() => null);

    return (
      <Suspense key={stock.ticker} fallback={<StockCardSkeleton />}>
        <StockCard stock={stock} pricePromise={pricePromise} />
      </Suspense>
    );
  };

  return (
    <div className="mt-8">
      {showSectors ? (
        sectors.map((sector) => (
          <div key={sector} className="mb-8">
            <div className="flex items-center gap-3 mb-4 font-[family-name:var(--mono)] text-[11px] uppercase tracking-[0.08em] text-[var(--ink-3)]">
              <span>{sector}</span>
              <span className="flex-1 h-px bg-[var(--rule)]" />
              <span className="text-[var(--ink-4)]">
                {grouped[sector].length}
              </span>
            </div>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-3">
              {grouped[sector].map(renderCard)}
            </div>
          </div>
        ))
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-3">
          {stocks.map(renderCard)}
        </div>
      )}
    </div>
  );
};

export default StockList;
