import React from "react";
import styles from "../page.module.css";
import StockCard from "./StockCard";

type Props = {};

const StockList = (props: Props) => {
    // TODO: get list of users stocks from database and then loop through them here
    return (
        <div className={styles["stock-list-grid"]}>
            {["AAPL", "NVDA", "MSFT"].map((symbol: string) => (
                <StockCard key={symbol} symbol={symbol} />
            ))}
        </div>
    );
};

export default StockList;
