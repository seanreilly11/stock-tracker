"use client";
import React from "react";
import { Skeleton, Card } from "antd";
import Link from "next/link";
import { TStock } from "@/utils/types";
import useFetchStockPrices from "@/hooks/useFetchStockPrices";
import { formatPrice, getChangeColour, getPercChange } from "@/utils/helpers";

type Props = {
    stock: TStock;
};

const StockCard = ({ stock }: Props) => {
    const {
        data: prices,
        isLoading,
        error,
    } = useFetchStockPrices(stock?.ticker);
    const todaysPrices = prices?.ticker.day.c !== 0;
    const stockPrices = todaysPrices
        ? prices?.ticker.day
        : prices?.ticker.prevDay;

    // console.log(prices);

    if (isLoading) return <Skeleton active />;
    return (
        <Link href={`stocks/${stock.ticker}`}>
            <Card className="card-shadow">
                {error ? (
                    <p>{error.stack}</p>
                ) : (
                    <>
                        <div className="flex items-end justify-between">
                            <h2 className="text-3xl font-bold">
                                {prices?.ticker.ticker}
                            </h2>
                            <div className="flex items-end">
                                <p
                                    className={getChangeColour(
                                        prices?.ticker.todaysChangePerc!
                                    )}
                                >
                                    {getPercChange(
                                        prices?.ticker.todaysChangePerc!
                                    )}
                                </p>
                                <p
                                    className={`text-2xl font-semibold text-primary ml-2`}
                                >
                                    {formatPrice(stockPrices?.c!)}
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
            </Card>
        </Link>
    );
};

export default StockCard;
