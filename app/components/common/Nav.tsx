"use client";
import Link from "next/link";
import React from "react";
import useAuth from "@/hooks/useAuth";
import Button from "../ui/Button";
import MenuDropdown from "../ui/MenuDropdown";
import { checkPriceTargets } from "@/lib/api";
import AppName from "./AppName";

const Nav = () => {
    const { user } = useAuth();

    const handlePriceTargetChecks = () => checkPriceTargets();

    return (
        <nav>
            <Link
                href="/"
                className="text-3xl font-bold mb-0 text-gray-900 whitespace-nowrap text-nowrap"
            >
                <AppName />
            </Link>
            <div className="flex items-center space-x-3 sm:space-x-6">
                <Button onClick={handlePriceTargetChecks}>
                    Check price targets
                </Button>
                {user ? <Link href="/">My Portfolio</Link> : null}
                <Link href="/contact">Contact</Link>
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
