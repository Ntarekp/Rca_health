"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, ShieldCheck, Globe, Clock, Save, RotateCcw, Smartphone, Mail, AlertTriangle, AppWindow, Calendar, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';

const SettingsPage = () => {
    const { t, locale } = useLanguage();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('general');
    const [saving, setSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [settings, setSettings] = useState({
        notifications: true,
        emailAlerts: true,
        lowStockAlert: true,
        autoReorder: false,
        timezone: 'Africa/Kigali'
    });
    const [originalSettings, setOriginalSettings] = useState(settings);

    useEffect(() => {
        // Load settings from localStorage
        const savedSettings = localStorage.getItem('appSettings');
        if (savedSettings) {
            const parsed = JSON.parse(savedSettings);
            setSettings(parsed);
            setOriginalSettings(parsed);
        }
    }, []);

    const handleSettingChange = (key: string, value: boolean | string) => {
        setSettings(prev => ({ ...prev, [key]: value }));
        setSaveSuccess(false);
    };

    const handleSave = () => {
        setSaving(true);
        // Save to localStorage
        localStorage.setItem('appSettings', JSON.stringify(settings));
        setOriginalSettings(settings);
        
        setTimeout(() => {
            setSaving(false);
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
        }, 500);
    };

    const handleDiscard = () => {
        setSettings(originalSettings);
        setSaveSuccess(false);
    };

    const hasChanges = JSON.stringify(settings) !== JSON.stringify(originalSettings);

    return (
        <div className="max-w-[1200px] mx-auto pb-20">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-28px font-bold text-primary mb-2">{t('settings.title')}</h1>
                    <p className="text-13px text-text-tertiary font-medium">{t('settings.preferences')}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-10">
                {/* Left side: Navigation / Categories */}
                <div className="space-y-4">
                    <div className="bg-bg-card border border-border rounded-12 p-3 shadow-sm sticky top-24">
                        <nav className="flex flex-col gap-1">
                            <button 
                                onClick={() => setActiveTab('general')}
                                className={`flex items-center gap-3 px-4 py-3 rounded-8 text-14px font-bold text-left transition-colors ${
                                    activeTab === 'general' 
                                        ? 'bg-primary/5 text-primary border border-primary/10' 
                                        : 'text-text-secondary hover:bg-bg-primary'
                                }`}
                            >
                                <Bell size={18} />
                                <span>{t('settings.notifications')}</span>
                            </button>
                            <button 
                                onClick={() => router.push('/settings/terms')}
                                className="flex items-center justify-between gap-3 px-4 py-3 text-text-secondary hover:bg-bg-primary rounded-8 text-14px font-semibold text-left transition-colors group"
                            >
                                <div className="flex items-center gap-3">
                                    <Calendar size={18} />
                                    <span>{t('settings.termConfiguration')}</span>
                                </div>
                                <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                            </button>
                            <button 
                                onClick={() => setActiveTab('localization')}
                                className={`flex items-center gap-3 px-4 py-3 rounded-8 text-14px font-semibold text-left transition-colors ${
                                    activeTab === 'localization' 
                                        ? 'bg-primary/5 text-primary border border-primary/10' 
                                        : 'text-text-secondary hover:bg-bg-primary'
                                }`}
                            >
                                <Globe size={18} />
                                <span>{t('settings.language')}</span>
                            </button>
                        </nav>

                        <div className="mt-8 p-4 bg-primary rounded-10 text-white relative overflow-hidden">
                            <div className="relative z-10">
                                <h4 className="text-12px font-bold mb-2">{locale === 'en' ? 'System Status' : 'État du système'}</h4>
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                                    <span className="text-13px font-bold">{t('common.appName')}</span>
                                </div>
                                <div className="text-10px opacity-80 mt-2">
                                    {locale === 'en' ? 'Language' : 'Langue'}: {locale === 'en' ? 'English' : 'Français'}
                                </div>
                            </div>
                            <div className="absolute top-[-20px] right-[-20px] w-20 h-20 bg-white/10 rounded-full blur-xl" />
                        </div>
                    </div>
                </div>

                {/* Right side: Detailed Settings */}
                <div className="space-y-8">
                    {activeTab === 'general' && (
                    <>
                    {/* Notifications Section */}
                    <div className="bg-bg-card border border-border rounded-12 p-8 shadow-sm">
                        <div className="flex items-center gap-3 mb-8 border-b border-border-light pb-4">
                            <div className="p-2 bg-primary/5 rounded-6 text-primary">
                                <Bell size={20} />
                            </div>
                            <div>
                                <h3 className="text-18px font-bold text-text-primary">{t('settings.notifications')}</h3>
                                <p className="text-11px text-text-tertiary font-bold uppercase tracking-wider">{locale === 'en' ? 'Configure notification preferences' : 'Configurer les préférences de notification'}</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center justify-between group">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <Smartphone size={16} className="text-text-tertiary" />
                                        <h4 className="text-14px font-bold text-text-primary">{locale === 'en' ? 'In-App Notifications' : 'Notifications dans l\'application'}</h4>
                                    </div>
                                    <p className="text-12px text-text-secondary">{locale === 'en' ? 'Push alerts for real-time medical updates and lab results' : 'Alertes push pour les mises à jour médicales et résultats de laboratoire en temps réel'}</p>
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
                                        <h4 className="text-14px font-bold text-text-primary">{locale === 'en' ? 'Email Medical Alerts' : 'Alertes médicales par e-mail'}</h4>
                                    </div>
                                    <p className="text-12px text-text-secondary">{locale === 'en' ? 'Official health summaries and parent communication emails' : 'Résumés de santé officiels et e-mails de communication aux parents'}</p>
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
                                        <h4 className="text-14px font-bold text-text-primary">{locale === 'en' ? 'Inventory Critical Alerts' : 'Alertes critiques d\'inventaire'}</h4>
                                    </div>
                                    <p className="text-12px text-text-secondary">{locale === 'en' ? 'Get notified instantly when essential medical supplies are low' : 'Soyez averti instantanément lorsque les fournitures médicales essentielles sont faibles'}</p>
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
                    </>
                    )}

                    {activeTab === 'localization' && (
                    <>
                    {/* Regional Section */}
                    <div className="bg-bg-card border border-border rounded-12 p-8 shadow-sm">
                        <div className="flex items-center gap-3 mb-8 border-b border-border-light pb-4">
                            <div className="p-2 bg-success/5 rounded-6 text-success">
                                <Globe size={20} />
                            </div>
                            <div>
                                <h3 className="text-18px font-bold text-text-primary">{t('settings.language')}</h3>
                                <p className="text-11px text-text-tertiary font-bold uppercase tracking-wider">{locale === 'en' ? 'Tailor the interface to your location' : 'Adaptez l\'interface à votre emplacement'}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-13px font-bold text-text-secondary flex items-center gap-2">
                                    <Globe size={14} /> {t('settings.selectLanguage')}
                                </label>
                                <div className="p-4 bg-slate-50 border-2 border-slate-200 rounded-12">
                                    <p className="text-12px text-slate-600 mb-3 font-medium">{locale === 'en' ? 'Use the language switcher in the top navigation to change the interface language.' : 'Utilisez le sélecteur de langue dans la navigation supérieure pour changer la langue de l\'interface.'}</p>
                                    <LanguageSwitcher />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="text-13px font-bold text-text-secondary flex items-center gap-2">
                                    <Clock size={14} /> {locale === 'en' ? 'System Timezone' : 'Fuseau horaire du système'}
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
                    </>
                    )}

                    {/* Footer Actions */}
                    {saveSuccess && (
                        <div className="mb-4 p-4 bg-success/10 border-2 border-success/30 rounded-12 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                            <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center">
                                <Save size={16} className="text-white" />
                            </div>
                            <div>
                                <p className="text-14px font-bold text-success">{t('messages.success.saved')}</p>
                                <p className="text-12px text-success/80">{locale === 'en' ? 'Your preferences have been updated successfully' : 'Vos préférences ont été mises à jour avec succès'}</p>
                            </div>
                        </div>
                    )}
                    <div className="flex justify-end gap-3 pt-4">
                        <button 
                            onClick={handleDiscard}
                            disabled={!hasChanges}
                            className="flex items-center gap-2 px-6 py-2.5 border border-border bg-white text-text-secondary rounded-10 text-14px font-bold hover:bg-bg-primary transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <RotateCcw size={18} className="group-hover:rotate-[-45deg] transition-transform" />
                            <span>{locale === 'en' ? 'Discard Changes' : 'Annuler les modifications'}</span>
                        </button>
                        <button 
                            onClick={handleSave}
                            disabled={!hasChanges || saving}
                            className="flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-primary to-primary-dark text-white rounded-12 text-16px font-black hover:from-primary-dark hover:to-primary hover:scale-105 transition-all shadow-xl shadow-primary/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:shadow-lg"
                        >
                            {saving ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    <span>{locale === 'en' ? 'Saving...' : 'Enregistrement...'}</span>
                                </>
                            ) : (
                                <>
                                    <Save size={18} />
                                    <span>{t('common.save')}</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
