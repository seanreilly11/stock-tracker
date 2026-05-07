"use client";
import { useState, FormEvent } from "react";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/hooks/useAuth";
import { getStockNotes, addNote } from "@/lib/api/db";
import { TStock, TNote } from "@/types";
import Button from "../ui/Button";
import { Skeleton } from "antd";
import EditNotesButton from "./EditNotesButton";
import AINotesList from "./AINotesList";
import EmptyState from "../common/EmptyState";

type Props = {
    ticker: string;
    name: string;
    type: string;
    stock: TStock;
};

const StockNotes = ({ ticker, name, type, stock }: Props) => {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const [noteText, setNoteText] = useState("");
    const NOTE_MAX_LENGTH = 350;

    const { data: notes, isLoading } = useQuery({
        queryKey: ["notes", stock.id],
        queryFn: () => getStockNotes(stock.id),
    });

    const addNoteMutation = useMutation({
        mutationFn: (text: string) => {
            return addNote(stock.id, user!.id, text);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["notes", stock.id],
            });
        },
    });

    const handleNewNote = (e: FormEvent) => {
        e.preventDefault();

        if (noteText.length < 1) return;
        addNoteMutation.mutate(noteText);
        setNoteText("");
    };

    return (
        <div className="flex-1">
            <h2 className="text-2xl font-semibold mb-2">My notes</h2>
            <div>
                <ul className="w-full space-y-3 mb-4">
                    {isLoading ? (
                        <Skeleton active />
                    ) : notes && notes.length > 0 ? (
                        notes.map((note: TNote) => (
                            <li key={note.id}>
                                <div className="flex items-center space-x-4 rtl:space-x-reverse">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-base font-medium text-gray-900">
                                            {note.text}
                                        </p>
                                    </div>
                                    <EditNotesButton
                                        note={note}
                                        stock={stock}
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
                        <AINotesList ticker={ticker} name={name} type={type} stock={stock} />
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
