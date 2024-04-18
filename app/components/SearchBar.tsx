"use client";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";

type Props = {};

const SearchBar = (props: Props) => {
    const [search, setSearch] = useState("");

    const searchStocks = async () => {
        const res = await fetch(
            `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${search}&apikey=891N0XBQAZW5FS4Q`
        );
        return res.json();
    };

    const { data, isLoading } = useQuery({
        queryKey: ["search", search],
        queryFn: searchStocks,
    });

    console.log(data);

    return (
        <div>
            <input
                type="search"
                placeholder="Search for your favourite stock"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
        </div>
    );
};

export default SearchBar;
