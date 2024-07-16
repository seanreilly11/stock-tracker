"use client";
import React from "react";
import AuthWrapper from "@/app/components/common/AuthWrapper";
import Banner from "@/app/components/stock-page/Banner";
import StockNews from "@/app/components/stock-page/StockNews";
import StockNotes from "@/app/components/stock-page/StockNotes";
import useFetchStockPrices from "@/hooks/useFetchStockPrices";
import useFetchStockDetails from "@/hooks/useFetchStockDetails";

type Props = {
    params: {
        ticker: string;
    };
};

const Page = ({ params }: Props) => {
    const { data: prices } = useFetchStockPrices(params.ticker);
    const { data: details } = useFetchStockDetails(params.ticker);

    // console.log(details);
    // console.log(prices);

    return (
        <AuthWrapper>
            <Banner
                ticker={params.ticker}
                name={details?.results?.name}
                prices={prices}
                results={details?.results}
            />
            <div className="flex flex-col sm:flex-row gap-x-8 gap-y-6 sm:pt-8">
                <StockNotes
                    ticker={params.ticker}
                    name={details?.results?.name}
                />
                <StockNews ticker={params.ticker} />
            </div>
        </AuthWrapper>
    );
};

export default Page;
