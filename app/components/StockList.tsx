import React from "react";
import styles from "../page.module.css";
import StockCard from "./StockCard";
import EmptyState from "./EmptyState";

type Props = {
    savedStocks: string[];
};

const StockList = ({ savedStocks }: Props) => {
    // TODO: get list of users stocks from database and then loop through them here
    return (
        <div className={styles["stock-list-grid"]}>
            {savedStocks.length < 1 ? (
                // spare div keeps the grid and cetners empty state
                <>
                    <div></div>
                    <EmptyState />
                </>
            ) : (
                savedStocks.map((ticker: string) => (
                    <StockCard key={ticker} ticker={ticker} />
                ))
            )}
        </div>
    );
};

export default StockList;
