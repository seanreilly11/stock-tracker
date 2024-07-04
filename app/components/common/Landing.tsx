import Link from "next/link";
import React, { useEffect, useState } from "react";
import Button from "../ui/Button";
import Spinner from "../ui/Spinner";

type Props = {};

const Landing = (props: Props) => {
    const [showLoader, setShowLoader] = useState(true);

    useEffect(() => {
        let timer = setTimeout(() => setShowLoader(false), 2000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div>
            {showLoader ? (
                <div className="fixed w-full h-full top-0 left-0 bg-white flex items-center justify-center">
                    <Spinner size={5} colour="indigo-600" />
                </div>
            ) : null}
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
                        Anim aute id magna aliqua ad ad non deserunt sunt. Qui
                        irure qui lorem cupidatat commodo. Elit sunt amet fugiat
                        veniam occaecat fugiat aliqua.
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
