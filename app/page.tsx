"use client";
import styles from "./page.module.css";
import SearchBar from "./components/SearchBar";
import StockList from "./components/StockList";
import { useState } from "react";

export default function Home() {
    const [savedStocks, setSavedStocks] = useState<string[]>([
        "AAPL",
        "MSFT",
        "NVDA",
    ]);

    return (
        <>
            <SearchBar setSavedStocks={setSavedStocks} />
            <StockList savedStocks={savedStocks} />
        </>
    );
}
