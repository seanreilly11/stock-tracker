"use client";
import React from "react";
import styles from "../page.module.css";
import StockCard from "./StockCard";
import EmptyState from "./EmptyState";
import { getUserStocks } from "../server/actions/db";
import { useQuery } from "@tanstack/react-query";
import { Stock } from "../lib/types";
import { Skeleton } from "antd";

const StockList = () => {
    const { data: savedStocks, isLoading } = useQuery({
        queryKey: ["savedStocks", "TAnsGp6XzdW0EEM3fXK7"],
        queryFn: () => getUserStocks("TAnsGp6XzdW0EEM3fXK7"),
        staleTime: Infinity, // could be set to a minute ish to help with live but might just leave
    });

    return (
        <div className={styles["stock-list-grid"]}>
            {isLoading ? (
                <>
                    <Skeleton active />
                    <Skeleton active />
                    <Skeleton active />
                </>
            ) : savedStocks.length < 1 ? (
                // spare div keeps the grid and centers empty state
                <>
                    <div></div>
                    <EmptyState />
                </>
            ) : (
                savedStocks?.map((stock: Stock) => (
                    <StockCard key={stock.ticker} stock={stock} />
                ))
            )}
        </div>
    );
};

export default StockList;
