"use client";
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@uidotdev/usehooks";
import { Input, Select } from "antd";

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
        // const res = await fetch(
        //     `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${keyword}&apikey=891N0XBQAZW5FS4Q`
        // );
        const res = await fetch(
            `https://api.polygon.io/v3/reference/tickers?search=${keyword}&active=true&apiKey=bZVZXz83pe0SFpRvjzubFtizArepCMs1`
        );
        return res.json();
    };
    console.log(search);

    const { data, isLoading } = useQuery({
        queryKey: ["search", debouncedSearch],
        queryFn: () => searchStocks(debouncedSearch),
        enabled: !!debouncedSearch,
    });
    console.log(data);

    const handleSearch = (newValue: string) => {
        setSearch(newValue);
    };
    const handleChange = (newValue: string) => {
        console.log(newValue);
    };

    return (
        <div>
            {/* <Input.Search
                placeholder="Search for your favourite stock"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            /> */}
            <Select
                showSearch
                value={search}
                placeholder={"Search for your favourite stock"}
                style={{ width: "100%" }}
                defaultActiveFirstOption={false}
                suffixIcon={null}
                filterOption={false}
                onSearch={handleSearch}
                onChange={handleChange}
                notFoundContent={null}
                options={(data?.results || [])?.map((d) => ({
                    value: d.ticker,
                    label: d.ticker + " - " + d.name,
                }))}
            />
        </div>
    );
};

export default SearchBar;
