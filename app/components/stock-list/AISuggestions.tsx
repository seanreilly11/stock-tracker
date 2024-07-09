"use client";
import { getAISuggestions } from "@/server/actions/ai";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import React, { useState } from "react";
import { Skeleton } from "antd";

type Props = {};

type AISuggestion = {
    name: string;
    ticker: string;
    reason: string;
};

const AISuggestions = (props: Props) => {
    const [option, setOption] = useState("popular");
    const {
        data: AISuggestions,
        error,
        isLoading,
    } = useQuery({
        queryKey: ["AISuggestions", option],
        queryFn: () => getAISuggestions(option),
        enabled: !!option,
        staleTime: Infinity,
    });

    return (
        <>
            {!error ? (
                <div className="mt-4 space-x-3 flex items-center overflow-x-auto w-full">
                    <h2 className="text-nowrap">Suggested by AI:</h2>
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
                                className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-normal py-1 px-3 rounded-full"
                                key={stock.ticker}
                                title={stock.name || stock.ticker}
                            >
                                {stock.ticker}
                            </Link>
                        ))
                    )}
                </div>
            ) : null}
        </>
    );
};

export default AISuggestions;
