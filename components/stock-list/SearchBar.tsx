"use client";
import React, { useState, useRef, useEffect, useTransition } from "react";
import { Search, Plus, Check, Loader2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { decompressIndex, searchTickers, type RawIndexEntry, type SearchResult } from "@/lib/search/ticker-search";
import { searchStocks } from "@/lib/api/stocks";
import { addToNextToBuyAction } from "@/lib/actions/stocks";
import AddStockModal from "./AddStockModal";

let _indexCache: ReturnType<typeof decompressIndex> | null = null;
let _indexLoading: Promise<ReturnType<typeof decompressIndex>> | null = null;

async function getIndex() {
  if (_indexCache) return _indexCache;
  if (_indexLoading) return _indexLoading;
  _indexLoading = fetch("/tickers.json")
    .then((r) => r.json() as Promise<RawIndexEntry[]>)
    .then((raw) => {
      _indexCache = decompressIndex(raw);
      return _indexCache;
    })
    .catch((err) => {
      _indexLoading = null;
      throw err;
    });
  return _indexLoading;
}

function mapPolygonResults(
  results: Array<{ ticker: string; name: string; type?: string; primary_exchange?: string }>
): SearchResult[] {
  return results.map((r) => ({
    ticker: r.ticker,
    name: r.name,
    kind: r.type === "ETF" ? ("etf" as const) : ("stock" as const),
    exchange: r.primary_exchange ?? "",
    popular: false,
    score: 0,
    matchType: "name-contains" as const,
  }));
}

interface SearchBarProps {
  nextToBuy?: boolean;
  savedTickers?: string[];
  setError?: React.Dispatch<React.SetStateAction<string | null>>;
}

const SearchBar = ({
  nextToBuy,
  savedTickers = [],
  setError,
}: SearchBarProps) => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [configuringStock, setConfiguringStock] =
    useState<{ ticker: string; name: string } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let cancelled = false;
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!search) {
      setResults([]);
      return () => { cancelled = true; };
    }

    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const index = await getIndex();
        if (cancelled) return;
        const local = searchTickers(search, index, { limit: 25 });

        if (local.length === 0) {
          const fallback = await searchStocks(search);
          if (cancelled) return;
          setResults(mapPolygonResults(fallback?.results ?? []));
        } else {
          setResults(local);
        }
      } catch {
        // index load failed — fall through to Polygon
        if (!cancelled) {
          const fallback = await searchStocks(search);
          if (cancelled) return;
          setResults(mapPolygonResults(fallback?.results ?? []));
        }
      } finally {
        if (!cancelled) setSearching(false);
      }
    }, 120);

    return () => {
      cancelled = true;
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [search]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSelect = (stock: SearchResult) => {
    setSearch("");
    setOpen(false);
    router.push(`/stocks/${stock.ticker}`);
  };

  const handleAdd = (e: React.MouseEvent, stock: SearchResult) => {
    e.stopPropagation();
    if (savedTickers.includes(stock.ticker)) return;
    setSearch("");
    setOpen(false);
    if (nextToBuy) {
      startTransition(async () => {
        try {
          await addToNextToBuyAction(stock.ticker);
        } catch (err) {
          setError?.((err as Error).message);
        }
      });
    } else {
      setConfiguringStock({ ticker: stock.ticker, name: stock.name });
    }
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="flex items-center gap-2 px-3 py-2 rounded-md border border-[var(--rule)] bg-[var(--paper)] focus-within:border-[var(--ink-3)] transition-colors">
        {(searching || isPending) && search ? (
          <Loader2
            size={14}
            className="text-[var(--ink-3)] animate-spin shrink-0"
          />
        ) : (
          <Search size={14} className="text-[var(--ink-3)] shrink-0" />
        )}
        <input
          id={nextToBuy ? undefined : 'stock-search-input'}
          className="flex-1 bg-transparent text-sm text-[var(--ink)] placeholder:text-[var(--ink-4)] outline-none"
          placeholder={
            nextToBuy
              ? "Search to add to next-to-buy…"
              : "Search stocks and ETFs…"
          }
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setOpen(true);
          }}
          onFocus={() => search && setOpen(true)}
        />
        {search && (
          <button
            type="button"
            className="text-[var(--ink-4)] hover:text-[var(--ink-2)]"
            onClick={() => {
              setSearch("");
              setOpen(false);
            }}
          >
            <X size={14} />
          </button>
        )}
      </div>

      {open && search && (searching || results.length > 0) && (
        <div className="absolute left-0 right-0 top-full mt-1 z-50 rounded-md border border-[var(--rule)] bg-[var(--paper)] shadow-lg overflow-hidden max-h-72 overflow-y-auto">
          {searching && results.length === 0 && (
            <div className="px-3 py-3 text-sm text-[var(--ink-3)]">Searching…</div>
          )}
          {!searching && results.length === 0 && (
            <div className="px-3 py-3 text-sm text-[var(--ink-3)]">No results for "{search}"</div>
          )}
          {results.map((stock: SearchResult) => {
            const alreadySaved = savedTickers.includes(stock.ticker);
            return (
              <div
                key={stock.ticker}
                role="button"
                tabIndex={0}
                className="w-full flex items-center justify-between gap-3 px-3 py-2.5 text-left hover:bg-[var(--paper-2)] transition-colors cursor-pointer"
                onClick={() => handleSelect(stock)}
                onKeyDown={(e) => e.key === "Enter" && handleSelect(stock)}
              >
                <span className="flex items-center gap-2 min-w-0">
                  <span className="font-[family-name:var(--mono)] text-sm font-medium text-[var(--ink)] shrink-0">
                    {stock.ticker}
                  </span>
                  <span className="text-sm text-[var(--ink-3)] truncate">
                    {stock.name}
                  </span>
                </span>
                <button
                  type="button"
                  className="shrink-0 flex items-center justify-center w-6 h-6 rounded border border-[var(--rule)] bg-[var(--paper)] hover:bg-[var(--paper-2)] text-[var(--ink-2)]"
                  onClick={(e) => handleAdd(e, stock)}
                  title={
                    alreadySaved
                      ? "Already added"
                      : nextToBuy
                        ? "Add to next to buy"
                        : "Add to watchlist"
                  }
                >
                  {alreadySaved ? (
                    <Check size={11} />
                  ) : (
                    <Plus size={11} />
                  )}
                </button>
              </div>
            );
          })}
        </div>
      )}
      {configuringStock && (
        <AddStockModal
          stock={configuringStock}
          onClose={() => setConfiguringStock(null)}
        />
      )}
    </div>
  );
};

export default SearchBar;
