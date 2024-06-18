"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";

const Nav = () => {
    const { data: session } = useSession();
    return (
        <nav>
            <h1 className="text-2xl font-bold mb-0">Ticker</h1>
            <div className="space-x-6">
                {session ? (
                    <>
                        <span>
                            Logged in as {session.user?.name}{" "}
                            {session.user?.uid}
                        </span>
                        <Link
                            href="#"
                            onClick={() => signOut()}
                            className="btn-signin"
                        >
                            Sign out
                        </Link>
                    </>
                ) : (
                    <Link
                        href="#"
                        onClick={() => signIn()}
                        className="btn-signin"
                    >
                        Sign in
                    </Link>
                )}
                <Link href="/">My Portfolio</Link>
                <Link href="/">Contact</Link>
            </div>
        </nav>
    );
};

export default Nav;
