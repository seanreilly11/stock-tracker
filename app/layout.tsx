import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ReactQueryClientProvider } from "./components/common/ReactQueryClientProvider";
import Nav from "./components/common/Nav";
import Footer from "./components/common/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Bullrush",
    description: "App to track stock intentions",
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ReactQueryClientProvider>
            <html lang="en" className="h-full overflow-hidden">
                <body className={inter.className + " h-full"}>
                    <div className="flex flex-col h-full justify-between">
                        <main>
                            <Nav />
                            {children}
                        </main>
                        <Footer />
                    </div>
                    <SpeedInsights />
                </body>
            </html>
        </ReactQueryClientProvider>
    );
}
