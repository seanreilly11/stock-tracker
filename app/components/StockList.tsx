import React from "react";
import styles from "../page.module.css";
import { Skeleton } from "antd";

type Props = {};

const StockList = (props: Props) => {
    return (
        <div className={styles["stock-list-grid"]}>
            {[1, 2, 3, 4, 5, 6].map((t) => (
                <Skeleton key={t} />
            ))}
        </div>
    );
};

export default StockList;
