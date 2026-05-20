import { Suspense } from "react";
import { getUidFromSession } from "@/lib/session";
import { getUserStocks, getTargetCountsByUser } from "@/lib/data";
import StockCard from "./StockCard";
import FilterBar from "./FilterBar";
import EmptyState from "@/components/common/EmptyState";
import SearchFocusButton from "./SearchFocusButton";
import { EIBook } from "@/components/ui/EmptyIcons";
import { TStock } from "@/types";

type Filter = "all" | "alerts" | "core";

interface StockListSectionProps {
    searchParams: { filter?: string; sort?: string; q?: string };
}

const StockCardSkeleton = () => (
    <div className="rounded-lg border border-[var(--rule)] bg-[var(--paper)] p-4 animate-pulse">
        <div className="h-4 bg-[var(--paper-3)] rounded w-1/3 mb-2" />
        <div className="h-3 bg-[var(--paper-3)] rounded w-2/3" />
    </div>
);

const StockListSection = async ({ searchParams }: StockListSectionProps) => {
    const filter = (searchParams.filter ?? "all") as Filter;
    const sort = (searchParams.sort ?? "sector") as "sector" | "recent";
    const query = searchParams.q ?? "";

    const uid = await getUidFromSession();
    const [stocks, targetCounts] = await Promise.all([
        getUserStocks(uid),
        getTargetCountsByUser(uid),
    ]);

    const counts = {
        all: stocks.length,
        alerts: stocks.filter(s => (targetCounts.triggered[s.id] ?? 0) > 0).length,
        core: stocks.filter(s => s.tag === "core").length,
    };

    let visible = stocks;
    if (query.trim()) {
        const q = query.toLowerCase();
        visible = visible.filter(s =>
            s.ticker.toLowerCase().includes(q) || s.name.toLowerCase().includes(q),
        );
    }
    if (filter === "alerts") visible = visible.filter(s => (targetCounts.triggered[s.id] ?? 0) > 0);
    if (filter === "core")   visible = visible.filter(s => s.tag === "core");
    if (sort === "recent")   visible = [...visible].sort((a, b) =>
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
    );

    const showSectors = sort === "sector" && !query.trim() && filter === "all";

    const renderCard = (stock: TStock) => (
        <Suspense key={stock.id} fallback={<StockCardSkeleton />}>
            <StockCard
                stock={stock}
                triggeredCount={targetCounts.triggered[stock.id] ?? 0}
                targets={targetCounts.targetsByStock[stock.id] ?? []}
            />
        </Suspense>
    );

    const grouped = showSectors
        ? visible.reduce<Record<string, TStock[]>>((acc, stock) => {
            const key = stock.sector ?? "Watchlist";
            (acc[key] ??= []).push(stock);
            return acc;
        }, {})
        : null;

    return (
        <section className="mt-10">
            <FilterBar filter={filter} sort={sort} query={query} counts={counts} />

            {stocks.length === 0 ? (
                <div
                    className="mt-8 rounded-[8px] border border-dashed border-[var(--rule)]"
                    style={{
                        background:
                            'repeating-linear-gradient(135deg, transparent 0, transparent 12px, color-mix(in oklch, var(--rule-soft) 50%, transparent) 12px, color-mix(in oklch, var(--rule-soft) 50%, transparent) 13px), var(--paper)',
                        padding: '72px 32px',
                    }}
                >
                    <EmptyState
                        size="lg"
                        variant="inline"
                        icon={<EIBook />}
                        eyebrow="Your watchlist"
                        title="Start your notebook."
                        body="Add the first ticker you want to be ready for. Write what you believe, set the price you'd act on, and we'll meet you there when the move comes."
                        action={<SearchFocusButton />}
                    />
                </div>
            ) : visible.length === 0 ? (
                <p className="py-12 text-center text-sm text-[var(--ink-3)]">No stocks match.</p>
            ) : (
                <div className="mt-8">
                    {grouped ? (
                        Object.entries(grouped).map(([sector, sectorStocks]) => (
                            <div key={sector} className="mb-8">
                                <div className="flex items-center gap-3 mb-4 font-[family-name:var(--mono)] text-[11px] uppercase tracking-[0.08em] text-[var(--ink-3)]">
                                    <span>{sector}</span>
                                    <span className="flex-1 h-px bg-[var(--rule)]" />
                                    <span className="text-[var(--ink-4)]">{sectorStocks.length}</span>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-3">
                                    {sectorStocks.map(renderCard)}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-3">
                            {visible.map(renderCard)}
                        </div>
                    )}
                </div>
            )}
        </section>
    );
};

export default StockListSection;
