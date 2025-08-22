"use client";
import React from "react";
import { Skeleton, Card, Progress, Tooltip } from "antd";
import Link from "next/link";
import { TStock } from "@/utils/types";
import useFetchStockPrices from "@/hooks/useFetchStockPrices";
import { formatPrice, getChangeColour, getChangePerc } from "@/utils/helpers";

type Props = {
    stock: TStock;
};

const StockCard = ({ stock }: Props) => {
    const {
        data: prices,
        isLoading,
        error,
    } = useFetchStockPrices(stock?.ticker);
    // const todaysPrices = prices?.ticker.day.c !== 0;
    // const stockPrices = todaysPrices
    //     ? prices?.ticker.day
    //     : prices?.ticker.prevDay;
    const progress = parseFloat(
        Math.min(100, (200 / (stock?.targetPrice || 1)) * 100).toFixed(0)
    );
    // TODO: change 200 ^ to the stock price as well as the 100 that is shown below

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
                                {prices?.ticker?.ticker || stock?.ticker}
                            </h2>
                            <div className="flex items-end">
                                <p
                                    className={getChangeColour(
                                        prices?.ticker?.todaysChangePerc!
                                    )}
                                >
                                    {getChangePerc(2.2)}
                                    {/* {getChangePerc(
                                        prices?.ticker.todaysChangePerc!
                                    )} */}
                                </p>
                                <p
                                    className={`text-2xl font-semibold text-primary ml-2`}
                                >
                                    {formatPrice(100)}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-end justify-between my-1">
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
                        {stock?.targetPrice ? (
                            <Tooltip
                                title={
                                    progress < 100
                                        ? `You're ${progress}% to your price target`
                                        : "You've hit your price target!"
                                }
                            >
                                <Progress
                                    percent={progress}
                                    // percentPosition={{ align: "center", type: "inner" }}
                                    showInfo={false}
                                    size={["100%", 2]}
                                />
                            </Tooltip>
                        ) : null}
                    </>
                )}
            </Card>
        </Link>
    );
};

export default StockCard;
