import { Suspense } from "react";
import SearchBar from "./components/stock-list/SearchBar";
import AISuggestions from "./components/stock-list/AISuggestions";
import StockList from "./components/stock-list/StockList";
import { getUidFromSession } from "@/lib/session";

// HOME PAGE - DISPLAYS STOCK LIST, SEARCH BAR, AND AI SUGGESTIONS
const Page = async () => {
    const uid = await getUidFromSession();
    return (
        <>
            <SearchBar />
            <AISuggestions />
            <Suspense>
                <StockList uid={uid!} />
            </Suspense>
        </>
    );
};

export default Page;
