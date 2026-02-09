import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

export const metadata: Metadata = {
    title: "RCA Student Health System",
    description: "Ensuring wellness and professional health management for our academic community.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className="font-secondary">
                {children}
            </body>
        </html>
    );
}
