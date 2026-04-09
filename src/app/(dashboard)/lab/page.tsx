"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LayoutGrid, List as ListIcon, Search, Plus, Filter, FlaskConical, AlertCircle, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { authenticatedFetch } from '@/utils/api';

const LabPage = () => {
    const router = useRouter();
    const { t, locale } = useLanguage();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('ALL');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [records, setRecords] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ pending: 0, inProgress: 0, completed: 0, total: 0 });

    useEffect(() => {
        const fetchLabs = async () => {
            try {
                const response = await authenticatedFetch('/api/labs');
                if (response.ok) {
                    const data = await response.json();
                    const mappedData = data.map((item: any) => ({
                        id: item.labId,
                        student: item.studentName || 'Unknown Student',
                        studentId: item.studentId,
                        studentCode: item.studentCode || 'N/A',
                        testName: item.testName,
                        testCategory: item.testCategory || 'General',
                        date: item.testDate ? new Date(item.testDate).toLocaleDateString() : 'N/A',
                        time: item.testDate ? new Date(item.testDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
                        resultDate: item.resultDate ? new Date(item.resultDate).toLocaleDateString() : null,
                        result: item.resultValue || 'Pending',
                        referenceRange: item.referenceRange,
                        unit: item.unit,
                        technician: item.technicianName || 'Not Assigned',
                        status: item.status || 'PENDING',
                        priority: item.priority || 'ROUTINE',
                        clinicalNotes: item.clinicalNotes,
                        technicianRemarks: item.technicianRemarks
                    }));
                    setRecords(mappedData);
                    
                    // Calculate stats
                    const pending = mappedData.filter((r: any) => r.status === 'PENDING').length;
                    const inProgress = mappedData.filter((r: any) => r.status === 'IN_PROGRESS').length;
                    const completed = mappedData.filter((r: any) => r.status === 'COMPLETED').length;
                    setStats({ pending, inProgress, completed, total: mappedData.length });
                }
            } catch (error) {
                console.error('Error fetching labs:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchLabs();
    }, []);

    const filteredRecords = records.filter(record => {
        const matchesSearch = 
            record.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
            record.testName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            record.studentCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
            record.result.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesStatus = statusFilter === 'ALL' || record.status === statusFilter;
        
        return matchesSearch && matchesStatus;
    });

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'COMPLETED': return 'bg-success/10 text-success border border-success/20';
            case 'IN_PROGRESS': return 'bg-primary/10 text-primary border border-primary/20';
            case 'PENDING': return 'bg-warning/10 text-warning border border-warning/20';
            case 'CANCELLED': return 'bg-danger/10 text-danger border border-danger/20';
            default: return 'bg-slate-100 text-slate-600 border border-slate-200';
        }
    };

    const getPriorityBadge = (priority: string) => {
        switch (priority) {
            case 'STAT': return 'bg-danger text-white';
            case 'URGENT': return 'bg-warning text-white';
            case 'ROUTINE': return 'bg-slate-500 text-white';
            default: return 'bg-slate-400 text-white';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'COMPLETED': return <CheckCircle size={16} className="text-success" />;
            case 'IN_PROGRESS': return <Clock size={16} className="text-primary" />;
            case 'PENDING': return <AlertCircle size={16} className="text-warning" />;
            case 'CANCELLED': return <XCircle size={16} className="text-danger" />;
            default: return <FlaskConical size={16} className="text-slate-400" />;
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center space-y-3">
                    <FlaskConical className="animate-pulse mx-auto text-primary" size={40} />
                    <p className="text-14px font-medium text-slate-600">{t('lab.loading')}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white border border-slate-200 rounded-12 p-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-11px font-bold text-slate-500 uppercase">{t('lab.totalTests')}</span>
                        <FlaskConical size={18} className="text-slate-400" />
                    </div>
                    <p className="text-28px font-extrabold text-slate-900">{stats.total}</p>
                </div>
                <div className="bg-gradient-to-br from-warning/5 to-warning/10 border border-warning/20 rounded-12 p-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-11px font-bold text-warning uppercase">{t('lab.pending')}</span>
                        <AlertCircle size={18} className="text-warning" />
                    </div>
                    <p className="text-28px font-extrabold text-warning">{stats.pending}</p>
                </div>
                <div className="bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 rounded-12 p-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-11px font-bold text-primary uppercase">{t('lab.inProgress')}</span>
                        <Clock size={18} className="text-primary" />
                    </div>
                    <p className="text-28px font-extrabold text-primary">{stats.inProgress}</p>
                </div>
                <div className="bg-gradient-to-br from-success/5 to-success/10 border border-success/20 rounded-12 p-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-11px font-bold text-success uppercase">{t('lab.completed')}</span>
                        <CheckCircle size={18} className="text-success" />
                    </div>
                    <p className="text-28px font-extrabold text-success">{stats.completed}</p>
                </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-24px font-semibold text-primary mb-1">{t('lab.title')}</h1>
                        <p className="text-12px text-text-tertiary">{t('lab.subtitle')}</p>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" size={18} />
                        <input
                            type="text"
                            placeholder={locale === 'en' ? 'Search by student name, test name, or student code...' : 'Rechercher par nom d\'étudiant, nom du test ou code étudiant...'}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-bg-card border border-border rounded-8 pl-10 pr-4 py-2 text-12px focus:ring-1 focus:ring-primary outline-none w-full sm:w-auto sm:min-w-[240px]"
                        />
                    </div>

                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" size={18} />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="bg-bg-card border border-border rounded-8 pl-10 pr-4 py-2 text-12px focus:ring-1 focus:ring-primary outline-none appearance-none cursor-pointer"
                        >
                            <option value="ALL">{locale === 'en' ? 'All Status' : 'Tous les statuts'}</option>
                            <option value="PENDING">{t('lab.status.pending')}</option>
                            <option value="IN_PROGRESS">{t('lab.status.inProgress')}</option>
                            <option value="COMPLETED">{t('lab.status.completed')}</option>
                            <option value="CANCELLED">{t('lab.status.cancelled')}</option>
                        </select>
                    </div>

                    <div className="flex bg-bg-secondary rounded-lg p-1 h-[40px] items-center border border-border">
                        <button
                            className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-primary' : 'text-text-tertiary hover:text-text-secondary'}`}
                            onClick={() => setViewMode('grid')}
                        >
                            <LayoutGrid size={18} />
                        </button>
                        <button
                            className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-primary' : 'text-text-tertiary hover:text-text-secondary'}`}
                            onClick={() => setViewMode('list')}
                        >
                            <ListIcon size={18} />
                        </button>
                    </div>

                    <button
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-5 hover:bg-primary-dark transition-colors"
                        onClick={() => router.push('/lab/new')}
                    >
                        <Plus size={18} />
                        <span className="text-14px font-medium">{t('lab.newLabRequest')}</span>
                    </button>
                </div>
            </div>

            {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredRecords.map((record) => {
                        const statusBadge = getStatusBadge(record.status);
                        return (
                            <div key={record.id} className="bg-white border-2 border-slate-200 rounded-16 p-5 flex flex-col gap-4 hover:shadow-lg hover:border-primary/30 transition-all">
                                <div className="flex justify-between items-start gap-3">
                                    <div className="flex-1">
                                        <h3 className="text-16px font-bold text-slate-900">{record.student}</h3>
                                        <p className="text-11px text-slate-500 font-medium">{record.studentCode}</p>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <span className={`px-2.5 py-1 rounded-full text-9px font-bold uppercase ${getPriorityBadge(record.priority)}`}>
                                            {record.priority}
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-10 border border-primary/10">
                                        <FlaskConical size={18} className="text-primary flex-shrink-0" />
                                        <div className="flex-1">
                                            <p className="text-9px text-primary/70 font-bold uppercase mb-0.5">{t('lab.testName')}</p>
                                            <p className="text-13px font-bold text-primary">{record.testName}</p>
                                            <p className="text-10px text-primary/60 font-medium mt-0.5">{record.testCategory}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-9px text-slate-500 uppercase tracking-wider font-bold">{t('lab.result')}</span>
                                            <span className="text-13px font-bold text-slate-900">{record.result}</span>
                                            {record.unit && <span className="text-10px text-slate-500">{record.unit}</span>}
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <span className="text-9px text-slate-500 uppercase tracking-wider font-bold">{t('lab.technician')}</span>
                                            <span className="text-13px font-semibold text-slate-700">{record.technician}</span>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                                        <div className="flex items-center gap-2">
                                            {getStatusIcon(record.status)}
                                            <span className={`px-2.5 py-1 rounded-full text-9px font-bold uppercase ${getStatusBadge(record.status)}`}>
                                                {record.status.replace('_', ' ')}
                                            </span>
                                        </div>
                                        <span className="text-11px text-slate-500 font-medium">{record.date} {record.time}</span>
                                    </div>
                                </div>

                                <div className="flex gap-2 mt-auto">
                                    <button
                                        className="flex-1 py-2.5 bg-primary text-white rounded-10 text-12px font-bold hover:bg-primary-dark transition-colors shadow-sm"
                                        onClick={() => router.push(`/lab/${record.id}`)}
                                    >
                                        View Details
                                    </button>
                                    <button 
                                        className="flex-1 py-2.5 border-2 border-slate-300 text-slate-700 rounded-10 text-12px font-bold hover:bg-slate-50 transition-colors"
                                        onClick={() => router.push(`/lab/${record.id}/edit`)}
                                    >
                                        Edit Result
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="bg-bg-card border border-border rounded-10 overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gradient-to-r from-slate-50 to-slate-100 border-b-2 border-slate-200">
                                    <th className="px-6 py-4 text-11px font-bold text-slate-700 uppercase tracking-wider text-left">Student</th>
                                    <th className="px-6 py-4 text-11px font-bold text-slate-700 uppercase tracking-wider text-left">Test Name</th>
                                    <th className="px-6 py-4 text-11px font-bold text-slate-700 uppercase tracking-wider text-left">Result</th>
                                    <th className="px-6 py-4 text-11px font-bold text-slate-700 uppercase tracking-wider text-left">Technician</th>
                                    <th className="px-6 py-4 text-11px font-bold text-slate-700 uppercase tracking-wider text-left">Priority</th>
                                    <th className="px-6 py-4 text-11px font-bold text-slate-700 uppercase tracking-wider text-center">Status</th>
                                    <th className="px-6 py-4 text-11px font-bold text-slate-700 uppercase tracking-wider text-left">Date</th>
                                    <th className="px-6 py-4 text-11px font-bold text-slate-700 uppercase tracking-wider text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border-light">
                                {filteredRecords.map((record) => {
                                    const statusBadge = getStatusBadge(record.status);
                                    return (
                                        <tr key={record.id} className="hover:bg-slate-50/50 transition-colors border-b border-slate-100">
                                            <td className="px-6 py-4">
                                                <div>
                                                    <p className="text-13px font-bold text-slate-900">{record.student}</p>
                                                    <p className="text-10px text-slate-500 font-medium">{record.studentCode}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div>
                                                    <p className="text-12px font-bold text-slate-800">{record.testName}</p>
                                                    <p className="text-10px text-slate-500">{record.testCategory}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div>
                                                    <p className="text-12px font-bold text-slate-900">{record.result}</p>
                                                    {record.unit && <p className="text-10px text-slate-500">{record.unit}</p>}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-12px font-medium text-slate-700">{record.technician}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2.5 py-1 rounded-full text-9px font-bold uppercase ${getPriorityBadge(record.priority)}`}>
                                                    {record.priority}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    {getStatusIcon(record.status)}
                                                    <span className={`px-2.5 py-1 rounded-full text-9px font-bold uppercase ${getStatusBadge(record.status)}`}>
                                                        {record.status.replace('_', ' ')}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-11px text-slate-600">
                                                <div>
                                                    <p className="font-medium">{record.date}</p>
                                                    <p className="text-10px text-slate-500">{record.time}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex gap-2 justify-center">
                                                    <button
                                                        className="px-3 py-1.5 bg-primary text-white rounded-8 text-11px font-bold hover:bg-primary-dark transition-colors"
                                                        onClick={() => router.push(`/lab/${record.id}`)}
                                                    >
                                                        View
                                                    </button>
                                                    <button 
                                                        className="px-3 py-1.5 border border-slate-300 text-slate-700 rounded-8 text-11px font-bold hover:bg-slate-50 transition-colors"
                                                        onClick={() => router.push(`/lab/${record.id}/edit`)}
                                                    >
                                                        Edit
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LabPage;
