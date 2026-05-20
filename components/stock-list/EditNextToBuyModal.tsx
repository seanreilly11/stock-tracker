"use client";
import React, { useState, useEffect, useTransition } from "react";
import { X, XCircle } from "lucide-react";
import { removeFromNextToBuyAction } from "@/lib/actions/stocks";
import SearchBar from "./SearchBar";
import Spinner from "@/components/ui/Spinner";
import EmptyState from "@/components/common/EmptyState";

interface EditNextToBuyModalProps {
    nextStocks: string[];
    showModal: boolean;
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditNextToBuyModal = ({
    nextStocks,
    showModal,
    setShowModal,
}: EditNextToBuyModalProps) => {
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === "Escape") setShowModal(false);
        };
        if (showModal) document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    }, [showModal, setShowModal]);

    if (!showModal) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <div
                className="absolute inset-0 bg-[oklch(20%_0.012_60_/_0.36)] backdrop-blur-sm"
                onClick={() => setShowModal(false)}
            />

            <div className="relative z-10 w-full max-w-md rounded-lg border border-[var(--rule)] bg-[var(--paper)] shadow-2xl overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--rule-soft)]">
                    <div>
                        <p className="font-[family-name:var(--mono)] text-[10px] uppercase tracking-widest text-[var(--ink-3)] mb-0.5">
                            Watchlist
                        </p>
                        <h2 className="font-[family-name:var(--serif)] text-xl text-[var(--ink)]">
                            Next to buy
                        </h2>
                    </div>
                    <button
                        type="button"
                        className="w-7 h-7 flex items-center justify-center rounded-md text-[var(--ink-3)] hover:bg-[var(--paper-2)] hover:text-[var(--ink)]"
                        onClick={() => setShowModal(false)}
                    >
                        <X size={15} />
                    </button>
                </div>

                <div className="px-6 py-4 flex flex-col gap-4">
                    <SearchBar nextToBuy savedTickers={[]} setError={setError} />

                    <div className="min-h-[2rem]">
                        {nextStocks.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {nextStocks.map((ticker) => (
                                    <RemoveButton key={ticker} ticker={ticker} />
                                ))}
                            </div>
                        ) : (
                            <EmptyState
                                title="Nothing queued yet."
                                body="Search for stocks to add them to your next-to-buy list."
                                size="sm"
                                variant="inline"
                            />
                        )}
                    </div>

                    {error && (
                        <p className="text-xs text-[var(--accent)]">{error}</p>
                    )}
                    <p className="text-xs text-[var(--ink-3)] font-[family-name:var(--mono)] uppercase tracking-wider">
                        Max 3 stocks
                    </p>
                </div>
            </div>
        </div>
    );
};

const RemoveButton = ({ ticker }: { ticker: string }) => {
    const [isPending, startTransition] = useTransition();

    return (
        <button
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[var(--rule)] bg-[var(--paper)] text-sm text-[var(--ink-2)] hover:border-[var(--accent-line)] hover:text-[var(--accent)] transition-colors"
            onClick={() =>
                startTransition(() => removeFromNextToBuyAction(ticker))
            }
        >
            {isPending ? (
                <Spinner size="small" />
            ) : (
                <>
                    {ticker}
                    <XCircle size={13} />
                </>
            )}
        </button>
    );
};

export default EditNextToBuyModal;
