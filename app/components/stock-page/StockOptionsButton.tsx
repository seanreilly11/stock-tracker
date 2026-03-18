"use client";
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
import { DbResult } from "@/lib/schemas/common/response.schema";
import { NoticeType } from "antd/es/message/interface";
import Button from "../ui/Button";
import { Modal } from "antd";
import useAuth from "@/hooks/useAuth";
import { TStock } from "@/lib/schemas/stocks/stock.schema";
import { TStockPrice } from "@/lib/schemas/stocks/polygon.schema";
import {
    addStockAction,
    removeStockAction,
    addToNextToBuyAction,
    removeFromNextToBuyAction,
} from "@/lib/actions/stocks";
import { logCustomEvent } from "@/lib/firebase";

type Props = {
    name: string;
    ticker: string;
    prices: TStockPrice;
    savedStock: TStock;
    nextStocks: string[];
    onUpdate: (stock: Partial<TStock>) => Promise<DbResult>;
    messagePopup: (type: NoticeType, content: string, duration?: number) => void;
    setEditTarget: React.Dispatch<React.SetStateAction<boolean>>;
};

const StockOptionsButton = ({
    onUpdate,
    ticker,
    name,
    prices,
    savedStock,
    nextStocks,
    messagePopup,
    setEditTarget,
}: Props) => {
    const { user } = useAuth();
    const [showDropdown, setShowDropdown] = useState(false);

    const handleHolding = () => {
        Modal.confirm({
            title: "Are you currently holding this stock?",
            icon: <QuestionCircleOutlined />,
            content: "",
            okText: "Yes",
            onOk() {
                logCustomEvent("holding_update", { holding: true });
                onUpdate({
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
                onUpdate({
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
            async onOk() {
                logCustomEvent("remove_stock", { ticker });
                messagePopup("loading", "Removing...");
                const result = await removeStockAction(ticker);
                if (result.success) messagePopup("success", "Removed!");
                else messagePopup("error", result.error);
            },
        });
        setShowDropdown(false);
    };

    const handleAdd = async () => {
        logCustomEvent("add_stock", { ticker });
        messagePopup("loading", "Adding...");
        const result = await addStockAction({
            holding: false,
            mostRecentPrice: null,
            ticker,
            targetPrice: null,
            name,
        });
        if (result.success) messagePopup("success", "Added!");
        else messagePopup("error", result.error);
        setShowDropdown(false);
    };

    const handleTargetPrice = () => {
        logCustomEvent("target_price_edit_started", { from: "Menu" });
        setEditTarget(true);
        setShowDropdown(false);
    };

    const handleAddToNextToBuy = async () => {
        logCustomEvent("next_to_buy_add", { page: "Stock page" });
        messagePopup("loading", "Adding...");
        const result = await addToNextToBuyAction(ticker);
        if (result.success) messagePopup("success", "Added!");
        else messagePopup("error", result.error);
        setShowDropdown(false);
    };

    const handleRemoveFromNextToBuy = async () => {
        logCustomEvent("next_to_buy_remove", { page: "Stock page" });
        messagePopup("loading", "Removing...");
        const result = await removeFromNextToBuyAction(ticker);
        if (result.success) messagePopup("success", "Removed!");
        else messagePopup("error", result.error);
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
                            className="py-2 text-sm text-gray-200"
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
