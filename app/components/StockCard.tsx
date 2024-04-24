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

type PolygonStock = {
    adjusted: true;
    count: 1;
    queryCount: 1;
    request_id: "6760de57971b78d1b8b0c5d1dc73ed08";
    results: ResultStock;
    resultsCount: 1;
    status: "OK";
    ticker: "MSFT";
};

type ResultStock = {
    T: string;
    c: number;
    h: number;
    l: number;
    n: number;
    o: number;
    t: number;
    v: number;
    vw: number;
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
        staleTime: Infinity, // could be set to a minute ish to help with live but might just leave
    });

    // aplha vantage - Global Quote is the object returned
    // Information when it fails

    console.log(data);

    if (isLoading) return <Skeleton active />;
    // if (!data["Global Quote"]) return <div>Failed to load</div>;
    return (
        <Card>
            <Typography.Title level={2}>{data?.ticker}</Typography.Title>
            <Typography.Text>{data?.results?.[0].c}</Typography.Text>
            <br />
            <Typography.Text>
                {(
                    ((data?.results?.[0].c - data?.results?.[0].o) /
                        data?.results?.[0].o) *
                    100
                ).toFixed(2)}
                %
                {/* math will be replaced with actual value once paying for next tier  */}
            </Typography.Text>
            {/* To calculate percentage change, first, 
                        subtract the earlier stock value from the later stock value; 
                        then divide that difference by the earlier value, 
                        and finally, multiply the result by 100. */}
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
