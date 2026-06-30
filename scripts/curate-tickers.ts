/**
 * curate-tickers.ts
 *
 * Run weekly (or on demand) to regenerate the ticker index from Polygon.
 *
 * Usage:
 *   POLYGON_API_KEY=xxx npx tsx scripts/curate-tickers.ts
 *
 * Output:
 *   public/tickers.json - the search index, ~4,000 curated tickers
 *   public/tickers-meta.json - metadata: generated_at, counts, version
 *
 * Strategy:
 *   1. Fetch ALL active US stocks + ETFs from Polygon (paginated)
 *   2. Apply hard exclusions (warrants, preferred, OTC, etc.)
 *   3. Score each by composite "interest" signal (market cap, exchange, type)
 *   4. Keep top ~4,000 by score
 *   5. Apply manual whitelist/popular flags
 *   6. Write JSON
 */

import fs from "node:fs/promises";
import path from "node:path";

// =============================================================================
// CONFIG
// =============================================================================

const POLYGON_API_KEY = "bZVZXz83pe0SFpRvjzubFtizArepCMs1";
// const POLYGON_API_KEY = process.env.POLYGON_API_KEY;
if (!POLYGON_API_KEY) {
  console.error("Missing POLYGON_API_KEY");
  process.exit(1);
}

const POLYGON_BASE = "https://api.polygon.io";
const TARGET_INDEX_SIZE = 8000;
const OUTPUT_DIR = path.join(process.cwd(), "public");
const OUTPUT_FILE = path.join(OUTPUT_DIR, "tickers.json");
const META_FILE = path.join(OUTPUT_DIR, "tickers-meta.json");

// =============================================================================
// MANUAL CURATION LISTS
// =============================================================================

/**
 * Tickers that are normally excluded by the rules but must be kept.
 * Edit this list when adding/removing exceptions.
 */
const WHITELIST_EXCEPTIONS = new Set([
  "BRK.A",
  "BRK.B", // Berkshire Hathaway
  "BF.A",
  "BF.B", // Brown-Forman
  "GOOG",
  "GOOGL", // Both Alphabet share classes
  // International ADRs - Polygon types these as ADRC, not CS, so they fail the type filter
  "TSM", // Taiwan Semiconductor
  "BABA", // Alibaba
  "BIDU", // Baidu
  "NVO", // Novo Nordisk
  "TM", // Toyota
  "SONY", // Sony
  "ASML", // ASML Holding
  "JD", // JD.com
  "PDD", // PinDuoDuo
  "NTES", // NetEase
  "SE", // Sea Limited
  "ATVI", // Activision Blizzard (may be typed as non-CS post-acquisition)
  // ETPs - Polygon types these as ETP, not ETF, so they fail the type filter
  "GLD", // SPDR Gold Shares
  "SLV", // iShares Silver Trust
]);

/**
 * Tickers always flagged as "popular" - boost in search ranking.
 * The top ~200 tickers users will search for most. Curated manually.
 * Add to this list whenever a stock becomes a household name.
 */
const POPULAR_TICKERS = new Set([
  // Mega-cap tech (the magnificent 7 + frequent searches)
  "AAPL",
  "MSFT",
  "GOOG",
  "GOOGL",
  "AMZN",
  "META",
  "NVDA",
  "TSLA",
  "AVGO",
  "ORCL",
  "CRM",
  "ADBE",
  "NFLX",
  "AMD",
  "INTC",
  "CSCO",
  "QCOM",
  "TXN",
  "IBM",
  "NOW",
  "INTU",
  "PYPL",
  "UBER",
  "SHOP",
  "RKLB",
  "SPOT",
  "TWTR",
  "SNAP",
  "LYFT",
  "ZM",
  "DOCU",
  "WDAY",
  // Other mega-caps
  "BRK.B",
  "JPM",
  "V",
  "MA",
  "WMT",
  "JNJ",
  "PG",
  "XOM",
  "CVX",
  "HD",
  "BAC",
  "ABBV",
  "MRK",
  "KO",
  "PEP",
  "TMO",
  "COST",
  "MCD",
  "ABT",
  "DIS",
  "WFC",
  "ACN",
  "DHR",
  "VZ",
  "T",
  "PM",
  "LIN",
  "AMGN",
  "TXN",
  "BMY",
  "NEE",
  "RTX",
  "HON",
  "UNH",
  "LLY",
  "PFE",
  // Hot retail names
  "PLTR",
  "SOFI",
  "COIN",
  "RIVN",
  "LCID",
  "HOOD",
  "GME",
  "AMC",
  "BB",
  "BBBY",
  "WISH",
  "CLOV",
  "SPCE",
  "DKNG",
  "RBLX",
  "PATH",
  "U",
  "SNOW",
  "DDOG",
  "NET",
  "CRWD",
  "ZS",
  "PANW",
  "FTNT",
  "MDB",
  "OKTA",
  "TEAM",
  // EV / energy
  "F",
  "GM",
  "NIO",
  "XPEV",
  "LI",
  "CHPT",
  "PLUG",
  "FCEL",
  "BE",
  // China / international stars
  "BABA",
  "TSM",
  "ASML",
  "TM",
  "SONY",
  "JD",
  "PDD",
  "BIDU",
  "NTES",
  "SE",
  "MELI",
  "NVO",
  "SHOP",
  "TCEHY",
  // Banking & fintech
  "GS",
  "MS",
  "C",
  "USB",
  "PNC",
  "TFC",
  "SCHW",
  "BLK",
  "SQ",
  "AXP",
  "COF",
  "AFRM",
  "UPST",
  "LMND",
  // Pharma / biotech popular
  "MRNA",
  "BNTX",
  "REGN",
  "VRTX",
  "GILD",
  "BIIB",
  "ZTS",
  // Energy / commodities
  "COP",
  "EOG",
  "SLB",
  "PSX",
  "VLO",
  "MPC",
  "OXY",
  "FCX",
  "NEM",
  // Real estate / consumer
  "AMT",
  "PLD",
  "EQIX",
  "PSA",
  "O",
  "SBUX",
  "NKE",
  "LULU",
  "TGT",
  "LOW",
  "DG",
  "DLTR",
  "BBY",
  "TJX",
  // S&P 500 names missing due to low heuristic score (no market cap data)
  "UPS",
  "UNP",
  "SPGI",
  "SYK",
  "SO",
  "ROP",
  "PH",
  "SRE",
  "YUM",
  // Mid-caps that scored too low
  "TWLO",
  "PINS",
  "ZI",
  "TTWO",
  // International ADRs (also in whitelist to bypass type filter)
  "TSM",
  "BABA",
  "BIDU",
  "NVO",
  "TM",
  "SONY",
  "ASML",
  "JD",
  "PDD",
  "NTES",
  "SE",
  "ATVI",
  // ETPs (also in whitelist to bypass type filter)
  "GLD",
  "SLV",
  // Top ETFs (will be auto-flagged popular but ensure here)
  "SPY",
  "QQQ",
  "VOO",
  "VTI",
  "IVV",
  "VEA",
  "VWO",
  "AGG",
  "BND",
  "GLD",
  "SLV",
  "TLT",
  "HYG",
  "LQD",
  "DIA",
  "IWM",
  "EFA",
  "EEM",
  "XLK",
  "XLF",
  "XLE",
  "XLV",
  "XLY",
  "XLI",
  "XLP",
  "XLU",
  "XLB",
  "XLRE",
  "XLC",
  "VTV",
  "VUG",
  "VYM",
  "SCHD",
  "VIG",
  "DGRO",
  "MOAT",
  "ARKK",
  "ARKG",
  "ARKW",
  "ARKF",
  "ARKQ",
  "SOXX",
  "SMH",
  "XSD",
  "IBB",
  "XBI",
  "IHI",
  "USO",
  "UNG",
  "JEPI",
  "JEPQ",
  "QYLD",
  "VXUS",
  "BNDX",
  "EMB",
  "MUB",
  "VNQ",
  "REET",
]);

// =============================================================================
// TYPES
// =============================================================================

interface PolygonTicker {
  ticker: string;
  name: string;
  market: string;
  locale: string;
  primary_exchange?: string;
  type?: string;
  active: boolean;
  currency_name?: string;
  cik?: string;
  composite_figi?: string;
  share_class_figi?: string;
  last_updated_utc?: string;
  market_cap?: number;
}

interface IndexEntry {
  t: string; // ticker (short field names = smaller JSON)
  n: string; // name
  k: "s" | "e"; // kind: stock | etf
  x: string; // exchange code (short)
  p?: 1; // popular flag (omitted if false)
  s?: string; // sector (optional, for stocks)
}

// =============================================================================
// FETCH FROM POLYGON
// =============================================================================

async function fetchAllPolygonTickers(): Promise<PolygonTicker[]> {
  const results: PolygonTicker[] = [];
  let url: string | null =
    `${POLYGON_BASE}/v3/reference/tickers` +
    `?market=stocks` +
    `&active=true` +
    `&limit=1000` +
    `&apiKey=${POLYGON_API_KEY}`;

  let page = 0;
  while (url) {
    page++;
    process.stdout.write(
      `\r  Fetching page ${page}... (${results.length} so far)`,
    );

    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Polygon error: ${res.status} ${await res.text()}`);
    }
    const data = (await res.json()) as {
      results: PolygonTicker[];
      next_url?: string;
    };

    results.push(...data.results);
    url = data.next_url ? `${data.next_url}&apiKey=${POLYGON_API_KEY}` : null;

    if (page % 5 === 0 && url) {
      console.log(
        `\n  Rate limit pause after page ${page}, resuming in 60s...`,
      );
      await new Promise((r) => setTimeout(r, 60_000));
    } else {
      await new Promise((r) => setTimeout(r, 100));
    }
  }
  console.log("");
  return results;
}

// =============================================================================
// HARD EXCLUSIONS
// =============================================================================

/**
 * Returns true if this ticker should be EXCLUDED from the index.
 */
function isExcluded(t: PolygonTicker): boolean {
  const { ticker, type, primary_exchange, active } = t;

  // Always whitelist these even if they'd otherwise fail
  if (WHITELIST_EXCEPTIONS.has(ticker)) return false;

  // Must be active
  if (!active) return true;

  // Polygon type filtering - keep only common stock and ETF-like things
  // CS = Common Stock, ETF = Exchange Traded Fund
  // ETN, ETV, FUND are debatable - keeping ETF only for cleanliness
  const goodTypes = new Set(["CS", "ETF"]);
  if (!type || !goodTypes.has(type)) return true;

  // OTC exchanges - exclude
  if (primary_exchange?.startsWith("OTC")) return true;
  if (primary_exchange === "OTCM" || primary_exchange === "OTCB") return true;

  // Major US exchanges only - accept these:
  // XNAS (Nasdaq), XNYS (NYSE), ARCX (NYSE Arca - many ETFs), BATS, XASE (NYSE American)
  const goodExchanges = new Set([
    "XNAS",
    "XNYS",
    "ARCX",
    "BATS",
    "XASE",
    "IEXG",
  ]);
  if (primary_exchange && !goodExchanges.has(primary_exchange)) return true;

  // Symbol-level filters
  // Tickers with hyphens are usually preferred shares (BAC-PA, WFC-PD)
  // Exception: some legit tickers have hyphens - but Polygon convention is no
  if (ticker.includes("-")) return true;

  // Tickers with dots are usually share classes - only BRK.A/B and BF.A/B make it
  // (handled by whitelist above)
  if (ticker.includes(".")) return true;

  // Warrants typically end in W, WS, WSA - but so do legit names like NEW, etc.
  // Polygon's `type` already filters most of these out, but extra safety:
  if (ticker.endsWith("WS") || ticker.endsWith(".W")) return true;

  // SPAC unit suffixes
  if (ticker.endsWith(".U") || ticker.endsWith("=")) return true;

  // Rights
  if (ticker.endsWith(".R")) return true;

  // Test tickers Polygon sometimes returns
  if (ticker.startsWith("TEST")) return true;

  // Empty / weird name
  if (!t.name || t.name.length < 2) return true;

  return false;
}

// =============================================================================
// SCORING (for picking top 4,000)
// =============================================================================

/**
 * Higher score = more likely to be kept in the index.
 *
 * Signals:
 *   - Market cap (if available) → log-scaled
 *   - Exchange (Nasdaq/NYSE > others)
 *   - Type (ETF gets a small bump because users search for them by ticker)
 *   - Popular list membership → huge bump
 *   - Whitelist → guaranteed inclusion
 */
function scoreTicker(t: PolygonTicker): number {
  if (WHITELIST_EXCEPTIONS.has(t.ticker)) return Number.MAX_SAFE_INTEGER;
  if (POPULAR_TICKERS.has(t.ticker)) return 1_000_000;

  let score = 0;

  // Market cap is the strongest signal - but it's not on the basic endpoint.
  // For weekly curation, you'd enrich top candidates via /v3/reference/tickers/{ticker}.
  // For this script we use heuristic proxies.
  if (t.market_cap && t.market_cap > 0) {
    score += Math.log10(t.market_cap);
  }

  // Exchange weight
  if (t.primary_exchange === "XNAS" || t.primary_exchange === "XNYS")
    score += 3;
  else if (t.primary_exchange === "ARCX")
    score += 2; // ETF hub
  else if (t.primary_exchange === "BATS") score += 1;

  // ETF bump - users search for ETFs by ticker a lot (SPY, QQQ, etc.)
  if (t.type === "ETF") score += 2;

  // Penalize very long tickers - usually obscure listings
  if (t.ticker.length >= 5) score -= 1;
  if (t.ticker.length >= 6) score -= 2;

  return score;
}

// =============================================================================
// MARKET CAP ENRICHMENT
// =============================================================================

/*
 * enrichMarketCap - commented out, may restore later for better scoring.
 *
 * The basic /reference/tickers endpoint doesn't return market_cap reliably.
 * For better scoring, enrich the top N candidates by hitting the per-ticker endpoint.
 *
 * Costs: N API calls. Skip if you're rate-limited; the heuristic above is OK.
 *
 * async function enrichMarketCap(tickers: PolygonTicker[], limit: number) {
 *   console.log(`  Enriching market cap for top ${limit} candidates...`);
 *   const subset = tickers.slice(0, limit);
 *   let done = 0;
 *   for (const t of subset) {
 *     try {
 *       const res = await fetch(
 *         `${POLYGON_BASE}/v3/reference/tickers/${t.ticker}?apiKey=${POLYGON_API_KEY}`,
 *       );
 *       if (res.ok) {
 *         const data = (await res.json()) as { results: PolygonTicker };
 *         if (data.results?.market_cap) {
 *           t.market_cap = data.results.market_cap;
 *         }
 *       }
 *     } catch {
 *       // ignore, fall back to heuristic
 *     }
 *     done++;
 *     if (done % 100 === 0) {
 *       process.stdout.write(`\r    Enriched ${done}/${limit}`);
 *     }
 *     await new Promise((r) => setTimeout(r, 30));
 *   }
 *   console.log("");
 * }
 */

// =============================================================================
// EXCHANGE CODE COMPRESSION
// =============================================================================

const EXCHANGE_SHORT: Record<string, string> = {
  XNAS: "NSDQ",
  XNYS: "NYSE",
  ARCX: "ARCA",
  BATS: "BATS",
  XASE: "AMEX",
  IEXG: "IEX",
};

// =============================================================================
// MAIN
// =============================================================================

async function main() {
  console.log("Curating ticker index from Polygon...\n");

  console.log("[1/4] Fetching all active tickers from Polygon");
  const all = await fetchAllPolygonTickers();
  console.log(`      ✓ Got ${all.length} raw tickers\n`);

  console.log("[2/4] Applying hard exclusions");
  const filtered = all.filter((t) => !isExcluded(t));
  console.log(
    `      ✓ ${filtered.length} survived filters (${all.length - filtered.length} excluded)\n`,
  );

  console.log("[3/4] Scoring and pre-sorting by heuristic");
  const preSorted = filtered
    .map((t) => ({ t, s: scoreTicker(t) }))
    .sort((a, b) => b.s - a.s);
  const candidates = preSorted.map((x) => x.t);
  console.log(`      ✓ Scored ${candidates.length} candidates\n`);

  // [4/5] Market cap enrichment - commented out, restore if needed
  // await enrichMarketCap(candidates, 6000);

  console.log("[4/4] Final ranking & writing output");
  const finalRanked = candidates
    .map((t) => ({ t, s: scoreTicker(t) }))
    .sort((a, b) => b.s - a.s)
    .slice(0, TARGET_INDEX_SIZE);

  const index: IndexEntry[] = finalRanked.map(({ t }) => {
    const entry: IndexEntry = {
      t: t.ticker,
      n: t.name,
      k: t.type === "ETF" ? "e" : "s",
      x: EXCHANGE_SHORT[t.primary_exchange || ""] || t.primary_exchange || "?",
    };
    if (POPULAR_TICKERS.has(t.ticker)) entry.p = 1;
    return entry;
  });

  // Stats
  const stats = {
    generated_at: new Date().toISOString(),
    version: Math.floor(Date.now() / 1000),
    total: index.length,
    stocks: index.filter((e) => e.k === "s").length,
    etfs: index.filter((e) => e.k === "e").length,
    popular: index.filter((e) => e.p === 1).length,
    source_raw_count: all.length,
    excluded_count: all.length - filtered.length,
  };

  await fs.mkdir(OUTPUT_DIR, { recursive: true });
  await fs.writeFile(OUTPUT_FILE, JSON.stringify(index));
  await fs.writeFile(META_FILE, JSON.stringify(stats, null, 2));

  const fileSize = (await fs.stat(OUTPUT_FILE)).size;

  console.log(`      ✓ Wrote ${OUTPUT_FILE}`);
  console.log(`      ✓ Size: ${(fileSize / 1024).toFixed(1)} KB`);
  console.log(`\n${"=".repeat(50)}`);
  console.log("STATS:");
  console.log(`  Total tickers:   ${stats.total}`);
  console.log(`  Stocks:          ${stats.stocks}`);
  console.log(`  ETFs:            ${stats.etfs}`);
  console.log(`  Popular flag:    ${stats.popular}`);
  console.log(`  Raw from API:    ${stats.source_raw_count}`);
  console.log(`  Excluded:        ${stats.excluded_count}`);
  console.log(`${"=".repeat(50)}\n`);
  console.log("Done. Commit the new tickers.json and deploy.");
}

main().catch((e) => {
  console.error("\n✗ Failed:", e);
  process.exit(1);
});
