import Link from "next/link";
import styles from "./page.module.css";
import SearchBar from "./components/SearchBar";

export default function Home() {
    return (
        <main className={styles.main}>
            <h1>Stock tracker</h1>
            <SearchBar />
            <Link href="stocks/123">Stock</Link>
        </main>
    );
}
