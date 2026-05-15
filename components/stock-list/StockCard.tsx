"use client";
import { use } from "react";
import Link from "next/link";
import { TrendingUp, TrendingDown } from "lucide-react";
import { TStock, TTarget } from "@/types";
import PriceTargetRail from "@/components/ui/PriceTargetRail";

interface PrevResult {
    c: number;
    o: number;
    h: number;
    l: number;
    v: number;
    vw: number;
}

interface StockCardProps {
    stock: TStock;
    pricePromise: Promise<{ results?: PrevResult[] } | null>;
    triggeredCount?: number;
    targets?: TTarget[];
}

const StockCard = ({ stock, pricePromise, triggeredCount = 0, targets = [] }: StockCardProps) => {
    const priceData = use(pricePromise);
    const result = priceData?.results?.[0] ?? null;
    const livePrice = result?.c ?? null;
    const changePerc = result ? ((result.c - result.o) / result.o) * 100 : 0;
    const isUp = changePerc >= 0;
    const isTriggered = triggeredCount > 0;

    return (
        <Link
            href={`/stocks/${stock.ticker}`}
            className={`relative block rounded-lg border p-3 sm:p-4 transition-all hover:-translate-y-px hover:shadow-[0_8px_20px_-12px_oklch(20%_0.01_60_/_0.18)] cursor-pointer ${
                isTriggered
                    ? "border-[var(--accent-line)] bg-[var(--accent-soft)] hover:border-[var(--accent)]"
                    : "border-[var(--rule)] bg-[var(--paper)] hover:border-[var(--ink-4)]"
            }`}
        >
            {isTriggered && (
                <span className="absolute left-0 top-3.5 bottom-3.5 w-0.5 bg-[var(--accent)] rounded-r" />
            )}
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
                            {isUp ? (
                                <TrendingUp size={11} />
                            ) : (
                                <TrendingDown size={11} />
                            )}
                            {Math.abs(changePerc).toFixed(2)}%
                        </span>
                    )}
                </div>
            </div>

            <p className="text-xs text-[var(--ink-3)] truncate mb-1">
                {stock.name}
            </p>

            <PriceTargetRail targets={targets} currentPrice={livePrice ?? undefined} compact />

        </Link>
    );
};

export default StockCard;
