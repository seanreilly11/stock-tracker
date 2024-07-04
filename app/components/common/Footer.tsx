import Link from "next/link";
import React from "react";

const Footer = () => {
    return (
        <footer className="bg-white w-full py-8 mt-6">
            <main className="py-0">
                <div className="flex items-end space-x-3 align-baseline">
                    <Link
                        href="/"
                        className="text-xl font-bold leading-6 mb-0 text-gray-900 whitespace-nowrap text-nowrap"
                    >
                        <span className="text-indigo-600">bull</span>
                        <span className="text-emerald-500">rush</span>
                    </Link>
                    <p className="text-sm leading-6 text-gray-500 align-baseline">
                        {"\u00A9"} 2024 Sean Reilly
                    </p>
                    <Link href="/contact">Contact</Link>
                </div>
            </main>
        </footer>
    );
};

export default Footer;
