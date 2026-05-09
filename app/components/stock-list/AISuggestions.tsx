"use client";
import Link from "next/link";
import { use, useMemo, useState } from "react";
import { Tooltip } from "antd";
import { AISuggestion, AISuggestionOption } from "@/lib/schemas/ai/ai.schema";
import { logCustomEvent } from "@/lib/firebase";
import { fetchAISuggestions } from "@/lib/api";
import { PRIMARY_COLOUR_HOVER } from "@/utils/constants";

const AISuggestions = () => {
    const isDev = process.env.NODE_ENV !== "production";
    const [option, setOption] = useState<AISuggestionOption>("popular");

    const suggestionsPromise = useMemo(
        () => !isDev ? fetchAISuggestions(option).catch(() => null) : Promise.resolve(null),
        [option, isDev],
    );
    const suggestions: AISuggestion[] | null = use(suggestionsPromise);

    const handleClick = () => logCustomEvent("AI_suggested_stock_click", { option });

    if (isDev || !suggestions) return null;

    return (
        <div className="flex flex-col sm:flex-row sm:items-center mt-4 space-y-1 sm:space-y-0 sm:space-x-3">
            <div className="flex items-center space-x-3">
                <h2 className="text-nowrap">Suggested by AI:</h2>
                <select
                    className="bg-white border w-full border-gray-300 text-gray-900 text-sm rounded-lg block focus:outline-none p-1.5"
                    value={option}
                    onChange={(e) => {
                        logCustomEvent("change_stock_suggestion_option", {
                            optionTo: e.currentTarget.value,
                        });
                        setOption(e.currentTarget.value as AISuggestionOption);
                    }}
                >
                    <option value="popular">Popular</option>
                    <option value="upside">Big potential</option>
                </select>
            </div>
            <div className="space-x-3">
                {suggestions.map((stock: AISuggestion) => (
                    <Link
                        href={`/stocks/${stock.ticker}`}
                        className="inline-block bg-primary hover:bg-primary-hover text-white text-xs font-normal py-1 px-3 rounded-full"
                        key={stock.ticker}
                        onClick={handleClick}
                    >
                        <Tooltip
                            placement="bottom"
                            color={PRIMARY_COLOUR_HOVER}
                            title={
                                <>
                                    <p className="font-bold">{stock.name || stock.ticker}</p>
                                    <p>{stock.reason}</p>
                                </>
                            }
                        >
                            {stock.ticker}
                        </Tooltip>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default AISuggestions;
