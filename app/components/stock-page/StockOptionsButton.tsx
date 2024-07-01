import useAuth from "@/app/hooks/useAuth";
import {
    EllipsisOutlined,
    ExclamationCircleFilled,
    QuestionCircleOutlined,
} from "@ant-design/icons";
import React, { useState } from "react";
import Button from "../ui/Button";
import { Modal } from "antd";
import { Stock } from "@/app/server/types";
import {
    UseMutationResult,
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";
import { NoticeType } from "antd/es/message/interface";
import { removeStock } from "@/app/server/actions/db";

type Props = {
    name: string;
    ticker: string;
    prices: {
        results: [
            {
                c: string;
                o: string;
            }
        ];
    };
    savedStock: Stock;
    updateMutation: UseMutationResult<
        void | {
            error: string;
        },
        Error,
        Stock,
        unknown
    >;
    loadingPopup: (type: NoticeType, content: string) => void;
    successPopup: (type: NoticeType, content: string) => void;
};

const StockOptionsButton = ({
    updateMutation,
    ticker,
    name,
    prices,
    savedStock,
    loadingPopup,
    successPopup,
}: Props) => {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const [showDropdown, setShowDropdown] = useState(false);

    const removeMutation: UseMutationResult<
        void | {
            error: string;
        },
        Error,
        void,
        unknown
    > = useMutation({
        mutationFn: () => {
            loadingPopup("loading", "Removing...");
            return removeStock(ticker, user?.uid);
        },
        onSuccess: () => {
            successPopup("success", "Removed!");
            queryClient.invalidateQueries({
                queryKey: ["savedStocks", user?.uid],
            });
        },
    });

    const handleHolding = () => {
        Modal.confirm({
            title: "Are you currently holding this stock?",
            icon: <QuestionCircleOutlined />,
            content: "",
            okText: "Yes",
            onOk() {
                updateMutation.mutate({
                    name,
                    holding: true,
                    ticker,
                    mostRecentPrice: parseFloat(prices?.results?.[0].c),
                    targetPrice: savedStock?.targetPrice || 0,
                });
            },
            cancelText: "No",
            onCancel() {
                updateMutation.mutate({
                    name,
                    holding: false,
                    ticker,
                    mostRecentPrice: parseFloat(prices?.results?.[0].c),
                    targetPrice: savedStock?.targetPrice || 0,
                });
            },
        });
        setShowDropdown(false);
    };

    const handleRemove = () => {
        Modal.confirm({
            title: "Do you want to remove this stock from your portfolio?",
            icon: <ExclamationCircleFilled />,
            content:
                "All of your notes and prices about this stock will be lost.",
            onOk() {
                return removeMutation.mutate();
            },
            onCancel() {
                console.log("Why you cancel??");
            },
        });
        setShowDropdown(false);
    };

    return (
        <div className="relative">
            <Button
                className="font-bold"
                fontSize="text-3xl"
                padding="px-2 py-.5"
                outline="link"
                id="dropdownOptionsButton"
                onClick={() => setShowDropdown((prev) => !prev)}
            >
                <span className="sr-only">Open options menu</span>
                <EllipsisOutlined />
            </Button>
            {showDropdown ? (
                <>
                    <div className="z-20 absolute right-0 top-7 rounded-lg shadow w-44 bg-gray-700 divide-gray-600">
                        <ul
                            className="py-2 text-sm  text-gray-200"
                            aria-labelledby="dropdownOptionsButton"
                        >
                            <li
                                onClick={handleHolding}
                                className="block px-4 py-2 hover:bg-gray-600 hover:text-white cursor-pointer"
                            >
                                Holding
                            </li>
                            <li
                                onClick={handleRemove}
                                className="block px-4 py-2 hover:bg-gray-600 hover:text-white cursor-pointer"
                            >
                                Remove stock
                            </li>
                        </ul>
                    </div>
                    <div
                        className="fixed top-0 left-0 w-full h-full bg-transparent cursor-pointer z-10"
                        onClick={() => setShowDropdown(false)}
                    ></div>
                </>
            ) : null}
        </div>
    );
};

export default StockOptionsButton;
