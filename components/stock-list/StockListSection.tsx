"use client";
import { useState, useMemo } from "react";
import { TStock, TTarget } from "@/types";
import StockList from "./StockList";

type Filter = "all" | "alerts" | "core";

interface StockListSectionProps {
  stocks: TStock[];
  triggeredCounts: Record<string, number>;
  targetsByStock: Record<string, TTarget[]>;
}

const StockListSection = ({ stocks, triggeredCounts, targetsByStock }: StockListSectionProps) => {
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"sector" | "recent">("sector");

  const counts = {
    all: stocks.length,
    alerts: stocks.filter(s => (triggeredCounts[s.id] ?? 0) > 0).length,
    core: stocks.filter(s => s.tag === "core").length,
  };

  const visible = useMemo(() => {
    let v = stocks;
    if (query.trim()) {
      const q = query.toLowerCase();
      v = v.filter(s => s.ticker.toLowerCase().includes(q) || s.name.toLowerCase().includes(q));
    }
    if (filter === "alerts") v = v.filter(s => (triggeredCounts[s.id] ?? 0) > 0);
    if (filter === "core")   v = v.filter(s => s.tag === "core");
    if (sort === "recent")   v = [...v].sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
    return v;
  }, [stocks, query, filter, sort, triggeredCounts]);

  const tabs: { key: Filter; label: string }[] = [
    { key: "all",    label: "All" },
    { key: "alerts", label: "Alerts" },
    { key: "core",   label: "Core" },
  ];

  return (
    <section className="mt-10">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between border-b border-[var(--rule)] pb-0 mb-0 gap-2 sm:gap-4">
        <div className="flex gap-4 overflow-x-auto">
          {tabs.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`font-[family-name:var(--mono)] text-[11px] uppercase tracking-[0.06em] pb-3 border-b transition-colors ${
                filter === key
                  ? "text-[var(--ink)] border-[var(--ink)]"
                  : "text-[var(--ink-3)] border-transparent hover:text-[var(--ink-2)]"
              }`}
            >
              {label}
              <span className={`ml-1 text-[10px] ${filter === key ? "text-[var(--ink-3)]" : "text-[var(--ink-4)]"}`}>
                {counts[key]}
              </span>
            </button>
          ))}
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pb-2">
          <div className="flex items-center gap-1.5 px-2 py-1 rounded border border-[var(--rule)] bg-[var(--paper)] w-full sm:w-40">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--ink-3)] flex-shrink-0">
              <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.3-4.3"/>
            </svg>
            <input
              className="flex-1 bg-transparent text-[12.5px] text-[var(--ink)] placeholder:text-[var(--ink-4)] outline-none"
              placeholder="Filter…"
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
          </div>
          <select
            className="border border-[var(--rule)] bg-[var(--paper)] rounded px-2 py-1 text-[12.5px] font-[family-name:var(--sans)] text-[var(--ink-2)] outline-none cursor-pointer w-full sm:w-auto"
            value={sort}
            onChange={e => setSort(e.target.value as "sector" | "recent")}
          >
            <option value="sector">Sort: Sector</option>
            <option value="recent">Sort: Recent</option>
          </select>
        </div>
      </div>
      <StockList
        stocks={visible}
        triggeredCounts={triggeredCounts}
        targetsByStock={targetsByStock}
        groupBySector={sort === "sector" && !query.trim() && filter === "all"}
      />
    </section>
  );
};

export default StockListSection;
