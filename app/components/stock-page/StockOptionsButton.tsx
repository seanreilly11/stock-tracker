import React, { useState } from "react";
import {
    EditOutlined,
    EllipsisOutlined,
    ExclamationCircleFilled,
    MinusCircleOutlined,
    PlusCircleOutlined,
    QuestionCircleOutlined,
    RiseOutlined,
} from "@ant-design/icons";
import {
    UseMutationResult,
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";
import { NoticeType } from "antd/es/message/interface";
import Button from "../ui/Button";
import { Modal } from "antd";
import useAuth from "@/hooks/useAuth";
import { TStock } from "@/utils/types";
import {
    addStock,
    addToNextToBuy,
    getUserNextBuyStocks,
    removeFromNextToBuy,
    removeStock,
} from "@/server/actions/db";

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
    savedStock: TStock | { error: string };
    updateMutation: UseMutationResult<
        void | {
            error: string;
        },
        Error,
        Partial<TStock>,
        unknown
    >;
    messagePopup: (
        type: NoticeType,
        content: string,
        duration?: number
    ) => void;
    setEditTarget: React.Dispatch<React.SetStateAction<boolean>>;
};

const StockOptionsButton = ({
    updateMutation,
    ticker,
    name,
    prices,
    savedStock,
    messagePopup,
    setEditTarget,
}: Props) => {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const [showDropdown, setShowDropdown] = useState(false);

    const { data: nextStocks, isLoading } = useQuery({
        queryKey: ["nextStocks", user?.uid],
        queryFn: () => getUserNextBuyStocks(user?.uid),
        enabled: !!user?.uid,
        staleTime: Infinity,
    });

    const removeMutation: UseMutationResult<
        void | {
            error: string;
        },
        Error,
        void,
        unknown
    > = useMutation({
        mutationFn: () => {
            messagePopup("loading", "Removing...");
            return removeStock(ticker, user?.uid);
        },
        onSuccess: () => {
            messagePopup("success", "Removed!");
            queryClient.invalidateQueries({
                queryKey: ["savedStocks", user?.uid],
            });
        },
    });

    const addMutation = useMutation({
        mutationFn: (stock: TStock) => {
            return addStock(stock, user?.uid);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["savedStocks", user?.uid],
            });
        },
    });

    const addToNextBuyMutation = useMutation({
        mutationFn: () => {
            messagePopup("loading", "Adding...");
            return addToNextToBuy(ticker, user?.uid);
        },
        onSuccess: () => {
            messagePopup("success", "Added!");
            queryClient.invalidateQueries({
                queryKey: ["nextStocks", user?.uid],
            });
        },
    });

    const removeFromNextBuyMutation = useMutation({
        mutationFn: () => {
            messagePopup("loading", "Removing...");
            return removeFromNextToBuy(ticker, user?.uid);
        },
        onSuccess: () => {
            messagePopup("success", "Removed!");
            queryClient.invalidateQueries({
                queryKey: ["nextStocks", user?.uid],
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
        addMutation.mutate({
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

    const handleAddToNextToBuy = () => {
        addToNextBuyMutation.mutate();
    };

    const handleRemoveFromNextToBuy = () => {
        removeFromNextBuyMutation.mutate();
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
                    <div className="z-20 absolute right-0 top-7 rounded-lg shadow w-48 bg-gray-700 divide-gray-600">
                        <ul
                            className="py-2 text-sm  text-gray-200"
                            aria-labelledby="dropdownOptionsButton"
                        >
                            <li
                                onClick={handleTargetPrice}
                                className="block px-4 py-2 hover:bg-gray-600 hover:text-white cursor-pointer"
                            >
                                <div className="flex space-x-3">
                                    <EditOutlined className="text-lg" />
                                    <span>Edit target price</span>
                                </div>
                            </li>
                            {nextStocks.includes(ticker) ? (
                                <li
                                    onClick={handleRemoveFromNextToBuy}
                                    className="block px-4 py-2 hover:bg-gray-600 hover:text-white cursor-pointer"
                                >
                                    <div className="flex space-x-3">
                                        <MinusCircleOutlined className="text-lg" />
                                        <span>
                                            Remove from next to buy list
                                        </span>
                                    </div>
                                </li>
                            ) : (
                                <li
                                    onClick={handleAddToNextToBuy}
                                    className="block px-4 py-2 hover:bg-gray-600 hover:text-white cursor-pointer"
                                >
                                    <div className="flex space-x-3">
                                        <PlusCircleOutlined className="text-lg" />
                                        <span>Add to next to buy list</span>
                                    </div>
                                </li>
                            )}
                            <li
                                onClick={handleHolding}
                                className="block px-4 py-2 hover:bg-gray-600 hover:text-white cursor-pointer"
                            >
                                <div className="flex space-x-3">
                                    <RiseOutlined className="text-lg" />
                                    <span>Update holding status</span>
                                </div>
                            </li>
                            {"error" in savedStock && savedStock?.error ? (
                                <li
                                    onClick={handleAdd}
                                    className="block px-4 py-2 hover:bg-gray-600 hover:text-white cursor-pointer"
                                >
                                    <div className="flex space-x-3">
                                        <PlusCircleOutlined className="text-lg" />
                                        <span>Add stock to portfolio</span>
                                    </div>
                                </li>
                            ) : (
                                <li
                                    onClick={handleRemove}
                                    className="block px-4 py-2 hover:bg-gray-600 hover:text-white cursor-pointer"
                                >
                                    <div className="flex space-x-3">
                                        <MinusCircleOutlined className="text-lg" />
                                        <span>Remove stock from portfolio</span>
                                    </div>
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
