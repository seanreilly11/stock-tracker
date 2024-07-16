"use client";
import Link from "next/link";
import React, { useState } from "react";
import { Skeleton } from "antd";
import { AISuggestion, AISuggestionOption } from "@/utils/types";
import { logCustomEvent } from "@/server/firebase";
import useFetchAISuggestions from "@/hooks/UseFetchAISuggestions";

const AISuggestions = () => {
    const [option, setOption] = useState<AISuggestionOption>("popular");
    const {
        data: AISuggestions,
        error,
        isLoading,
    } = useFetchAISuggestions(option);

    const handleClick = () => {
        logCustomEvent("AI_suggested_stock_click", { option });
    };

    return (
        <>
            {!error ? (
                <div className="flex flex-col sm:flex-row sm:items-center mt-4 space-y-1 sm:space-y-0 sm:space-x-3">
                    <div className="flex items-center space-x-3">
                        <h2 className="text-nowrap">Suggested by AI:</h2>
                        <select
                            className="bg-white border w-full border-gray-300 text-gray-900 text-sm rounded-lg block focus:outline-none p-1.5"
                            value={option}
                            onChange={(e) =>
                                setOption(
                                    e.currentTarget.value as AISuggestionOption
                                )
                            }
                        >
                            <option value="popular">Popular</option>
                            <option value="upside">Big potential</option>
                        </select>
                    </div>
                    <div className="space-x-3">
                        {isLoading ? (
                            <>
                                <Skeleton.Button active size="small" />
                                <Skeleton.Button active size="small" />
                                <Skeleton.Button active size="small" />
                                <Skeleton.Button active size="small" />
                            </>
                        ) : (
                            AISuggestions?.map((stock: AISuggestion) => (
                                <Link
                                    href={`/stocks/${stock.ticker}`}
                                    className={`inline-block bg-primary hover:bg-primary-hover text-white text-xs font-normal py-1 px-3 rounded-full`}
                                    key={stock.ticker}
                                    onClick={handleClick}
                                    title={stock.name || stock.ticker}
                                >
                                    {stock.ticker}
                                </Link>
                            ))
                        )}
                    </div>
                </div>
            ) : null}
        </>
    );
};

export default AISuggestions;
