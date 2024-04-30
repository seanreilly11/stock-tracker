"use client";
import React from "react";
import styles from "./page.module.css";
import { Typography } from "antd";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";

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
    if (detailsLoading || pricesLoading) return "Loading";
    return (
        <>
            <Typography.Title>{params.ticker}</Typography.Title>
            <Image
                src={
                    details?.results.branding.logo_url +
                    "?apiKey=bZVZXz83pe0SFpRvjzubFtizArepCMs1"
                }
                alt="Logo"
                width={100}
                height={100}
                priority
            />
        </>
    );
};

export default Page;
