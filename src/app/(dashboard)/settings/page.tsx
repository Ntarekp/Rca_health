"use client";

import React, { useState } from 'react';
import { Bell, ShieldCheck, Globe, Clock, Save, RotateCcw, Smartphone, Mail, AlertTriangle, AppWindow } from 'lucide-react';

const SettingsPage = () => {
    const [settings, setSettings] = useState({
        notifications: true,
        emailAlerts: true,
        lowStockAlert: true,
        autoReorder: false,
        language: 'en',
        timezone: 'Africa/Kigali'
    });

    const handleSettingChange = (key: string, value: boolean | string) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    return (
        <div className="max-w-[1000px] mx-auto pb-20">
            <div className="mb-10">
                <h1 className="text-28px font-bold text-primary mb-2">System Configuration</h1>
                <p className="text-13px text-text-tertiary font-medium">Manage your application parameters, security preferences and accessibility</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-10">
                {/* Left side: Navigation / Categories */}
                <div className="space-y-4">
                    <div className="bg-bg-card border border-border rounded-12 p-3 shadow-sm sticky top-24">
                        <nav className="flex flex-col gap-1">
                            <button className="flex items-center gap-3 px-4 py-3 bg-primary/5 text-primary rounded-8 text-14px font-bold text-left border border-primary/10">
                                <Bell size={18} />
                                <span>General & Notifications</span>
                            </button>
                            <button className="flex items-center gap-3 px-4 py-3 text-text-secondary hover:bg-bg-primary rounded-8 text-14px font-semibold text-left transition-colors">
                                <ShieldCheck size={18} />
                                <span>Security & Privacy</span>
                            </button>
                            <button className="flex items-center gap-3 px-4 py-3 text-text-secondary hover:bg-bg-primary rounded-8 text-14px font-semibold text-left transition-colors">
                                <Globe size={18} />
                                <span>Localization</span>
                            </button>
                            <button className="flex items-center gap-3 px-4 py-3 text-text-secondary hover:bg-bg-primary rounded-8 text-14px font-semibold text-left transition-colors">
                                <AppWindow size={18} />
                                <span>System Logs</span>
                            </button>
                        </nav>

                        <div className="mt-8 p-4 bg-primary rounded-10 text-white relative overflow-hidden">
                            <div className="relative z-10">
                                <h4 className="text-12px font-bold mb-2">System Status</h4>
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                                    <span className="text-13px font-bold">All services online</span>
                                </div>
                                <button className="w-full py-1.5 bg-white/20 hover:bg-white/30 rounded-6 text-11px font-bold transition-colors">
                                    Check for Updates
                                </button>
                            </div>
                            <div className="absolute top-[-20px] right-[-20px] w-20 h-20 bg-white/10 rounded-full blur-xl" />
                        </div>
                    </div>
                </div>

                {/* Right side: Detailed Settings */}
                <div className="space-y-8">
                    {/* Notifications Section */}
                    <div className="bg-bg-card border border-border rounded-12 p-8 shadow-sm">
                        <div className="flex items-center gap-3 mb-8 border-b border-border-light pb-4">
                            <div className="p-2 bg-primary/5 rounded-6 text-primary">
                                <Bell size={20} />
                            </div>
                            <div>
                                <h3 className="text-18px font-bold text-text-primary">Communication Settings</h3>
                                <p className="text-11px text-text-tertiary font-bold uppercase tracking-wider">Configure how the system reaches you</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center justify-between group">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <Smartphone size={16} className="text-text-tertiary" />
                                        <h4 className="text-14px font-bold text-text-primary">In-App Notifications</h4>
                                    </div>
                                    <p className="text-12px text-text-secondary">Push alerts for real-time medical updates and lab results</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={settings.notifications}
                                        onChange={(e) => handleSettingChange('notifications', e.target.checked)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                </label>
                            </div>

                            <div className="flex items-center justify-between group">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <Mail size={16} className="text-text-tertiary" />
                                        <h4 className="text-14px font-bold text-text-primary">Email Medical Alerts</h4>
                                    </div>
                                    <p className="text-12px text-text-secondary">Official health summaries and parent communication emails</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={settings.emailAlerts}
                                        onChange={(e) => handleSettingChange('emailAlerts', e.target.checked)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                </label>
                            </div>

                            <div className="flex items-center justify-between group">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <AlertTriangle size={16} className="text-text-tertiary" />
                                        <h4 className="text-14px font-bold text-text-primary">Inventory Critical Alerts</h4>
                                    </div>
                                    <p className="text-12px text-text-secondary">Get notified instantly when essential medical supplies are low</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={settings.lowStockAlert}
                                        onChange={(e) => handleSettingChange('lowStockAlert', e.target.checked)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Regional Section */}
                    <div className="bg-bg-card border border-border rounded-12 p-8 shadow-sm">
                        <div className="flex items-center gap-3 mb-8 border-b border-border-light pb-4">
                            <div className="p-2 bg-success/5 rounded-6 text-success">
                                <Globe size={20} />
                            </div>
                            <div>
                                <h3 className="text-18px font-bold text-text-primary">Language & Region</h3>
                                <p className="text-11px text-text-tertiary font-bold uppercase tracking-wider">Tailor the interface to your location</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-13px font-bold text-text-secondary flex items-center gap-2">
                                    <Globe size={14} /> Interface Language
                                </label>
                                <select
                                    className="w-full px-4 py-2 bg-bg-secondary border border-border rounded-8 text-14px font-bold text-text-primary outline-none focus:border-primary transition-all appearance-none cursor-pointer"
                                    value={settings.language}
                                    onChange={(e) => handleSettingChange('language', e.target.value)}
                                >
                                    <option value="en">English (Official)</option>
                                    <option value="rw">Kinyarwanda</option>
                                    <option value="fr">Français</option>
                                </select>
                            </div>
                            <div className="space-y-3">
                                <label className="text-13px font-bold text-text-secondary flex items-center gap-2">
                                    <Clock size={14} /> System Timezone
                                </label>
                                <select
                                    className="w-full px-4 py-2 bg-bg-secondary border border-border rounded-8 text-14px font-bold text-text-primary outline-none focus:border-primary transition-all appearance-none cursor-pointer"
                                    value={settings.timezone}
                                    onChange={(e) => handleSettingChange('timezone', e.target.value)}
                                >
                                    <option value="Africa/Kigali">Africa/Kigali (GMT+2)</option>
                                    <option value="UTC">UTC (GMT+0)</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex justify-end gap-3 pt-4">
                        <button className="flex items-center gap-2 px-6 py-2.5 border border-border bg-white text-text-secondary rounded-10 text-14px font-bold hover:bg-bg-primary transition-all group">
                            <RotateCcw size={18} className="group-hover:rotate-[-45deg] transition-transform" />
                            <span>Discard Changes</span>
                        </button>
                        <button className="flex items-center gap-2 px-8 py-2.5 bg-primary text-white rounded-10 text-14px font-bold hover:bg-primary-dark transition-all shadow-lg shadow-primary/20">
                            <Save size={18} />
                            <span>Sync Configuration</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
