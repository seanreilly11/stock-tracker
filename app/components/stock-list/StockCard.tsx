"use client";
import React from "react";
import { Skeleton, Card } from "antd";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Stock } from "@/utils/types";
import { getStockPrices } from "@/server/actions/stocks";
import Price from "../ui/Price";

type Props = {
    stock: Stock;
};

const StockCard = ({ stock }: Props) => {
    const { data, isLoading } = useQuery({
        queryKey: ["search", stock.ticker],
        queryFn: () => getStockPrices(stock.ticker),
        staleTime: Infinity, // could be set to a minute ish to help with live but might just leave
    });

    const percChange: number = parseFloat(
        (
            ((data?.results?.[0].c - data?.results?.[0].o) /
                data?.results?.[0].o) *
            100
        ).toFixed(2)
    );

    // console.log(data);

    if (isLoading) return <Skeleton active />;
    return (
        <Link href={`stocks/${stock.ticker}`}>
            <Card className="card-shadow">
                {data.error ? (
                    <p>{data.error}</p>
                ) : (
                    <>
                        <div className="flex items-end justify-between">
                            <h2 className="text-3xl font-bold">
                                {data?.ticker}
                            </h2>
                            <div className="flex items-end">
                                <p>
                                    {percChange}%
                                    {/* TODO: math will be replaced with actual value once paying for next tier  */}
                                </p>
                                <p className="text-2xl font-semibold text-indigo-600 ml-2">
                                    <Price
                                        value={parseFloat(data?.results?.[0].c)}
                                    />
                                </p>
                            </div>
                        </div>
                        <div className="flex items-end justify-between">
                            <p className="ellipsis-text">{stock?.name}</p>
                            {stock?.targetPrice ? (
                                <p className="target-price-nowrap">
                                    Target:{" "}
                                    <span className="text-lg font-medium text-emerald-500">
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
