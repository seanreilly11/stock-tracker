# Ticker Index - Seeding Strategy

## Target: ~4,000 curated tickers

This index powers the in-app search. Every ticker here appears in autocomplete; everything else doesn't exist as far as the user is concerned. The Polygon API is used downstream for live data once a ticker is selected, but never for search.

## The 95/5 Principle

95% of users will search for the same 500-ish tickers. The remaining 3,500 exist so the long-tail user (the swing trader who's into mid-cap semis, the person whose company stock is here, the ETF nerd) doesn't bounce.

## Sources & Composition

| Source                                             | Count        | Why                                                                    |
| -------------------------------------------------- | ------------ | ---------------------------------------------------------------------- |
| **S&P 500 (current constituents)**                 | ~500         | The default expectation. Every stock people have heard of.             |
| **NASDAQ-100 (overlap with S&P)**                  | ~50 net new  | Tech-heavy names not in S&P                                            |
| **Russell 1000 (overlap)**                         | ~400 net new | Mid-large caps. PLTR, RIVN, COIN, SOFI all live here.                  |
| **Russell 2000 top 500 by market cap**             | ~500         | Active small caps. Where r/wallstreetbets lives.                       |
| **Top 500 ETFs by AUM**                            | ~500         | SPY, QQQ, VOO, sector ETFs, themed (ARKK, SOXX), bond, intl            |
| **Popular international ADRs**                     | ~150         | TSM, BABA, ASML, NVO, SHOP, SE, MELI, etc.                             |
| **Recent IPOs (last 24mo, market cap > $1B)**      | ~150         | Whatever's new and being talked about                                  |
| **Curated "popular among retail" list**            | ~200         | Manual additions: meme stocks, crypto-adjacent, biotech darlings       |
| **Sector leaders (top 5 per sector × 20 sectors)** | ~100 net new | Catches anything the cap-based lists miss                              |
| **Buffer**                                         | ~650         | Mid-cap names that don't fit the buckets above but exist on watchlists |
| **TOTAL**                                          | ~3,200-4,000 |                                                                        |

## Hard Exclusions

These NEVER appear in the index, regardless of source:

- **Warrants** (tickers ending in `-W`, `+W`, `.W`, `WS`)
- **Preferred shares** (tickers with `-` and a letter, e.g. `BAC-PA`, `WFC-PD`)
- **Units** (post-SPAC tickers ending in `U` from SPACs)
- **Rights** (tickers with `R` suffix)
- **OTC stocks** (any exchange code starting with `OTC` or `PINK`)
- **Inactive/delisted tickers** (`active=false` from Polygon)
- **Tickers with dots/dashes in the symbol itself** (BRK.A and BRK.B are exceptions - see below)
- **Foreign listings without ADRs** (unless explicitly added)
- **SPACs that haven't completed deals** (typically tickers ending in `AC`, `WS`)
- **Test tickers** (anything from Polygon flagged as test)

## Special Cases (Whitelist)

A few tickers normally excluded by the rules but desirable:

- **BRK.B** (Berkshire Hathaway) - has a dot but is core
- **BF.A**, **BF.B** (Brown-Forman) - same
- **GOOG / GOOGL** - both share classes are tracked separately and both should appear

## Ticker Categorization

Each entry stores a `type` and `popular` flag:

- `type: "stock"` for individual companies
- `type: "etf"` for funds (SPY, QQQ, ARKK, etc.)
- `popular: true` for the top 200ish names that should always rank first when ambiguous

Popular flag criteria (any of):

- S&P 100 constituent
- Top 50 ETF by AUM
- Top 100 by retail trading volume (proxy: NASDAQ + NYSE Retail Liquidity Program data, or just curate)
- Recent meme/news cycle ticker (manual flag)

## Storage Strategy

**For launch:** ship as static JSON file with the app build.

- File size at 4,000 records ≈ 500KB raw, ~150KB gzipped
- Loads once on first use, cached forever
- Search runs client-side in-memory - instant
- No DB hit, no rate limits, no API failures

**Refresh cadence:**

- Weekly cron regenerates the JSON from sources
- New IPOs added, delistings removed
- File ships with next deploy (or fetched at runtime if you want hot updates)

## The "no match" Fallback

When a user's search returns ZERO results from the local index:

1. Show a "Searching the broader market..." state
2. Hit Polygon's `/v3/reference/tickers` endpoint with the query
3. Apply the same hard exclusions to the API response
4. Show those results below a "Less common matches" header
5. If user picks one, **add it to the local index permanently** for future searches

This solves the long-tail problem without bloating the default index.

## Curation Effort

Initial curation: ~4-6 hours of work to assemble the list. Mostly:

1. Run the seeding script to pull from Polygon (1 hour)
2. Manually review the top 500 to ensure no garbage made it through (2 hours)
3. Tag the `popular` flag on the top 200 (1 hour)
4. Spot-check the long tail for obvious errors (1 hour)

Ongoing: ~30 min/week to review what got added/removed by the cron.
