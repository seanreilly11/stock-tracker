import { FormEvent, KeyboardEvent, useState } from "react";
import {
    QuestionCircleOutlined,
    AimOutlined,
    RiseOutlined,
    FallOutlined,
} from "@ant-design/icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Modal } from "antd";
import StockOptionsButton from "./StockOptionsButton";
import useAuth from "@/hooks/useAuth";
import { updateStock } from "@/server/actions/db";
import { TStock } from "@/utils/types";
import Image from "next/image";
import Button from "../ui/Button";
import usePopup from "@/hooks/usePopup";
import useFetchUserStock from "@/hooks/useFetchUserStock";
import { formatPrice, getPercChange } from "@/utils/helpers";

type Props = {
    name: string;
    ticker: string;
    prices: {
        ticker: string;
        results: [
            {
                c: number;
                o: number;
            }
        ];
    };
    results: {
        homepage_url: string;
        name: string;
        description: string;
        sic_description: string;
        branding: {
            logo_url: string;
            icon_url: string;
        };
    };
};

const Banner = ({ prices, ticker, name, results }: Props) => {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const { messagePopup, contextHolder } = usePopup();

    const [targetPrice, setTargetPrice] = useState("");
    const [editTarget, setEditTarget] = useState(false);
    const { data: savedStock } = useFetchUserStock(ticker);
    const updateMutation = useMutation({
        mutationFn: (_stock: Partial<TStock>) => {
            messagePopup("loading", "Updating...");
            return updateStock(_stock, ticker, user?.uid);
        },
        onSuccess: () => {
            messagePopup("success", "Updated!");
            queryClient.invalidateQueries({
                queryKey: ["savedStocks", user?.uid, ticker],
            });
            queryClient.invalidateQueries({
                queryKey: ["savedStocks", user?.uid],
            });
        },
    });

    const submitTargetPrice = (e: FormEvent) => {
        e.preventDefault();
        if (!savedStock?.targetPrice)
            Modal.confirm({
                title: "Are you currently holding this stock?",
                icon: <QuestionCircleOutlined />,
                content:
                    "You will only be asked this once. If you would like to change this later, click on the three dots on the right.",
                okText: "Yes",
                onOk() {
                    updateMutation.mutate({
                        name,
                        holding: true,
                        ticker,
                        mostRecentPrice: prices?.results?.[0].c,
                        targetPrice:
                            parseFloat(targetPrice) ||
                            savedStock.targetPrice ||
                            0,
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
                            parseFloat(targetPrice) ||
                            savedStock.targetPrice ||
                            0,
                    });
                },
            });
        else
            updateMutation.mutate({
                mostRecentPrice: prices?.results?.[0].c,
                targetPrice:
                    parseFloat(targetPrice) || savedStock.targetPrice || 0,
            });
        setTargetPrice("");
        setEditTarget(false);
    };

    // console.log(results);
    const getChangeColour = () =>
        prices?.results?.[0].c > prices?.results?.[0].o
            ? "text-green-500"
            : "text-red-500";

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
        <>
            {contextHolder}
            <div className="my-4 mb-8 sm:my-8 relative">
                <div className="absolute top-0 right-0">
                    <StockOptionsButton
                        name={name}
                        prices={prices}
                        savedStock={savedStock}
                        ticker={ticker}
                        messagePopup={messagePopup}
                        updateMutation={updateMutation}
                        setEditTarget={setEditTarget}
                    />
                </div>
                <div className="flex flex-col items-center">
                    <div className="mb-6">
                        {results?.branding?.icon_url ? (
                            <Image
                                src={
                                    results.branding.icon_url +
                                    "?apiKey=" +
                                    process.env.NEXT_PUBLIC_POLYGON_API_KEY
                                }
                                alt={`${name} logo`}
                                width={50}
                                height={50}
                                priority
                            />
                        ) : null}
                    </div>
                    <div className="flex flex-col sm:flex-row items-center gap-x-6 mb-6 w-full">
                        <div className="text-center flex flex-col sm:text-right flex-1 basis-full">
                            <h1 className="text-2xl sm:text-3xl font-semibold">
                                {ticker}
                            </h1>
                            <p
                                className="text-base sm:w-3/4 self-center sm:self-end"
                                title={name?.length >= 100 ? name : undefined}
                            >
                                {!name
                                    ? ""
                                    : name?.length < 100
                                    ? name
                                    : name?.substring(0, 100) + "..."}
                            </p>
                        </div>
                        <h1
                            className={`text-3xl sm:text-5xl my-3 sm:my-0 font-semibold min-w-fit tracking-tight text-primary`}
                        >
                            {prices?.results?.[0].c
                                ? formatPrice(prices?.results?.[0].c)
                                : "$--"}
                        </h1>
                        <div
                            className={
                                "text-md flex-1 basis-full " + getChangeColour()
                            }
                        >
                            {getPercChange(
                                prices?.results?.[0].c,
                                prices?.results?.[0].o
                            )}
                        </div>
                    </div>
                    <div className="flex sm:items-center justify-center gap-x-3">
                        <AimOutlined
                            className="text-3xl"
                            title="Target price"
                        />
                        {editTarget ? (
                            <form
                                onSubmit={submitTargetPrice}
                                className={`flex items-center border-b border-primary py-2 max-w-[14rem]`}
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
                                    placeholder={formatPrice(
                                        savedStock?.targetPrice || 0
                                    )}
                                    aria-label="Target price"
                                />
                                <Button className="flex-shrink-0" type="submit">
                                    Set target
                                </Button>
                            </form>
                        ) : savedStock?.targetPrice ? (
                            <>
                                <h2
                                    className="text-2xl cursor-pointer"
                                    title="Edit target price"
                                    onClick={() => setEditTarget(true)}
                                >
                                    {formatPrice(savedStock.targetPrice)}
                                </h2>
                                {savedStock.holding ? (
                                    <RiseOutlined
                                        className="text-xl"
                                        title="Holding shares"
                                    />
                                ) : (
                                    <FallOutlined
                                        className="text-xl"
                                        title="Not holding shares"
                                    />
                                )}
                            </>
                        ) : (
                            <h2
                                className="text-lg cursor-pointer"
                                onClick={() => setEditTarget(true)}
                            >
                                Set your target price
                            </h2>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Banner;
