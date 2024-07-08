import { DeleteOutlined, EllipsisOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import Button from "../ui/Button";
import { TNote } from "@/utils/types";

type Props = {
    note: TNote;
};

const EditNotesButton = ({ note }: Props) => {
    const [showDropdown, setShowDropdown] = useState(false);

    const handleDelete = () => {
        console.log("Delete");
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
