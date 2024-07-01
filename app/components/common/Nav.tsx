"use client";
import Link from "next/link";
import React from "react";
import useAuth from "../../hooks/useAuth";
import Button from "../ui/Button";
import MenuDropdown from "../ui/MenuDropdown";

const Nav = () => {
    const { user } = useAuth();

    return (
        <nav>
            <Link
                href="/"
                className="text-3xl font-bold mb-0 text-gray-900 whitespace-nowrap text-nowrap"
            >
                <span className="text-indigo-600">bull</span>
                <span className="text-emerald-500">rush</span>
            </Link>
            <div className="flex items-center space-x-3 sm:space-x-6">
                {user ? <Link href="/">My Portfolio</Link> : null}
                <Link href="/">Contact</Link>
                {user ? (
                    <MenuDropdown />
                ) : (
                    <Link href="/login">
                        <Button outline="outline">Login</Button>
                    </Link>
                )}
            </div>
        </nav>
    );
};

export default Nav;
