import { useState, FormEvent } from "react";
import { EllipsisOutlined } from "@ant-design/icons";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import useAuth from "@/app/hooks/useAuth";
import { getUserStock, updateStock } from "@/app/server/actions/db";
import { Stock } from "@/app/server/types";
import Button from "../ui/Button";
import { Skeleton } from "antd";

const StockNotes = ({ ticker, name }: { ticker: string; name: string }) => {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const [note, setNote] = useState("");
    const { data: savedStock, isLoading } = useQuery({
        queryKey: ["savedStocks", user?.uid, ticker],
        queryFn: () => getUserStock(ticker, user?.uid),
        staleTime: Infinity, // could be set to a minute ish to help with live but might just leave
    });
    const updateMutation = useMutation({
        mutationFn: (_stock: Partial<Stock>) => {
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
    // TODO: might make notes an object with date data as well as text. Not sure of any other data wanted
    const handleNewNote = (e: FormEvent) => {
        e.preventDefault();
        if (note.length > 0) {
            let _stock: Partial<Stock> = {
                ticker,
                name,
                notes: savedStock?.notes
                    ? [...savedStock?.notes, note]
                    : [note],
            };
            updateMutation.mutate(_stock);
            setNote("");
        }
    };

    return (
        <div className="flex-1">
            <h2 className="text-2xl mb-2">My notes</h2>
            {user ? (
                <div>
                    {isLoading ? (
                        <div className="max-w-md space-y-3 mb-4">
                            <Skeleton active paragraph={{ rows: 1 }} />
                            <Skeleton active paragraph={{ rows: 1 }} />
                            <Skeleton active paragraph={{ rows: 1 }} />
                        </div>
                    ) : savedStock?.notes?.length > 0 ? (
                        <ul className="max-w-md space-y-3 mb-4">
                            {savedStock?.notes?.map(
                                (note: string, i: number) => (
                                    <li key={i}>
                                        <div className="flex items-center space-x-4 rtl:space-x-reverse">
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-900">
                                                    {note}
                                                </p>
                                            </div>
                                            {/* <div className="inline-flex items-center text-base font-semibold text-gray-900 ">
                                                <EllipsisOutlined />
                                            </div> */}
                                        </div>
                                    </li>
                                )
                            )}
                        </ul>
                    ) : null}
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
                                    value={note}
                                    onChange={(e) =>
                                        setNote(e.currentTarget.value)
                                    }
                                    placeholder="Write a note..."
                                    required
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
