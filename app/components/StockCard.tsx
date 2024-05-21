"use client";
import React, { useEffect, useState } from "react";
import { Skeleton, Card } from "antd";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Stock } from "../lib/types";
import { getStock } from "../server/actions/stocks";
import Price from "./Price";

type Props = {
    stock: Stock;
};

const StockCard = ({ stock }: Props) => {
    const { data, isLoading } = useQuery({
        queryKey: ["search", stock.ticker],
        queryFn: () => getStock(stock.ticker),
        staleTime: Infinity, // could be set to a minute ish to help with live but might just leave
    });

    const percChange: number = parseFloat(
        (
            ((data?.results?.[0].c - data?.results?.[0].o) /
                data?.results?.[0].o) *
            100
        ).toFixed(2)
    );

    console.log(data);

    if (isLoading) return <Skeleton active />;
    return (
        <Link href={`stocks/${stock.ticker}`}>
            <Card className="card-shadow">
                {data.error ? (
                    <p>{data.error}</p>
                ) : (
                    <>
                        <div className="flex items-center justify-between">
                            <h2 className="text-3xl font-bold">
                                {data?.ticker}
                            </h2>
                            <div className="flex items-end">
                                <p
                                    className={
                                        percChange >= 0
                                            ? "text-green-500"
                                            : "text-red-500"
                                    }
                                >
                                    {percChange}%
                                    {/* math will be replaced with actual value once paying for next tier  */}
                                </p>
                                <Price
                                    value={parseFloat(data?.results?.[0].c)}
                                    margin="l"
                                />
                            </div>
                        </div>
                        <div className="flex items-end justify-between">
                            <p className="ellipsis-text">{stock?.name}</p>
                            {stock?.targetPrice ? (
                                <p className="target-price-nowrap">
                                    Target:{" "}
                                    <span className="text-lg font-medium text-green-500">
                                        ${stock?.targetPrice}
                                    </span>
                                </p>
                            ) : null}
                        </div>
                    </>
                )}
                {/* To calculate percentage change, first, 
                        subtract the earlier stock value from the later stock value; 
                        then divide that difference by the earlier value, 
                        and finally, multiply the result by 100. */}
            </Card>
        </Link>
    );
};

export default StockCard;
