"use client";
import AuthWrapper from "@/app/components/common/AuthWrapper";
import Banner from "@/app/components/stock-page/Banner";
import StockNews from "@/app/components/stock-page/StockNews";
import StockNotes from "@/app/components/stock-page/StockNotes";
import useFetchStockDetails from "@/server/queries/useFetchStockDetails";
import NotFound from "@/app/components/stock-page/NotFound";

type Props = {
    ticker: string;
};

const StockPageContent = ({ ticker }: Props) => {
    const { data: details } = useFetchStockDetails(ticker);

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
                        <StockNews ticker={ticker} />
                    </div>
                </>
            )}
        </AuthWrapper>
    );
};

export default StockPageContent;
