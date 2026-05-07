import { FormEvent, KeyboardEvent, useState } from "react";
import Button from "../ui/Button";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { Modal } from "antd";
import { formatPrice } from "@/utils/helpers";
import { UseMutationResult } from "@tanstack/react-query";
import { TStock } from "@/types";

type StockUpdates = {
    holding?: boolean;
    target_price?: number | null;
    most_recent_price?: number | null;
};

type Props = {
    ticker: string;
    name: string;
    savedTargetPrice: number | null;
    mostRecentPrice: number | undefined;
    updateMutation: UseMutationResult<TStock, Error, StockUpdates, unknown>;
};

const TargetPriceForm = ({
    ticker,
    name,
    savedTargetPrice,
    mostRecentPrice,
    updateMutation,
}: Props) => {
    const [targetPrice, setTargetPrice] = useState("");

    const submitTargetPrice = (e: FormEvent) => {
        e.preventDefault();
        if (!savedTargetPrice) {
            Modal.confirm({
                title: "Are you currently holding this stock?",
                icon: <QuestionCircleOutlined />,
                content:
                    "You will only be asked this once. If you would like to change this later, click on the three dots on the right.",
                okText: "Yes",
                onOk() {
                    updateMutation.mutate({
                        holding: true,
                        most_recent_price: mostRecentPrice ?? null,
                        target_price:
                            parseFloat(targetPrice) || savedTargetPrice || 0,
                    });
                },
                cancelText: "No",
                onCancel() {
                    updateMutation.mutate({
                        holding: false,
                        most_recent_price: mostRecentPrice ?? null,
                        target_price:
                            parseFloat(targetPrice) || savedTargetPrice || 0,
                    });
                },
            });
        } else {
            updateMutation.mutate({
                most_recent_price: mostRecentPrice ?? null,
                target_price: parseFloat(targetPrice) || savedTargetPrice || 0,
            });
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (
            !/[0-9]/.test(e.key) &&
            e.key !== "." &&
            e.key !== "Backspace" &&
            e.key !== "Enter"
        )
            e.preventDefault();
    };

    return (
        <form
            onSubmit={submitTargetPrice}
            className={`flex items-center border-b border-primary py-2 max-w-56`}
        >
            <input
                className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
                autoFocus
                type="text"
                maxLength={7}
                value={targetPrice}
                onKeyDown={handleKeyDown}
                onChange={(e) => {
                    setTargetPrice(e.currentTarget.value);
                }}
                inputMode="numeric"
                pattern="^[1-9]\d*(\.\d+)?$"
                placeholder={
                    savedTargetPrice ? formatPrice(savedTargetPrice) : "$0.00"
                }
                aria-label="Target price"
            />
            <Button className="shrink-0" type="submit">
                Set target
            </Button>
        </form>
    );
};

export default TargetPriceForm;
