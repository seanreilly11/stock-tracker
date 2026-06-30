# SEO Optimisation Design — InvestPrep

**Date:** 2026-05-19  
**Branch:** redesign-1-08052026

## Context

InvestPrep has minimal SEO coverage: a root title/description, a dynamic stock page title, and nothing else. No robots.txt, no sitemap, no Open Graph, no structured data, no canonical URLs. Stock pages are auth-gated so crawlers can't reach them.

The goal is full-stack SEO — landing page for acquisition (ranking for "stock tracker", "investment journal") and stock pages for content SEO (ranking for "[TICKER] stock", "[COMPANY] stock tracker"). This requires ungating stock pages for anonymous users and implementing 10 complementary SEO methods that work together.

All hardcoded app name strings must use `APP_TITLE` from `@/lib/utils/constants` so the brand name stays consistent if it changes.

---

## Method 1 — Ungate Stock Pages

**File:** `middleware.ts`

Remove `/stocks` from the protected route matcher. The stock page already handles `uid = null` gracefully — it conditionally renders user features only when `savedStock` exists. Anonymous users see: company info, price, news, related stocks. Hidden: notes, thesis, targets, watchlist.

**Verification:** Visit `/stocks/AAPL` while logged out. Should show company details, no redirect.

---

## Method 2 — robots.txt

**New file:** `app/robots.ts`

```ts
import { MetadataRoute } from 'next'
import { APP_TITLE } from '@/lib/utils/constants'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/stocks/', '/contact'],
        disallow: ['/api/', '/login', '/register', '/forgot-password'],
      },
    ],
    sitemap: `${process.env.NEXT_PUBLIC_BASE_URL}/sitemap.xml`,
  }
}
```

**Requirement:** `NEXT_PUBLIC_BASE_URL` env var (e.g. `https://investprep.com`).

---

## Method 3 — Dynamic XML Sitemap

**New file:** `app/sitemap.ts`

Reads `public/tickers.json` (8000+ tickers) and generates one URL entry per ticker. Also includes static routes.

```ts
import { MetadataRoute } from 'next'
import tickers from '@/public/tickers.json'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_BASE_URL

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, priority: 1.0, changeFrequency: 'weekly' },
    { url: `${base}/contact`, priority: 0.3, changeFrequency: 'monthly' },
  ]

  const stockRoutes: MetadataRoute.Sitemap = tickers.map((t) => ({
    url: `${base}/stocks/${t.ticker}`,
    priority: 0.7,
    changeFrequency: 'daily',
  }))

  return [...staticRoutes, ...stockRoutes]
}
```

**Note:** Inspect `public/tickers.json` shape to confirm property name (`ticker` vs `symbol` etc.) before implementing.

---

## Method 4 — Enhanced `generateMetadata` on Stock Pages

**File:** `app/stocks/[ticker]/page.tsx`

Extend `generateMetadata` to fetch company details and populate full metadata. Next.js deduplicates the `fetch()` call via its request cache — `getStockDetails` will not be called twice.

```ts
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { ticker } = await params
  const details = await getStockDetails(ticker)
  const name = details?.results?.name ?? ticker
  const description = details?.results?.description
  const sector = details?.results?.sic_description

  return {
    title: `${name} (${ticker}) Stock | ${APP_TITLE}`,
    description: description
      ? `${description.slice(0, 152)}...`
      : `Track ${ticker} with ${APP_TITLE}. Real-time price, news, and analysis.`,
    keywords: [ticker, name, sector, 'stock tracker', 'investment'].filter(Boolean),
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/stocks/${ticker}`,
    },
    openGraph: {
      title: `${name} (${ticker}) | ${APP_TITLE}`,
      description: description?.slice(0, 200) ?? `Track ${ticker} on ${APP_TITLE}`,
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/stocks/${ticker}`,
      siteName: APP_TITLE,
      type: 'website',
      images: [
        {
          url: `${process.env.NEXT_PUBLIC_BASE_URL}/og/stocks/${ticker}`,
          width: 1200,
          height: 630,
          alt: `${name} (${ticker}) stock on ${APP_TITLE}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${name} (${ticker}) | ${APP_TITLE}`,
      description: description?.slice(0, 200) ?? `Track ${ticker} on ${APP_TITLE}`,
      images: [`${process.env.NEXT_PUBLIC_BASE_URL}/og/stocks/${ticker}`],
    },
  }
}
```

---

## Method 5 — Open Graph + Twitter Cards on Root Layout

**File:** `app/layout.tsx`

Extend root metadata with full OG and Twitter tags for the landing page and any page without its own OG override.

```ts
export const metadata: Metadata = {
  title: {
    default: APP_TITLE,
    template: `%s | ${APP_TITLE}`,
  },
  description: 'Track stock intentions and keep personal notes alongside real-time data.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL!),
  openGraph: {
    title: APP_TITLE,
    description: 'Track stock intentions and keep personal notes alongside real-time data.',
    url: process.env.NEXT_PUBLIC_BASE_URL,
    siteName: APP_TITLE,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: APP_TITLE,
    description: 'Track stock intentions and keep personal notes alongside real-time data.',
  },
}
```

**Note:** `metadataBase` is required for Next.js to resolve relative OG image URLs.

---

## Method 6 — Dynamic OG Images

**New file:** `app/og/stocks/[ticker]/route.tsx`

Generates a 1200×630 PNG social preview image per stock using `next/og` (`ImageResponse`). Runs on Vercel Edge.

Layout:
```
┌─────────────────────────────────────────────────┐
│  [APP_TITLE]                                    │
│                                                 │
│  AAPL                                           │
│  Apple Inc.                                     │
│                                                 │
│  $192.35        ▲ +1.42%    Technology          │
└─────────────────────────────────────────────────┘
```

Fetches: ticker name, price, % change, sector from Polygon snapshot endpoint. Falls back to ticker-only display if Polygon call fails.

Uses `APP_TITLE` in the top-left branding area.

---

## Method 7 — JSON-LD Structured Data

**New file:** `components/seo/JsonLd.tsx` (server component)

Generic component that injects a `<script type="application/ld+json">` tag.

**Landing page** — `Organization` schema in `app/page.tsx` (for unauthenticated render):
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "[APP_TITLE]",
  "url": "[BASE_URL]",
  "description": "Track stock intentions and keep personal notes alongside real-time data."
}
```

**Stock pages** — `WebPage` + `BreadcrumbList` + `FinancialProduct`:
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "/" },
    { "@type": "ListItem", "position": 2, "name": "AAPL", "item": "/stocks/AAPL" }
  ]
}
```

`APP_TITLE` used in Organization `name` field.

---

## Method 8 — Canonical URLs

Included as `alternates.canonical` in every `generateMetadata` call (Methods 4 and 5). Prevents duplicate content penalties from URL parameters (e.g. `?filter=`, `?q=`).

No separate file needed — part of Methods 4 and 5.

---

## Method 9 — Web App Manifest

**New file:** `app/manifest.ts`

```ts
import { MetadataRoute } from 'next'
import { APP_TITLE } from '@/lib/utils/constants'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: APP_TITLE,
    short_name: APP_TITLE,
    description: 'Track stock intentions and keep personal notes alongside real-time data.',
    start_url: '/',
    display: 'standalone',
    theme_color: '#ffffff',
    background_color: '#ffffff',
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  }
}
```

**Requirement:** Add `icon-192.png` and `icon-512.png` to `public/icons/`. Check if any existing icons are in `/public/images/`.

---

## Method 10 — Landing Page Content Optimisation

**File:** `components/Landing.tsx` (or wherever the landing component lives)

Audit and update:
- H1 must contain target keyword (e.g. "Personal Stock Tracker")
- H2s cover feature keywords: "Investment Journal", "Stock Analysis", "Price Targets"
- Body copy references `APP_TITLE` not hardcoded string
- No `noindex` meta on landing page
- Descriptive alt text on any images

---

## Environment Variables Required

| Variable | Purpose | Example |
|----------|---------|---------|
| `NEXT_PUBLIC_BASE_URL` | Canonical URLs, sitemap, OG image paths | `https://investprep.com` |

Add to `.env.local` and Vercel environment settings.

---

## Critical Files

| File | Action |
|------|--------|
| `middleware.ts` | Remove `/stocks` from protected routes |
| `app/layout.tsx` | Add OG/Twitter metadata, metadataBase, title template |
| `app/stocks/[ticker]/page.tsx` | Enrich `generateMetadata` with details fetch + OG + Twitter + canonical |
| `app/robots.ts` | New — robots config |
| `app/sitemap.ts` | New — dynamic sitemap from tickers.json |
| `app/og/stocks/[ticker]/route.tsx` | New — edge OG image generation |
| `app/manifest.ts` | New — PWA manifest |
| `components/seo/JsonLd.tsx` | New — JSON-LD script injector |
| `components/Landing.tsx` | Audit heading structure and keyword copy |
| `.env.local` | Add `NEXT_PUBLIC_BASE_URL` |

---

## Verification

1. `robots.txt`: Visit `/robots.txt` — verify allows `/stocks/`, disallows `/api/`
2. `sitemap.xml`: Visit `/sitemap.xml` — verify 8000+ `<url>` entries present
3. Stock page public: Log out, visit `/stocks/AAPL` — company info visible, no redirect
4. Metadata: Inspect `<head>` on `/stocks/AAPL` — title, description, og:*, twitter:* all present
5. OG image: Visit `/og/stocks/AAPL` — branded 1200×630 PNG renders
6. JSON-LD: Use Google Rich Results Test on a stock page URL
7. Canonical: Inspect `<link rel="canonical">` on `/stocks/AAPL`
8. Manifest: DevTools Application tab → Manifest — shows name, icons
9. Landing page: Lighthouse SEO score ≥ 90
