import Link from "next/link";
import React from "react";
import ShareButton from "./ShareButton";
import AppName from "./AppName";
import { APP_NAME } from "@/utils/constants";

const Footer = () => {
    return (
        <footer className="w-full py-8 mt-6">
            <main className="py-0">
                <div className="flex flex-col gap-y-4">
                    <div>
                        <h3 className="text-gray-900 font-semibold text-sm mb-1">
                            Disclaimer:
                        </h3>
                        <p className="text-gray-600 text-xs leading-5">
                            The information provided on this website and within
                            the InvestPrep app is for informational and
                            educational purposes only and does not constitute
                            financial, investment, or trading advice. All
                            content, including stock prices, news, analysis, and
                            user-generated notes, is provided “as is” without
                            any warranties of accuracy, completeness, or
                            timeliness. You are solely responsible for your own
                            investment decisions, and you should always conduct
                            your own research or consult a licensed financial
                            advisor before making any investment. Past
                            performance is not indicative of future results.
                            InvestPrep, its creators, and affiliates are not
                            liable for any losses or damages arising from the
                            use of this&nbsp;platform.
                        </p>
                    </div>
                    <div className="space-x-3">
                        <Link
                            href="/"
                            className="text-xl font-bold mb-0 text-gray-900 whitespace-nowrap text-nowrap"
                        >
                            <AppName />
                        </Link>
                        <span className="text-sm text-gray-500 align-baseline">
                            {"\u00A9"} 2024 {APP_NAME}
                        </span>
                        {/* <Link
                            href="https://www.linkedin.com/in/sean-reilly-nz"
                            target="_blank"
                            referrerPolicy="no-referrer"
                            className="text-sm text-gray-500 align-baseline"
                        >
                            {"\u00A9"} 2024 Sean&nbsp;Reilly
                        </Link> */}
                        <Link href="/contact">Contact</Link>
                        <ShareButton />
                    </div>
                </div>
            </main>
        </footer>
    );
};

export default Footer;
