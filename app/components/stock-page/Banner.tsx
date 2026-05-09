"use client";
import { use, useMemo, useState } from "react";
import { AimOutlined, RiseOutlined, FallOutlined } from "@ant-design/icons";
import { Modal, Progress, Tooltip } from "antd";
import StockOptionsButton from "./StockOptionsButton";
import TargetPriceForm from "./TargetPriceForm";
import { TStock } from "@/lib/schemas/stocks/stock.schema";
import { SearchedStockPolygon } from "@/lib/schemas/stocks/polygon.schema";
import {
    formatPrice,
    getChangeColour,
    getChangePerc,
    truncate,
} from "@/utils/helpers";
import { STOCK_NAME_TRUNCATE_LENGTH } from "@/utils/constants";
import usePopup from "@/hooks/usePopup";
import { logCustomEvent } from "@/lib/firebase";
import { updateStockAction } from "@/lib/actions/stocks";
import { getStockPrices } from "@/lib/api";
import { TStockPrice } from "@/lib/schemas/stocks/polygon.schema";

type Props = {
    ticker: string;
    name: string | undefined;
    details: SearchedStockPolygon | undefined;
    savedStock: TStock | null;
    nextStocks: string[];
};

const Banner = ({ ticker, name = "", details, savedStock, nextStocks }: Props) => {
    const { messagePopup, contextHolder } = usePopup();

    const [editTarget, setEditTarget] = useState(false);
    const [showDesc, setShowDesc] = useState(false);
    const pricesPromise = useMemo(
        () => getStockPrices(ticker).catch(() => null),
        [ticker],
    );
    const prices: TStockPrice | null = use(pricesPromise);

    const todaysPrices = prices?.ticker?.day?.c !== 0;
    const stockPrices = todaysPrices
        ? prices?.ticker?.day
        : prices?.ticker?.prevDay;

    const handleUpdate = async (stock: Partial<TStock>) => {
        messagePopup("loading", "Updating...");
        const result = await updateStockAction(stock, ticker);
        if (result.success) messagePopup("success", "Updated!");
        else messagePopup("error", result.error);
        setEditTarget(false);
        return result;
    };

    const progress = parseFloat(
        Math.min(
            100,
            ((stockPrices?.c || 0) / (savedStock?.targetPrice || 1)) * 100,
        ).toFixed(0),
    );

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
                        savedStock={savedStock!}
                        ticker={ticker}
                        nextStocks={nextStocks}
                        messagePopup={messagePopup}
                        onUpdate={handleUpdate}
                        setEditTarget={setEditTarget}
                    />
                </div>
                <div className="flex flex-col items-center">
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
                            {prices ? formatPrice(stockPrices?.c!) : "—"}
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
                        {editTarget ? (
                            <TargetPriceForm
                                ticker={ticker}
                                name={name}
                                savedTargetPrice={savedStock?.targetPrice}
                                mostRecentPrice={stockPrices?.c}
                                onUpdate={handleUpdate}
                            />
                        ) : savedStock?.targetPrice ? (
                            <>
                                <h2
                                    className="text-2xl cursor-pointer"
                                    title="Edit target price"
                                    onClick={() => {
                                        logCustomEvent(
                                            "target_price_edit_started",
                                            { from: "Value" },
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
                                        { from: "Initial" },
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
