"use client";
import { useState, FormEvent } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import useAuth from "@/hooks/useAuth";
import { updateStock } from "@/server/actions/db";
import { TStock, TNote } from "@/utils/types";
import Button from "../ui/Button";
import { Skeleton } from "antd";
import EditNotesButton from "./EditNotesButton";
import AINotesList from "./AINotesList";
import EmptyState from "../common/EmptyState";
import useFetchUserStock from "@/hooks/useFetchUserStock";
import { logCustomEvent } from "@/server/firebase";

type Props = {
    ticker: string;
    name: string;
    type: string;
};

const StockNotes = ({ ticker, name, type }: Props) => {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const [noteText, setNoteText] = useState("");
    const { data: savedStock, isLoading } = useFetchUserStock(ticker);
    const NOTE_MAX_LENGTH = 350;

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

    const handleNewNote = (e: FormEvent) => {
        e.preventDefault();
        logCustomEvent("add_personal_note", { ticker });

        if (noteText.length < 1) return;
        let _note: TNote = {
            id: crypto.randomUUID(),
            text: noteText,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        };
        let _stock: Partial<TStock> = {
            ticker,
            name,
            notes: savedStock?.notes ? [...savedStock?.notes, _note] : [_note],
        };
        updateMutation.mutate(_stock);
        setNoteText("");
    };

    return (
        <div className="flex-1">
            <h2 className="text-2xl font-semibold mb-2">My notes</h2>
            <div>
                <ul className="w-full space-y-3 mb-4">
                    {isLoading ? (
                        <Skeleton active />
                    ) : savedStock?.notes?.length > 0 ? (
                        savedStock?.notes?.map((note: TNote) => (
                            <li key={note.id}>
                                <div className="flex items-center space-x-4 rtl:space-x-reverse">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-base font-medium text-gray-900">
                                            {note.text}
                                        </p>
                                    </div>
                                    <EditNotesButton
                                        note={note}
                                        ticker={ticker}
                                    />
                                </div>
                            </li>
                        ))
                    ) : (
                        <div className="pb-1">
                            <EmptyState page="Notes" />
                        </div>
                    )}
                    {isLoading ? null : (
                        <AINotesList ticker={ticker} name={name} type={type} />
                    )}
                </ul>

                <form onSubmit={handleNewNote}>
                    <div className="w-full mb-4 rounded-lg border bg-gray-700 border-gray-600">
                        <div className="px-4 py-2 rounded-t-lg bg-gray-800">
                            <label className="sr-only">Your note</label>
                            <textarea
                                rows={4}
                                className="w-full px-0 text-base text-white border-0 bg-gray-800  placeholder-gray-400 focus:outline-none"
                                value={noteText}
                                onChange={(e) =>
                                    setNoteText(e.currentTarget.value)
                                }
                                placeholder="Write a note..."
                                required
                                maxLength={NOTE_MAX_LENGTH}
                            ></textarea>
                        </div>
                        <div className="flex items-center justify-between px-3 py-2 border-t border-gray-600">
                            <Button type="submit">Add note</Button>
                            <span className="text-xs text-white">
                                {noteText.length} / {NOTE_MAX_LENGTH} characters
                            </span>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default StockNotes;
