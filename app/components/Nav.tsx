"use client";
import { Button } from "antd";
import Link from "next/link";
import React from "react";
import useAuth from "./useAuth";
import { signOutUser } from "../server/actions/auth";

const Nav = () => {
    const user = useAuth();
    return (
        <nav>
            <h1 className="text-2xl font-bold mb-0">Ticker</h1>
            <div className="space-x-6">
                {user ? <Link href="/">My Portfolio</Link> : null}
                <Link href="/">Contact</Link>
                {user ? (
                    <>
                        <span>Hi {user?.email}</span>
                        <Button onClick={() => signOutUser()}>Sign out</Button>
                    </>
                ) : null}
            </div>
        </nav>
    );
};

export default Nav;
