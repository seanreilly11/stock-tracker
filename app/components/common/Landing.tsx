import Link from "next/link";
import React from "react";
import Button from "../ui/Button";

type Props = {};

const Landing = (props: Props) => {
    return (
        <div>
            {/* <h1>Welcome to Ticker!!</h1>
            <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
            >
                Register
            </button>
            <button
                className="bg-transparent hover:bg-blue-700 border border-blue-500 hover:border-transparent text-blue-700 hover:text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
            >
                Login
            </button> */}
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
                    <div className="mt-10 flex items-center justify-center gap-x-6">
                        <Link href="/register">
                            <Button text="Register" />
                        </Link>
                        <Link
                            href="/login"
                            className="text-sm font-semibold leading-6 text-gray-900"
                        >
                            Login
                        </Link>
                        {/* <Button text="Login" outline /> */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Landing;
