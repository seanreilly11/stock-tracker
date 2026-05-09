"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Pencil } from "lucide-react";
import EditNextToBuyModal from "./EditNextToBuyModal";

interface NextToBuyProps {
    nextStocks: string[];
}

const NextToBuy = ({ nextStocks }: NextToBuyProps) => {
    const [showModal, setShowModal] = useState(false);

    const slots = [...nextStocks, null, null, null].slice(0, 3);

    return (
        <>
            <EditNextToBuyModal
                nextStocks={nextStocks}
                showModal={showModal}
                setShowModal={setShowModal}
            />

            <section className="mt-8">
                <div className="flex items-baseline justify-between border-b border-[var(--rule)] pb-2 mb-4">
                    <div className="flex items-baseline gap-2">
                        <span className="font-[family-name:var(--mono)] text-[11px] uppercase tracking-[0.08em] text-[var(--ink-3)]">
                            Next to buy
                        </span>
                        <span className="font-[family-name:var(--serif)] italic text-sm text-[var(--ink-4)]">
                            - when the paycheck lands
                        </span>
                    </div>
                    <div className="flex items-center gap-3 pb-1">
                        <span className="font-[family-name:var(--mono)] text-[10px] uppercase tracking-wider text-[var(--ink-4)]">
                            max 3
                        </span>
                        <button
                            className="flex items-center justify-center w-7 h-7 rounded-md border border-[var(--rule)] text-[var(--ink-3)] hover:bg-[var(--paper-2)] transition-colors"
                            onClick={() => setShowModal(true)}
                            title="Edit next to buy"
                        >
                            <Pencil size={12} />
                        </button>
                    </div>
                </div>

                <ol className="grid grid-cols-1 sm:grid-cols-3 gap-3 list-none p-0 m-0">
                    {slots.map((ticker, i) => (
                        <li key={ticker ?? `empty-${i}`}>
                            {ticker ? (
                                <Link
                                    href={`/stocks/${ticker}`}
                                    className="flex items-start gap-3 p-4 rounded-lg border border-[var(--rule)] bg-[var(--paper)] hover:-translate-y-px hover:border-[var(--ink-4)] hover:shadow-[0_8px_20px_-12px_oklch(20%_0.01_60_/_0.18)] transition-all"
                                >
                                    <span className="font-[family-name:var(--serif)] italic text-2xl text-[var(--ink-4)] leading-none pt-0.5">
                                        {i + 1}
                                    </span>
                                    <div className="min-w-0">
                                        <span className="block font-[family-name:var(--mono)] text-sm font-medium text-[var(--ink)]">
                                            {ticker}
                                        </span>
                                        <span className="block font-[family-name:var(--mono)] text-[10px] uppercase tracking-wider text-[var(--ink-3)] mt-0.5">
                                            watching
                                        </span>
                                    </div>
                                </Link>
                            ) : (
                                <button
                                    className="w-full flex items-center gap-3 p-4 rounded-lg border border-dashed border-[var(--rule)] text-[var(--ink-3)] hover:text-[var(--ink)] hover:border-[var(--ink-3)] transition-colors"
                                    onClick={() => setShowModal(true)}
                                >
                                    <span className="font-[family-name:var(--serif)] italic text-2xl text-[var(--ink-4)] leading-none">
                                        {i + 1}
                                    </span>
                                    <span className="text-sm">+ Pick a stock</span>
                                </button>
                            )}
                        </li>
                    ))}
                </ol>
            </section>
        </>
    );
};

export default NextToBuy;
