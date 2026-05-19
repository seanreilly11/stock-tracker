# SEO Optimisation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement 10 complementary SEO methods — robots.txt, sitemap, Open Graph, Twitter Cards, JSON-LD structured data, dynamic OG images, canonical URLs, PWA manifest, public stock pages, and landing page metadata — so InvestPrep ranks for both acquisition keywords ("stock tracker") and content keywords ("[TICKER] stock analysis").

**Architecture:** Stock pages are ungated so crawlers can reach them. All brand strings use `APP_TITLE` from `lib/utils/constants.ts`. A dynamic sitemap covers 8000+ ticker URLs. Dynamic OG images are generated per stock using `next/og` and the Polygon API.

**Tech Stack:** Next.js 16 App Router, `next/og` (built-in), Polygon API (`polygonFetch` from `lib/api/queries.ts`), `POLYGON_API_KEY` env var.

---

## File Map

| Action | File | Responsibility |
|--------|------|----------------|
| Modify | `.env.local` | Add `NEXT_PUBLIC_BASE_URL` |
| Modify | `proxy.ts` | Remove `/stocks` from protected routes |
| Modify | `components/landing-page/HeroSection.tsx` | Replace hardcoded app name with `APP_TITLE` import |
| Modify | `app/layout.tsx` | Add `metadataBase`, OG, Twitter, title template |
| Create | `app/robots.ts` | Crawler allow/disallow rules + sitemap pointer |
| Create | `app/sitemap.ts` | 8000+ URLs from `public/tickers.json` |
| Create | `app/manifest.ts` | PWA manifest with `APP_TITLE` |
| Create | `components/seo/JsonLd.tsx` | Generic JSON-LD `<script>` injector |
| Modify | `app/page.tsx` | Add Organization JSON-LD for unauthenticated view |
| Modify | `app/stocks/[ticker]/page.tsx` | Full `generateMetadata` + BreadcrumbList JSON-LD |
| Create | `app/og/stocks/[ticker]/route.tsx` | Dynamic 1200×630 OG image per stock |

---

## Task 1: Add `NEXT_PUBLIC_BASE_URL` Environment Variable

**Files:**
- Modify: `.env.local`

- [ ] **Step 1: Open `.env.local` and add the variable**

```
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

For production (Vercel), add `NEXT_PUBLIC_BASE_URL=https://your-production-domain.com` to the Vercel environment variables settings. This variable is used for canonical URLs, sitemap entries, and OG image paths.

- [ ] **Step 2: Commit**

```bash
git add .env.local
git commit -m "chore: add NEXT_PUBLIC_BASE_URL env var for canonical urls"
```

---

## Task 2: Ungate Stock Pages

**Files:**
- Modify: `proxy.ts:4`

Current `proxy.ts` line 4:
```ts
const PROTECTED = ["/stocks"];
```

- [ ] **Step 1: Remove `/stocks` from the PROTECTED array**

Open `proxy.ts`. Change line 4 from:
```ts
const PROTECTED = ["/stocks"];
```
to:
```ts
const PROTECTED: string[] = [];
```

The array is kept (not deleted) so it's easy to add routes back if needed. The rest of `proxy.ts` stays exactly as-is.

- [ ] **Step 2: Verify stock pages are publicly accessible**

Start the dev server (`npm run dev`), then open an incognito/private window and visit `http://localhost:3000/stocks/AAPL`. You should see the company info page without being redirected to `/login`.

- [ ] **Step 3: Commit**

```bash
git add proxy.ts
git commit -m "feat: make stock pages publicly accessible for seo crawlers"
```

---

## Task 3: Fix Hardcoded App Name in HeroSection

**Files:**
- Modify: `components/landing-page/HeroSection.tsx:64`

Currently line 64 defines:
```ts
const APP_TITLE_TEXT = "InvestPrep";
```
and line 45 uses `{APP_TITLE_TEXT}` in the JSX.

- [ ] **Step 1: Replace the local constant with the shared `APP_TITLE` import**

At the top of `components/landing-page/HeroSection.tsx`, add the import after the existing imports:

```ts
import { APP_TITLE } from "@/lib/utils/constants";
```

Then delete line 64:
```ts
const APP_TITLE_TEXT = "InvestPrep";  // DELETE THIS LINE
```

Then on line 45 (the `<p>` body), change `{APP_TITLE_TEXT}` to `{APP_TITLE}`:

```tsx
        {APP_TITLE} is a research notebook for traders who&apos;d rather be prepared than fast.
```

- [ ] **Step 2: Verify the landing page renders correctly**

Visit `http://localhost:3000` while logged out. The hero paragraph should still read "InvestPrep is a research notebook…".

- [ ] **Step 3: Audit landing page heading structure for target keywords**

The current H1 in `HeroSection.tsx` is `"Be ready before the market moves."` — brand-first copy, not keyword-optimised. For SEO, Google needs to find target terms ("stock tracker", "investment journal") in semantic headings.

Check each landing section file in `components/landing-page/` (`WhySection.tsx`, `MomentSection.tsx`, `FeelSection.tsx`, etc.) and ensure at least one prominent heading (H2 or H3 near the top) contains a target keyword phrase. The hero H1 can stay as-is — brand copy is fine for the primary headline. Add an H2 tagline below the hero headline that includes the target keyword, e.g.:

```tsx
<h2 style={{ fontSize: 18, color: 'var(--ink-3)', fontFamily: 'var(--sans)' }}>
  The stock tracker built for investors who think before they trade.
</h2>
```

Place this between the `<h1>` and the `<p>` description in `HeroSection.tsx`.

- [ ] **Step 4: Commit**

```bash
git add components/landing-page/HeroSection.tsx
git commit -m "fix: use APP_TITLE constant and add keyword-bearing h2 to hero section"
```

---

## Task 4: Enhance Root Layout Metadata

**Files:**
- Modify: `app/layout.tsx`

- [ ] **Step 1: Replace the metadata export in `app/layout.tsx`**

Replace the entire file content with:

```tsx
import type { Metadata } from "next";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { APP_TITLE } from "@/lib/utils/constants";

const description = "Track stock intentions and keep personal notes alongside real-time data.";

export const metadata: Metadata = {
  title: {
    default: APP_TITLE,
    template: `%s | ${APP_TITLE}`,
  },
  description,
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL!),
  openGraph: {
    title: APP_TITLE,
    description,
    siteName: APP_TITLE,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: APP_TITLE,
    description,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="h-full">
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
```

Key changes:
- `title` is now a template object — pages that set their own title get `"Page Title | InvestPrep"` automatically
- `metadataBase` enables Next.js to resolve relative OG image URLs
- `openGraph` and `twitter` are inherited by all pages unless overridden

- [ ] **Step 2: Verify metadata in browser DevTools**

Visit `http://localhost:3000`. In the browser, view page source and confirm these tags are present in `<head>`:
```html
<meta property="og:title" content="InvestPrep" />
<meta property="og:site_name" content="InvestPrep" />
<meta name="twitter:card" content="summary_large_image" />
```

- [ ] **Step 3: Commit**

```bash
git add app/layout.tsx
git commit -m "feat: add og and twitter card metadata to root layout"
```

---

## Task 5: Create robots.txt

**Files:**
- Create: `app/robots.ts`

- [ ] **Step 1: Create `app/robots.ts`**

```ts
import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/stocks/", "/contact"],
        disallow: ["/api/", "/login", "/register", "/forgot-password"],
      },
    ],
    sitemap: `${process.env.NEXT_PUBLIC_BASE_URL}/sitemap.xml`,
  };
}
```

- [ ] **Step 2: Verify robots.txt**

Visit `http://localhost:3000/robots.txt`. Expected output:
```
User-agent: *
Allow: /
Allow: /stocks/
Allow: /contact
Disallow: /api/
Disallow: /login
Disallow: /register
Disallow: /forgot-password

Sitemap: http://localhost:3000/sitemap.xml
```

- [ ] **Step 3: Commit**

```bash
git add app/robots.ts
git commit -m "feat: add robots.txt with crawler rules"
```

---

## Task 6: Create Dynamic Sitemap

**Files:**
- Create: `app/sitemap.ts`

The `public/tickers.json` file has this shape (confirmed):
```json
[{"t":"AAPL","n":"Apple Inc.","k":"s","x":"NASDAQ"}, ...]
```
Property `t` is the ticker symbol. Total: ~8000 entries.

- [ ] **Step 1: Create `app/sitemap.ts`**

```ts
import { MetadataRoute } from "next";
import { readFileSync } from "fs";
import { join } from "path";

interface TickerEntry {
  t: string;
  n: string;
  k: string;
  x: string;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_BASE_URL!;

  const rawTickers = readFileSync(
    join(process.cwd(), "public", "tickers.json"),
    "utf8",
  );
  const tickers: TickerEntry[] = JSON.parse(rawTickers);

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${base}/`,
      priority: 1.0,
      changeFrequency: "weekly",
      lastModified: new Date(),
    },
    {
      url: `${base}/contact`,
      priority: 0.3,
      changeFrequency: "monthly",
      lastModified: new Date(),
    },
  ];

  const stockRoutes: MetadataRoute.Sitemap = tickers.map((entry) => ({
    url: `${base}/stocks/${entry.t}`,
    priority: 0.7,
    changeFrequency: "daily" as const,
    lastModified: new Date(),
  }));

  return [...staticRoutes, ...stockRoutes];
}
```

- [ ] **Step 2: Verify sitemap**

Visit `http://localhost:3000/sitemap.xml`. It should return XML with 8000+ `<url>` entries. Spot-check a few:
```xml
<url>
  <loc>http://localhost:3000/stocks/AAPL</loc>
  <changefreq>daily</changefreq>
  <priority>0.7</priority>
</url>
```

- [ ] **Step 3: Commit**

```bash
git add app/sitemap.ts
git commit -m "feat: add dynamic sitemap with 8000+ stock page urls"
```

---

## Task 7: Create PWA Manifest

**Files:**
- Create: `app/manifest.ts`

- [ ] **Step 1: Create `app/manifest.ts`**

```ts
import { MetadataRoute } from "next";
import { APP_TITLE } from "@/lib/utils/constants";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: APP_TITLE,
    short_name: APP_TITLE,
    description:
      "Track stock intentions and keep personal notes alongside real-time data.",
    start_url: "/",
    display: "standalone",
    theme_color: "#faf9f5",
    background_color: "#faf9f5",
    icons: [],
  };
}
```

Note: `theme_color` / `background_color` are the hex equivalent of `--paper: oklch(98% 0.008 75)`. Icons array is empty until icon assets are added to `public/icons/`. If icons exist in `public/images/`, update the array to point at them.

- [ ] **Step 2: Verify manifest**

Visit `http://localhost:3000/manifest.webmanifest`. Expected JSON with `name`, `short_name`, `display`, `theme_color`.

- [ ] **Step 3: Commit**

```bash
git add app/manifest.ts
git commit -m "feat: add pwa manifest"
```

---

## Task 8: Create JSON-LD Component

**Files:**
- Create: `components/seo/JsonLd.tsx`

- [ ] **Step 1: Create `components/seo/JsonLd.tsx`**

```tsx
interface JsonLdProps {
  data: Record<string, unknown>;
}

const JsonLd = ({ data }: JsonLdProps) => (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
  />
);

export default JsonLd;
```

This is a server component (no `"use client"` directive). It renders a `<script>` tag with the JSON-LD payload directly into the HTML. `dangerouslySetInnerHTML` is safe here because `JSON.stringify` escapes special characters and the data comes from our own code, not user input.

- [ ] **Step 2: Commit**

```bash
git add components/seo/JsonLd.tsx
git commit -m "feat: add JsonLd server component for structured data injection"
```

---

## Task 9: Enrich Stock Page Metadata and Add JSON-LD

**Files:**
- Modify: `app/stocks/[ticker]/page.tsx`

- [ ] **Step 1: Update `generateMetadata` in `app/stocks/[ticker]/page.tsx`**

Replace the existing `generateMetadata` function (currently lines 23–27) with:

```ts
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { ticker } = await params;
  const details = await getStockDetails(ticker);
  const name = details?.results?.name ?? ticker;
  const rawDescription: string | undefined = details?.results?.description;
  const sector: string | undefined = details?.results?.sic_description;
  const base = process.env.NEXT_PUBLIC_BASE_URL!;
  const url = `${base}/stocks/${ticker}`;
  const ogImage = `${base}/og/stocks/${ticker}`;

  const description = rawDescription
    ? `${rawDescription.slice(0, 152)}…`
    : `Track ${ticker} with ${APP_TITLE}. Real-time price, news, and analysis.`;

  return {
    title: `${name} (${ticker}) Stock`,
    description,
    keywords: [ticker, name, sector, "stock tracker", "investment journal"].filter(
      (v): v is string => Boolean(v),
    ),
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${name} (${ticker}) | ${APP_TITLE}`,
      description,
      url,
      siteName: APP_TITLE,
      type: "website",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${name} (${ticker}) stock on ${APP_TITLE}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${name} (${ticker}) | ${APP_TITLE}`,
      description,
      images: [ogImage],
    },
  };
}
```

Note: `getStockDetails` is already imported at the top of the file. The `title` value is `"${name} (${ticker}) Stock"` — the root layout's `template: "%s | InvestPrep"` will render it as `"Apple Inc. (AAPL) Stock | InvestPrep"` automatically.

- [ ] **Step 2: Add `JsonLd` import and render BreadcrumbList + WebPage schema**

Add the import at the top of the file with other imports:

```ts
import JsonLd from "@/components/seo/JsonLd";
```

Inside `StockPage`, after the `<TopBar>` and before the first `<div className="flex flex-1 ...">`, add:

```tsx
<JsonLd
  data={{
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: process.env.NEXT_PUBLIC_BASE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: ticker,
        item: `${process.env.NEXT_PUBLIC_BASE_URL}/stocks/${ticker}`,
      },
    ],
  }}
/>
```

Place it directly after the `<TopBar ... />` closing tag, before the `<div className="flex flex-1 min-h-0">` line.

- [ ] **Step 3: Verify metadata on a stock page**

Visit `http://localhost:3000/stocks/AAPL` and view page source. Confirm:
- `<title>Apple Inc. (AAPL) Stock | InvestPrep</title>`
- `<meta name="description" content="Apple Inc. is ..." />`
- `<meta property="og:image" content="http://localhost:3000/og/stocks/AAPL" />`
- `<link rel="canonical" href="http://localhost:3000/stocks/AAPL" />`
- `<script type="application/ld+json">` with BreadcrumbList

- [ ] **Step 4: Commit**

```bash
git add app/stocks/[ticker]/page.tsx
git commit -m "feat: enrich stock page metadata with og, twitter cards, canonical, and json-ld"
```

---

## Task 10: Add JSON-LD to Landing Page

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Add Organization JSON-LD to the unauthenticated landing view**

Add the import at the top of `app/page.tsx`:

```ts
import JsonLd from "@/components/seo/JsonLd";
import { APP_TITLE } from "@/lib/utils/constants";
```

Change the `if (!uid)` branch from:

```tsx
if (!uid) return <Landing />;
```

to:

```tsx
if (!uid)
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: APP_TITLE,
          url: process.env.NEXT_PUBLIC_BASE_URL,
          description:
            "Track stock intentions and keep personal notes alongside real-time data.",
        }}
      />
      <Landing />
    </>
  );
```

- [ ] **Step 2: Verify JSON-LD on landing page**

Visit `http://localhost:3000` while logged out. View page source and confirm a `<script type="application/ld+json">` tag is present with `"@type": "Organization"`.

- [ ] **Step 3: Commit**

```bash
git add app/page.tsx
git commit -m "feat: add organization json-ld structured data to landing page"
```

---

## Task 11: Dynamic OG Image Route

**Files:**
- Create: `app/og/stocks/[ticker]/route.tsx`

This route generates a 1200×630 PNG social preview image for each stock using `next/og`'s `ImageResponse`. It calls the Polygon API directly via `polygonFetch` (avoids internal API calls which require an absolute URL).

- [ ] **Step 1: Create `app/og/stocks/[ticker]/route.tsx`**

```tsx
import { ImageResponse } from "next/og";
import { polygonFetch } from "@/lib/api/queries";
import { APP_TITLE } from "@/lib/utils/constants";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ ticker: string }> },
) {
  const { ticker } = await params;

  let name = ticker;
  let sector = "";

  try {
    const data = await polygonFetch(`/v3/reference/tickers/${ticker}`);
    name = data?.results?.name ?? ticker;
    sector = data?.results?.sic_description ?? "";
  } catch {
    // fall through — render with ticker only
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#faf9f5",
          padding: "60px",
        }}
      >
        {/* Brand */}
        <div
          style={{
            display: "flex",
            fontSize: 18,
            color: "#7a7869",
            fontFamily: "monospace",
            letterSpacing: "0.05em",
            textTransform: "uppercase",
          }}
        >
          {APP_TITLE}
        </div>

        {/* Stock info */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div
            style={{
              fontSize: 26,
              color: "#7a7869",
              fontFamily: "monospace",
              letterSpacing: "0.08em",
            }}
          >
            {ticker}
          </div>
          <div
            style={{
              fontSize: 68,
              color: "#1c1a16",
              fontWeight: 400,
              lineHeight: 1,
              fontFamily: "serif",
              maxWidth: "900px",
            }}
          >
            {name}
          </div>
          {sector ? (
            <div
              style={{
                fontSize: 22,
                color: "#7a7869",
                fontFamily: "sans-serif",
              }}
            >
              {sector}
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div
          style={{
            fontSize: 15,
            color: "#b0ae9e",
            fontFamily: "monospace",
            letterSpacing: "0.04em",
          }}
        >
          Stock research notebook
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
```

- [ ] **Step 2: Verify OG image renders**

Visit `http://localhost:3000/og/stocks/AAPL` in a browser. You should see a 1200×630 image with "AAPL", "Apple Inc.", and sector info on a warm cream background. The `Content-Type` header should be `image/png`.

Also verify a ticker that might not exist: `http://localhost:3000/og/stocks/FAKEXYZ` — should render with just "FAKEXYZ" and no name/sector (fallback).

- [ ] **Step 3: Commit**

```bash
git add app/og/stocks/[ticker]/route.tsx
git commit -m "feat: add dynamic og image generation for stock pages"
```

---

## Task 12: End-to-End Verification

- [ ] **Verify robots.txt**

```bash
curl http://localhost:3000/robots.txt
```
Expected: `Allow: /stocks/` and `Disallow: /api/` present.

- [ ] **Verify sitemap**

```bash
curl http://localhost:3000/sitemap.xml | grep "<loc>" | wc -l
```
Expected: 8002+ lines (8000 stocks + 2 static routes).

- [ ] **Verify stock page is public**

Open incognito tab → `http://localhost:3000/stocks/AAPL`. Should show company info. Should NOT redirect to `/login`.

- [ ] **Verify stock page metadata**

```bash
curl -s http://localhost:3000/stocks/AAPL | grep -E "og:|twitter:|canonical|ld\+json" | head -20
```
Expected: og:title, og:description, og:image, twitter:card, canonical link, and JSON-LD script all present.

- [ ] **Verify OG image**

Visit `http://localhost:3000/og/stocks/AAPL` — branded 1200×630 image renders.

- [ ] **Verify manifest**

```bash
curl http://localhost:3000/manifest.webmanifest
```
Expected: JSON with `"name"` matching `APP_TITLE`.

- [ ] **Verify landing page JSON-LD**

```bash
curl -s http://localhost:3000| grep "ld+json"
```
Expected: `<script type="application/ld+json">` tag present.

- [ ] **Run Lighthouse SEO audit**

In Chrome DevTools → Lighthouse → SEO. Run audit on `http://localhost:3000` and `http://localhost:3000/stocks/AAPL`. Target score: 90+.

- [ ] **Final commit if any loose ends**

```bash
git add -A
git commit -m "chore: seo optimisation complete"
```
