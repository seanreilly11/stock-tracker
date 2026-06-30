/**
 * components/TickerSearch.tsx
 *
 * The search input + dropdown for adding stocks to the notebook.
 *
 * Behavior:
 *   - Debounces input (~120ms)
 *   - Keyboard nav: ↑/↓ to move selection, Enter to pick, Esc to close
 *   - Highlights matched portion in ticker/name
 *   - Empty state: Your recents → Trending → Popular curated
 *   - Search results boosted by what the user has recently selected
 *   - Tracks selections to power recents + trending (fire-and-forget)
 *   - Falls back to Polygon search if local index returns zero matches
 *
 * Styling matches the warm-journal direction.
 */

"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import {
  searchTickers,
  decompressIndex,
  getPopularShelf,
  groupResults,
  highlightString,
  type RawIndexEntry,
  type TickerEntry,
  type SearchResult,
} from "@/lib/ticker-search";
import {
  trackSearchSelection,
  getUserRecents,
  getTrending,
  getRecencyBoost,
  type RecentSearch,
  type TrendingEntry,
} from "@/lib/search-analytics";
import { db } from "@/lib/firebase/client"; // Adjust to your firebase init path

// =============================================================================
// PROPS
// =============================================================================

interface TickerSearchProps {
  /** Current user's UID. Pass null/undefined if not logged in - tracking is skipped. */
  userId?: string | null;

  /** Called when user picks a ticker to add. */
  onSelect: (ticker: TickerEntry) => void;

  /** Tickers the user is already tracking - hidden from shelves, dimmed in results. */
  trackedTickers?: Set<string>;

  /** Optional Polygon fallback for queries that miss the local index. */
  fallbackSearch?: (query: string) => Promise<TickerEntry[]>;

  placeholder?: string;
  autoFocus?: boolean;
}

// =============================================================================
// INDEX LOADING (cached in module scope)
// =============================================================================

let _cachedIndex: TickerEntry[] | null = null;
let _loadPromise: Promise<TickerEntry[] | null> | null = null;

async function loadIndex(): Promise<TickerEntry[] | null> {
  if (_cachedIndex) return _cachedIndex;
  if (_loadPromise) return _loadPromise;
  _loadPromise = fetch("/tickers.json")
    .then((res) => res.json() as Promise<RawIndexEntry[]>)
    .then((raw) => {
      _cachedIndex = decompressIndex(raw);
      return _cachedIndex;
    });
  return _loadPromise;
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function TickerSearch({
  userId,
  onSelect,
  trackedTickers = new Set(),
  fallbackSearch,
  placeholder = "Search ticker or company name…",
  autoFocus = false,
}: TickerSearchProps) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [index, setIndex] = useState<TickerEntry[] | null>(null);
  const [recents, setRecents] = useState<RecentSearch[]>([]);
  const [trending, setTrending] = useState<TrendingEntry[]>([]);
  const [fallbackResults, setFallbackResults] = useState<TickerEntry[]>([]);
  const [fallbackLoading, setFallbackLoading] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load index + recents + trending
  useEffect(() => {
    loadIndex().then(setIndex);
  }, []);

  useEffect(() => {
    if (!userId) return;
    getUserRecents(db, userId, trackedTickers, 5).then(setRecents);
  }, [userId, trackedTickers]);

  useEffect(() => {
    const exclude = new Set([
      ...trackedTickers,
      ...recents.map((r) => r.ticker),
    ]);
    getTrending(db, exclude, 5).then(setTrending);
  }, [trackedTickers, recents]);

  // Debounce + selection reset
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 120);
    return () => clearTimeout(t);
  }, [query]);

  useEffect(() => {
    setSelectedIdx(0);
  }, [debouncedQuery]);

  // Local search with recency boost
  const localResults = useMemo<SearchResult[]>(() => {
    if (!index || !debouncedQuery.trim()) return [];
    const base = searchTickers(debouncedQuery, index, { limit: 20 });
    const boosted = base.map((r) => ({
      ...r,
      score: r.score + getRecencyBoost(r.ticker, recents),
    }));
    boosted.sort((a, b) => b.score - a.score);
    return boosted.slice(0, 8);
  }, [debouncedQuery, index, recents]);

  // Fallback
  useEffect(() => {
    if (!fallbackSearch) return;
    if (!debouncedQuery.trim() || localResults.length > 0) {
      setFallbackResults([]);
      return;
    }
    let cancelled = false;
    setFallbackLoading(true);
    fallbackSearch(debouncedQuery)
      .then((rows) => {
        if (!cancelled) setFallbackResults(rows.slice(0, 6));
      })
      .catch(() => {
        if (!cancelled) setFallbackResults([]);
      })
      .finally(() => {
        if (!cancelled) setFallbackLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [debouncedQuery, localResults.length, fallbackSearch]);

  // Popular shelf - minus what's already in recents/trending
  const popularShelf = useMemo<TickerEntry[]>(() => {
    if (!index) return [];
    const exclude = new Set([
      ...trackedTickers,
      ...recents.map((r) => r.ticker),
      ...trending.map((t) => t.ticker),
    ]);
    return getPopularShelf(index, exclude, 6);
  }, [index, trackedTickers, recents, trending]);

  // Combined flat list for keyboard nav
  const allItems = useMemo<
    (TickerEntry | SearchResult | RecentSearch | TrendingEntry)[]
  >(() => {
    if (debouncedQuery.trim()) {
      return [...localResults, ...fallbackResults];
    }
    return [...recents, ...trending, ...popularShelf];
  }, [
    debouncedQuery,
    localResults,
    fallbackResults,
    recents,
    trending,
    popularShelf,
  ]);

  // Outside click closes
  useEffect(() => {
    if (!isOpen) return;
    const onDocClick = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [isOpen]);

  // Keyboard nav
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!isOpen) {
        if (e.key === "ArrowDown" || e.key === "Enter") {
          setIsOpen(true);
          e.preventDefault();
        }
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIdx((i) => Math.min(i + 1, allItems.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIdx((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const picked = allItems[selectedIdx];
        if (picked) handlePick(picked);
      } else if (e.key === "Escape") {
        setIsOpen(false);
        inputRef.current?.blur();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isOpen, allItems, selectedIdx],
  );

  // Pick handler - fires analytics, calls parent, clears input
  const handlePick = useCallback(
    (entry: TickerEntry | RecentSearch | TrendingEntry) => {
      const ticker: TickerEntry = {
        ticker: entry.ticker,
        name: entry.name,
        kind: entry.kind,
        exchange: "exchange" in entry ? entry.exchange : "",
        popular: "popular" in entry ? entry.popular : false,
      };

      // Fire-and-forget analytics
      if (userId) {
        trackSearchSelection(db, userId, {
          ticker: ticker.ticker,
          name: ticker.name,
          kind: ticker.kind,
        });
      }

      onSelect(ticker);
      setQuery("");
      setDebouncedQuery("");
      setIsOpen(false);
      inputRef.current?.blur();

      // Optimistic local recents update
      if (userId) {
        setRecents((prev) => {
          const filtered = prev.filter((r) => r.ticker !== ticker.ticker);
          return [
            {
              ticker: ticker.ticker,
              name: ticker.name,
              kind: ticker.kind,
              selectedAt: Date.now(),
            },
            ...filtered,
          ].slice(0, 5);
        });
      }
    },
    [onSelect, userId],
  );

  const hasQuery = debouncedQuery.trim().length > 0;
  const showDropdown =
    isOpen &&
    (hasQuery ||
      popularShelf.length > 0 ||
      recents.length > 0 ||
      trending.length > 0);

  return (
    <div ref={containerRef} className="relative w-full">
      <div
        className="flex items-center gap-2 rounded-2xl border px-4 py-3 transition-colors"
        style={{
          background: "#FFFFFF",
          borderColor: isOpen ? "#D4C5B0" : "#EDE5DA",
          boxShadow: isOpen ? "0 4px 16px rgba(60, 40, 20, 0.06)" : "none",
        }}
      >
        <SearchIcon />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoFocus={autoFocus}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          className="flex-1 bg-transparent text-sm focus:outline-none"
          style={{ color: "#3D2E1F" }}
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              setDebouncedQuery("");
              inputRef.current?.focus();
            }}
            className="rounded-full p-1 transition-colors hover:bg-stone-100"
            aria-label="Clear search"
          >
            <ClearIcon />
          </button>
        )}
      </div>

      {showDropdown && (
        <div
          className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border"
          style={{
            background: "#FFFFFF",
            borderColor: "#EDE5DA",
            boxShadow:
              "0 8px 32px rgba(60, 40, 20, 0.08), 0 2px 8px rgba(60, 40, 20, 0.04)",
            maxHeight: "70vh",
            overflowY: "auto",
          }}
        >
          {!hasQuery ? (
            <EmptyStateView
              recents={recents}
              trending={trending}
              popular={popularShelf}
              selectedIdx={selectedIdx}
              onPick={handlePick}
              trackedTickers={trackedTickers}
            />
          ) : (
            <SearchResultsView
              localResults={localResults}
              fallbackResults={fallbackResults}
              fallbackLoading={fallbackLoading}
              selectedIdx={selectedIdx}
              onPick={handlePick}
              trackedTickers={trackedTickers}
              query={debouncedQuery}
            />
          )}
        </div>
      )}
    </div>
  );
}

// =============================================================================
// EMPTY STATE - Recents → Trending → Popular
// =============================================================================

function EmptyStateView({
  recents,
  trending,
  popular,
  selectedIdx,
  onPick,
  trackedTickers,
}: {
  recents: RecentSearch[];
  trending: TrendingEntry[];
  popular: TickerEntry[];
  selectedIdx: number;
  onPick: (e: TickerEntry | RecentSearch | TrendingEntry) => void;
  trackedTickers: Set<string>;
}) {
  if (recents.length === 0 && trending.length === 0 && popular.length === 0) {
    return (
      <div
        className="px-4 py-6 text-center text-sm"
        style={{ color: "#8B7B6B" }}
      >
        Loading…
      </div>
    );
  }

  let flatIdx = 0;
  return (
    <div>
      {recents.length > 0 && (
        <>
          <SectionLabel icon="recent">Your recents</SectionLabel>
          {recents.map((item) => {
            const isSelected = flatIdx === selectedIdx;
            const row = (
              <ResultRow
                key={`recent-${item.ticker}`}
                item={item}
                selected={isSelected}
                onPick={onPick}
                tracked={trackedTickers.has(item.ticker)}
              />
            );
            flatIdx++;
            return row;
          })}
        </>
      )}

      {trending.length > 0 && (
        <>
          <SectionLabel icon="trending">Trending with traders</SectionLabel>
          {trending.map((item) => {
            const isSelected = flatIdx === selectedIdx;
            const row = (
              <ResultRow
                key={`trending-${item.ticker}`}
                item={item}
                selected={isSelected}
                onPick={onPick}
                tracked={trackedTickers.has(item.ticker)}
              />
            );
            flatIdx++;
            return row;
          })}
        </>
      )}

      {popular.length > 0 && (
        <>
          <SectionLabel icon="star">Popular tickers</SectionLabel>
          {popular.map((item) => {
            const isSelected = flatIdx === selectedIdx;
            const row = (
              <ResultRow
                key={`popular-${item.ticker}`}
                item={item}
                selected={isSelected}
                onPick={onPick}
                tracked={trackedTickers.has(item.ticker)}
              />
            );
            flatIdx++;
            return row;
          })}
        </>
      )}
    </div>
  );
}

// =============================================================================
// SEARCH RESULTS
// =============================================================================

function SearchResultsView({
  localResults,
  fallbackResults,
  fallbackLoading,
  selectedIdx,
  onPick,
  trackedTickers,
  query,
}: {
  localResults: SearchResult[];
  fallbackResults: TickerEntry[];
  fallbackLoading: boolean;
  selectedIdx: number;
  onPick: (e: TickerEntry) => void;
  trackedTickers: Set<string>;
  query: string;
}) {
  const { stocks, etfs } = groupResults(localResults);
  let flatIdx = 0;

  if (
    localResults.length === 0 &&
    fallbackResults.length === 0 &&
    !fallbackLoading
  ) {
    return (
      <div
        className="px-4 py-6 text-center text-sm"
        style={{ color: "#8B7B6B" }}
      >
        No matches for <strong style={{ color: "#3D2E1F" }}>{query}</strong>
      </div>
    );
  }

  return (
    <div>
      {stocks.length > 0 && (
        <>
          <SectionLabel>Stocks</SectionLabel>
          {stocks.map((item) => {
            const isSelected = flatIdx === selectedIdx;
            const row = (
              <ResultRow
                key={item.ticker}
                item={item}
                selected={isSelected}
                onPick={onPick}
                tracked={trackedTickers.has(item.ticker)}
              />
            );
            flatIdx++;
            return row;
          })}
        </>
      )}

      {etfs.length > 0 && (
        <>
          <SectionLabel>ETFs</SectionLabel>
          {etfs.map((item) => {
            const isSelected = flatIdx === selectedIdx;
            const row = (
              <ResultRow
                key={item.ticker}
                item={item}
                selected={isSelected}
                onPick={onPick}
                tracked={trackedTickers.has(item.ticker)}
              />
            );
            flatIdx++;
            return row;
          })}
        </>
      )}

      {fallbackLoading && (
        <div
          className="px-4 py-3 text-center text-xs"
          style={{ color: "#A89B8C" }}
        >
          Searching the broader market…
        </div>
      )}

      {fallbackResults.length > 0 && (
        <>
          <SectionLabel>Less common matches</SectionLabel>
          {fallbackResults.map((item) => {
            const isSelected = flatIdx === selectedIdx;
            const row = (
              <ResultRow
                key={item.ticker}
                item={item}
                selected={isSelected}
                onPick={onPick}
                tracked={trackedTickers.has(item.ticker)}
              />
            );
            flatIdx++;
            return row;
          })}
        </>
      )}
    </div>
  );
}

// =============================================================================
// SECTION LABEL & ROW
// =============================================================================

function SectionLabel({
  children,
  icon,
}: {
  children: React.ReactNode;
  icon?: "recent" | "trending" | "star";
}) {
  return (
    <div
      className="flex items-center gap-1.5 px-4 pb-2 pt-3 text-xs uppercase tracking-wider"
      style={{ color: "#A89B8C", fontWeight: 600, letterSpacing: "0.08em" }}
    >
      {icon === "recent" && <ClockIcon />}
      {icon === "trending" && <TrendingIcon />}
      {icon === "star" && <StarIcon />}
      {children}
    </div>
  );
}

function ResultRow({
  item,
  selected,
  onPick,
  tracked,
}: {
  item: TickerEntry | SearchResult | RecentSearch | TrendingEntry;
  selected: boolean;
  onPick: (e: any) => void;
  tracked: boolean;
}) {
  const searchResult = "matchType" in item ? (item as SearchResult) : null;

  const [tickerBefore, tickerMatch, tickerAfter] = searchResult
    ? highlightString(item.ticker, searchResult.tickerMatchRange)
    : [item.ticker, "", ""];
  const [nameBefore, nameMatch, nameAfter] = searchResult
    ? highlightString(item.name, searchResult.nameMatchRange)
    : [item.name, "", ""];

  const isTrending = "uniqueSelections" in item;

  return (
    <button
      onClick={() => !tracked && onPick(item)}
      disabled={tracked}
      className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors"
      style={{
        background: selected ? "#FCEDF3" : "transparent",
        cursor: tracked ? "default" : "pointer",
        opacity: tracked ? 0.5 : 1,
      }}
    >
      <div
        className="h-2 w-2 flex-shrink-0 rounded-full"
        style={{ background: item.kind === "etf" ? "#B5A1E5" : "#E8956C" }}
      />

      <div className="flex w-16 flex-shrink-0 items-center gap-1.5">
        <span
          style={{
            fontWeight: 600,
            color: "#3D2E1F",
            fontSize: "14px",
            letterSpacing: "-0.01em",
          }}
        >
          <Hl pre={tickerBefore} hit={tickerMatch} post={tickerAfter} />
        </span>
      </div>

      <div className="min-w-0 flex-1">
        <div className="truncate text-sm" style={{ color: "#5C4E3D" }}>
          <Hl pre={nameBefore} hit={nameMatch} post={nameAfter} />
        </div>
      </div>

      <div className="flex-shrink-0">
        {tracked ? (
          <span className="text-xs" style={{ color: "#A89B8C" }}>
            Tracked
          </span>
        ) : isTrending ? (
          <span
            className="rounded-full px-2 py-0.5 text-xs"
            style={{ background: "#FFE8DC", color: "#B85420", fontWeight: 500 }}
          >
            ↑ {(item as TrendingEntry).uniqueSelections}
          </span>
        ) : (
          <span
            className="rounded-full px-2 py-0.5 text-xs"
            style={{
              background: item.kind === "etf" ? "#F2EDFC" : "#FFF4ED",
              color: item.kind === "etf" ? "#5D4BA1" : "#B85420",
              fontWeight: 500,
            }}
          >
            {item.kind === "etf"
              ? "ETF"
              : "exchange" in item
                ? item.exchange
                : ""}
          </span>
        )}
      </div>
    </button>
  );
}

function Hl({ pre, hit, post }: { pre: string; hit: string; post: string }) {
  return (
    <>
      {pre}
      {hit && (
        <span
          style={{
            background: "#FFF4D4",
            color: "#3D2E1F",
            borderRadius: "2px",
          }}
        >
          {hit}
        </span>
      )}
      {post}
    </>
  );
}

// =============================================================================
// ICONS
// =============================================================================

function SearchIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#A89B8C"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function ClearIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#8B7B6B"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function TrendingIcon() {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
