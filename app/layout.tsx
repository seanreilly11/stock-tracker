import type { Metadata } from "next";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ReactQueryClientProvider } from "@/components/common/ReactQueryClientProvider";

export const metadata: Metadata = {
    title: "Bullrush",
    description: "Track stock intentions and keep personal notes alongside real-time data.",
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ReactQueryClientProvider>
            <html lang="en" className="h-full">
                <body className="h-full">
                    {children}
                    <SpeedInsights />
                </body>
            </html>
        </ReactQueryClientProvider>
    );
}
