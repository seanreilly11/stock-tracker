import { FormEvent, KeyboardEvent, useState } from "react";
import {
    QuestionCircleOutlined,
    AimOutlined,
    RiseOutlined,
    FallOutlined,
} from "@ant-design/icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Modal, Skeleton } from "antd";
import StockOptionsButton from "./StockOptionsButton";
import useAuth from "@/hooks/useAuth";
import { updateStock } from "@/server/actions/db";
import { TStock } from "@/utils/types";
import Image from "next/image";
import Button from "../ui/Button";
import usePopup from "@/hooks/usePopup";
import useFetchUserStock from "@/hooks/useFetchUserStock";
import { formatPrice, getChangeColour, getPercChange } from "@/utils/helpers";
import useFetchStockPrices from "@/hooks/useFetchStockPrices";

type Props = {
    name: string;
    ticker: string;
    details: {
        homepage_url: string;
        name: string;
        description: string;
        sic_description: string;
        branding: {
            logo_url: string;
            icon_url: string;
        };
        type: string;
    };
};

const Banner = ({ ticker, name, details }: Props) => {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const { messagePopup, contextHolder } = usePopup();

    const [targetPrice, setTargetPrice] = useState("");
    const [editTarget, setEditTarget] = useState(false);
    const { data: savedStock, isLoading: loadingSavedStock } =
        useFetchUserStock(ticker);
    const { data: prices, isLoading: loadingPrices } =
        useFetchStockPrices(ticker);

    const todaysPrices = prices?.ticker.day.c !== 0;
    const stockPrices = todaysPrices
        ? prices?.ticker.day
        : prices?.ticker.prevDay;

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
                        mostRecentPrice: stockPrices?.c,
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
                        mostRecentPrice: stockPrices?.c,
                        targetPrice:
                            parseFloat(targetPrice) ||
                            savedStock.targetPrice ||
                            0,
                    });
                },
            });
        else
            updateMutation.mutate({
                mostRecentPrice: stockPrices?.c,
                targetPrice:
                    parseFloat(targetPrice) || savedStock.targetPrice || 0,
            });
        setTargetPrice("");
        setEditTarget(false);
    };

    // console.log(prices);

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
                        prices={prices!}
                        savedStock={savedStock}
                        ticker={ticker}
                        messagePopup={messagePopup}
                        updateMutation={updateMutation}
                        setEditTarget={setEditTarget}
                    />
                </div>
                <div className="flex flex-col items-center">
                    <div className="mb-6">
                        {details?.branding?.icon_url ? (
                            <Image
                                src={
                                    details.branding.icon_url +
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
                            {formatPrice(stockPrices?.c!)}
                        </h1>
                        <div
                            className={
                                "text-md flex-1 basis-full " +
                                getChangeColour(
                                    prices?.ticker.todaysChangePerc!
                                )
                            }
                        >
                            {getPercChange(prices?.ticker.todaysChangePerc!)}
                        </div>
                    </div>
                    <div className="flex sm:items-center justify-center gap-x-3">
                        <AimOutlined
                            className="text-3xl"
                            title="Target price"
                        />
                        {!user?.uid || loadingSavedStock ? (
                            <Skeleton.Input active />
                        ) : editTarget ? (
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
                                        savedStock?.targetPrice
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
