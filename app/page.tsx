import AuthWrapper from "./components/common/AuthWrapper";
import SearchBar from "./components/stock-list/SearchBar";
import AISuggestions from "./components/stock-list/AISuggestions";
import StockList from "./components/stock-list/StockList";

// HOME PAGE - DISPLAYS STOCK LIST, SEARCH BAR, AND AI SUGGESTIONS
const Page = () => {
    return (
        <AuthWrapper>
            <SearchBar />
            <AISuggestions />
            <StockList />
        </AuthWrapper>
    );
};

export default Page;
