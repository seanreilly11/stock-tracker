import React from "react";
import Link from "next/link";
import { EditOutlined } from "@ant-design/icons";
import { Card } from "antd";
import { useQuery } from "@tanstack/react-query";
import useAuth from "@/hooks/useAuth";
import { getUserNextBuyStocks } from "@/server/actions/db";

type Props = {};

const NextToBuy = (props: Props) => {
    const { user } = useAuth();
    const { data: nextStocks, isLoading } = useQuery({
        queryKey: ["savedStocks", user?.uid],
        queryFn: () => getUserNextBuyStocks(user?.uid),
        enabled: !!user?.uid,
        staleTime: Infinity,
    });

    // TODO: get next to buy stocks from user
    // add next to buy stocks, remove next to buy stocks. Max 3 atm

    return (
        <Card className="card-shadow bg-primary text-white">
            <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold">Next to buy</h2>
                <EditOutlined className="text-xl" />
            </div>
            <div className="flex items-center justify-between">
                <Link
                    href="/stocks/TSM"
                    className="text-2xl font-bold hover:text-indigo-200"
                >
                    TSM
                </Link>
                <Link
                    href="/stocks/ARM"
                    className="text-2xl font-bold hover:text-indigo-200"
                >
                    ARM
                </Link>
                <Link
                    href="/stocks/TSM"
                    className="text-2xl font-bold hover:text-indigo-200"
                >
                    MSFT
                </Link>
            </div>
        </Card>
    );
};

export default NextToBuy;
