"use client";
import React from "react";
import Landing from "./Landing";
import useAuth from "../../hooks/useAuth";

type Props = {
    children: React.ReactNode | React.ReactElement;
};

const AuthWrapper = ({ children }: Props) => {
    const { user } = useAuth();
    return user ? children : <Landing />;
};

export default AuthWrapper;
