import React from "react";
import styles from "@/app/page.module.css";
import StockCard from "./StockCard";
import EmptyState from "../common/EmptyState";
import { TStock } from "@/lib/schemas/stocks/stock.schema";
import NextToBuy from "./NextToBuy";
import { IS_DEV_STOCK_DATA, DEV_STOCK_LIMIT } from "@/utils/constants";
import {
    getUserStocksServer,
    getUserNextBuyStocksServer,
} from "@/lib/db.server";

type Props = {
    uid: string;
};

const StockList = async ({ uid }: Props) => {
    const [stocksResult, nextStocksResult] = await Promise.all([
        getUserStocksServer(uid),
        getUserNextBuyStocksServer(uid),
    ]);

    const stocks = stocksResult.success ? stocksResult.data! : [];
    const nextStocks = nextStocksResult.success ? nextStocksResult.data! : [];
    const visibleStocks = IS_DEV_STOCK_DATA
        ? stocks.slice(0, DEV_STOCK_LIMIT)
        : stocks;

    return (
        <div className={styles["stock-list-grid"]}>
            <NextToBuy nextStocks={nextStocks} />
            {visibleStocks.length === 0 ? (
                <EmptyState page="Home" />
            ) : (
                visibleStocks.map((stock: TStock) => (
                    <StockCard key={stock.ticker} stock={stock} />
                ))
            )}
        </div>
    );
};

export default StockList;
