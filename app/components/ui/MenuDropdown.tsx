import React, { useState } from "react";
import useAuth from "@/hooks/useAuth";
import { signOutUser } from "@/server/actions/auth";
import { UserOutlined } from "@ant-design/icons";

const MenuDropdown = () => {
    const { user } = useAuth();
    const [showDropdown, setShowDropdown] = useState(false);

    return (
        <div className="relative">
            <button
                id="dropdownUserAvatarButton"
                className="flex rounded-md md:me-0 p-2 -mr-1 sm:mr-0 sm:p-1"
                type="button"
                onClick={() => setShowDropdown((prev) => !prev)}
            >
                <span className="sr-only">Open user menu</span>
                <UserOutlined />
            </button>
            {showDropdown ? (
                <>
                    <div className="z-20 absolute right-0 top-7 divide-y rounded-lg shadow w-44 bg-gray-700 divide-gray-600">
                        <div className="px-4 py-3 text-sm text-white">
                            <div>{user?.displayName || "Signed in as:"}</div>
                            <div className="font-medium truncate">
                                {user?.email}
                            </div>
                        </div>
                        {/* <ul
                            className="py-2 text-sm text-gray-700 dark:text-gray-200"
                            aria-labelledby="dropdownUserAvatarButton"
                        >
                            <li>
                                <a
                                    href="#"
                                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                >
                                    Dashboard
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                >
                                    Settings
                                </a>
                            </li>
                        </ul> */}
                        <div className="py-2">
                            <a
                                className="block cursor-pointer px-4 py-2 text-sm hover:bg-gray-600 text-gray-200 hover:text-white"
                                onClick={() => signOutUser()}
                            >
                                Sign out
                            </a>
                        </div>
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

export default MenuDropdown;
