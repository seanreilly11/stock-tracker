"use client";
import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDebounce } from "@uidotdev/usehooks";
import { Select } from "antd";
import { useRouter } from "next/navigation";
import { SearchedStockPolygon, TStock } from "@/types";
import { addStock, addToNextToBuy } from "@/lib/api/db";
import { useAuth } from "@/lib/hooks/useAuth";
import Button from "../ui/Button";
import useFetchUserStocks from "@/lib/hooks/useFetchUserStocks";
import useSearchStocks from "@/hooks/useSearchStocks";

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

    const { data: searchedStocks, isLoading } =
        useSearchStocks(debouncedSearch);
    const { data: savedStocks } = useFetchUserStocks();
    const mutation = useMutation({
        mutationFn: ({ ticker, name }: { ticker: string; name: string }) => {
            return addStock(user!.id, ticker, name);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["stocks", user?.id],
            });
        },
    });

    const addNextToBuyMutation = useMutation({
        mutationFn: (ticker: string) => {
            return addToNextToBuy(user!.id, ticker);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["nextStocks", user?.id],
            });
        },
        onError: (error: Error) => {
            setError?.(error.message);
        },
    });

    const handleSearch = (newValue: string) => {
        setSearch(newValue);
    };

    const handleChange = (newValue: string, data: any) => {
        setSearch("");
        router.push(`stocks/${newValue}`);
    };

    const handleAddStock = (
        e: React.MouseEvent<HTMLButtonElement>,
        ticker: string,
        name: string,
        i: number
    ) => {
        e.stopPropagation();
        setSearch("");
        mutation.mutate({ ticker, name });
    };

    const handleAddToNextToBuy = (
        e: React.MouseEvent<HTMLButtonElement>,
        ticker: string
    ) => {
        e.stopPropagation();
        setSearch("");
        addNextToBuyMutation.mutate(ticker);
    };

    return (
        <Select
            showSearch
            value={search || undefined}
            placeholder={"Search for your favourite stock or ETF"}
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
                (d: SearchedStockPolygon, i: number) => ({
                    value: d.ticker,
                    label: (
                        <div
                            className="flex items-center justify-between"
                            data-index={i}
                        >
                            <span className="ellipsis-text">
                                {d.ticker} - {d.name}
                            </span>
                            <Button
                                className="ml-1"
                                padding="px-2.5 py-1"
                                outline="outline"
                                title="Add to portfolio"
                                onClick={(
                                    e: React.MouseEvent<HTMLButtonElement>
                                ) =>
                                    nextToBuy
                                        ? handleAddToNextToBuy(e, d.ticker)
                                        : handleAddStock(e, d.ticker, d.name, i)
                                }
                            >
                                {nextToBuy
                                    ? "＋"
                                    : savedStocks
                                          ?.map((s: TStock) => s.ticker)
                                          .includes(d.ticker)
                                    ? "✓"
                                    : "＋"}
                            </Button>
                        </div>
                    ),
                })
            )}
        />
    );
};

export default SearchBar;
