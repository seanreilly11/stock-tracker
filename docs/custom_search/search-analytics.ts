/**
 * lib/search-analytics.ts
 *
 * Tracks which tickers users select from the search dropdown, so we can power:
 *   - A "Your recents" shelf (per-user, last ~10 selections)
 *   - A "Trending" shelf (global aggregate, time-decayed)
 *
 * Both feed back into the search UX: when the input is empty, we show
 * Recents → Trending → Popular (curated). When the user types, ranking
 * gets a boost from selection frequency.
 *
 * Storage:
 *   users/{uid}                                     ← per-user recents (capped at 10)
 *   metrics/ticker_selections                       ← global aggregate counts
 *   metrics/ticker_trending                         ← derived trending list (computed daily)
 *
 * Anti-abuse: a user can only contribute one global increment per ticker per
 * day. Local recents update freely.
 */

import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  serverTimestamp,
  increment,
  Timestamp,
  type Firestore,
} from "firebase/firestore";

// =============================================================================
// TYPES
// =============================================================================

export interface RecentSearch {
  ticker: string;
  name: string;
  kind: "stock" | "etf";
  selectedAt: number; // Unix ms, for ordering and time-decay
}

export interface TrendingEntry {
  ticker: string;
  name: string;
  kind: "stock" | "etf";
  /** Number of unique users who selected this in the trending window. */
  uniqueSelections: number;
}

interface UserSearchDoc {
  recents?: RecentSearch[];
  /** Map<ticker, ISO-date-string> - when did this user last contribute a global count for this ticker. */
  globalContributions?: Record<string, string>;
}

// =============================================================================
// CONFIG
// =============================================================================

const MAX_RECENTS = 10;
const GLOBAL_THROTTLE_HOURS = 24;

// =============================================================================
// MAIN ENTRY POINT
// =============================================================================

/**
 * Call this whenever a user picks a ticker from the search dropdown.
 * Fire-and-forget - the caller doesn't need to await.
 *
 * Internally does two things:
 *   1. Adds (or moves to top) the ticker in the user's recents list
 *   2. If the user hasn't contributed a global count for this ticker today,
 *      increment the global counter
 *
 * Failures are logged but never thrown - search analytics must NEVER break
 * the user-facing flow of adding a stock.
 */
export async function trackSearchSelection(
  db: Firestore,
  userId: string,
  entry: { ticker: string; name: string; kind: "stock" | "etf" },
): Promise<void> {
  try {
    await Promise.all([
      updateUserRecents(db, userId, entry),
      maybeIncrementGlobal(db, userId, entry),
    ]);
  } catch (err) {
    // Analytics is best-effort. Log and move on.
    console.error("[search-analytics] tracking failed:", err);
  }
}

// =============================================================================
// PER-USER RECENTS
// =============================================================================

/**
 * Adds the ticker to the user's recents. If already present, moves to top.
 * Caps the list at MAX_RECENTS.
 *
 * Implementation note: we do this with a read-then-write rather than two
 * arrayUnion/arrayRemove calls because we need to preserve order and trim
 * the tail. The whole field is a single array of ~10 objects, so this is fine.
 */
async function updateUserRecents(
  db: Firestore,
  userId: string,
  entry: { ticker: string; name: string; kind: "stock" | "etf" },
): Promise<void> {
  const userRef = doc(db, "users", userId);
  const snap = await getDoc(userRef);
  const data = (snap.data() as UserSearchDoc | undefined) ?? {};
  const existing = data.recents ?? [];

  // Remove any existing entry for this ticker (we're about to put it on top)
  const filtered = existing.filter((r) => r.ticker !== entry.ticker);

  const newEntry: RecentSearch = {
    ticker: entry.ticker,
    name: entry.name,
    kind: entry.kind,
    selectedAt: Date.now(),
  };

  const updated = [newEntry, ...filtered].slice(0, MAX_RECENTS);

  await setDoc(userRef, { recents: updated }, { merge: true });
}

/**
 * Returns the user's recent selections, most recent first.
 * Excludes any tickers in `excludeTickers` (typically the stocks they already track).
 */
export async function getUserRecents(
  db: Firestore,
  userId: string,
  excludeTickers: Set<string> = new Set(),
  limit = 5,
): Promise<RecentSearch[]> {
  try {
    const userRef = doc(db, "users", userId);
    const snap = await getDoc(userRef);
    const data = (snap.data() as UserSearchDoc | undefined) ?? {};
    const recents = data.recents ?? [];
    return recents.filter((r) => !excludeTickers.has(r.ticker)).slice(0, limit);
  } catch (err) {
    console.error("[search-analytics] getUserRecents failed:", err);
    return [];
  }
}

/**
 * Manually clear a user's recents (for a "Clear recent searches" button in Settings).
 */
export async function clearUserRecents(
  db: Firestore,
  userId: string,
): Promise<void> {
  const userRef = doc(db, "users", userId);
  await updateDoc(userRef, { recents: [] });
}

/**
 * Remove a single ticker from the user's recents (e.g. when they untrack a stock,
 * or click an X next to a recents pill).
 */
export async function removeFromRecents(
  db: Firestore,
  userId: string,
  ticker: string,
): Promise<void> {
  try {
    const userRef = doc(db, "users", userId);
    const snap = await getDoc(userRef);
    const data = (snap.data() as UserSearchDoc | undefined) ?? {};
    const recents = data.recents ?? [];
    const filtered = recents.filter((r) => r.ticker !== ticker);
    if (filtered.length !== recents.length) {
      await updateDoc(userRef, { recents: filtered });
    }
  } catch (err) {
    console.error("[search-analytics] removeFromRecents failed:", err);
  }
}

// =============================================================================
// GLOBAL AGGREGATE (THROTTLED)
// =============================================================================

/**
 * Increment the global selection count for a ticker, IF this user hasn't
 * contributed a count for the same ticker in the last GLOBAL_THROTTLE_HOURS.
 *
 * This prevents one user spamming "add NVDA, untrack NVDA, add NVDA, ..." to
 * inflate trending. Their per-user recents still update freely.
 */
async function maybeIncrementGlobal(
  db: Firestore,
  userId: string,
  entry: { ticker: string; name: string; kind: "stock" | "etf" },
): Promise<void> {
  const userRef = doc(db, "users", userId);
  const snap = await getDoc(userRef);
  const data = (snap.data() as UserSearchDoc | undefined) ?? {};
  const contributions = data.globalContributions ?? {};

  const lastContribIso = contributions[entry.ticker];
  if (lastContribIso) {
    const lastContrib = new Date(lastContribIso).getTime();
    const ageHours = (Date.now() - lastContrib) / (60 * 60 * 1000);
    if (ageHours < GLOBAL_THROTTLE_HOURS) {
      return; // Throttled
    }
  }

  // OK to increment. Two writes: bump global, record this contribution on user.
  const globalRef = doc(db, "metrics", "ticker_selections");
  await Promise.all([
    setDoc(
      globalRef,
      {
        // Nested map: counts.NVDA = 47, counts.AAPL = 312
        counts: { [entry.ticker]: increment(1) },
        // Track name + kind on the global doc for the trending generator
        meta: { [entry.ticker]: { name: entry.name, kind: entry.kind } },
        lastUpdated: serverTimestamp(),
      },
      { merge: true },
    ),
    setDoc(
      userRef,
      {
        globalContributions: { [entry.ticker]: new Date().toISOString() },
      },
      { merge: true },
    ),
  ]);
}

// =============================================================================
// TRENDING (derived, READ-ONLY for clients)
// =============================================================================

/**
 * Returns the trending list. This is generated by a daily cron job
 * (see scripts/compute-trending.ts) and stored in metrics/ticker_trending.
 *
 * Clients should read this, not compute it themselves. Computing trending on
 * the client would require reading the entire counts map.
 *
 * Excludes tickers in `excludeTickers` - usually the user's tracked stocks
 * and their own recents (so trending only shows them new options).
 */
export async function getTrending(
  db: Firestore,
  excludeTickers: Set<string> = new Set(),
  limit = 5,
): Promise<TrendingEntry[]> {
  try {
    const trendingRef = doc(db, "metrics", "ticker_trending");
    const snap = await getDoc(trendingRef);
    const data = snap.data() as { entries?: TrendingEntry[] } | undefined;
    const entries = data?.entries ?? [];
    return entries.filter((e) => !excludeTickers.has(e.ticker)).slice(0, limit);
  } catch (err) {
    console.error("[search-analytics] getTrending failed:", err);
    return [];
  }
}

// =============================================================================
// RANKING BOOST FOR ACTIVE SEARCHES
// =============================================================================

/**
 * Returns a score boost (additive) for a ticker, based on whether the user
 * has searched for it recently.
 *
 * Call this from the search ranking step:
 *   score = baseScore + getRecencyBoost(ticker, userRecents)
 *
 * Tiered:
 *   - Top 3 most recent → +200 (above name-prefix matches)
 *   - In recents list   → +100
 *   - Not in recents    → 0
 *
 * Note: trending boost is intentionally NOT applied to ranking - it's only
 * used in the empty-state shelves. Trending shouldn't override what the user
 * literally typed.
 */
export function getRecencyBoost(
  ticker: string,
  recents: RecentSearch[],
): number {
  const idx = recents.findIndex((r) => r.ticker === ticker);
  if (idx === -1) return 0;
  if (idx < 3) return 200;
  return 100;
}
