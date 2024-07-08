"use client";
import { getAISuggestions } from "@/server/actions/ai";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import React, { useState } from "react";
import Spinner from "../ui/Spinner";

type Props = {};

type AISuggestion = {
    name: string;
    ticker: string;
    reason: string;
};

const AISuggestions = (props: Props) => {
    const [option, setOption] = useState("upside");
    const {
        data: AISuggestions,
        error,
        isLoading,
    } = useQuery({
        queryKey: ["AISuggestions", option],
        queryFn: () => getAISuggestions(option),
        enabled: !!option,
        staleTime: Infinity,
        // staleTime: 60 * 1000,
    });

    return (
        <div className="mt-4 space-x-3 flex">
            <h2>Suggested by AI:</h2>
            {isLoading ? (
                <Spinner size="small" colour="indigo-600" />
            ) : (
                AISuggestions?.map((stock: AISuggestion) => (
                    <Link
                        href={`/stocks/${stock.ticker}`}
                        className="bg-blue-500 hover:bg-blue-700 text-white text-xs font-normal py-1 px-3 rounded-full"
                        key={stock.ticker}
                        title={stock.name || stock.ticker}
                    >
                        {stock.ticker}
                    </Link>
                ))
            )}
        </div>
    );
};

export default AISuggestions;
