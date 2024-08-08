"use client";
import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useDebounce } from "@uidotdev/usehooks";
import { Select } from "antd";
import { useRouter } from "next/navigation";
import { SearchedStockPolygon, TStock } from "@/utils/types";
import { addStock, addToNextToBuy, getUserStocks } from "@/server/actions/db";
import { searchStocks } from "@/server/actions/stocks";
import useAuth from "@/hooks/useAuth";
import Button from "../ui/Button";

type Props = {
    nextToBuy?: boolean;
    setError?: React.Dispatch<React.SetStateAction<string | null>>;
};

const SearchBar = ({ nextToBuy, setError }: Props) => {
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
    const { data: savedStocks } = useQuery({
        queryKey: ["savedStocks", user?.uid],
        queryFn: () => getUserStocks(user?.uid),
        enabled: !!user?.uid,
        staleTime: Infinity, // could be set to a minute ish to help with live but might just leave
    });
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

    const addNextToBuyMutation = useMutation({
        mutationFn: (ticker: string) => {
            return addToNextToBuy(ticker, user?.uid);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["nextStocks", user?.uid],
            });
        },
        onSettled: (data) => {
            if (data?.error) setError?.(data.error);
        },
    });

    const handleSearch = (newValue: string) => {
        setSearch(newValue);
    };
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

    const handleAddToNextToBuy = (
        e: React.MouseEvent<HTMLButtonElement>,
        ticker: string
    ) => {
        e.stopPropagation();
        setSearch("");
        addNextToBuyMutation.mutate(ticker);
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
            options={(data?.results || [])?.map((d: SearchedStockPolygon) => ({
                value: d.ticker,
                label: (
                    <div className="flex items-center justify-between">
                        <span className="ellipsis-text">
                            {d.ticker} - {d.name}
                        </span>
                        <Button
                            className="ml-1"
                            padding="px-2.5 py-1"
                            outline="outline"
                            title="Add to portfolio"
                            onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                                nextToBuy
                                    ? handleAddToNextToBuy(e, d.ticker)
                                    : handleAddStock(e, d.ticker, d.name)
                            }
                        >
                            {nextToBuy
                                ? "\uff0b"
                                : savedStocks
                                      ?.map((s: TStock) => s.ticker)
                                      .includes(d.ticker)
                                ? "\u2713"
                                : "\uff0b"}
                        </Button>
                    </div>
                ),
            }))}
        />
    );
};

export default SearchBar;
