import AuthWrapper from "./components/common/AuthWrapper";
import SearchBar from "./components/stock-list/SearchBar";
import StockList from "./components/stock-list/StockList";

export default function Home() {
    return (
        <AuthWrapper>
            <SearchBar />
            <StockList />
        </AuthWrapper>
    );
}
