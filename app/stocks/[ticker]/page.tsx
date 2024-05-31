"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import StockDetails from "@/app/components/StockDetails";
import StockNotes from "@/app/components/StockNotes";
import { Card, Skeleton } from "antd";
import { getStockDetails, getStockPrices } from "@/app/lib/actions/stocks";

type Props = {
    params: {
        ticker: string;
    };
};

const Page = ({ params }: Props) => {
    const { data: prices, isLoading: pricesLoading } = useQuery({
        queryKey: ["search", params.ticker],
        queryFn: () => getStockPrices(params.ticker),
        staleTime: Infinity, // could be set to a minute ish to help with live but might just leave
    });

    const { data: details, isLoading: detailsLoading } = useQuery({
        queryKey: ["stockDetails", params.ticker],
        queryFn: () => getStockDetails(params.ticker),
        staleTime: Infinity, // could be set to a minute ish to help with live but might just leave
    });

    // console.log(details);
    // console.log(prices);

    return (
        <div className="flex flex-col items-start md:flex-row gap-4">
            {detailsLoading ? (
                <Card className="md:basis-3/5">
                    <Skeleton active paragraph={{ rows: 8 }} />
                </Card>
            ) : (
                <StockDetails details={details} prices={prices} />
            )}
            {pricesLoading ? (
                <Card className="basis-full">
                    <Skeleton active />
                </Card>
            ) : (
                <StockNotes
                    name={details?.results.name}
                    ticker={params.ticker}
                    prices={prices}
                />
            )}
        </div>
    );
};

export default Page;
