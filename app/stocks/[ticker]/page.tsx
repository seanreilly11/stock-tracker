import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ArrowLeft } from "lucide-react";
import AuthWrapper from "@/components/common/AuthWrapper";
import Banner from "@/components/stock-page/Banner";
import StockNews from "@/components/stock-page/StockNews";
import StockNotes from "@/components/stock-page/StockNotes";
import TopBar from "@/components/common/TopBar";
import MenuDropdown from "@/components/ui/MenuDropdown";
import NotFound from "@/components/stock-page/NotFound";
import { fetchAINotesServer } from "@/lib/ai.server";
import { getUidFromSession } from "@/lib/session";
import {
  getUserStockServer,
  getUserNextBuyStocksServer,
  getStockNotesServer,
  getTargetsServer,
} from "@/lib/db.server";
import { fetchSafe } from "@/lib/utils/helpers";
import { APP_TITLE } from "@/lib/utils/constants";
import { TStock, TNote, TTarget } from "@/types";
import { getStockDetails, getStockNews, getStockPrices } from "@/lib/api/stocks";

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
  const uid = await getUidFromSession();

  const [details, news, savedStock, nextStocks] = await Promise.all([
    fetchSafe(() => getStockDetails(ticker)),
    fetchSafe(() => getStockNews(ticker)),
    getUserStockServer(uid, ticker),
    getUserNextBuyStocksServer(uid),
  ]);

  const notes: TNote[] = savedStock
    ? await getStockNotesServer(savedStock.id).catch(() => [])
    : [];

  const targets: TTarget[] = savedStock
    ? await getTargetsServer(savedStock.id).catch(() => [])
    : [];

  // Start these promises without awaiting — streamed to client via use()
  const pricePromise = getStockPrices(ticker).catch(() => null);

  const stockType = details?.results?.type ?? "";
  const aiNotesPromise = savedStock
    ? fetchAINotesServer(ticker, stockType).catch(() => null)
    : Promise.resolve(null);

  return (
    <AuthWrapper>
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
          actions={<MenuDropdown />}
        />

        <main className="flex-1 overflow-y-auto">
          {details?.status === "NOT_FOUND" ? (
            <NotFound error={details} />
          ) : (
            <div className="max-w-3xl mx-auto px-8 pb-20">
              <Suspense fallback={<BannerSkeleton />}>
                <Banner
                  ticker={ticker}
                  name={details?.results?.name}
                  details={details?.results}
                  savedStock={savedStock as TStock | null}
                  nextStocks={nextStocks}
                  pricePromise={pricePromise}
                  targets={targets}
                />
              </Suspense>
              <StockNews ticker={ticker} news={news} />
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
    </AuthWrapper>
  );
};

export default StockPage;
