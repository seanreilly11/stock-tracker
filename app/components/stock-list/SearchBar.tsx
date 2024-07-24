"use client";
import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDebounce } from "@uidotdev/usehooks";
import { Select } from "antd";
import { useRouter } from "next/navigation";
import { SearchedStockPolygon, TStock } from "@/utils/types";
import { addStock } from "@/server/actions/db";
import useAuth from "@/hooks/useAuth";
import Button from "../ui/Button";
import useFetchUserStocks from "@/hooks/useFetchUserStocks";
import useSearchStocks from "@/hooks/useSearchStocks";

const SearchBar = () => {
    const { user } = useAuth();
    const router = useRouter();
    const queryClient = useQueryClient();
    const [search, setSearch] = useState<string>("");
    const debouncedSearch = useDebounce<string>(search, 500);

    const { data: searchedStocks, isLoading } =
        useSearchStocks(debouncedSearch);
    const { data: savedStocks } = useFetchUserStocks();
    const mutation = useMutation({
        mutationFn: (stock: TStock) => {
            return addStock(stock, user?.uid);
        },
        onSuccess: (data) => {
            if (data?.error) handleError(data);
            queryClient.invalidateQueries({
                queryKey: ["savedStocks", user?.uid],
            });
        },
    });

    const handleSearch = (newValue: string) => setSearch(newValue);

    const handleChange = (newValue: string) => {
        setSearch("");
        router.push(`stocks/${newValue}`);
    };
    const handleAddStock = (
        e: React.MouseEvent<HTMLButtonElement>,
        ticker: string,
        name: string
    ) => {
        e.stopPropagation();
        let stock: TStock = {
            holding: false,
            mostRecentPrice: null,
            ticker,
            targetPrice: null,
            name,
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
            className="w-full"
            size="large"
            loading={isLoading}
            defaultActiveFirstOption={false}
            suffixIcon={null}
            filterOption={false}
            onSearch={handleSearch}
            onChange={handleChange}
            notFoundContent={null}
            options={(searchedStocks?.results || [])?.map(
                (stock: SearchedStockPolygon) => ({
                    value: stock.ticker,
                    label: (
                        <div className="flex items-center justify-between">
                            <span className="ellipsis-text">
                                {stock.ticker} - {stock.name}
                            </span>
                            <Button
                                className="ml-1"
                                padding="px-2.5 py-1"
                                outline="outline"
                                title="Add to portfolio"
                                onClick={(
                                    e: React.MouseEvent<HTMLButtonElement>
                                ) =>
                                    handleAddStock(e, stock.ticker, stock.name)
                                }
                            >
                                {savedStocks
                                    ?.map((s: TStock) => s.ticker)
                                    .includes(stock.ticker)
                                    ? "\u2713"
                                    : "\uff0b"}
                            </Button>
                        </div>
                    ),
                })
            )}
        />
    );
};

export default SearchBar;
