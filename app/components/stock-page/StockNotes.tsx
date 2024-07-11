import { useState, FormEvent } from "react";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import useAuth from "@/hooks/useAuth";
import { getUserStock, updateStock } from "@/server/actions/db";
import { TStock, TNote } from "@/utils/types";
import Button from "../ui/Button";
import { Skeleton } from "antd";
import EditNotesButton from "./EditNotesButton";
import AINotesList from "./AINotesList";
import EmptyState from "../common/EmptyState";

const StockNotes = ({ ticker, name }: { ticker: string; name: string }) => {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const [noteText, setNoteText] = useState("");
    const { data: savedStock, isLoading } = useQuery({
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
            queryClient.invalidateQueries({
                queryKey: ["savedStocks", user?.uid],
            });
        },
    });

    const handleNewNote = (e: FormEvent) => {
        e.preventDefault();
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
            {user ? (
                <div>
                    {isLoading ? (
                        <div className="space-y-3 mb-4">
                            <Skeleton active paragraph={{ rows: 1 }} />
                            <Skeleton active paragraph={{ rows: 1 }} />
                            <Skeleton active paragraph={{ rows: 1 }} />
                        </div>
                    ) : savedStock?.notes?.length > 0 ? (
                        <ul className="w-full space-y-3 mb-4">
                            {savedStock?.notes?.map((note: TNote) => (
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
                            ))}
                            {/* <AINotesList ticker={ticker} name={name} /> */}
                        </ul>
                    ) : (
                        <>
                            <EmptyState page="Notes" />
                            <ul className="space-y-3 mb-4 mt-4">
                                {/* <AINotesList ticker={ticker} name={name} /> */}
                            </ul>
                        </>
                    )}
                    {/* <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn m-1">
                        Click
                    </div>
                    <ul
                        tabIndex={0}
                        className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
                    >
                        <li>
                            <a>Item 1</a>
                        </li>
                        <li>
                            <a>Item 2</a>
                        </li>
                    </ul>
                </div> */}
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
                                    maxLength={350}
                                ></textarea>
                            </div>
                            <div className="flex items-center justify-between px-3 py-2 border-t border-gray-600">
                                <Button type="submit">Add note</Button>
                            </div>
                        </div>
                    </form>
                </div>
            ) : (
                <p>You must be logged in to make notes about a stock.</p>
            )}
        </div>
    );
};

export default StockNotes;
