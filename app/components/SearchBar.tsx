"use client";
import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useDebounce } from "@uidotdev/usehooks";
import { Select } from "antd";
import { useRouter } from "next/navigation";
import { SearchedStockPolygon, Stock } from "../server/types";
import { addStock } from "../server/actions/db";
import { searchStocks } from "../server/actions/stocks";
import useAuth from "../hooks/useAuth";
import Button from "./ui/Button";

const SearchBar = () => {
    const { user } = useAuth();
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
            return addStock(stock, user?.uid);
        },
        onSuccess: (data) => {
            if (data?.error) handleError(data);
            queryClient.invalidateQueries({
                queryKey: ["savedStocks", user?.uid],
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
        setSearch("");
        mutation.mutate(stock);
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
                            className="ml-1 px-3 py-1"
                            text="+"
                            outline="outline"
                        />
                    </div>
                ),
            }))}
        />
    );
};

export default SearchBar;
