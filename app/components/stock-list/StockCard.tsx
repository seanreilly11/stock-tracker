"use client";
import { use, useMemo } from "react";
import { Card, Progress, Tooltip } from "antd";
import Link from "next/link";
import { TStock } from "@/lib/schemas/stocks/stock.schema";
import { TStockPrice } from "@/lib/schemas/stocks/polygon.schema";
import { getStockPrices } from "@/lib/api";
import { formatPrice, getChangeColour, getChangePerc } from "@/utils/helpers";

type Props = {
    stock: TStock;
};

const StockCard = ({ stock }: Props) => {
    const pricesPromise = useMemo(
        () => getStockPrices(stock?.ticker).catch(() => null),
        [stock?.ticker],
    );
    const prices: TStockPrice | null = use(pricesPromise);
    const currentPrice =
        prices?.ticker?.day?.c || prices?.ticker?.prevDay?.c || 0;
    const progress = parseFloat(
        Math.min(100, (currentPrice / (stock?.targetPrice || 1)) * 100).toFixed(
            0,
        ),
    );

    return (
        <Link href={`stocks/${stock.ticker}`} className="block h-full">
            <Card className="card-shadow h-full">
                <div className="flex items-end justify-between">
                    <h2 className="text-3xl font-bold">
                        {prices?.ticker?.ticker || stock?.ticker}
                    </h2>
                    <div className="flex items-end">
                        <p className={getChangeColour(prices?.ticker?.todaysChangePerc!)}>
                            {getChangePerc(prices?.ticker?.todaysChangePerc!)}
                        </p>
                        <p className="text-2xl font-semibold text-primary ml-2">
                            {formatPrice(currentPrice)}
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
                            showInfo={false}
                            size={["100%", 2]}
                        />
                    </Tooltip>
                ) : null}
            </Card>
        </Link>
    );
};

export default StockCard;
