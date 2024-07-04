import Link from "next/link";
import React, { useEffect, useState } from "react";
import Button from "../ui/Button";
import LoaderFullscreen from "./LoaderFullscreen";

type Props = {};

const Landing = (props: Props) => {
    const [showLoader, setShowLoader] = useState(true);

    useEffect(() => {
        let timer = setTimeout(() => setShowLoader(false), 1500);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div>
            {showLoader ? <LoaderFullscreen /> : null}
            <div className="mx-auto max-w-2xl py-24">
                {/* <div className="hidden sm:mb-8 sm:flex sm:justify-center">
                    <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
                        Announcing our next round of funding.{" "}
                        <a href="#" className="font-semibold text-indigo-600">
                            <span
                                className="absolute inset-0"
                                aria-hidden="true"
                            ></span>
                            Read more <span aria-hidden="true">→</span>
                        </a>
                    </div>
                </div> */}
                <div className="text-center">
                    <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                        Keep track of your stocks how you want
                    </h1>
                    <p className="mt-6 text-lg leading-8 text-gray-600">
                        Watch your favourite stocks climb or fall to your target
                        prices with up-to-date stock prices alongside personal
                        notes and important news articles keeping you up to date
                        on these&nbsp;stocks.
                    </p>
                    <div className="mt-10 flex items-center justify-center gap-x-2">
                        <Link href="/register">
                            <Button>Register</Button>
                        </Link>
                        <Link href="/login">
                            <Button outline="outline">Login</Button>
                        </Link>
                        {/* className="text-sm font-semibold leading-6 text-gray-900" */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Landing;
