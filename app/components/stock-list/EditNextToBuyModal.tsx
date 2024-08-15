import { Modal } from "antd";
import React, { useState } from "react";
import SearchBar from "./SearchBar";
import Button from "../ui/Button";
import { CloseCircleOutlined } from "@ant-design/icons";
import useAuth from "@/hooks/useAuth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeFromNextToBuy } from "@/server/actions/db";
import Spinner from "../ui/Spinner";
import EmptyState from "../common/EmptyState";
import { logCustomEvent } from "@/server/firebase";

type Props = {
    nextStocks: string[];
    showModal: boolean;
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
};

type ButtonProps = {
    ticker: string;
};

const EditNextToBuyModal = ({ nextStocks, showModal, setShowModal }: Props) => {
    const [error, setError] = useState<string | null>(null);
    return (
        <Modal
            title="Edit next to buy stocks"
            open={showModal}
            onOk={() => setShowModal(false)}
            onCancel={() => setShowModal(false)}
        >
            <SearchBar nextToBuy setError={setError} />
            <div className="mt-4 flex gap-x-4">
                {nextStocks?.length > 0 ? (
                    nextStocks?.map((ticker: string) => (
                        <NextToBuyButton key={ticker} ticker={ticker} />
                    ))
                ) : (
                    <EmptyState page="NextToBuy" />
                )}
            </div>
            <p className="text-sm text-red-500 mt-2">{error}</p>
            <p className="text-sm font-semibold leading-6 text-gray-900 mt-2">
                Max 3 stocks
            </p>
        </Modal>
    );
};

const NextToBuyButton = ({ ticker }: ButtonProps) => {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    const removeMutation = useMutation({
        mutationFn: (ticker: string) => {
            return removeFromNextToBuy(ticker, user?.uid);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["nextStocks", user?.uid],
            });
        },
    });

    const handleRemoveTicker = (ticker: string) => {
        logCustomEvent("next_to_buy_remove", { page: "Home" });
        removeMutation.mutate(ticker);
    };

    return (
        <Button rounded="rounded-full">
            <span className="flex items-center gap-x-2">
                {removeMutation.isPending ? (
                    <Spinner />
                ) : (
                    <>
                        {ticker}{" "}
                        <CloseCircleOutlined
                            className="text-xl"
                            onClick={() => handleRemoveTicker(ticker)}
                        />
                    </>
                )}
            </span>
        </Button>
    );
};

export default EditNextToBuyModal;
