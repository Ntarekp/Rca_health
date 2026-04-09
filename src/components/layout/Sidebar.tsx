"use client";

import React, { useState, useEffect } from 'react';
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
import { useLanguage } from '@/contexts/LanguageContext';

const Sidebar = () => {
    const pathname = usePathname();
    const { academicYears, selectedYearId, setSelectedYearId } = useAcademicYear();
    const { t, locale } = useLanguage();
    
    const [userData, setUserData] = useState({
        name: 'System Administrator',
        role: 'ADMIN',
        initials: 'SA'
    });

    useEffect(() => {
        // TODO: Fetch actual user data from authentication context or API
        // For now, using placeholder that can be replaced with real user data
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
            try {
                const user = JSON.parse(storedUser);
                setUserData({
                    name: user.name || 'Nurse',
                    role: user.role || 'Healthcare Provider',
                    initials: user.name ? user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) : 'N'
                });
            } catch (e) {
                console.error('Error parsing user data:', e);
            }
        }
    }, []);

    const menuItems = [
        { name: t('navigation.dashboard'), icon: LayoutDashboard, path: '/dashboard' },
        { name: t('navigation.students'), icon: Users, path: '/students' },
        { name: t('navigation.visits'), icon: ClipboardList, path: '/consultations' },
        { name: locale === 'en' ? 'Inventory' : 'Inventaire', icon: Package, path: '/inventory' },
        { name: t('navigation.reports'), icon: FileText, path: '/reports' },
        { name: t('navigation.lab'), icon: FlaskConical, path: '/lab' },
        { name: t('navigation.settings'), icon: Settings, path: '/settings' },
    ];

    return (
        <>
            {/* Desktop & Tablet Sidebar - Icon-only on md, Full on lg+ */}
            <aside
                className={`hidden md:flex fixed left-0 top-0 h-screen md:w-20 lg:w-sidebar bg-bg-sidebar border-r border-border z-50 flex-col transition-all duration-300 ease-in-out`}
            >
            {/* Branding Section */}
            <div className="p-6 border-b border-border/50 bg-bg-sidebar md:p-4 lg:p-6">
                <div className="flex items-center gap-3 mb-6 md:justify-center lg:justify-start md:mb-4 lg:mb-6">
                    <img
                        src="/assets/logo.png"
                        alt="RCA Logo"
                        className="w-9 h-9 object-contain hover:scale-105 transition-transform duration-300"
                    />
                    <div className="flex flex-col -space-y-0.5 md:hidden lg:flex">
                        <span className="text-12px font-bold text-text-primary tracking-tight leading-tight">Rwanda Coding</span>
                        <span className="text-10px font-bold text-text-tertiary tracking-wide uppercase">Academy</span>
                    </div>
                </div>

                {/* Academic Year Context Switcher - Hidden on md (icon-only mode) */}
                <div className="relative md:hidden lg:block">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-primary pointer-events-none">
                        <Calendar size={14} />
                    </div>
                    <select
                        value={selectedYearId}
                        onChange={(e) => setSelectedYearId(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-white border border-border rounded-8 text-12px font-bold text-text-primary outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all appearance-none cursor-pointer shadow-sm"
                    >
                        <option value="">{locale === 'en' ? 'All Years' : 'Toutes les années'}</option>
                        {academicYears.length === 0 && <option disabled>{t('common.loading')}</option>}
                        {academicYears.map(year => (
                            <option key={year.id} value={year.id}>{year.name}</option>
                        ))}
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-tertiary">
                        <ChevronRight size={12} className="rotate-90" />
                    </div>
                </div>
            </div>

            <nav className="flex-1 px-4 py-6 overflow-y-auto custom-scrollbar md:px-2 lg:px-4">
                <div className="space-y-1.5">
                    {menuItems.map((item) => {
                        const isActive = pathname.startsWith(item.path);
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.path}
                                href={item.path}
                                onClick={onClose}
                                className={`flex items-center gap-3 px-4 py-3 rounded-12 text-14px font-semibold transition-all duration-200 group relative md:justify-center lg:justify-start md:px-3 lg:px-4 ${isActive
                                    ? 'bg-primary text-white shadow-md shadow-primary/20'
                                    : 'text-text-secondary hover:bg-primary/5 hover:text-primary'
                                    }`}
                                title={item.name}
                            >
                                <Icon
                                    size={20}
                                    className={`${isActive ? 'text-white' : 'text-text-tertiary group-hover:text-primary'} transition-colors md:mx-auto lg:mx-0`}
                                />
                                <span className="flex-1 md:hidden lg:block">{item.name}</span>
                                {isActive && (
                                    <div className="absolute right-2 w-1.5 h-1.5 rounded-full bg-white/40 md:hidden lg:block" />
                                )}
                            </Link>
                        );
                    })}
                </div>
            </nav>

            {/* Bottom Section: User Profile Only */}
            <div className="mt-auto p-4 border-t border-border/50 bg-bg-sidebar md:p-2 lg:p-4">
                {/* User Profile */}
                <div className="bg-bg-card border border-border rounded-10 p-3 hover:border-primary/30 transition-all cursor-pointer group md:p-2 lg:p-3">
                    <div className="flex items-center gap-3 md:flex-col md:gap-2 lg:flex-row lg:gap-3">
                        <div className="w-11 h-11 bg-gradient-to-br from-primary to-primary-dark rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white font-bold group-hover:scale-105 transition-transform md:w-10 md:h-10 lg:w-11 lg:h-11">
                            <span className="text-15px md:text-13px lg:text-15px">{userData.initials}</span>
                        </div>
                        <div className="flex flex-col min-w-0 flex-1 md:hidden lg:flex">
                            <p className="text-14px font-bold text-text-primary truncate leading-tight mb-0.5">{userData.name}</p>
                            <div className="flex items-center gap-1.5">
                                <span className="px-2 py-0.5 bg-primary/10 text-primary text-9px font-black uppercase tracking-wider rounded-4 border border-primary/20">{userData.role}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            </aside>

            {/* Mobile Full Sidebar Overlay */}
            <aside
                className={`md:hidden fixed left-0 top-0 h-screen w-sidebar bg-bg-sidebar border-r border-border z-50 flex flex-col transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
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
                        <option value="">{locale === 'en' ? 'All Years' : 'Toutes les années'}</option>
                        {academicYears.length === 0 && <option disabled>{t('common.loading')}</option>}
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

            {/* Bottom Section: User Profile Only */}
            <div className="mt-auto p-4 border-t border-border/50 bg-bg-sidebar">
                {/* User Profile */}
                <div className="bg-bg-card border border-border rounded-10 p-3 hover:border-primary/30 transition-all cursor-pointer group">
                    <div className="flex items-center gap-3">
                        <div className="w-11 h-11 bg-gradient-to-br from-primary to-primary-dark rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white font-bold group-hover:scale-105 transition-transform">
                            <span className="text-15px">{userData.initials}</span>
                        </div>
                        <div className="flex flex-col min-w-0 flex-1">
                            <p className="text-14px font-bold text-text-primary truncate leading-tight mb-0.5">{userData.name}</p>
                            <div className="flex items-center gap-1.5">
                                <span className="px-2 py-0.5 bg-primary/10 text-primary text-9px font-black uppercase tracking-wider rounded-4 border border-primary/20">{userData.role}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            </aside>
        </>
    );
};

export default Sidebar;
