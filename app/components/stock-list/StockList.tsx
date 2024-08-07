"use client";
import React from "react";
import styles from "@/app/page.module.css";
import StockCard from "./StockCard";
import EmptyState from "../common/EmptyState";
import { TStock } from "@/utils/types";
import { Skeleton } from "antd";
import useFetchUserStocks from "@/hooks/useFetchUserStocks";
import NextToBuy from "./NextToBuy";

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
                    <p>{error.stack}</p>
                </>
            ) : savedStocks?.error ? (
                <>
                    <p>{savedStocks?.error}</p>
                </>
            ) : savedStocks?.length < 1 ? (
                // spare div keeps the grid and centers empty state
                <>
                    <EmptyState page="Home" />
                </>
            ) : savedStocks?.length > 0 ? (
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
