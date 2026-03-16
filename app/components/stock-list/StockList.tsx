"use client";
import React from "react";
import styles from "@/app/page.module.css";
import StockCard from "./StockCard";
import EmptyState from "../common/EmptyState";
import QueryError from "../common/QueryError";
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

    const renderContent = () => {
        if (isLoading)
            return (
                <>
                    <Skeleton active />
                    <Skeleton active />
                </>
            );
        if (error)
            return <QueryError message="Failed to load your portfolio." />;
        if (visibleStocks.length === 0) return <EmptyState page="Home" />;
        return visibleStocks.map((stock: TStock) => (
            <StockCard key={stock.ticker} stock={stock} />
        ));
    };

    return (
        <div className={styles["stock-list-grid"]}>
            <NextToBuy />
            {renderContent()}
        </div>
    );
};

export default StockList;
