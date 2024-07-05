"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getStockDetails, getStockPrices } from "@/server/actions/stocks";
import AuthWrapper from "@/app/components/common/AuthWrapper";
import Banner from "@/app/components/stock-page/Banner";
import StockNews from "@/app/components/stock-page/StockNews";
import StockNotes from "@/app/components/stock-page/StockNotes";

type Props = {
    params: {
        ticker: string;
    };
};

const Page = ({ params }: Props) => {
    const { data: prices, isLoading: pricesLoading } = useQuery({
        queryKey: ["search", params.ticker],
        queryFn: () => getStockPrices(params.ticker),
        staleTime: Infinity, // could be set to a minute ish to help with live but might just leave. COuld make a minute if local time is during the day
    });

    const { data: details, isLoading: detailsLoading } = useQuery({
        queryKey: ["stockDetails", params.ticker],
        queryFn: () => getStockDetails(params.ticker),
        staleTime: Infinity, // could be set to a minute ish to help with live but might just leave
    });

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
