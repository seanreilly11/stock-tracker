import React from "react";
import SearchBar from "../stock-list/SearchBar";
import StockList from "../stock-list/StockList";
import AISuggestions from "../stock-list/AISuggestions";

type Props = {};

const Home = (props: Props) => {
    return (
        <>
            <SearchBar />
            <AISuggestions />
            <StockList />
        </>
    );
};

export default Home;
