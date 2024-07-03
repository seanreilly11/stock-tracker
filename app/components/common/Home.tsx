import React from "react";
import SearchBar from "../stock-list/SearchBar";
import StockList from "../stock-list/StockList";

type Props = {};

const Home = (props: Props) => {
    return (
        <>
            <SearchBar />
            <StockList />
        </>
    );
};

export default Home;
