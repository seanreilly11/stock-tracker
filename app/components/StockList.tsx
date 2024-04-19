import React from "react";
import styles from "../page.module.css";

type Props = {};

const StockList = (props: Props) => {
    return (
        <div className={styles["stock-list-grid"]}>
            {[1, 2, 3, 4, 5, 6].map((t, i) => (
                <div key={i}>
                    <h3>Stock {i}</h3>
                </div>
            ))}
        </div>
    );
};

export default StockList;
