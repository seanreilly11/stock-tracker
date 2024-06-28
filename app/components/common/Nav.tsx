"use client";
import Link from "next/link";
import React from "react";
import useAuth from "../../hooks/useAuth";
import { signOutUser } from "../../server/actions/auth";
import Button from "../ui/Button";
import MenuDropdown from "../ui/MenuDropdown";

const Nav = () => {
    const { user, loading } = useAuth();

    return (
        <nav>
            <Link href="/" className="text-2xl font-bold mb-0 text-gray-900">
                Bull Rush
            </Link>
            <div className="flex items-center space-x-3 sm:space-x-6">
                {user ? <Link href="/">My Portfolio</Link> : null}
                <Link href="/">Contact</Link>
                {!user ? (
                    <Link href="/login">
                        <Button text="Login" outline="outline" />
                    </Link>
                ) : (
                    <MenuDropdown />
                )}
            </div>
        </nav>
    );
};

export default Nav;
