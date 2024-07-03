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
import { addStock, removeStock } from "@/app/server/actions/db";

type Props = {
    name: string;
    ticker: string;
    prices: {
        results: [
            {
                c: number;
                o: number;
            }
        ];
    };
    savedStock: Stock | { error: string };
    updateMutation: UseMutationResult<
        void | {
            error: string;
        },
        Error,
        Partial<Stock>,
        unknown
    >;
    loadingPopup: (type: NoticeType, content: string) => void;
    successPopup: (type: NoticeType, content: string) => void;
    setEditTarget: React.Dispatch<React.SetStateAction<boolean>>;
};

const StockOptionsButton = ({
    updateMutation,
    ticker,
    name,
    prices,
    savedStock,
    loadingPopup,
    successPopup,
    setEditTarget,
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

    const mutation = useMutation({
        mutationFn: (stock: Stock) => {
            return addStock(stock, user?.uid);
        },
        onSuccess: () => {
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
                    mostRecentPrice: prices?.results?.[0].c,
                    targetPrice:
                        ("targetPrice" in savedStock &&
                            savedStock?.targetPrice) ||
                        null,
                });
            },
            cancelText: "No",
            onCancel() {
                updateMutation.mutate({
                    name,
                    holding: false,
                    ticker,
                    mostRecentPrice: prices?.results?.[0].c,
                    targetPrice:
                        ("targetPrice" in savedStock &&
                            savedStock?.targetPrice) ||
                        null,
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

    const handleAdd = () => {
        mutation.mutate({
            holding: false,
            mostRecentPrice: null,
            ticker,
            targetPrice: null,
            name,
        });
    };

    const handleTargetPrice = () => {
        setEditTarget(true);
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
                                onClick={handleTargetPrice}
                                className="block px-4 py-2 hover:bg-gray-600 hover:text-white cursor-pointer"
                            >
                                Edit target price
                            </li>
                            <li
                                onClick={handleHolding}
                                className="block px-4 py-2 hover:bg-gray-600 hover:text-white cursor-pointer"
                            >
                                Update holding status
                            </li>
                            {"error" in savedStock && savedStock?.error ? (
                                <li
                                    onClick={handleAdd}
                                    className="block px-4 py-2 hover:bg-gray-600 hover:text-white cursor-pointer"
                                >
                                    Add stock to portfolio
                                </li>
                            ) : (
                                <li
                                    onClick={handleRemove}
                                    className="block px-4 py-2 hover:bg-gray-600 hover:text-white cursor-pointer"
                                >
                                    Remove stock from portfolio
                                </li>
                            )}
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
