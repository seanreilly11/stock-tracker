"use client";
import React, { useState } from "react";
import Link from "next/link";
import { EditOutlined } from "@ant-design/icons";
import { Card } from "antd";
import EditNextToBuyModal from "./EditNextToBuyModal";
import { logCustomEvent } from "@/lib/firebase";

type Props = {
    nextStocks: string[];
};

const NextToBuy = ({ nextStocks }: Props) => {
    const [showModal, setShowModal] = useState(false);

    const handleEditButton = () => {
        logCustomEvent("next_to_buy_edit", { page: "Home" });
        setShowModal(true);
    };

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
                    <EditOutlined
                        className="text-xl"
                        onClick={handleEditButton}
                    />
                </div>

                {nextStocks.length > 0 ? (
                    <div className="grid grid-cols-3">
                        {nextStocks.map((ticker: string) => (
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
