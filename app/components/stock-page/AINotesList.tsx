import { getAINotes } from "@/server/actions/ai";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import Button from "../ui/Button";
import { TNote, TStock } from "@/utils/types";
import useAuth from "@/hooks/useAuth";
import { getUserStock, updateStock } from "@/server/actions/db";

type Props = {
    ticker: string;
    name: string;
};

type AINotes = {
    explanation: string;
    impact: "increase" | "decrease";
};

const AINotesList = ({ ticker, name }: Props) => {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const [addedNotes, setAddedNotes] = useState<number[]>([]);
    const {
        data: AINotes,
        error,
        isLoading,
    } = useQuery({
        queryKey: ["AINotes", ticker],
        queryFn: () => getAINotes(ticker),
        enabled: !!ticker,
        staleTime: Infinity,
    });
    const { data: savedStock } = useQuery({
        queryKey: ["savedStocks", user?.uid, ticker],
        queryFn: () => getUserStock(ticker, user?.uid),
        staleTime: Infinity,
    });
    const updateMutation = useMutation({
        mutationFn: (_stock: Partial<TStock>) => {
            return updateStock(_stock, ticker, user?.uid);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["savedStocks", user?.uid, ticker],
            });
        },
    });
    useEffect(() => {
        () => setAddedNotes([]);
    }, []);

    const addNotes = (text: string, index: number) => {
        setAddedNotes((prev) => [...prev, index]);
        let _note: TNote = {
            id: crypto.randomUUID(),
            text,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        };
        let _stock: Partial<TStock> = {
            ticker,
            name,
            notes: savedStock?.notes ? [...savedStock?.notes, _note] : [_note],
        };
        updateMutation.mutate(_stock);
    };

    if (error || isLoading) return;
    return (
        <>
            <li className="text-sm">Suggested by AI:</li>
            {AINotes?.map((note: AINotes, i: number) => {
                if (!addedNotes.includes(i))
                    return (
                        <li key={i}>
                            <div className="flex items-center space-x-4 border border-indigo-600 hover:border-indigo-500 hover:bg-indigo-500 text-gray-900 hover:text-white rounded-md py-1 px-2 rtl:space-x-reverse">
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium">
                                        {note.explanation}
                                    </p>
                                </div>
                                <button
                                    className="text-xl"
                                    onClick={() =>
                                        addNotes(note.explanation, i)
                                    }
                                >
                                    +
                                </button>
                            </div>
                        </li>
                    );
            })}
        </>
    );
};

export default AINotesList;
