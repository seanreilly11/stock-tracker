/* eslint-disable react/no-unescaped-entities */
"use client";
import React, { useEffect, useState } from "react";
import { signIn } from "@/server/actions/auth";
import useAuth from "@/hooks/useAuth";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { FirebaseError } from "firebase/app";
import { redirect } from "next/navigation";
import Button from "../components/ui/Button";
import AuthLoginButtons from "../components/common/AuthLoginButtons";
import AuthInput from "../components/ui/AuthInput";

type FormData = {
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
                    <AuthInput
                        type="email"
                        placeholder="Email"
                        register={register}
                        errors={errors}
                        name="email"
                        options={{
                            required: {
                                value: true,
                                message: "Please enter your email",
                            },
                        }}
                    />
                </div>
                <div className="mb-3">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Password
                    </label>
                    <AuthInput
                        type="password"
                        placeholder="********"
                        register={register}
                        name="password"
                        errors={errors}
                        options={{
                            required: {
                                value: true,
                                message: "Please enter your password",
                            },
                        }}
                    />
                    {authError === "auth/invalid-credential" ? (
                        <p className="text-red-500 text-xs italic">
                            Email and password don't match
                        </p>
                    ) : null}
                </div>
                <a
                    className={`inline-block cursor-pointer align-baseline mb-3 font-bold text-xs text-primary hover:text-primary-hover`}
                    href="/forgot-password"
                >
                    Forgot Password?
                </a>
                <Button loading={loading} type="submit" className="w-full">
                    Login
                </Button>

                <Link
                    className={`inline-block mt-3 font-bold text-xs text-primary hover:text-primary-hover`}
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
