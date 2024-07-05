/* eslint-disable react/no-unescaped-entities */
"use client";
import React, { useEffect, useState } from "react";
import { resetPassword } from "@/server/actions/auth";
import useAuth from "@/hooks/useAuth";
import { useForm } from "react-hook-form";
import Link from "next/link";
import Button from "../components/ui/Button";

type FormData = {
    email: string;
};

const Page = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);
    const [time, setTime] = useState(60);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>();
    const onSubmit = handleSubmit(({ email }) => {
        if (!email) return;

        setLoading(true);
        resetPassword(email).then(() => {
            setEmailSent(true);
            setTime(60);
        });
        setLoading(false);
    });

    // useEffect(() => {
    //     if (emailSent) {
    //         let timer = setInterval(() => {
    //             setTime((time) => {
    //                 if (time === 0) {
    //                     clearInterval(timer);
    //                     return 0;
    //                 } else return time - 1;
    //             });
    //         }, 1000);
    //     }
    // }, [emailSent]);

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
                            (errors.email ? " border-red-500" : "")
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
                {/* {emailSent ? (
                    <p className="mb-2 text-sm">
                        You can resend the reset email in {time} seconds
                    </p>
                ) : null} */}
                {emailSent && time > 0 ? (
                    <Link href="/login">
                        <Button type="button" className="w-full">
                            Go back to login page
                        </Button>
                    </Link>
                ) : (
                    <Button loading={loading} type="submit" className="w-full">
                        Send reset email
                    </Button>
                )}
                {emailSent ? (
                    <div className="mt-3">
                        <p className="mb-2 text-sm">
                            A password reset email has been sent to the email
                            that you provided.
                        </p>
                        <p className="mb-2 text-sm">
                            Please find this email and reset your password using
                            the link.
                        </p>
                        <p className="text-sm">
                            If you can't find the email, be sure to check your
                            spam folder.
                        </p>
                    </div>
                ) : null}
            </form>
        </div>
    );
};

export default Page;
