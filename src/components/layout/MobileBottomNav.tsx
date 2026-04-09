"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Users,
    ClipboardList,
    FileText,
    Settings,
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const MobileBottomNav = () => {
    const pathname = usePathname();
    const { t } = useLanguage();

    const navItems = [
        { name: t('navigation.dashboard'), icon: LayoutDashboard, path: '/dashboard' },
        { name: t('navigation.students'), icon: Users, path: '/students' },
        { name: t('navigation.visits'), icon: ClipboardList, path: '/consultations' },
        { name: t('navigation.reports'), icon: FileText, path: '/reports' },
        { name: t('navigation.settings'), icon: Settings, path: '/settings' },
    ];

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-bg-card border-t border-border z-50 safe-area-bottom">
            <div className="flex items-center justify-around px-2 py-2">
                {navItems.map((item) => {
                    const isActive = pathname.startsWith(item.path);
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.path}
                            href={item.path}
                            className={`flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-10 min-w-[60px] transition-all duration-200 ${
                                isActive
                                    ? 'bg-primary text-white shadow-md shadow-primary/20'
                                    : 'text-text-tertiary hover:text-primary hover:bg-primary/5'
                            }`}
                        >
                            <Icon
                                size={20}
                                className={`${isActive ? 'text-white' : 'text-text-tertiary'} transition-colors`}
                            />
                            <span className={`text-9px font-bold uppercase tracking-wide ${isActive ? 'text-white' : 'text-text-tertiary'}`}>
                                {item.name.length > 8 ? item.name.substring(0, 7) + '...' : item.name}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
};

export default MobileBottomNav;
