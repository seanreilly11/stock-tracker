import type { Metadata } from "next";
import SessionProvider from "./components/SessionProvider";
import { getServerSession } from "next-auth";
import { Inter } from "next/font/google";
import "./globals.css";
import { ReactQueryClientProvider } from "./components/ReactQueryClientProvider";
import Nav from "./components/Nav";

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
    const session = await getServerSession();

    return (
        <ReactQueryClientProvider>
            <html lang="en">
                <body className={inter.className}>
                    <SessionProvider session={session}>
                        <main>
                            <Nav />
                            {children}
                        </main>
                    </SessionProvider>
                </body>
            </html>
        </ReactQueryClientProvider>
    );
}
