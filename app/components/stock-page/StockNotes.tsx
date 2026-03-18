"use client";
import { useState, FormEvent } from "react";
import { TStock, TNote } from "@/lib/schemas/stocks/stock.schema";
import { updateStockAction } from "@/lib/actions/stocks";
import Button from "../ui/Button";
import EditNotesButton from "./EditNotesButton";
import AINotesList from "./AINotesList";
import EmptyState from "../common/EmptyState";
import { logCustomEvent } from "@/lib/firebase";
import { timeSince } from "@/utils/helpers";
import { NOTE_MAX_LENGTH } from "@/utils/constants";

type Props = {
    ticker: string;
    name: string | undefined;
    type: string | undefined;
    savedStock: TStock | null;
};

const StockNotes = ({ ticker, name = "", type = "", savedStock }: Props) => {
    const [noteText, setNoteText] = useState("");
    const notesList =
        savedStock?.notes?.toSorted((a, b) => b.createdAt - a.createdAt) || [];

    const handleNewNote = async (e: FormEvent) => {
        e.preventDefault();
        logCustomEvent("add_personal_note", { ticker });

        if (noteText.length < 1) return;
        const _note: TNote = {
            id: crypto.randomUUID(),
            text: noteText,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        };
        const _stock: Partial<TStock> = {
            ticker,
            name,
            notes: savedStock?.notes ? [...savedStock.notes, _note] : [_note],
        };
        setNoteText("");
        await updateStockAction(_stock, ticker);
    };

    return (
        <div className="flex-1">
            <h2 className="text-2xl font-semibold mb-2">My plan</h2>
            <div>
                <ul className="w-full space-y-3 mb-4">
                    {notesList?.length > 0 ? (
                        notesList?.map((note: TNote) => (
                            <li key={note.id}>
                                <div className="grid grid-cols-12">
                                    <div className="pr-2 pt-1 text-xs text-gray-400">
                                        <span
                                            title={new Date(
                                                note.createdAt,
                                            ).toLocaleString("en-au")}
                                        >
                                            {timeSince(+note.createdAt)}
                                        </span>
                                    </div>
                                    <div className="min-w-0 col-span-10">
                                        <p className="text-base font-medium text-gray-900">
                                            {note.text}
                                        </p>
                                    </div>
                                    <div className="justify-self-end">
                                        <EditNotesButton
                                            note={note}
                                            ticker={ticker}
                                        />
                                    </div>
                                </div>
                            </li>
                        ))
                    ) : (
                        <div className="pb-1">
                            <EmptyState page="Notes" />
                        </div>
                    )}
                </ul>
                <AINotesList
                    ticker={ticker}
                    name={name}
                    type={type}
                    savedStock={savedStock}
                />

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
                                placeholder={`What do you think about ${ticker}?`}
                                required
                                maxLength={NOTE_MAX_LENGTH}
                            ></textarea>
                        </div>
                        <div className="flex items-center justify-between px-3 py-2 border-t border-gray-600">
                            <Button type="submit" disabled={!noteText.length}>
                                Add note
                            </Button>
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
