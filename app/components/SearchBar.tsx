"use client";
import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useDebounce } from "@uidotdev/usehooks";
import { Button, Select } from "antd";
import { useRouter } from "next/navigation";
import { Stock } from "../lib/types";
import { addStock } from "../server/actions/db";
import { searchStocks } from "../server/actions/stocks";

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

const SearchBar = () => {
    const router = useRouter();
    const queryClient = useQueryClient();
    const [search, setSearch] = useState<string>("");
    const debouncedSearch = useDebounce<string>(search, 500);

    const { data, isLoading } = useQuery({
        queryKey: ["search", debouncedSearch],
        queryFn: () => searchStocks(debouncedSearch),
        enabled: !!debouncedSearch,
    });
    const mutation = useMutation({
        mutationFn: (stock: Stock) => {
            return addStock(stock, "TAnsGp6XzdW0EEM3fXK7");
        },
        onSuccess: (data) => {
            if (data?.error) handleError(data);
            queryClient.invalidateQueries({
                queryKey: ["savedStocks", "TAnsGp6XzdW0EEM3fXK7"],
            });
            // TODO: user id needs to be passed in correctly
        },
    });

    const handleSearch = (newValue: string) => {
        setSearch(newValue);
    };
    const handleChange = (newValue: string) => {
        setSearch("");
        router.push(`stocks/${newValue}`);
    };
    const handleAddStock = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        let stock: Stock = {
            holding: false,
            mostRecentPrice: null,
            ticker: e.currentTarget.dataset.ticker!,
            targetPrice: null,
            name: e.currentTarget.dataset.name!,
        };
        mutation.mutate(stock);
        setSearch("");
    };

    const handleError = (data: { error: string }) => {
        console.log(data.error);
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
                label: (
                    <div className="flex justify-between">
                        <span className="ellipsis-text">
                            {d.ticker} - {d.name}
                        </span>
                        <Button
                            data-ticker={d.ticker}
                            data-name={d.name}
                            onClick={handleAddStock}
                            className="ml-1"
                        >
                            +
                        </Button>
                    </div>
                ),
            }))}
        />
    );
};

export default SearchBar;
