import AuthWrapper from "./components/AuthWrapper";
import SearchBar from "./components/SearchBar";
import StockList from "./components/StockList";

export default function Home() {
    return (
        <AuthWrapper>
            <SearchBar />
            <StockList />
        </AuthWrapper>
    );
}
