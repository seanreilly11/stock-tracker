"use client";
import React from "react";
import { Skeleton, Card } from "antd";
import Link from "next/link";
import { TStock } from "@/utils/types";
import Price from "../ui/Price";
import useFetchStockPrices from "@/hooks/useFetchStockPrices";
import { formatPrice } from "@/utils/helpers";

type Props = {
    stock: TStock;
};

const StockCard = ({ stock }: Props) => {
    const { data, isLoading } = useFetchStockPrices(stock?.ticker);

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
                                <p
                                    className={`text-2xl font-semibold text-primary ml-2`}
                                >
                                    {formatPrice(
                                        parseFloat(data?.results?.[0].c)
                                    )}
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
