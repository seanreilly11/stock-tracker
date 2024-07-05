"use client";
import React, { useEffect, useState } from "react";
import { signUp } from "@/server/actions/auth";
import useAuth from "@/hooks/useAuth";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { FirebaseError } from "firebase/app";
import { redirect } from "next/navigation";
import Button from "../components/ui/Button";
import AuthLoginButtons from "../components/common/AuthLoginButtons";
import AuthInput from "../components/ui/AuthInput";

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
    const onSubmit = handleSubmit(async ({ email, password, name }) => {
        setLoading(true);
        const result = await signUp(email, password, name);
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
                        Name
                    </label>
                    <AuthInput
                        type="text"
                        placeholder="Name"
                        register={register}
                        name="name"
                        options={{
                            required: {
                                value: true,
                                message: "Please enter your name",
                            },
                        }}
                        errors={errors}
                    />
                </div>
                <div className="mb-3">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Email
                    </label>
                    <AuthInput
                        type="email"
                        placeholder="Email"
                        register={register}
                        name="email"
                        options={{
                            required: {
                                value: true,
                                message: "Please enter your email",
                            },
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: "Invalid email address",
                            },
                        }}
                        errors={errors}
                    />
                    {authError === "auth/email-already-in-use" ? (
                        <p className="text-red-500 text-xs italic">
                            Email already in use
                        </p>
                    ) : null}
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
                        options={{
                            required: {
                                value: true,
                                message: "Please choose a password",
                            },
                            minLength: {
                                value: 6,
                                message:
                                    "Password should be at least 6 characters",
                            },
                        }}
                        errors={errors}
                    />
                </div>
                <Button loading={loading} type="submit" className="w-full">
                    Register
                </Button>
                <Link
                    className="inline-block mt-3 font-bold text-xs text-indigo-600 hover:text-indigo-500"
                    href="/login"
                >
                    Already have an account? Login here
                </Link>
                <AuthLoginButtons />
            </form>
        </div>
    );
};

export default Page;
