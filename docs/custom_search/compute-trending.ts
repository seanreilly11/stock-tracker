/**
 * scripts/compute-trending.ts
 *
 * Daily cron job. Reads metrics/ticker_selections, applies time decay, and
 * writes a derived metrics/ticker_trending document that the app reads to
 * power the "Trending" shelf.
 *
 * Why a derived doc instead of computing on the fly:
 *   1. Reads are cheap. Clients hit one doc, get a small ordered list.
 *   2. Decay needs the FULL count map. Reading it on every client load
 *      would be expensive and slow.
 *   3. The job can do extra work (apply business rules, hide things,
 *      validate against the curated index) that we wouldn't want on the
 *      hot path.
 *
 * Schedule: once a day, post-market-close US (suggest 22:00 UTC).
 *   You could run it more often, but trending shouldn't whip around hour to
 *   hour - daily cadence feels right for a "what's everyone watching" shelf.
 *
 * Time decay model:
 *   Raw count is preserved as-is. The TRENDING signal is computed from a
 *   recent window only - we track per-day counts in a rolling window and
 *   compute trending = sum of last 7 days. Old hype fades naturally.
 *
 *   For the simple version (V1), we track only the total cumulative count
 *   and apply a daily multiplicative decay (0.95/day = ~half-life of 14 days).
 *   This is one extra write per ticker per day but produces a list that
 *   updates smoothly.
 *
 * Usage:
 *   Run via Vercel Cron, GitHub Action, or your own scheduler.
 *   See vercel.json example at the bottom of this file.
 */

import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import fs from "node:fs/promises";
import path from "node:path";

// =============================================================================
// CONFIG
// =============================================================================

/** How many trending entries to keep in the derived doc. */
const TRENDING_LIST_SIZE = 25;

/** Daily decay factor applied to all counts. 0.95 = ~14 day half-life. */
const DECAY_FACTOR = 0.95;

/** Minimum count to be eligible for trending - filters out noise. */
const MIN_TRENDING_COUNT = 3;

/** Path to the curated ticker index - used to filter out anything weird that
 *  might be in counts but isn't a real tradable ticker. */
const TICKER_INDEX_PATH = path.join(process.cwd(), "public", "tickers.json");

// =============================================================================
// FIREBASE ADMIN INIT
// =============================================================================

if (!getApps().length) {
  // Initialize from FIREBASE_SERVICE_ACCOUNT env var (JSON-stringified)
  const sa = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!sa) {
    console.error("Missing FIREBASE_SERVICE_ACCOUNT env var");
    process.exit(1);
  }
  initializeApp({ credential: cert(JSON.parse(sa)) });
}
const db = getFirestore();

// =============================================================================
// TYPES (matching what search-analytics.ts writes)
// =============================================================================

interface SelectionsDoc {
  counts?: Record<string, number>;
  meta?: Record<string, { name: string; kind: "stock" | "etf" }>;
}

interface TrendingEntry {
  ticker: string;
  name: string;
  kind: "stock" | "etf";
  uniqueSelections: number;
}

// =============================================================================
// MAIN
// =============================================================================

async function main() {
  console.log("Computing trending tickers...");

  // 1. Load the curated index so we can filter out anything not in it.
  const indexRaw = JSON.parse(
    await fs.readFile(TICKER_INDEX_PATH, "utf8"),
  ) as Array<{ t: string }>;
  const validTickers = new Set(indexRaw.map((e) => e.t));
  console.log(`  Loaded ${validTickers.size} valid tickers from curated index`);

  // 2. Read the global selections doc.
  const selectionsRef = db.collection("metrics").doc("ticker_selections");
  const snap = await selectionsRef.get();
  if (!snap.exists) {
    console.log("  No selections yet - nothing to do.");
    return;
  }
  const data = snap.data() as SelectionsDoc;
  const counts = data.counts ?? {};
  const meta = data.meta ?? {};

  // 3. Apply decay: write back decayed counts to the same doc.
  //    Skip tickers below a floor - once a count is small enough it can be
  //    fully forgotten so the doc doesn't grow unbounded.
  const FORGET_FLOOR = 0.5;
  const decayedCounts: Record<string, number | FirebaseFirestore.FieldValue> =
    {};
  const decayedMeta: Record<string, FirebaseFirestore.FieldValue> = {};

  for (const [ticker, count] of Object.entries(counts)) {
    const decayed = count * DECAY_FACTOR;
    if (decayed < FORGET_FLOOR) {
      // Forget this ticker - delete from both maps
      decayedCounts[ticker] = FieldValue.delete();
      decayedMeta[ticker] = FieldValue.delete();
    } else {
      decayedCounts[ticker] = decayed;
    }
  }

  // 4. Compute the trending list from the (un-decayed) current counts.
  //    We use current counts not the decayed ones so today's trending reflects
  //    today's reality, and decay only matters for tomorrow.
  const eligible = Object.entries(counts)
    .filter(
      ([ticker, count]) =>
        count >= MIN_TRENDING_COUNT && validTickers.has(ticker),
    )
    .map(([ticker, count]) => {
      const m = meta[ticker];
      if (!m) return null; // Missing meta - skip
      const entry: TrendingEntry = {
        ticker,
        name: m.name,
        kind: m.kind,
        uniqueSelections: Math.round(count),
      };
      return entry;
    })
    .filter((e): e is TrendingEntry => e !== null)
    .sort((a, b) => b.uniqueSelections - a.uniqueSelections)
    .slice(0, TRENDING_LIST_SIZE);

  console.log(
    `  Top 5 trending: ${eligible
      .slice(0, 5)
      .map((e) => e.ticker)
      .join(", ")}`,
  );

  // 5. Write the trending list to the derived doc.
  const trendingRef = db.collection("metrics").doc("ticker_trending");
  await trendingRef.set({
    entries: eligible,
    computedAt: FieldValue.serverTimestamp(),
    sourceCount: Object.keys(counts).length,
  });

  // 6. Write back the decayed counts. Use update with field-path keys so we
  //    don't overwrite the meta map by accident.
  const updatePayload: Record<string, unknown> = {};
  for (const [ticker, value] of Object.entries(decayedCounts)) {
    updatePayload[`counts.${ticker}`] = value;
  }
  for (const [ticker, value] of Object.entries(decayedMeta)) {
    updatePayload[`meta.${ticker}`] = value;
  }
  if (Object.keys(updatePayload).length > 0) {
    await selectionsRef.update(updatePayload);
  }

  console.log(`✓ Wrote trending list (${eligible.length} entries)`);
  console.log(`✓ Decayed ${Object.keys(decayedCounts).length} counts`);
}

main().catch((err) => {
  console.error("✗ Trending computation failed:", err);
  process.exit(1);
});

// =============================================================================
// VERCEL CRON CONFIG
//
// Add to vercel.json:
//
//   {
//     "crons": [{
//       "path": "/api/cron/compute-trending",
//       "schedule": "0 22 * * *"
//     }]
//   }
//
// Then add app/api/cron/compute-trending/route.ts that runs this script's
// logic. Or run from GitHub Actions on a schedule (see refresh-ticker-index.yml
// for a similar pattern).
// =============================================================================
