import Link from "next/link";
import React from "react";

const Nav = () => {
    return (
        <nav>
            <h1 className="text-2xl font-bold mb-0">Ticker</h1>
            <div className="space-x-6">
                <Link href="/">My Portfolio</Link>
                <Link href="/">Contact</Link>
            </div>
        </nav>
    );
};

export default Nav;
