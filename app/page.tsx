import Link from "next/link";
import styles from "./page.module.css";
import SearchBar from "./components/SearchBar";
import StockList from "./components/StockList";

export default function Home() {
    return (
        <main className={styles.main}>
            <h1>Stock tracker</h1>
            <SearchBar />
            <StockList />
        </main>
    );
}
