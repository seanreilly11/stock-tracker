"use client";
import { useState } from "react";
import { AimOutlined, RiseOutlined, FallOutlined } from "@ant-design/icons";
import { Modal, Progress, Skeleton, Tooltip } from "antd";
import StockOptionsButton from "./StockOptionsButton";
import TargetPriceForm from "./TargetPriceForm";
import { TStock } from "@/lib/schemas/stocks/stock.schema";
import { SearchedStockPolygon } from "@/lib/schemas/stocks/polygon.schema";
import useUpdateStockMutation from "@/lib/mutations/useUpdateStockMutation";
import {
    formatPrice,
    getChangeColour,
    getChangePerc,
    truncate,
} from "@/utils/helpers";
import { STOCK_NAME_TRUNCATE_LENGTH } from "@/utils/constants";
import useAuth from "@/hooks/useAuth";
import usePopup from "@/hooks/usePopup";
import useFetchStockPrices from "@/lib/queries/useFetchStockPrices";
import { logCustomEvent } from "@/lib/firebase";

type Props = {
    ticker: string;
    name: string | undefined;
    details: SearchedStockPolygon | undefined;
    savedStock: TStock | null;
};

const Banner = ({ ticker, name = "", details, savedStock }: Props) => {
    const { user } = useAuth();
    const { messagePopup, contextHolder } = usePopup();

    const [editTarget, setEditTarget] = useState(false);
    const [showDesc, setShowDesc] = useState(false);
    const {
        data: prices,
        isLoading: loadingPrices,
        error: priceError,
    } = useFetchStockPrices(ticker);

    const todaysPrices = prices?.ticker?.day?.c !== 0;
    const stockPrices = todaysPrices
        ? prices?.ticker?.day
        : prices?.ticker?.prevDay;

    const updateMutation = useUpdateStockMutation(ticker, {
        onMutate: () => messagePopup("loading", "Updating..."),
        onSuccess: () => messagePopup("success", "Updated!"),
        onSettled: () => setEditTarget(false),
    });

    const toggleModal = () => {
        logCustomEvent("show_description_clicked", { ticker });
        setShowDesc((prev) => !prev);
    };

    const progress = parseFloat(
        Math.min(
            100,
            ((stockPrices?.c || 0) / (savedStock?.targetPrice || 1)) * 100,
        ).toFixed(0),
    );

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
                        savedStock={savedStock!}
                        ticker={ticker}
                        messagePopup={messagePopup}
                        updateMutation={updateMutation}
                        setEditTarget={setEditTarget}
                    />
                </div>
                <div className="flex flex-col items-center">
                    {/* <div className="mb-6">
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
                    </div> */}
                    <div className="flex flex-col sm:flex-row items-center gap-x-6 mt-16 mb-6 w-full">
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
                                title={
                                    name?.length >= STOCK_NAME_TRUNCATE_LENGTH
                                        ? name
                                        : undefined
                                }
                            >
                                {name
                                    ? truncate(name, STOCK_NAME_TRUNCATE_LENGTH)
                                    : ""}
                            </p>
                        </div>
                        <h1
                            className={`text-3xl sm:text-5xl my-3 sm:my-0 font-semibold min-w-fit tracking-tight text-primary`}
                        >
                            {loadingPrices ? (
                                <Skeleton.Input active />
                            ) : priceError ? (
                                <span className="text-sm text-red-500">—</span>
                            ) : (
                                formatPrice(stockPrices?.c!)
                            )}
                        </h1>
                        <div
                            className={
                                "text-md flex-1 basis-full " +
                                getChangeColour(
                                    prices?.ticker?.todaysChangePerc!,
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
                        {!user?.uid ? (
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
                                            },
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
                                        },
                                    );
                                    setEditTarget(true);
                                }}
                            >
                                Set your target price
                            </h2>
                        )}
                    </div>
                    <div className="w-48 mt-2">
                        <Tooltip
                            title={
                                progress < 100
                                    ? `You're ${progress}% to your price target`
                                    : "You've hit your price target!"
                            }
                        >
                            <Progress
                                percent={progress}
                                // percentPosition={{ align: "center", type: "inner" }}
                                // showInfo={false}
                                size={["100", 10]}
                            />
                        </Tooltip>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Banner;
