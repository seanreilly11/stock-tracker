"use client";
import React from "react";
import AuthWrapper from "@/app/components/common/AuthWrapper";
import Banner from "@/app/components/stock-page/Banner";
import StockNews from "@/app/components/stock-page/StockNews";
import StockNotes from "@/app/components/stock-page/StockNotes";
import useFetchStockDetails from "@/hooks/useFetchStockDetails";

type Props = {
    params: {
        ticker: string;
    };
};

const Page = ({ params }: Props) => {
    const { data: details } = useFetchStockDetails(params.ticker);
    // console.log(details);
    return (
        <AuthWrapper>
            <Banner
                ticker={params.ticker}
                name={details?.results?.name}
                details={details?.results}
            />
            <div className="flex flex-col sm:flex-row gap-x-8 gap-y-6 sm:pt-8">
                <StockNotes
                    ticker={params.ticker}
                    name={details?.results?.name}
                    type={details?.results.type}
                />
                <StockNews ticker={params.ticker} />
            </div>
        </AuthWrapper>
    );
};

export default Page;
