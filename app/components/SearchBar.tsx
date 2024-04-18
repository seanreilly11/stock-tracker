"use client";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { useDebounce } from "@uidotdev/usehooks";

type Props = {};

const SearchBar = (props: Props) => {
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 500);

    const searchStocks = async () => {
        if (!search && !debouncedSearch) return [];
        const res = await fetch(
            `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${debouncedSearch}&apikey=891N0XBQAZW5FS4Q`
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
