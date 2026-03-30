"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Users,
    ClipboardList,
    BarChart2,
    FileText,
    FlaskConical,
    Settings,
    Package,
    ChevronRight,
    Calendar
} from 'lucide-react';
import { useAcademicYear } from '@/context/AcademicYearContext';

type SidebarProps = {
    isOpen?: boolean;
    onClose?: () => void;
};

const Sidebar = ({ isOpen = false, onClose }: SidebarProps) => {
    const pathname = usePathname();
    const { academicYears, selectedYearId, setSelectedYearId } = useAcademicYear();

    const menuItems = [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
        { name: 'Students', icon: Users, path: '/students' },
        { name: 'Consultations', icon: ClipboardList, path: '/consultations' },
        { name: 'Inventory', icon: Package, path: '/inventory' },
        { name: 'Reports', icon: FileText, path: '/reports' },
        { name: 'Lab & History', icon: FlaskConical, path: '/lab' },
        { name: 'Settings', icon: Settings, path: '/settings' },
    ];

    return (
        <>
            <div
                className={`fixed inset-0 bg-black/30 z-40 transition-opacity lg:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            />

            <aside
                className={`fixed left-0 top-0 h-screen w-sidebar bg-bg-sidebar border-r border-border z-50 flex flex-col transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:block`}
            >
            {/* Branding Section */}
            <div className="p-6 border-b border-border/50 bg-bg-sidebar">
                <div className="flex items-center gap-3 mb-6">
                    <img
                        src="/assets/logo.png"
                        alt="RCA Logo"
                        className="w-9 h-9 object-contain hover:scale-105 transition-transform duration-300"
                    />
                    <div className="flex flex-col -space-y-0.5">
                        <span className="text-12px font-bold text-text-primary tracking-tight leading-tight">Rwanda Coding</span>
                        <span className="text-10px font-bold text-text-tertiary tracking-wide uppercase">Academy</span>
                    </div>
                </div>

                {/* Academic Year Context Switcher */}
                <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-primary pointer-events-none">
                        <Calendar size={14} />
                    </div>
                    <select
                        value={selectedYearId}
                        onChange={(e) => setSelectedYearId(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-white border border-border rounded-8 text-12px font-bold text-text-primary outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all appearance-none cursor-pointer shadow-sm"
                    >
                        <option value="">All Years</option>
                        {academicYears.length === 0 && <option disabled>Loading...</option>}
                        {academicYears.map(year => (
                            <option key={year.id} value={year.id}>{year.name}</option>
                        ))}
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-tertiary">
                        <ChevronRight size={12} className="rotate-90" />
                    </div>
                </div>
            </div>

            <nav className="flex-1 px-4 py-6 overflow-y-auto custom-scrollbar">
                <div className="space-y-1.5">
                    {menuItems.map((item) => {
                        const isActive = pathname.startsWith(item.path);
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.path}
                                href={item.path}
                                onClick={onClose}
                                className={`flex items-center gap-3 px-4 py-3 rounded-12 text-14px font-semibold transition-all duration-200 group relative ${isActive
                                    ? 'bg-primary text-white shadow-md shadow-primary/20'
                                    : 'text-text-secondary hover:bg-primary/5 hover:text-primary'
                                    }`}
                            >
                                <Icon
                                    size={20}
                                    className={`${isActive ? 'text-white' : 'text-text-tertiary group-hover:text-primary'} transition-colors`}
                                />
                                <span className="flex-1">{item.name}</span>
                                {isActive && (
                                    <div className="absolute right-2 w-1.5 h-1.5 rounded-full bg-white/40" />
                                )}
                            </Link>
                        );
                    })}
                </div>
            </nav>

            {/* Bottom Section: Status & Profile */}
            <div className="p-4 mt-auto border-t border-border/50 space-y-4 bg-bg-sidebar">
                {/* Clinic Status */}
                <div className="bg-primary/5 border border-primary/10 rounded-12 p-3 relative overflow-hidden group">
                    <div className="relative z-10 flex items-center justify-between">
                        <div>
                            <p className="text-10px font-bold text-primary uppercase tracking-widest mb-0.5">Clinic Status</p>
                            <div className="flex items-center gap-1.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                                <span className="text-12px font-bold text-text-primary italic">Active duty</span>
                            </div>
                        </div>
                    </div>
                    <div className="absolute -right-4 -bottom-4 w-12 h-12 bg-primary/5 rounded-full blur-xl" />
                </div>

                {/* Nurse Profile */}
                <div className="flex items-center gap-3 p-2 rounded-12 hover:bg-bg-secondary transition-all cursor-pointer group">
                    <div className="w-10 h-10 bg-primary/10 rounded-full border border-primary/20 flex items-center justify-center text-primary font-bold shadow-sm group-hover:bg-primary group-hover:text-white transition-all">
                        <span className="text-14px">NK</span>
                    </div>
                    <div className="flex flex-col min-w-0">
                        <p className="text-13px font-bold text-text-primary truncate leading-tight transition-colors group-hover:text-primary">Nurse Kwishima</p>
                        <p className="text-11px font-medium text-text-tertiary">Head Nurse</p>
                    </div>
                </div>
            </div>
            </aside>
        </>
    );
};

export default Sidebar;
