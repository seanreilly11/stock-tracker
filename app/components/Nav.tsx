"use client";
import { Space, Typography } from "antd";
import Link from "next/link";
import React from "react";

const Nav = () => {
    return (
        <nav>
            <Typography.Title>Ticker</Typography.Title>
            <Space size={"large"}>
                <Link href="/">My Portfolio</Link>
                <Link href="/">Contact</Link>
            </Space>
        </nav>
    );
};

export default Nav;
