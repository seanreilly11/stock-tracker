import Link from "next/link";
import React from "react";
import ShareButton from "./ShareButton";

const Footer = () => {
    return (
        <footer className="bg-white w-full py-8 mt-6">
            <main className="py-0">
                <div className="flex flex-col sm:flex-row gap-x-8">
                    <div className="mb-4 sm:mb-0 sm:order-2 flex-1">
                        <h3 className="text-gray-900 font-semibold text-sm">
                            Disclaimer:
                        </h3>
                        <p className="text-gray-900 text-sm text-justify">
                            The information provided on this website is for
                            informational and note-taking purposes only and
                            should not be construed as financial advice. We do
                            not guarantee the accuracy, completeness, or
                            reliability of any data presented. Any financial
                            decisions made based on the information from this
                            website are done at your own risk. Always consult
                            with a qualified financial advisor before making any
                            investment&nbsp;decisions.
                        </p>
                    </div>
                    <div className="space-x-3 flex-1">
                        <Link
                            href="/"
                            className="text-xl font-bold mb-0 text-gray-900 whitespace-nowrap text-nowrap"
                        >
                            <span className="text-primary">bull</span>
                            <span className="text-emerald-500">rush</span>
                        </Link>
                        <Link
                            href="https://www.linkedin.com/in/sean-reilly-nz"
                            target="_blank"
                            referrerPolicy="no-referrer"
                            className="text-sm text-gray-500 align-baseline"
                        >
                            {"\u00A9"} 2024 Sean&nbsp;Reilly
                        </Link>
                        <Link href="/contact">Contact</Link>
                        <ShareButton />
                    </div>
                </div>
            </main>
        </footer>
    );
};

export default Footer;
