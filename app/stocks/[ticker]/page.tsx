"use client";
import React from "react";
import styles from "./page.module.css";
import { useQuery } from "@tanstack/react-query";
import StockDetails from "@/app/components/StockDetails";
import StockNotes from "@/app/components/StockNotes";
import { Card, Skeleton } from "antd";

type Props = {
    params: {
        ticker: string;
    };
};

const Page = ({ params }: Props) => {
    const getStockPrices = async (ticker: string) => {
        const res = await fetch(
            `https://api.polygon.io/v2/aggs/ticker/${ticker}/prev?adjusted=true&apiKey=bZVZXz83pe0SFpRvjzubFtizArepCMs1`
        );
        return res.json();
    };
    const getStockDetails = async (ticker: string) => {
        const res = await fetch(
            `https://api.polygon.io/v3/reference/tickers/${ticker}?apiKey=bZVZXz83pe0SFpRvjzubFtizArepCMs1`
        );
        return res.json();
    };

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

    console.log(details);
    console.log(prices);

    if (detailsLoading || pricesLoading)
        return (
            <div className="flex flex-col md:flex-row gap-4">
                <Card className="md:basis-3/5">
                    <Skeleton active paragraph={{ rows: 8 }} />
                </Card>
                <Card className="basis-full">
                    <Skeleton active />
                </Card>
            </div>
        );
    return (
        <div className="flex flex-col md:flex-row gap-4">
            <StockDetails details={details} prices={prices} />
            <StockNotes prices={prices} />
        </div>
    );
};

export default Page;
