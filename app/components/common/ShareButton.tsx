"use client";
import React from "react";
import Button from "../ui/Button";
import Link from "next/link";

type Props = {};

const ShareButton = (props: Props) => {
    const shareLink = async () => {
        const shareData: ShareData = {
            title: "Bullrush",
            text: "Track stocks how you want to",
            url: "https://stock-tracker-ruddy.vercel.app",
        };
        try {
            await navigator.share(shareData);
        } catch (err) {
            console.log(err);
        }
    };
    return (
        <Link href="" onClick={shareLink}>
            Share
        </Link>
    );
};

export default ShareButton;
