"use client";
import React from "react";
import Landing from "./Landing";
import useAuth from "@/hooks/useAuth";

type Props = {
    children: React.ReactNode | React.ReactElement;
};

const AuthWrapper = ({ children }: Props) => {
    const { user, isLoggedIn } = useAuth();
    return user || isLoggedIn ? children : <Landing />;
};

export default AuthWrapper;
