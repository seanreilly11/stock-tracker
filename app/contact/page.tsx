/* eslint-disable react/no-unescaped-entities */
"use client";
import React, { useState } from "react";
import useAuth from "../hooks/useAuth";
import { useForm } from "react-hook-form";
import Button from "../components/ui/Button";
import { addFeedback } from "../server/actions/db";
import usePopup from "../hooks/usePopup";

type FormData = {
    name: string;
    email: string;
    message: string;
};

const Page = () => {
    const { user } = useAuth();
    const { contextHolder, messagePopup } = usePopup();
    const [loading, setLoading] = useState(false);
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormData>({
        defaultValues: { email: user?.email || "", message: "", name: "" },
    });
    const onSubmit = handleSubmit(async ({ name, email, message }) => {
        setLoading(true);
        const result = await addFeedback(name, email, message, user?.uid);
        console.log(result);
        if (result) {
            setLoading(false);
            reset();
            messagePopup("success", "Thanks! Your message has been sent.");
        }
    });

    return (
        <>
            {contextHolder}
            <div className="w-full max-w-md mx-auto">
                <form
                    className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
                    onSubmit={onSubmit}
                >
                    <div className="mb-3">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Name
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                            type="text"
                            placeholder="Name"
                            {...register("name")}
                        />
                    </div>
                    <div className="mb-3">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Email *
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
                    <div className="mb-3">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Message *
                        </label>
                        <textarea
                            className={
                                "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" +
                                (errors.message ? " border-red-500" : "")
                            }
                            rows={4}
                            placeholder="Your message"
                            {...register("message", {
                                required: {
                                    value: true,
                                    message: "Please enter your message",
                                },
                            })}
                        />
                        {errors.message ? (
                            <p className="text-red-500 text-xs italic">
                                {errors.message.message}
                            </p>
                        ) : null}
                    </div>
                    <Button loading={loading} type="submit" className="w-full">
                        Send message
                    </Button>
                </form>
            </div>
        </>
    );
};

export default Page;
