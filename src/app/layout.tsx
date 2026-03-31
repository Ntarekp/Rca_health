import type { Metadata } from "next";
import "./globals.css";
import { AcademicYearProvider } from "@/context/AcademicYearContext";
import { AuthProvider } from "@/context/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";

export const metadata: Metadata = {
    title: "RCA Health System",
    description: "Student Health Monitoring System",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className="font-secondary">
                <LanguageProvider>
                    <AuthProvider>
                        <AcademicYearProvider>
                            {children}
                        </AcademicYearProvider>
                    </AuthProvider>
                </LanguageProvider>
            </body>
        </html>
    );
}
