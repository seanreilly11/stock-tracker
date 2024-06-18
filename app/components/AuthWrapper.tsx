"use client";
import { useSession } from "next-auth/react";
import React from "react";
import Login from "./Login";

type Props = {
    children: React.ReactNode | React.ReactElement;
};

const AuthWrapper = ({ children }: Props) => {
    const { data: session } = useSession();
    return session ? children : <Login />;
};

export default AuthWrapper;
