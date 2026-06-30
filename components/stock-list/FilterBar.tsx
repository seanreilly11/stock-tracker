"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type Filter = "all" | "alerts" | "core";

interface FilterBarProps {
  filter: Filter;
  sort: "sector" | "recent";
  query: string;
  counts: { all: number; alerts: number; core: number };
}

const FilterBar = ({ filter, sort, query, counts }: FilterBarProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [inputValue, setInputValue] = useState(query);

  // Keep local input in sync if URL changes externally (adjust during render)
  const [syncedQuery, setSyncedQuery] = useState(query);
  if (query !== syncedQuery) {
    setSyncedQuery(query);
    setInputValue(query);
  }

  const update = useCallback(
    (overrides: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [k, v] of Object.entries(overrides)) {
        if (v === "all" || v === "sector" || v === "") {
          params.delete(k);
        } else {
          params.set(k, v);
        }
      }
      const search = params.toString();
      router.push(search ? `/?${search}` : "/", { scroll: false });
    },
    [router, searchParams],
  );

  // Debounce search input - avoid a server request on every keystroke
  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputValue !== query) update({ q: inputValue });
    }, 300);
    return () => clearTimeout(timer);
  }, [inputValue, query, update]);

  const tabs: { key: Filter; label: string }[] = [
    { key: "all", label: "All" },
    { key: "alerts", label: "Alerts" },
    { key: "core", label: "Core" },
  ];

  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between border-b border-[var(--rule)] pb-0 mb-0 gap-2 sm:gap-4">
      <div className="flex gap-4 overflow-x-auto">
        {tabs.map(({ key, label }) => (
          <button
            type="button"
            key={key}
            onClick={() => update({ filter: key })}
            className={`font-[family-name:var(--mono)] text-[11px] uppercase tracking-[0.06em] pb-3 border-b transition-colors ${
              filter === key
                ? "text-[var(--ink)] border-[var(--ink)]"
                : "text-[var(--ink-3)] border-transparent hover:text-[var(--ink-2)]"
            }`}
          >
            {label}
            <span
              className={`ml-1 text-[10px] ${filter === key ? "text-[var(--ink-3)]" : "text-[var(--ink-4)]"}`}
            >
              {counts[key]}
            </span>
          </button>
        ))}
      </div>
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pb-2">
        <div className="flex items-center gap-1.5 px-2 py-1 rounded border border-[var(--rule)] bg-[var(--paper)] w-full sm:w-40">
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-[var(--ink-3)] flex-shrink-0"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.3-4.3" />
          </svg>
          <input
            className="flex-1 bg-transparent text-[12.5px] text-[var(--ink)] placeholder:text-[var(--ink-4)] outline-none"
            placeholder="Filter…"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        </div>
        <select
          className="border border-[var(--rule)] bg-[var(--paper)] rounded px-2 py-1 text-[12.5px] font-[family-name:var(--sans)] text-[var(--ink-2)] outline-none cursor-pointer w-full sm:w-auto"
          value={sort}
          onChange={(e) => update({ sort: e.target.value })}
        >
          <option value="sector">Sort: Sector</option>
          <option value="recent">Sort: Recent</option>
        </select>
      </div>
    </div>
  );
};

export default FilterBar;
