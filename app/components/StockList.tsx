"use client";
import React from "react";
import styles from "../page.module.css";
import StockCard from "./StockCard";
import EmptyState from "./EmptyState";
import { getUserStocks } from "../server/actions/db";
import { useQuery } from "@tanstack/react-query";
import { Stock } from "../server/types";
import { Button, Skeleton } from "antd";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";

const StockList = () => {
    const { data: session } = useSession();
    const {
        data: savedStocks,
        error,
        isLoading,
    } = useQuery({
        queryKey: ["savedStocks", session?.user?.uid],
        queryFn: () => getUserStocks(session?.user?.uid),
        enabled: !!session?.user?.uid,
        staleTime: Infinity, // could be set to a minute ish to help with live but might just leave
    });

    return (
        <div className={styles["stock-list-grid"]}>
            {!session ? (
                <>
                    <div></div>
                    <Button onClick={() => signIn()}>Sign in</Button>
                </>
            ) : isLoading || (session && !session?.user?.uid) ? (
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
