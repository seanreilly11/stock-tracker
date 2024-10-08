"use client";
import { useState } from "react";
import { AimOutlined, RiseOutlined, FallOutlined } from "@ant-design/icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Modal, Skeleton } from "antd";
import Image from "next/image";
import StockOptionsButton from "./StockOptionsButton";
import TargetPriceForm from "./TargetPriceForm";
import { updateStock } from "@/server/actions/db";
import { TStock } from "@/utils/types";
import { formatPrice, getChangeColour, getChangePerc } from "@/utils/helpers";
import useAuth from "@/hooks/useAuth";
import usePopup from "@/hooks/usePopup";
import useFetchUserStock from "@/hooks/useFetchUserStock";
import useFetchStockPrices from "@/hooks/useFetchStockPrices";
import { logCustomEvent } from "@/server/firebase";

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

    const [editTarget, setEditTarget] = useState(false);
    const [showDesc, setShowDesc] = useState(false);
    const { data: savedStock, isLoading: loadingSavedStock } =
        useFetchUserStock(ticker);
    const { data: prices, isLoading: loadingPrices } =
        useFetchStockPrices(ticker);

    const todaysPrices = prices?.ticker?.day?.c !== 0;
    const stockPrices = todaysPrices
        ? prices?.ticker?.day
        : prices?.ticker?.prevDay;

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
        onSettled: () => setEditTarget(false),
    });

    const toggleModal = () => {
        logCustomEvent("show_description_clicked", { ticker });
        setShowDesc((prev) => !prev);
    };

    return (
        <>
            {contextHolder}
            <Modal
                title={`About ${ticker}`}
                open={showDesc}
                onOk={toggleModal}
                onCancel={toggleModal}
                width={"clamp(250px, 100%, 800px)"}
                cancelButtonProps={{ className: "hidden" }}
            >
                <p className="text-base leading-7">{details?.description}</p>
            </Modal>
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
                        <div className="text-center flex flex-col sm:items-end sm:text-right flex-1 basis-full">
                            <h1 className="text-2xl sm:text-3xl font-semibold relative">
                                {details?.description ? (
                                    <button
                                        className="text-xs h-4 w-4 flex items-center justify-center absolute top-0 right-[-1.05rem] rounded-full border border-primary text-primary"
                                        title={`About ${ticker}`}
                                        onClick={toggleModal}
                                    >
                                        ?
                                    </button>
                                ) : null}
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
                                    prices?.ticker?.todaysChangePerc!
                                )
                            }
                        >
                            {getChangePerc(prices?.ticker?.todaysChangePerc!)}
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
                            <TargetPriceForm
                                ticker={ticker}
                                name={name}
                                savedTargetPrice={savedStock?.targetPrice}
                                mostRecentPrice={stockPrices?.c}
                                updateMutation={updateMutation}
                            />
                        ) : savedStock?.targetPrice ? (
                            <>
                                <h2
                                    className="text-2xl cursor-pointer"
                                    title="Edit target price"
                                    onClick={() => {
                                        logCustomEvent(
                                            "target_price_edit_started",
                                            {
                                                from: "Value",
                                            }
                                        );
                                        setEditTarget(true);
                                    }}
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
                                onClick={() => {
                                    logCustomEvent(
                                        "target_price_edit_started",
                                        {
                                            from: "Initial",
                                        }
                                    );
                                    setEditTarget(true);
                                }}
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
