"use client";
import React from "react";
import styles from "@/app/page.module.css";
import StockCard from "./StockCard";
import EmptyState from "../common/EmptyState";
import { TStock } from "@/utils/types";
import { Skeleton } from "antd";
import useFetchUserStocks from "@/hooks/useFetchUserStocks";

const StockList = () => {
    const { data: savedStocks, error, isLoading } = useFetchUserStocks();

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
