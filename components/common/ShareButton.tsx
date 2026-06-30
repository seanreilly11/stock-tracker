"use client";
import Link from "next/link";
import { APP_TITLE } from "@/lib/utils/constants";

const ShareButton = () => {
  const shareLink = async () => {
    const shareData: ShareData = {
      title: APP_TITLE,
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
