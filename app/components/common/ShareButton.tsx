"use client";
import React from "react";
import Button from "../ui/Button";
import Link from "next/link";
import { logCustomEvent } from "@/server/firebase";

type Props = {};

const ShareButton = (props: Props) => {
    const shareLink = async () => {
        logCustomEvent("share_button_clicked");
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
