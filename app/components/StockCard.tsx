"use client";
import React from "react";
import { Skeleton, Card, Typography } from "antd";
import { useQuery } from "@tanstack/react-query";

type Props = {
    symbol: string;
};

type Stock = {
    "01. symbol": string;
    "02. open": string;
    "03. high": string;
    "04. low": string;
    "05. price": string;
    "06. volume": string;
    "07. latest trading day": string;
    "08. previous close": string;
    "09. change": string;
    "10. change percent": string;
};

const StockCard = ({ symbol }: Props) => {
    const getStock = async (symbol: string) => {
        const res = await fetch(
            `https://api.polygon.io/v2/aggs/ticker/${symbol}/prev?adjusted=true&apiKey=bZVZXz83pe0SFpRvjzubFtizArepCMs1`
        );
        // const res = await fetch(
        //     `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=891N0XBQAZW5FS4Q`
        // );
        return res.json();
    };

    const { data, isLoading } = useQuery({
        queryKey: ["search", symbol],
        queryFn: () => getStock(symbol),
    });

    // Global Quote is the object returned
    // Information when it fails

    console.log(data);

    if (isLoading) return <Skeleton />;
    // if (!data["Global Quote"]) return <div>Failed to load</div>;
    return (
        <Card>
            <Typography.Title level={2}>{data.ticker}</Typography.Title>
            <Typography.Text>{data?.results?.[0].c}</Typography.Text>
        </Card>
        // <Card>
        //     <Typography.Title level={2}>
        //         {data["Global Quote"]["01. symbol"]}
        //     </Typography.Title>
        //     <Typography.Text>
        //         {data["Global Quote"]["05. price"]}
        //     </Typography.Text>
        // </Card>
    );
};

export default StockCard;
