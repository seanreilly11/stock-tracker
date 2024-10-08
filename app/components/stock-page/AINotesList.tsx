import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { AINotes, TNote, TStock } from "@/utils/types";
import useAuth from "@/hooks/useAuth";
import { updateStock } from "@/server/actions/db";
import useFetchUserStock from "@/hooks/useFetchUserStock";
import useFetchAINotes from "@/hooks/useFetchAINotes";
import { logCustomEvent } from "@/server/firebase";
import { Skeleton } from "antd";

type Props = {
    ticker: string;
    name: string;
    type: string;
};

const AINotesList = ({ ticker, name, type }: Props) => {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const [addedNotes, setAddedNotes] = useState<number[]>([]);

    const { data: AINotes, error, isLoading } = useFetchAINotes(ticker, type);
    const { data: savedStock } = useFetchUserStock(ticker);

    const updateMutation = useMutation({
        mutationFn: (_stock: Partial<TStock>) => {
            return updateStock(_stock, ticker, user?.uid);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["savedStocks", user?.uid, ticker],
            });
            queryClient.invalidateQueries({
                queryKey: ["savedStocks", user?.uid],
            });
        },
    });

    const addNotes = (note: AINotes, index: number) => {
        setAddedNotes((prev) => [...prev, index]);
        let _note: TNote = {
            id: crypto.randomUUID(),
            text: note.explanation,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        };
        let _stock: Partial<TStock> = {
            ticker,
            name,
            notes: savedStock?.notes ? [...savedStock?.notes, _note] : [_note],
        };
        updateMutation.mutate(_stock);
        logCustomEvent("add_AI_note", { ticker, impact: note.impact });
    };

    if (error) return;
    return (
        <>
            <li className="text-sm">Suggested by AI:</li>
            {isLoading ? (
                <>
                    <li>
                        <Skeleton active paragraph={{ rows: 1 }} />
                    </li>
                    <li>
                        <Skeleton active paragraph={{ rows: 1 }} />
                    </li>
                    <li>
                        <Skeleton active paragraph={{ rows: 1 }} />
                    </li>
                </>
            ) : (
                AINotes?.map((note: AINotes, i: number) => {
                    if (!addedNotes.includes(i))
                        return (
                            <li key={i}>
                                <div
                                    className={`flex items-center space-x-2 border border-primary hover:border-primary-hover hover:bg-primary-hover text-dark hover:text-white rounded-md py-1 px-2 rtl:space-x-reverse`}
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
                            </li>
                        );
                })
            )}
        </>
    );
};

export default AINotesList;
