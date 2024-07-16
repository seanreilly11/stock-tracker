import React, { useState } from "react";
import { DeleteOutlined, EllipsisOutlined } from "@ant-design/icons";
import Button from "../ui/Button";
import { TNote, TStock } from "@/utils/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateStock } from "@/server/actions/db";
import useAuth from "@/hooks/useAuth";
import useFetchUserStock from "@/hooks/useFetchUserStock";

type Props = {
    note: TNote;
    ticker: string;
};

const EditNotesButton = ({ note, ticker }: Props) => {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const [showDropdown, setShowDropdown] = useState(false);
    const { data: savedStock } = useFetchUserStock(ticker);

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

    const handleDelete = () => {
        let _stock: Partial<TStock> = {
            notes: savedStock?.notes.filter(
                (_note: TNote) => _note.id !== note.id
            ),
        };
        updateMutation.mutate(_stock);
    };

    return (
        <div className="relative">
            <div className="inline-flex items-center text-base font-semibold text-gray-900 ">
                <Button
                    className="font-bold"
                    fontSize="text-xl"
                    padding="px-1 py-.25"
                    outline="link"
                    id="dropdownOptionsButton"
                    onClick={() => setShowDropdown((prev) => !prev)}
                >
                    <span className="sr-only">Open options menu</span>
                    <EllipsisOutlined />
                </Button>
            </div>
            {showDropdown ? (
                <>
                    <div className="z-20 absolute right-0 top-7 rounded-lg shadow w-44 bg-gray-700 divide-gray-600">
                        <ul
                            className="py-2 text-sm  text-gray-200"
                            aria-labelledby="dropdownOptionsButton"
                        >
                            {/* <li
                                onClick={handleEdit}
                                className="block px-4 py-2 hover:bg-gray-600 hover:text-white cursor-pointer"
                            >
                                <div className="flex space-x-3">
                                    <EditOutlined className="text-lg" />
                                    <span>Edit note</span>
                                </div>
                            </li> */}
                            <li
                                onClick={handleDelete}
                                className="block px-4 py-2 hover:bg-gray-600 hover:text-white cursor-pointer"
                            >
                                <div className="flex space-x-3">
                                    <DeleteOutlined className="text-lg" />
                                    <span>Delete note</span>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div
                        className="fixed top-0 left-0 w-full h-full bg-transparent cursor-pointer z-10"
                        onClick={() => setShowDropdown(false)}
                    ></div>
                </>
            ) : null}
        </div>
    );
};

export default EditNotesButton;
