import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ArrowLeft } from "lucide-react";
import Banner from "@/components/stock-page/Banner";
import CollapsedNewsBar from "@/components/stock-page/CollapsedNewsBar";
import ThesisSection from "@/components/stock-page/ThesisSection";
import WatchlistSidebar from "@/components/stock-page/WatchlistSidebar";
import StockNotes from "@/components/stock-page/StockNotes";
import RelatedStocks from "@/components/stock-page/RelatedStocks";
import type { RelatedCard } from "@/components/stock-page/RelatedStocks";
import TopBar from "@/components/common/TopBar";
import MenuDropdown from "@/components/ui/MenuDropdown";
import JsonLd from "@/components/seo/JsonLd";
import NotFound from "@/components/stock-page/NotFound";
import { getUidFromSession, getUserFromSession } from "@/lib/session";
import {
  getUserStock,
  getUserNextBuyStocks,
  getStockNotes,
  getTargets,
} from "@/lib/data";
import { APP_TITLE } from "@/lib/utils/constants";
import { TStock, TNote, TTarget } from "@/types";
import {
  getStockDetails,
  getStockNews,
  getStockPrices,
  getRelatedCompanies,
  getRelatedStockCards,
} from "@/lib/api/stocks";

type Props = { params: Promise<{ ticker: string }> };

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

const BannerSkeleton = () => (
  <div className="pt-9 pb-6 border-b border-[var(--rule)] animate-pulse">
    <div className="h-4 bg-[var(--paper-3)] rounded w-1/4 mb-3" />
    <div className="h-10 bg-[var(--paper-3)] rounded w-1/2 mb-4" />
    <div className="h-6 bg-[var(--paper-3)] rounded w-1/4" />
  </div>
);

const StockPage = async ({ params }: Props) => {
  const { ticker } = await params;
  const [uid, user] = await Promise.all([
    getUidFromSession(),
    getUserFromSession(),
  ]);

  const [details, news, savedStock, nextStocks, relatedData] =
    await Promise.all([
      getStockDetails(ticker),
      getStockNews(ticker),
      getUserStock(uid, ticker),
      getUserNextBuyStocks(uid),
      getRelatedCompanies(ticker),
    ]);

  const relatedTickers: string[] = (relatedData?.results ?? [])
    .map((r: { ticker: string }) => r.ticker)
    .slice(0, 6);

  const relatedCards: RelatedCard[] = relatedTickers.length
    ? ((await getRelatedStockCards(relatedTickers))?.results ?? []).slice(0, 4)
    : [];

  const notes: TNote[] = savedStock
    ? ((await getStockNotes(savedStock.id)) ?? [])
    : [];

  const targets: TTarget[] = savedStock
    ? ((await getTargets(savedStock.id)) ?? [])
    : [];

  // Start these promises without awaiting — streamed to client via use()
  const pricePromise = getStockPrices(ticker);

  const stockType = details?.results?.type ?? "";
  const aiNotesPromise = Promise.resolve(null);
  //  savedStock
  //   ? getAINotes(ticker, stockType)

  return (
    <div className="flex flex-col h-full bg-[var(--paper)]">
      <TopBar
        breadcrumbs={[
          <Link
            key="home"
            href="/"
            className="inline-flex items-center gap-1 hover:text-[var(--ink)] transition-colors"
          >
            <ArrowLeft size={11} /> Home
          </Link>,
          ...(savedStock?.sector
            ? [<span key="sector">{savedStock.sector}</span>]
            : []),
          <span key="ticker">{ticker}</span>,
        ]}
        actions={
          <MenuDropdown name={user?.user_metadata?.name} email={user?.email} />
        }
      />

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

      <div className="flex flex-1 min-h-0">
        <WatchlistSidebar currentTicker={ticker} />
        <main className="flex-1 overflow-y-auto">
          {details?.status === "NOT_FOUND" ? (
            <NotFound error={details} />
          ) : (
            <div className="max-w-3xl mx-auto px-4 sm:px-8 pb-20">
              <Suspense fallback={<BannerSkeleton />}>
                <Banner
                  ticker={ticker}
                  name={details?.results?.name}
                  details={details?.results}
                  savedStock={savedStock as TStock | null}
                  nextStocks={nextStocks}
                  pricePromise={pricePromise}
                  targets={targets}
                  lastNoteDate={notes[0]?.created_at ?? null}
                />
              </Suspense>
              <ThesisSection stock={savedStock as TStock | null} ticker={ticker} name={details?.results?.name ?? ticker} />
              <CollapsedNewsBar ticker={ticker} news={news} />
              <StockNotes
                ticker={ticker}
                name={details?.results?.name ?? ""}
                type={stockType}
                stock={savedStock as TStock | null}
                notes={notes}
                aiNotesPromise={aiNotesPromise}
              />
              <RelatedStocks cards={relatedCards} />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default StockPage;
