"use client";
import React from "react";
import Login from "./Login";
import useAuth from "./useAuth";

type Props = {
    children: React.ReactNode | React.ReactElement;
};

const AuthWrapper = ({ children }: Props) => {
    const user = useAuth();
    return user ? children : <Login />;
};

export default AuthWrapper;
