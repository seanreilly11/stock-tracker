"use client";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { useDebounce } from "@uidotdev/usehooks";

type Props = {};

type SearchedStock = {
    "1. symbol": string;
    "2. name": string;
    "3. type": string;
    "4. region": string;
    "5. marketOpen": string;
    "6. marketClose": string;
    "7. timezone": string;
    "8. currency": string;
    "9. matchScore": string;
};

const SearchBar = (props: Props) => {
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 500);

    const searchStocks = async (keyword: string) => {
        const res = await fetch(
            `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${keyword}&apikey=891N0XBQAZW5FS4Q`
        );
        return res.json();
    };

    const { data, isLoading } = useQuery({
        queryKey: ["search", debouncedSearch],
        queryFn: () => searchStocks(debouncedSearch),
        enabled: !!debouncedSearch,
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
            <div>
                {data?.bestMatches.map((stock: SearchedStock, i: number) => (
                    <p key={i}>{stock["1. symbol"]}</p>
                ))}
            </div>
        </div>
    );
};

export default SearchBar;
