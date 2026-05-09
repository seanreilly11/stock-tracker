import type { Metadata } from "next";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { APP_TITLE } from "@/lib/utils/constants";

export const metadata: Metadata = {
  title: APP_TITLE,
  description:
    "Track stock intentions and keep personal notes alongside real-time data.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full">
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
