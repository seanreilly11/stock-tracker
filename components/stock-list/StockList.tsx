"use client";
import React from "react";
import styles from "@/app/page.module.css";
import StockCard from "@/components/stock-list/StockCard";
import EmptyState from "@/components/common/EmptyState";
import { TStock } from "@/types";
import { Skeleton } from "antd";
import useFetchUserStocks from "@/lib/queries/useFetchUserStocks";
import NextToBuy from "@/components/stock-list/NextToBuy";

const StockList = () => {
    const { data: savedStocks, error, isLoading } = useFetchUserStocks();
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
                    <p>{error.message}</p>
                </>
            ) : (savedStocks?.length ?? 0) < 1 ? (
                // spare div keeps the grid and centers empty state
                <>
                    <EmptyState page="Home" />
                </>
            ) : (savedStocks?.length ?? 0) > 0 ? (
                savedStocks?.map((stock: TStock) => (
                    <StockCard key={stock.ticker} stock={stock} />
                ))
            ) : (
                <>
                    <Skeleton active />
                    <Skeleton active />
                    <Skeleton active />
                </>
            )}
        </div>
    );
};

export default StockList;
