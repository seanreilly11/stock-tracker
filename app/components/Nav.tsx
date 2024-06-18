"use client";
import { Button } from "antd";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";

const Nav = () => {
    const { data: session } = useSession();
    return (
        <nav>
            <h1 className="text-2xl font-bold mb-0">Ticker</h1>
            <div className="space-x-6">
                {session ? <Link href="/">My Portfolio</Link> : null}
                <Link href="/">Contact</Link>
                {session ? (
                    <>
                        <span>Hi {session.user?.name}</span>
                        <Button onClick={() => signOut()}>Sign out</Button>
                    </>
                ) : (
                    <Button onClick={() => signIn()}>Sign in</Button>
                )}
            </div>
        </nav>
    );
};

export default Nav;
