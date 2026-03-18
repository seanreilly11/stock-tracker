"use client";
import { useState } from "react";
import { AINotes } from "@/lib/schemas/ai/ai.schema";
import { TNote, TStock } from "@/lib/schemas/stocks/stock.schema";
import { updateStockAction } from "@/lib/actions/stocks";
import useFetchAINotes from "@/lib/queries/useFetchAINotes";
import { logCustomEvent } from "@/lib/firebase";
import { Skeleton } from "antd";

type Props = {
    ticker: string;
    name: string;
    type: string;
    savedStock: TStock | null;
};

const AINotesList = ({ ticker, name, type, savedStock }: Props) => {
    const [addedNotes, setAddedNotes] = useState<number[]>([]);

    const isDev = process.env.NODE_ENV !== "production";

    const {
        data: AINotes,
        error,
        isLoading,
    } = useFetchAINotes(ticker, type, !isDev);

    const addNotes = async (note: AINotes, index: number) => {
        setAddedNotes((prev) => [...prev, index]);
        const _note: TNote = {
            id: crypto.randomUUID(),
            text: note.explanation,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        };
        const _stock: Partial<TStock> = {
            ticker,
            name,
            notes: savedStock?.notes ? [...savedStock.notes, _note] : [_note],
        };
        logCustomEvent("add_AI_note", { ticker, impact: note.impact });
        await updateStockAction(_stock, ticker);
    };

    if (error)
        return (
            <p className="text-sm text-gray-400 mb-4">
                AI suggestions unavailable.
            </p>
        );
    if (isDev) {
        return (
            <div className="space-y-1 mb-4">
                <p>No AI notes returned in dev</p>
            </div>
        );
    }
    return (
        <>
            <h4 className="text-sm mb-2">Suggested by AI:</h4>
            <div className="space-y-1 mb-4">
                {isLoading ? (
                    <>
                        <Skeleton active paragraph={{ rows: 1 }} />
                        <Skeleton active paragraph={{ rows: 1 }} />
                        <Skeleton active paragraph={{ rows: 1 }} />
                    </>
                ) : (
                    AINotes?.map((note: AINotes, i: number) =>
                        addedNotes.includes(i) ? null : (
                            <div
                                key={note.explanation}
                                className="flex items-center space-x-2 border border-primary hover:border-primary-hover hover:bg-primary-hover text-dark hover:text-white rounded-md py-1 px-2 rtl:space-x-reverse"
                            >
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium">
                                        {note.explanation}
                                    </p>
                                </div>
                                <button
                                    className="text-xl py-1 px-1.5"
                                    onClick={() => addNotes(note, i)}
                                >
                                    +
                                </button>
                            </div>
                        ),
                    )
                )}
            </div>
        </>
    );
};

export default AINotesList;
