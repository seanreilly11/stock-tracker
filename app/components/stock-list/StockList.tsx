"use client";
import React from "react";
import styles from "@/app/page.module.css";
import StockCard from "./StockCard";
import EmptyState from "../common/EmptyState";
import { getUserStocks } from "../../server/actions/db";
import { useQuery } from "@tanstack/react-query";
import { Stock } from "../../server/types";
import { Skeleton } from "antd";
import useAuth from "../../hooks/useAuth";

const StockList = () => {
    const { user } = useAuth();
    const {
        data: savedStocks,
        error,
        isLoading,
    } = useQuery({
        queryKey: ["savedStocks", user?.uid],
        queryFn: () => getUserStocks(user?.uid),
        enabled: !!user?.uid,
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
            ) : error ? (
                <>
                    <div></div>
                    <p>{error.stack}</p>
                </>
            ) : savedStocks?.length < 1 ? (
                // spare div keeps the grid and centers empty state
                <>
                    <div></div>
                    <EmptyState />
                </>
            ) : savedStocks?.length > 0 ? (
                savedStocks?.map((stock: Stock) => (
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
