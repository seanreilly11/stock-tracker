"use client";
import styles from "./page.module.css";
import SearchBar from "./components/SearchBar";
import StockList from "./components/StockList";
import { Typography } from "antd";

export default function Home() {
    return (
        <main className={styles.main}>
            <section className={styles.wrapper}>
                <Typography.Title>Stock tracker</Typography.Title>
                <SearchBar />
                <StockList />
            </section>
        </main>
    );
}
