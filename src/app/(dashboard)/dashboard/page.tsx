"use client";

import { useState, useEffect } from 'react';
import { Plus, Users, Calendar, AlertTriangle, Activity, UserPlus, FileText } from 'lucide-react';
import { useRouter } from 'next/navigation';
import StatsCard from '@/features/dashboard/StatsCard';
import ChartsSection from '@/features/dashboard/ChartsSection';
import AppointmentsTable from '@/features/dashboard/AppointmentsTable';
import RecentConsultations from '@/features/dashboard/RecentConsultations';
import { apiUrl } from '@/utils/api';

export default function DashboardPage() {
    const router = useRouter();
    const [stats, setStats] = useState({
        totalStudents: 0,
        appointmentsToday: 0,
        criticalAlerts: 0,
        consultationsThisMonth: 0,
        recentConsultations: [],
        todaysAppointments: [],
        dispositionStats: [],
        monthlyStats: [],
        totalDispositions: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Append a timestamp to completely bypass aggressive Next.js/Browser GET caching
                const response = await fetch(`${apiUrl('/api/dashboard/stats')}?t=${new Date().getTime()}`);
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
        return <div>Loading dashboard...</div>;
    }

    return (
        <div className="space-y-8 pb-10">
            {/* Page Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-14px text-text-tertiary font-normal mb-1">Good morning, Nurse</h2>
                    <h1 className="text-24px font-semibold text-primary">Student Health Dashboard</h1>
                    <p className="text-12px text-text-tertiary">Overview of student health and consultations</p>
                </div>

                <div className="flex flex-wrap gap-3">
                    <button
                        onClick={() => router.push('/consultations/new')}
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-5 hover:bg-primary-dark transition-colors"
                    >
                        <Plus size={16} />
                        <span className="text-14px font-medium">New Consultation</span>
                    </button>
                    <button
                        onClick={() => router.push('/students/new')}
                        className="flex items-center gap-2 px-4 py-2 bg-white text-primary rounded-5 border border-border hover:bg-gray-50 transition-colors"
                    >
                        <UserPlus size={16} />
                        <span className="text-14px font-medium">Register Student</span>
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white text-text-secondary rounded-5 border border-border hover:bg-gray-50 transition-colors">
                        <FileText size={16} />
                        <span className="text-14px font-medium">Reports</span>
                    </button>
                </div>
            </div>


            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                <StatsCard
                    title="Total Students"
                    value={stats.totalStudents.toLocaleString()}
                    trend={0} // Placeholder
                    trendDirection="up"
                    variant="primary"
                    icon={<Users size={20} />}
                />
                <StatsCard
                    title="Appointments Today"
                    value={stats.appointmentsToday.toLocaleString()}
                    trend={0} // Placeholder
                    trendDirection="up"
                    variant="default"
                    icon={<Calendar size={20} />}
                />
                <StatsCard
                    title="Critical Alerts"
                    value={stats.criticalAlerts.toLocaleString()}
                    trend={0} // Placeholder
                    trendDirection="down"
                    variant="default"
                    icon={<AlertTriangle size={20} className="text-error" />}
                />
                <StatsCard
                    title="Consultations This Month"
                    value={stats.consultationsThisMonth.toLocaleString()}
                    trend={0} // Placeholder
                    trendDirection="up"
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
