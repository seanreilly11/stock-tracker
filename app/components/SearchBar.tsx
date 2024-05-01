"use client";
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@uidotdev/usehooks";
import { Select } from "antd";

type SearchedStockAlphaV = {
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

type SearchedStockPolygon = {
    active: boolean;
    cik: string;
    composite_figi: string;
    currency_name: string;
    last_updated_utc: string;
    locale: string;
    market: string;
    name: string;
    primary_exchange: string;
    share_class_figi: string;
    ticker: string;
    type: string;
};

const SearchBar = ({
    setSavedStocks,
}: {
    setSavedStocks: React.Dispatch<React.SetStateAction<string[]>>;
}) => {
    const [search, setSearch] = useState<string>("");
    const debouncedSearch = useDebounce<string>(search, 500);

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
        setSavedStocks((prev: string[]) => {
            if (prev.includes(newValue)) return [...prev];
            return [...prev, newValue];
        });
        setSearch("");
    };

    return (
        <Select
            showSearch
            value={search || undefined}
            placeholder={"Search for your favourite stock"}
            style={{ width: "100%" }}
            loading={isLoading}
            defaultActiveFirstOption={false}
            suffixIcon={null}
            filterOption={false}
            onSearch={handleSearch}
            onChange={handleChange}
            notFoundContent={null}
            options={(data?.results || [])?.map((d: SearchedStockPolygon) => ({
                value: d.ticker,
                label: d.ticker + " - " + d.name,
            }))}
        />
    );
};

export default SearchBar;
