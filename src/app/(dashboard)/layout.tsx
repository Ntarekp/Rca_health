"use client";

import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { AcademicYearProvider } from "@/context/AcademicYearContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import React, { useState } from 'react';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <ProtectedRoute>
            <AcademicYearProvider>
                <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
                <div className="flex-1 flex flex-col min-h-screen">
                    <Header onMenuClick={() => setSidebarOpen(true)} />
                    <main className="flex-1 p-4 sm:p-6 lg:p-8 mt-header transition-all duration-300 overflow-x-hidden lg:ml-sidebar">
                        <div className="max-w-[1600px] mx-auto">
                            {children}
                        </div>
                    </main>
                </div>
            </AcademicYearProvider>
        </ProtectedRoute>
    );
}
