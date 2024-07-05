import Link from "next/link";
import React from "react";

const Footer = () => {
    return (
        <footer className="bg-white w-full py-8 mt-6">
            <main className="py-0">
                <div className="space-x-3">
                    <Link
                        href="/"
                        className="text-xl font-bold mb-0 text-gray-900 whitespace-nowrap text-nowrap"
                    >
                        <span className="text-indigo-600">bull</span>
                        <span className="text-emerald-500">rush</span>
                    </Link>
                    <Link
                        href="https://www.linkedin.com/in/sean-reilly-nz"
                        target="_blank"
                        referrerPolicy="no-referrer"
                        className="text-sm text-gray-500 align-baseline"
                    >
                        {"\u00A9"} 2024 Sean Reilly
                    </Link>
                    <Link href="/contact">Contact</Link>
                </div>
            </main>
        </footer>
    );
};

export default Footer;
