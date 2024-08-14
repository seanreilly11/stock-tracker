import React, { useState } from "react";
import Link from "next/link";
import {
    EditOutlined,
    PlusCircleOutlined,
    PlusOutlined,
} from "@ant-design/icons";
import { Card, Skeleton } from "antd";
import { useQuery } from "@tanstack/react-query";
import useAuth from "@/hooks/useAuth";
import { getUserNextBuyStocks } from "@/server/actions/db";
import EditNextToBuyModal from "./EditNextToBuyModal";

const NextToBuy = () => {
    const { user } = useAuth();
    const [showModal, setShowModal] = useState(false);
    const { data: nextStocks, isLoading } = useQuery({
        queryKey: ["nextStocks", user?.uid],
        queryFn: () => getUserNextBuyStocks(user?.uid),
        enabled: !!user?.uid,
        staleTime: Infinity,
    });

    return (
        <>
            <EditNextToBuyModal
                nextStocks={nextStocks}
                showModal={showModal}
                setShowModal={setShowModal}
            />
            <Card className="card-shadow bg-primary text-white">
                <div className="flex justify-between items-center mb-2">
                    <h2 className="text-lg font-semibold">Next to buy</h2>
                    {isLoading || !user?.uid ? null : (
                        <EditOutlined
                            className="text-xl"
                            onClick={() => setShowModal(true)}
                        />
                    )}
                </div>

                {isLoading || !user?.uid ? (
                    <Skeleton.Button active />
                ) : nextStocks?.length > 0 ? (
                    <div className="grid grid-cols-3">
                        {nextStocks?.map((ticker: string) => (
                            <Link
                                key={ticker}
                                href={`/stocks/${ticker}`}
                                className="text-2xl font-bold hover:text-indigo-200"
                            >
                                {ticker}
                            </Link>
                        ))}
                    </div>
                ) : (
                    <p className="text-base">
                        What stocks are you planning to buy&nbsp;next?
                    </p>
                )}
            </Card>
        </>
    );
};

export default NextToBuy;
