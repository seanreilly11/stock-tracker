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
    useQuery,
} from "@tanstack/react-query";
import { DbResult } from "@/utils/types";
import { NoticeType } from "antd/es/message/interface";
import Button from "../ui/Button";
import { Modal } from "antd";
import useAuth from "@/hooks/useAuth";
import { TStock, TStockPrice } from "@/utils/types";
import { getUserNextBuyStocks } from "@/server/actions/db";
import useAddStockMutation from "@/server/mutations/useAddStockMutation";
import useRemoveStockMutation from "@/server/mutations/useRemoveStockMutation";
import useAddToNextToBuyMutation from "@/server/mutations/useAddToNextToBuyMutation";
import useRemoveFromNextToBuyMutation from "@/server/mutations/useRemoveFromNextToBuyMutation";
import { logCustomEvent } from "@/server/firebase";

type Props = {
    name: string;
    ticker: string;
    prices: TStockPrice;
    savedStock: TStock;
    updateMutation: UseMutationResult<DbResult, Error, Partial<TStock>, unknown>;
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
    const [showDropdown, setShowDropdown] = useState(false);

    const { data: nextStocks } = useQuery({
        queryKey: ["nextStocks", user?.uid],
        queryFn: async () => {
            const result = await getUserNextBuyStocks(user?.uid);
            if (!result.success) throw new Error(result.error);
            return result.data;
        },
        enabled: !!user?.uid,
        staleTime: Infinity,
    });

    const removeMutation = useRemoveStockMutation(ticker, {
        onMutate: () => messagePopup("loading", "Removing..."),
        onSuccess: () => messagePopup("success", "Removed!"),
    });

    const addMutation = useAddStockMutation({
        onMutate: () => messagePopup("loading", "Adding..."),
        onSuccess: () => messagePopup("success", "Added!"),
    });

    const addToNextBuyMutation = useAddToNextToBuyMutation({
        onMutate: () => messagePopup("loading", "Adding..."),
        onSuccess: (data) => {
            if (data && !data.success) messagePopup("error", data.error);
            else messagePopup("success", "Added!");
        },
    });

    const removeFromNextBuyMutation = useRemoveFromNextToBuyMutation({
        onMutate: () => messagePopup("loading", "Removing..."),
        onSuccess: () => messagePopup("success", "Removed!"),
    });

    const handleHolding = () => {
        Modal.confirm({
            title: "Are you currently holding this stock?",
            icon: <QuestionCircleOutlined />,
            content: "",
            okText: "Yes",
            onOk() {
                logCustomEvent("holding_update", { holding: true });
                updateMutation.mutate({
                    name,
                    holding: true,
                    ticker,
                    mostRecentPrice: prices?.ticker.day.c,
                    targetPrice:
                        ("targetPrice" in savedStock &&
                            savedStock?.targetPrice) ||
                        null,
                });
            },
            cancelText: "No",
            onCancel() {
                logCustomEvent("holding_update", { holding: false });
                updateMutation.mutate({
                    name,
                    holding: false,
                    ticker,
                    mostRecentPrice: prices?.ticker.day.c,
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
                logCustomEvent("remove_stock", { ticker });
                return removeMutation.mutate();
            },
        });
        setShowDropdown(false);
    };

    const handleAdd = () => {
        logCustomEvent("add_stock", { ticker });
        addMutation.mutate({
            holding: false,
            mostRecentPrice: null,
            ticker,
            targetPrice: null,
            name,
        });
        setShowDropdown(false);
    };

    const handleTargetPrice = () => {
        logCustomEvent("target_price_edit_started", { from: "Menu" });
        setEditTarget(true);
        setShowDropdown(false);
    };

    const handleAddToNextToBuy = () => {
        logCustomEvent("next_to_buy_add", { page: "Stock page" });
        addToNextBuyMutation.mutate(ticker);
        setShowDropdown(false);
    };

    const handleRemoveFromNextToBuy = () => {
        logCustomEvent("next_to_buy_remove", { page: "Stock page" });
        removeFromNextBuyMutation.mutate(ticker);
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
                            {nextStocks?.includes(ticker) ? (
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
                            {!savedStock ? (
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
