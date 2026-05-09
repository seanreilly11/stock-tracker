import { Suspense } from "react";
import { Skeleton } from "antd";
import Banner from "@/app/components/stock-page/Banner";
import StockNews from "@/app/components/stock-page/StockNews";
import StockNotes from "@/app/components/stock-page/StockNotes";
import NotFound from "@/app/components/stock-page/NotFound";
import { TStockDetails } from "@/lib/schemas/stocks/polygon.schema";
import { TNewsList } from "@/lib/schemas/news/news.schema";
import { TStock } from "@/lib/schemas/stocks/stock.schema";

type Props = {
    ticker: string;
    details: TStockDetails;
    news: TNewsList;
    savedStock: TStock | null;
    nextStocks: string[];
};

const StockPageContent = ({ ticker, details, news, savedStock, nextStocks }: Props) => {
    return details?.status === "NOT_FOUND" ? (
        <NotFound error={details} />
    ) : (
        <>
            <Suspense fallback={<Skeleton active />}>
                <Banner
                    ticker={ticker}
                    name={details?.results?.name}
                    details={details?.results}
                    savedStock={savedStock}
                    nextStocks={nextStocks}
                />
            </Suspense>
            <div className="flex flex-col sm:flex-row gap-x-8 gap-y-6 sm:pt-8">
                <StockNotes
                    ticker={ticker}
                    name={details?.results?.name}
                    type={details?.results?.type}
                    savedStock={savedStock}
                />
                <StockNews news={news} ticker={ticker} />
            </div>
        </>
    );
};

export default StockPageContent;
