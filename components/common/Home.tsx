import React from "react";
import SearchBar from "@/components/stock-list/SearchBar";
import StockList from "@/components/stock-list/StockList";

const Home = () => {
    return (
        <>
            <SearchBar />
            <StockList />
        </>
    );
};

export default Home;
