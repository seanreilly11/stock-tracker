import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ArrowLeft } from "lucide-react";
import Banner from "@/components/stock-page/Banner";
import CollapsedNewsBar from "@/components/stock-page/CollapsedNewsBar";
import ThesisSection from "@/components/stock-page/ThesisSection";
import WatchlistSidebar from "@/components/stock-page/WatchlistSidebar";
import StockNotes from "@/components/stock-page/StockNotes";
import TopBar from "@/components/common/TopBar";
import MenuDropdown from "@/components/ui/MenuDropdown";
import NotFound from "@/components/stock-page/NotFound";
import { getAINotes } from "@/lib/api/ai";
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
} from "@/lib/api/stocks";

type Props = { params: Promise<{ ticker: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { ticker } = await params;
  return { title: `${ticker} | ${APP_TITLE}` };
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
  const [uid, user] = await Promise.all([getUidFromSession(), getUserFromSession()]);

  const [details, news, savedStock, nextStocks] = await Promise.all([
    getStockDetails(ticker),
    getStockNews(ticker),
    getUserStock(uid, ticker),
    getUserNextBuyStocks(uid),
  ]);

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
          actions={<MenuDropdown name={user?.user_metadata?.name} email={user?.email} />}
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
              {savedStock && (
                <ThesisSection stock={savedStock as TStock} ticker={ticker} />
              )}
              <CollapsedNewsBar ticker={ticker} news={news} />
              {savedStock && (
                <StockNotes
                  ticker={ticker}
                  name={details?.results?.name ?? ""}
                  type={stockType}
                  stock={savedStock as TStock}
                  notes={notes}
                  aiNotesPromise={aiNotesPromise}
                />
              )}
            </div>
          )}
        </main>
        </div>
      </div>
  );
};

export default StockPage;
