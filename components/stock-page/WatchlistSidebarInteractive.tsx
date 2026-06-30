"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { TStock } from "@/types";
import { APP_TITLE } from "@/lib/utils/constants";
import EmptyState from "@/components/common/EmptyState";
import { EIBook } from "@/components/ui/EmptyIcons";

type Tab = "all" | "alerts" | "core";

interface WatchlistSidebarInteractiveProps {
    stocks: TStock[];
    currentTicker: string;
    triggeredCounts: Record<string, number>;
}

const WatchlistSidebarInteractive = ({ stocks, currentTicker, triggeredCounts }: WatchlistSidebarInteractiveProps) => {
    const [tab, setTab] = useState<Tab>("all");
    const [query, setQuery] = useState("");
    const [collapsed, setCollapsed] = useState(false);

    const counts = {
        all:    stocks.length,
        alerts: stocks.filter(s => (triggeredCounts[s.id] ?? 0) > 0).length,
        core:   stocks.filter(s => s.tag === "core").length,
    };

    const filtered = useMemo(() => {
        let v = stocks;
        if (query.trim()) {
            const q = query.toLowerCase();
            v = v.filter(s => s.ticker.toLowerCase().includes(q) || s.name.toLowerCase().includes(q));
        }
        if (tab === "alerts") v = v.filter(s => (triggeredCounts[s.id] ?? 0) > 0);
        if (tab === "core")   v = v.filter(s => s.tag === "core");
        return v;
    }, [stocks, query, tab, triggeredCounts]);

    const tabs: { key: Tab; label: string }[] = [
        { key: "all",    label: "All" },
        { key: "alerts", label: "Alerts" },
        { key: "core",   label: "Core" },
    ];

    if (collapsed) {
        return (
            <aside className="hidden sm:flex flex-col border-r border-[var(--rule)] bg-[var(--paper-2)] min-h-0 w-10 shrink-0 items-center pt-4">
                <button
                    type="button"
                    onClick={() => setCollapsed(false)}
                    className="w-7 h-7 flex items-center justify-center rounded text-[var(--ink-3)] hover:bg-[var(--paper)] hover:text-[var(--ink)] transition-colors"
                    title="Expand watchlist"
                >
                    <ChevronRight size={14} />
                </button>
            </aside>
        );
    }

    return (
        <aside className="hidden sm:flex flex-col border-r border-[var(--rule)] bg-[var(--paper-2)] min-h-0 overflow-hidden w-[320px] shrink-0">
            {/* Brand */}
            <div className="px-6 pt-5 pb-4 border-b border-[var(--rule)]">
                <div className="flex items-center gap-2">
                    <span className="w-[9px] h-[9px] rounded-[2px] bg-[var(--ink)] flex-shrink-0" />
                    <span className="font-[family-name:var(--serif)] text-[19px] font-medium tracking-[-0.01em] text-[var(--ink)] flex-1 whitespace-nowrap">
                        {APP_TITLE}
                    </span>
                    <span className="font-[family-name:var(--mono)] text-[9.5px] text-[var(--ink-4)] uppercase tracking-[0.08em] flex-shrink-0">
                        beta
                    </span>
                    <button
                        type="button"
                        onClick={() => setCollapsed(true)}
                        className="w-6 h-6 flex items-center justify-center rounded text-[var(--ink-4)] hover:bg-[var(--paper)] hover:text-[var(--ink-2)] transition-colors flex-shrink-0"
                        title="Collapse watchlist"
                    >
                        <ChevronLeft size={13} />
                    </button>
                </div>

                {/* Search */}
                <div className="mt-3.5 flex items-center gap-2 px-2.5 py-1.5 bg-[var(--paper)] border border-[var(--rule)] rounded-md">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--ink-3)] flex-shrink-0">
                        <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.3-4.3"/>
                    </svg>
                    <input
                        className="flex-1 bg-transparent text-[13px] text-[var(--ink)] placeholder:text-[var(--ink-4)] outline-none"
                        placeholder="Filter…"
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 px-4 border-b border-[var(--rule)] font-[family-name:var(--mono)] text-[11px] uppercase tracking-[0.06em]">
                {tabs.map(({ key, label }) => (
                    <button
                        type="button"
                        key={key}
                        onClick={() => setTab(key)}
                        className={`py-2.5 border-b transition-colors ${
                            tab === key
                                ? "text-[var(--ink)] border-[var(--ink)]"
                                : "text-[var(--ink-3)] border-transparent hover:text-[var(--ink-2)]"
                        }`}
                    >
                        {label}
                        <span className="ml-1 text-[10px] text-[var(--ink-4)]">{counts[key]}</span>
                    </button>
                ))}
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto py-1.5">
                {stocks.length === 0 ? (
                    <div className="flex items-center justify-center h-full min-h-[200px]">
                        <EmptyState
                            size="md"
                            variant="inline"
                            icon={<EIBook />}
                            title="Your notebook starts here"
                            body="Add the first ticker you want to be ready for. Set a thesis, a target, and we'll meet you there."
                            action={
                                <Link
                                    href="/"
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)] font-[family-name:var(--sans)] text-[12.5px] font-medium hover:opacity-80 transition-opacity"
                                >
                                    + Add your first ticker
                                </Link>
                            }
                        />
                    </div>
                ) : filtered.length === 0 ? (
                    <p className="px-5 py-10 text-[13px] text-[var(--ink-3)] text-center">
                        Nothing matches.
                    </p>
                ) : (
                    filtered.map(stock => {
                        const isSelected = stock.ticker === currentTicker;
                        const isTriggered = (triggeredCounts[stock.id] ?? 0) > 0;

                        return (
                            <Link
                                key={stock.ticker}
                                href={`/stocks/${stock.ticker}`}
                                className={`grid items-center h-12 pr-5 border-b border-[var(--rule-soft)] transition-colors ${
                                    isSelected ? "bg-[var(--paper)]" : "hover:bg-[var(--paper)]"
                                }`}
                                style={{ gridTemplateColumns: "3px 56px 1fr" }}
                            >
                                <span className={`h-[60%] rounded-r-sm ${
                                    isSelected   ? "bg-[var(--ink)]"
                                    : isTriggered ? "bg-[var(--accent)]"
                                    : "bg-transparent"
                                }`} />
                                <span className="font-[family-name:var(--mono)] font-medium text-[12.5px] tracking-[0.02em] text-[var(--ink)] pl-4">
                                    {stock.ticker}
                                </span>
                                <div className="min-w-0 pr-2">
                                    <div className="text-[12px] text-[var(--ink-3)] truncate">{stock.name}</div>
                                    <div className="flex items-center gap-1.5 font-[family-name:var(--mono)] text-[10px] text-[var(--ink-4)] uppercase tracking-[0.06em] mt-0.5">
                                        {stock.sector && <span>{stock.sector}</span>}
                                        {isTriggered && <span className="text-[var(--accent)]">· alert</span>}
                                    </div>
                                </div>
                            </Link>
                        );
                    })
                )}
            </div>

            {/* Footer */}
            <div className="px-5 py-3.5 border-t border-[var(--rule)] flex items-center justify-between text-[12px] text-[var(--ink-3)] bg-[var(--paper-2)]">
                <span>
                    {stocks.length} tracked
                    {counts.alerts > 0 && ` · ${counts.alerts} alert${counts.alerts !== 1 ? "s" : ""}`}
                </span>
            </div>
        </aside>
    );
};

export default WatchlistSidebarInteractive;
