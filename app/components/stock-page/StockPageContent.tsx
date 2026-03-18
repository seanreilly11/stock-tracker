import AuthWrapper from "@/app/components/common/AuthWrapper";
import Banner from "@/app/components/stock-page/Banner";
import StockNews from "@/app/components/stock-page/StockNews";
import StockNotes from "@/app/components/stock-page/StockNotes";
import NotFound from "@/app/components/stock-page/NotFound";
import { TStockDetails } from "@/lib/schemas/stocks/polygon.schema";
import { TNewsList } from "@/lib/schemas/news/news.schema";

type Props = {
    ticker: string;
    details: TStockDetails;
    news: TNewsList;
};

const StockPageContent = ({ ticker, details, news }: Props) => {
    return (
        <AuthWrapper>
            {details?.status === "NOT_FOUND" ? (
                <NotFound error={details} />
            ) : (
                <>
                    <Banner
                        ticker={ticker}
                        name={details?.results?.name}
                        details={details?.results}
                    />
                    <div className="flex flex-col sm:flex-row gap-x-8 gap-y-6 sm:pt-8">
                        <StockNotes
                            ticker={ticker}
                            name={details?.results?.name}
                            type={details?.results?.type}
                        />
                        <StockNews news={news} ticker={ticker} />
                    </div>
                </>
            )}
        </AuthWrapper>
    );
};

export default StockPageContent;
