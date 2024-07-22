"use client";
import React from "react";
import { Skeleton, Card } from "antd";
import Link from "next/link";
import { TStock } from "@/utils/types";
import useFetchStockPrices from "@/hooks/useFetchStockPrices";
import { formatPrice, getPercChange } from "@/utils/helpers";

type Props = {
    stock: TStock;
};

const StockCard = ({ stock }: Props) => {
    const { data, isLoading, error } = useFetchStockPrices(stock?.ticker);

    console.log(data);
    const getChangeColour = () =>
        data?.ticker.todaysChangePerc! > 0 ? "text-green-500" : "text-red-500";

    if (isLoading) return <Skeleton active />;
    return (
        <Link href={`stocks/${stock.ticker}`}>
            <Card className="card-shadow">
                {error ? (
                    <p>{error.message}</p>
                ) : (
                    <>
                        <div className="flex items-end justify-between">
                            <h2 className="text-3xl font-bold">
                                {data?.ticker.ticker}
                            </h2>
                            <div className="flex items-end">
                                <p className={getChangeColour()}>
                                    {getPercChange(
                                        data?.ticker.todaysChangePerc!
                                    )}
                                </p>
                                <p
                                    className={`text-2xl font-semibold text-primary ml-2`}
                                >
                                    {formatPrice(data?.ticker.day.c!)}
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
