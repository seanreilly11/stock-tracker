"use client";
import { Space, Typography } from "antd";
import Link from "next/link";
import React from "react";

const Nav = () => {
    return (
        <nav>
            <h1 className="text-2xl font-bold mb-0">Ticker</h1>
            <Space size={"large"}>
                <Link href="/">My Portfolio</Link>
                <Link href="/">Contact</Link>
            </Space>
        </nav>
    );
};

export default Nav;
