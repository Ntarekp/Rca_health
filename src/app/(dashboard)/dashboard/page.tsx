"use client";

import { useState, useEffect } from 'react';
import { Plus, Users, Calendar, AlertTriangle, Activity, UserPlus, FileText } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import StatsCard from '@/features/dashboard/StatsCard';
import ChartsSection from '@/features/dashboard/ChartsSection';
import AppointmentsTable from '@/features/dashboard/AppointmentsTable';
import RecentConsultations from '@/features/dashboard/RecentConsultations';
import { apiUrl, authenticatedFetch } from '@/utils/api';

export default function DashboardPage() {
    const router = useRouter();
    const { t, locale } = useLanguage();
    const [stats, setStats] = useState({
        totalStudents: 0,
        appointmentsToday: 0,
        criticalAlerts: 0,
        consultationsThisMonth: 0,
        recentConsultations: [],
        todaysAppointments: [],
        dispositionStats: [],
        monthlyStats: [],
        totalDispositions: 0,
        totalStudentsTrend: 0,
        appointmentsTodayTrend: 0,
        criticalAlertsTrend: 0,
        consultationsThisMonthTrend: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Append a timestamp to completely bypass aggressive Next.js/Browser GET caching
                const response = await authenticatedFetch(`/api/dashboard/stats?t=${new Date().getTime()}`);
                if (response.ok) {
                    const data = await response.json();
                    setStats(data);
                }
            } catch (error) {
                console.error('Error fetching dashboard stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center space-y-3">
                    <Activity className="animate-pulse mx-auto text-primary" size={40} />
                    <p className="text-14px font-medium text-slate-600">{t('common.loading')}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-10">
            {/* Page Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-14px text-text-tertiary font-normal mb-1">{locale === 'en' ? 'Good morning, Nurse' : 'Bonjour, Infirmière'}</h2>
                    <h1 className="text-24px font-semibold text-primary">{t('dashboard.title')}</h1>
                    <p className="text-12px text-text-tertiary">{t('dashboard.overview')}</p>
                </div>

                <div className="flex flex-wrap gap-3">
                    <LanguageSwitcher />
                    <button
                        onClick={() => router.push('/consultations/new')}
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-5 hover:bg-primary-dark transition-colors"
                    >
                        <Plus size={16} />
                        <span className="text-14px font-medium">{locale === 'en' ? 'New Consultation' : 'Nouvelle consultation'}</span>
                    </button>
                    <button
                        onClick={() => router.push('/students/new')}
                        className="flex items-center gap-2 px-4 py-2 bg-white text-primary rounded-5 border border-border hover:bg-gray-50 transition-colors"
                    >
                        <UserPlus size={16} />
                        <span className="text-14px font-medium">{locale === 'en' ? 'Register Student' : 'Inscrire un étudiant'}</span>
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white text-text-secondary rounded-5 border border-border hover:bg-gray-50 transition-colors">
                        <FileText size={16} />
                        <span className="text-14px font-medium">{t('navigation.reports')}</span>
                    </button>
                </div>
            </div>


            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                <StatsCard
                    title={t('dashboard.totalStudents')}
                    value={stats.totalStudents.toLocaleString()}
                    trend={Math.abs(stats.totalStudentsTrend)}
                    trendDirection={stats.totalStudentsTrend >= 0 ? "up" : "down"}
                    variant="primary"
                    icon={<Users size={20} />}
                />
                <StatsCard
                    title={locale === 'en' ? 'Appointments Today' : 'Rendez-vous aujourd\'hui'}
                    value={stats.appointmentsToday.toLocaleString()}
                    trend={Math.abs(stats.appointmentsTodayTrend)}
                    trendDirection={stats.appointmentsTodayTrend >= 0 ? "up" : "down"}
                    variant="default"
                    icon={<Calendar size={20} />}
                />
                <StatsCard
                    title={locale === 'en' ? 'Critical Alerts' : 'Alertes critiques'}
                    value={stats.criticalAlerts.toLocaleString()}
                    trend={Math.abs(stats.criticalAlertsTrend)}
                    trendDirection={stats.criticalAlertsTrend >= 0 ? "up" : "down"}
                    variant="default"
                    icon={<AlertTriangle size={20} className="text-error" />}
                />
                <StatsCard
                    title={locale === 'en' ? 'Consultations This Month' : 'Consultations ce mois'}
                    value={stats.consultationsThisMonth.toLocaleString()}
                    trend={Math.abs(stats.consultationsThisMonthTrend)}
                    trendDirection={stats.consultationsThisMonthTrend >= 0 ? "up" : "down"}
                    variant="default"
                    icon={<Activity size={20} />}
                />
            </div>

            {/* Charts Section */}
            <ChartsSection
                monthlyData={stats.monthlyStats}
                dispositionData={stats.dispositionStats}
                totalDispositions={stats.totalDispositions}
            />

            {/* Appointments Table & Recent Consultations */}
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                <div className="xl:col-span-3">
                    <AppointmentsTable data={stats.todaysAppointments} />
                </div>
                <div className="xl:col-span-1">
                    <RecentConsultations data={stats.recentConsultations} />
                </div>
            </div>
        </div>
    );
}
