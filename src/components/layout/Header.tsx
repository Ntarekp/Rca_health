"use client";

import React from 'react';
import { Search, Bell, Settings, User, Menu } from 'lucide-react';
import LanguageSwitcher from '@/components/LanguageSwitcher';

type HeaderProps = {
    onMenuClick?: () => void;
};

const Header = ({ onMenuClick }: HeaderProps) => {
    return (
        <header className="fixed top-0 right-0 left-0 h-header bg-white/80 backdrop-blur-md border-b border-border z-40 flex items-center justify-between px-4 sm:px-6 lg:px-8 md:ml-20 lg:ml-sidebar">
            {/* Logo + Hamburger - Mobile Only */}
            <div className="md:hidden flex items-center gap-2 mr-3">
                <img
                    src="/assets/logo.png"
                    alt="RCA Logo"
                    className="w-8 h-8 object-contain"
                />
                <button
                    type="button"
                    onClick={onMenuClick}
                    className="w-9 h-9 flex items-center justify-center rounded-10 text-text-tertiary hover:bg-bg-secondary hover:text-text-primary transition-all"
                    aria-label="Open menu"
                >
                    <Menu size={20} />
                </button>
            </div>

            {/* Global Search */}
            <div className="flex-1 max-w-xl min-w-0">
                <div className="relative group">
                    <Search
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary group-focus-within:text-primary transition-colors"
                    />
                    <input
                        type="text"
                        placeholder="Quick search patients, records..."
                        className="w-full h-11 pl-10 pr-4 bg-bg-secondary/40 border border-transparent rounded-12 text-14px text-text-primary outline-none focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 transition-all"
                    />
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
                <LanguageSwitcher />
                <button className="w-10 h-10 flex items-center justify-center rounded-10 text-text-tertiary hover:bg-bg-secondary hover:text-text-primary transition-all relative">
                    <Bell size={20} />
                    <span className="absolute top-3 right-3 w-2 h-2 bg-error rounded-full border-2 border-white" />
                </button>
                <button className="w-10 h-10 flex items-center justify-center rounded-10 text-text-tertiary hover:bg-bg-secondary hover:text-text-primary transition-all">
                    <Settings size={20} />
                </button>
            </div>
        </header>
    );
};

export default Header;
