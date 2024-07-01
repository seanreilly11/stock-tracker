import useAuth from "@/app/hooks/useAuth";
import { EllipsisOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import Button from "../ui/Button";

const RemoveStockButton = () => {
    const { user } = useAuth();
    const [showDropdown, setShowDropdown] = useState(false);

    return (
        <div className="relative">
            <Button
                className="font-bold"
                fontSize="text-3xl"
                padding="px-2 py-.5"
                outline="link"
                id="dropdownOptionsButton"
                onClick={() => setShowDropdown((prev) => !prev)}
            >
                <span className="sr-only">Open options menu</span>
                <EllipsisOutlined />
            </Button>
            {showDropdown ? (
                <>
                    <div className="z-20 absolute right-0 top-7 rounded-lg shadow w-44 bg-gray-700 divide-gray-600">
                        <ul
                            className="py-2 text-sm  text-gray-200"
                            aria-labelledby="dropdownOptionsButton"
                        >
                            <li>
                                <a
                                    href="#"
                                    className="block px-4 py-2  hover:bg-gray-600 hover:text-white"
                                >
                                    Holding
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="block px-4 py-2  hover:bg-gray-600 hover:text-white"
                                >
                                    Remove stock
                                </a>
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

export default RemoveStockButton;
