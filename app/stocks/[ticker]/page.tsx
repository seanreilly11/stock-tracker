import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import AuthWrapper from "@/components/common/AuthWrapper";
import Banner from "@/components/stock-page/Banner";
import StockNews from "@/components/stock-page/StockNews";
import StockNotes from "@/components/stock-page/StockNotes";
import TopBar from "@/components/common/TopBar";
import MenuDropdown from "@/components/ui/MenuDropdown";
import NotFound from "@/components/stock-page/NotFound";
import { polygonFetch } from "@/lib/api/polygon";
import { getUidFromSession } from "@/lib/session";
import {
    getUserStockServer,
    getUserNextBuyStocksServer,
    getStockNotesServer,
} from "@/lib/db.server";
import { APP_TITLE } from "@/lib/utils/constants";
import { TStock, TNote } from "@/types";

type Props = { params: Promise<{ ticker: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { ticker } = await params;
    return { title: `${ticker} | ${APP_TITLE}` };
}

const StockPage = async ({ params }: Props) => {
    const { ticker } = await params;
    const uid = await getUidFromSession();

    const [details, news, savedStock, nextStocks] = await Promise.all([
        polygonFetch(`/v3/reference/tickers/${ticker}`).catch(() => null),
        polygonFetch("/v2/reference/news", {
            ticker: ticker.toUpperCase(),
            limit: "10",
        }).catch(() => null),
        uid ? getUserStockServer(uid, ticker) : Promise.resolve(null),
        uid
            ? getUserNextBuyStocksServer(uid)
            : Promise.resolve([] as string[]),
    ]);

    const notes: TNote[] = savedStock
        ? await getStockNotesServer(savedStock.id).catch(() => [])
        : [];

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
                            <Banner
                                ticker={ticker}
                                name={details?.results?.name}
                                details={details?.results}
                                savedStock={savedStock as TStock | null}
                                nextStocks={nextStocks}
                            />
                            <StockNews ticker={ticker} news={news} />
                            {savedStock && (
                                <StockNotes
                                    ticker={ticker}
                                    name={details?.results?.name ?? ""}
                                    type={details?.results?.type ?? ""}
                                    stock={savedStock as TStock}
                                    notes={notes}
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
