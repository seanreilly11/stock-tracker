import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ReactQueryClientProvider } from "./components/common/ReactQueryClientProvider";
import Nav from "./components/common/Nav";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Stock Tracker",
    description: "App to track stock intentions",
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ReactQueryClientProvider>
            <html lang="en" className="h-full">
                <body className={inter.className + " h-full"}>
                    <main>
                        <Nav />
                        {children}
                    </main>
                </body>
            </html>
        </ReactQueryClientProvider>
    );
}
