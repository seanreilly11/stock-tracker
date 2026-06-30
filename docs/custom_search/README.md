# Ticker Search System

A fast, accurate, in-app ticker search that replaces Polygon's bad relevance ranking with a curated 4,000-ticker index searched client-side in memory.

## The Problem

Polygon's `/v3/reference/tickers` search endpoint:

- Returns warrants, preferred shares, OTC junk, and inactive tickers indiscriminately
- Has poor relevance - "AAPL" doesn't put Apple first
- Hits the network on every keystroke

## The Solution

1. **Curate a static index of ~4,000 tickers** (stocks + ETFs, hard-filtered to remove junk)
2. **Ship it as a JSON file** with the app (~150 KB gzipped)
3. **Search client-side, in memory** with a relevance algorithm tuned for finance - exact ticker > prefix > contains, with a "popular" boost
4. **Fall back to Polygon's search** only when the local index returns zero matches (covers the long tail)
5. **Use Polygon for everything else** - live prices, news, earnings - once a ticker is selected

## Files

| File                    | Purpose                                                                                 |
| ----------------------- | --------------------------------------------------------------------------------------- |
| `SEEDING_STRATEGY.md`   | How to choose which ~4,000 tickers go in the index                                      |
| `curate-tickers.ts`     | Weekly cron script: fetches from Polygon, filters, scores, writes `public/tickers.json` |
| `ticker-search.ts`      | Pure search logic - ranking, highlighting, grouping. No UI, no fetch.                   |
| `ticker-search.test.ts` | Test suite covering the critical ranking cases                                          |
| `TickerSearch.tsx`      | React component: input + dropdown + keyboard nav + fallback                             |

## Performance

- Index size: ~4,000 records, ~150 KB gzipped
- Search latency: < 5ms for any query against full index
- Loads once per session, cached in module scope - re-mounting the component does not re-parse
- No network on keystrokes (only on `tickers.json` first load and the rare Polygon fallback)

## Setup

### 1. Generate the index

```bash
POLYGON_API_KEY=your_key_here npx tsx scripts/curate-tickers.ts
```

Outputs:

- `public/tickers.json` - the search index
- `public/tickers-meta.json` - version + stats

Run this weekly via a cron job (GitHub Action, Vercel Cron, etc.) and commit the resulting JSON.

### 2. Add the component

```tsx
import { TickerSearch } from "@/components/TickerSearch";

export function AddStockModal() {
  const trackedTickers = useTrackedTickers(); // Set<string> of user's stocks

  return (
    <TickerSearch
      onSelect={(entry) => addStockToNotebook(entry.ticker)}
      trackedTickers={trackedTickers}
      autoFocus
      placeholder="Search ticker or company name…"
    />
  );
}
```

### 3. (Optional) Wire up the Polygon fallback

For the rare case where a user searches for a ticker not in the curated 4,000:

```tsx
async function polygonFallback(query: string): Promise<TickerEntry[]> {
  const res = await fetch(
    `/api/search-fallback?q=${encodeURIComponent(query)}`,
  );
  return res.json();
}

<TickerSearch onSelect={addStock} fallbackSearch={polygonFallback} />;
```

The API route should call Polygon, apply the same hard-exclusion rules from `curate-tickers.ts`, and return a small set of `TickerEntry` objects.

## Ranking Algorithm

In order of priority (high to low):

1. **Exact ticker match** - `"AAPL"` → AAPL
2. **Ticker prefix match** - `"AAP"` → AAP, AAPL, AAPN
3. **Ticker contains** - `"PL"` → PLTR, AAPL, PLD
4. **Company name prefix** - `"Apple"` → Apple Inc.
5. **Word-start in name** - `"Motors"` → General Motors (matches the "Motors" word)
6. **Name contains anywhere** - `"tech"` → various technology companies

Tiebreakers:

- Popular flag (+50)
- Shorter ticker preferred (proxy for "more famous")
- Alphabetical (stable)

## Configuration

### Add a ticker to "popular" (always boost)

Edit `POPULAR_TICKERS` in `curate-tickers.ts` and regenerate.

### Whitelist a ticker normally excluded (dotted symbols, etc.)

Edit `WHITELIST_EXCEPTIONS` in `curate-tickers.ts` and regenerate.

### Change index size

Edit `TARGET_INDEX_SIZE` in `curate-tickers.ts` (default 4000). The current 4,000 covers ~99% of real-world searches in a US-equities-and-ETFs context.

## Testing

```bash
npx vitest run ticker-search.test.ts
```

The test suite enforces the must-pass cases:

- `"AAPL"` returns Apple first
- `"apple"` returns Apple first (name match, case-insensitive)
- `"Motors"` finds General Motors via word-start matching
- Popular tickers win ties against obscure ones

## Known Limitations

1. **Index doesn't include international stocks** - only US-listed ADRs. If the audience wants non-US listings, increase the index size and adjust filters.
2. **No fuzzy matching** for typos - "Appel" won't match Apple. Could add Levenshtein later if user data shows this is a problem; for finance the cost of false matches (suggesting the wrong ticker) is high, so I'd avoid it by default.
3. **Index is only refreshed on deploys** unless you set up runtime fetching. For most apps, a weekly cron + commit is sufficient.

## Future Improvements

- **Search by sector** - type "semis" and get NVDA, AMD, AVGO. Requires sector tags in the index.
- **Recent searches shelf** - show recently-searched-but-not-tracked tickers when input is empty.
- **Multi-language company names** - TSM is "Taiwan Semiconductor" and "台積電". Probably not worth it for launch.
