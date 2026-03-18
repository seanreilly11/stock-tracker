"use client";
import React, { useState } from "react";
import { useDebounce } from "@uidotdev/usehooks";
import { Select } from "antd";
import type { DefaultOptionType } from "antd/es/select";
import { useRouter } from "next/navigation";
import { TStock } from "@/lib/schemas/stocks/stock.schema";
import { SearchedStockPolygon } from "@/lib/schemas/stocks/polygon.schema";
import Button from "../ui/Button";
import useSearchStocks from "@/lib/queries/useSearchStocks";
import { logCustomEvent } from "@/lib/firebase";
import { addStockAction, addToNextToBuyAction } from "@/lib/actions/stocks";

type Props = {
    nextToBuy?: boolean;
    setError?: React.Dispatch<React.SetStateAction<string | null>>;
};

const SearchBar = ({ nextToBuy, setError }: Props) => {
    const router = useRouter();
    const [search, setSearch] = useState<string>("");
    const debouncedSearch = useDebounce<string>(search, 500);

    const { data: searchedStocks, isLoading } =
        useSearchStocks(debouncedSearch);

    const handleSearch = (newValue: string) => {
        setSearch(newValue);
    };

    const handleChange = (
        newValue: string,
        data: DefaultOptionType | DefaultOptionType[] | undefined,
    ) => {
        const option = Array.isArray(data) ? data[0] : data;
        const index = (option?.label as React.ReactElement<{ "data-index": number }>)?.props["data-index"];
        logCustomEvent("stock_search_index", { index });
        setSearch("");
        router.push(`stocks/${newValue}`);
    };

    const handleAddStock = async (
        e: React.MouseEvent<HTMLButtonElement>,
        ticker: string,
        name: string,
        i: number,
    ) => {
        e.stopPropagation();
        logCustomEvent("stock_search_index", { index: i });
        logCustomEvent("add_stock", { ticker });

        const stock: TStock = {
            holding: false,
            mostRecentPrice: null,
            ticker,
            targetPrice: null,
            name,
        };
        setSearch("");
        const result = await addStockAction(stock);
        if (result && !result.success) setError?.(result.error);
    };

    const handleAddToNextToBuy = async (
        e: React.MouseEvent<HTMLButtonElement>,
        ticker: string,
    ) => {
        e.stopPropagation();
        logCustomEvent("next_to_buy_add", { page: "Home" });
        setSearch("");
        const result = await addToNextToBuyAction(ticker);
        if (result && !result.success) setError?.(result.error);
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
                                    e: React.MouseEvent<HTMLButtonElement>,
                                ) =>
                                    nextToBuy
                                        ? handleAddToNextToBuy(e, d.ticker)
                                        : handleAddStock(e, d.ticker, d.name, i)
                                }
                            >
                                ＋
                            </Button>
                        </div>
                    ),
                }),
            )}
        />
    );
};

export default SearchBar;
