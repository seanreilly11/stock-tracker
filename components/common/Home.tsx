import React from "react";
import SearchBar from "@/components/stock-list/SearchBar";
import StockList from "@/components/stock-list/StockList";
import AISuggestions from "@/components/stock-list/AISuggestions";

const Home = () => {
    return (
        <>
            <SearchBar />
            <AISuggestions />
            <StockList />
        </>
    );
};

export default Home;
