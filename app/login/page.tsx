/* eslint-disable react/no-unescaped-entities */
"use client";
import React, { useEffect, useState } from "react";
import { resetPassword, signIn } from "../server/actions/auth";
import useAuth from "../hooks/useAuth";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { FirebaseError } from "firebase/app";
import { redirect } from "next/navigation";
import Button from "../components/ui/Button";
import AuthLoginButtons from "../components/common/AuthLoginButtons";

type FormData = {
    email: string;
    password: string;
};

const Page = () => {
    const { user, loading, setLoading } = useAuth();
    const [authError, setAuthError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>();
    const onSubmit = handleSubmit(async ({ email, password }) => {
        setLoading(true);
        const result = await signIn(email, password);
        if (result instanceof FirebaseError && result?.code) {
            setLoading(false);
            setAuthError(result.code);
        }
    });

    useEffect(() => {
        if (user) redirect("/");
    }, [user]);

    return (
        <div className="w-full max-w-xs mx-auto">
            <form
                className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
                onSubmit={onSubmit}
            >
                <div className="mb-3">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Email
                    </label>
                    <input
                        className={
                            "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" +
                            (errors.email?.type == "required"
                                ? " border-red-500"
                                : "")
                        }
                        type="email"
                        placeholder="Email"
                        {...register("email", {
                            required: {
                                value: true,
                                message: "Please enter your email",
                            },
                        })}
                    />
                    {errors.email ? (
                        <p className="text-red-500 text-xs italic">
                            {errors.email.message}
                        </p>
                    ) : null}
                </div>
                <div className="mb-3">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Password
                    </label>
                    <div className="relative">
                        <input
                            className={
                                "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" +
                                (errors.password?.type == "required"
                                    ? " border-red-500"
                                    : "")
                            }
                            type={showPassword ? "text" : "password"}
                            placeholder="********"
                            {...register("password", {
                                required: {
                                    value: true,
                                    message: "Please enter your password",
                                },
                            })}
                        />
                        <button
                            type="button"
                            className="absolute top-0 end-0 p-3.5 rounded-e-md"
                            onClick={() => setShowPassword((prev) => !prev)}
                        >
                            <svg
                                className="flex-shrink-0 size-3.5 text-gray-400 dark:text-neutral-600"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path
                                    className={
                                        showPassword ? "hidden" : "block"
                                    }
                                    d="M9.88 9.88a3 3 0 1 0 4.24 4.24"
                                ></path>
                                <path
                                    className={
                                        showPassword ? "hidden" : "block"
                                    }
                                    d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"
                                ></path>
                                <path
                                    className={
                                        showPassword ? "hidden" : "block"
                                    }
                                    d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"
                                ></path>
                                <line
                                    className={
                                        showPassword ? "hidden" : "block"
                                    }
                                    x1="2"
                                    x2="22"
                                    y1="2"
                                    y2="22"
                                ></line>
                                <path
                                    className={
                                        showPassword ? "block" : "hidden"
                                    }
                                    d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"
                                ></path>
                                <circle
                                    className={
                                        showPassword ? "block" : "hidden"
                                    }
                                    cx="12"
                                    cy="12"
                                    r="3"
                                ></circle>
                            </svg>
                        </button>
                    </div>
                    {errors.password ? (
                        <p className="text-red-500 text-xs italic">
                            {errors.password.message}
                        </p>
                    ) : null}
                    {authError === "auth/invalid-credential" ? (
                        <p className="text-red-500 text-xs italic">
                            Email and password don't match
                        </p>
                    ) : null}
                </div>
                <a
                    className="inline-block cursor-pointer align-baseline mb-3 font-bold text-xs text-indigo-600 hover:text-indigo-500"
                    href="/forgot-password"
                >
                    Forgot Password?
                </a>
                <Button loading={loading} type="submit" className="w-full">
                    Login
                </Button>

                <Link
                    className="inline-block mt-3 font-bold text-xs text-indigo-600 hover:text-indigo-500"
                    href="/register"
                >
                    Don't have an account? Register here
                </Link>
                <AuthLoginButtons />
            </form>
        </div>
    );
};

export default Page;
