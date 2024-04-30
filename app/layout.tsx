import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ReactQueryClientProvider } from "./components/ReactQueryClientProvider";
import Nav from "./components/Nav";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Stock Tracker",
    description: "App to track stock intentions",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ReactQueryClientProvider>
            <html lang="en">
                <body className={inter.className}>
                    <main>
                        <section className="wrapper">
                            <Nav />
                            {children}
                        </section>
                    </main>
                </body>
            </html>
        </ReactQueryClientProvider>
    );
}
