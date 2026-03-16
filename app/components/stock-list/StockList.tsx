"use client";
import React from "react";
import styles from "@/app/page.module.css";
import StockCard from "./StockCard";
import EmptyState from "../common/EmptyState";
import { TStock } from "@/utils/types";
import { Skeleton } from "antd";
import useFetchUserStocks from "@/server/queries/useFetchUserStocks";
import NextToBuy from "./NextToBuy";
import { IS_DEV_STOCK_DATA, DEV_STOCK_LIMIT } from "@/utils/constants";

const StockList = () => {
    const { data: savedStocks = [], error, isLoading } = useFetchUserStocks();
    const visibleStocks = IS_DEV_STOCK_DATA
        ? savedStocks.slice(0, DEV_STOCK_LIMIT)
        : savedStocks;
    // " max-h-[65dvh] overflow-auto" only on mobile
    return (
        <div className={styles["stock-list-grid"]}>
            <NextToBuy />
            {isLoading ? (
                <>
                    <Skeleton active />
                    <Skeleton active />
                </>
            ) : error ? (
                <>
                    <p>{error.stack}</p>
                </>
            ) : visibleStocks.length < 1 ? (
                // spare div keeps the grid and centers empty state
                <>
                    <EmptyState page="Home" />
                </>
            ) : (
                visibleStocks.map((stock: TStock) => (
                    <StockCard key={stock.ticker} stock={stock} />
                ))
            )}
        </div>
    );
};

export default StockList;
