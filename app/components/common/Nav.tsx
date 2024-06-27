"use client";
import Link from "next/link";
import React from "react";
import useAuth from "../../hooks/useAuth";
import { signOutUser } from "../../server/actions/auth";
import Button from "../ui/Button";

const Nav = () => {
    const { user, loading } = useAuth();

    return (
        <nav>
            <Link href="/" className="text-2xl font-bold mb-0 text-gray-900">
                Bull Rush
            </Link>
            <div className="space-x-6">
                {user ? <Link href="/">My Portfolio</Link> : null}
                <Link href="/">Contact</Link>
                {user ? (
                    <>
                        <span>Hi {user?.displayName || user?.email}</span>
                        <Button
                            text="Sign out"
                            loading={loading}
                            onClick={() => signOutUser()}
                            outline="link"
                        />
                    </>
                ) : (
                    <Link href="/login">
                        <Button text="Login" outline="outline" />
                    </Link>
                )}
            </div>
        </nav>
    );
};

export default Nav;
