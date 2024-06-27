/* eslint-disable react/no-unescaped-entities */
"use client";
import React, { useEffect, useState } from "react";
import { signIn } from "../server/actions/auth";
import useAuth from "../hooks/useAuth";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { FirebaseError } from "firebase/app";
import { redirect } from "next/navigation";
import Button from "../components/ui/Button";
import AuthLoginButtons from "../components/common/AuthLoginButtons";

type FormData = {
    name: string;
    email: string;
    password: string;
};

const Page = () => {
    const { user, loading, setLoading } = useAuth();
    const [authError, setAuthError] = useState("");
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>();
    const onSubmit = handleSubmit(async ({ email, password }) => {
        setLoading(true);
        const result = await signIn(email, password);
        console.log(result);
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
                <div className="mb-4">
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
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Password
                    </label>
                    <input
                        className={
                            "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" +
                            (errors.password?.type == "required"
                                ? " border-red-500"
                                : "")
                        }
                        type="password"
                        placeholder="********"
                        {...register("password", {
                            required: {
                                value: true,
                                message: "Please choose a password",
                            },
                        })}
                    />
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
                <div className="flex items-center justify-between">
                    <a
                        className="inline-block align-baseline font-bold text-sm text-indigo-600 hover:text-indigo-500"
                        href="#"
                    >
                        Forgot Password?
                    </a>
                    <Button text="Login" loading={loading} type="submit" />
                </div>
                <Link
                    className="inline-block mt-3 font-bold text-sm text-indigo-600 hover:text-indigo-500"
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
