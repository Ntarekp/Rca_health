"use client";

import React, { useState, useEffect } from 'react';
import { FileText, Download, User, Activity, Users, TrendingUp, Search, Calendar, Printer, FileBarChart, Package, AlertTriangle, BarChart3 } from 'lucide-react';
import { authenticatedFetch } from '@/utils/api';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';

type ReportType = 'facility' | 'student' | 'disease' | 'class' | 'inventory';
type PeriodType = 'monthly' | 'term' | 'yearly' | 'custom';

const ReportsPage = () => {
    const { t } = useLanguage();
    const [reportType, setReportType] = useState<ReportType>('facility');
    const [periodType, setPeriodType] = useState<PeriodType>('monthly');
    
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const [dateRange, setDateRange] = useState({
        start: firstDayOfMonth.toISOString().split('T')[0],
        end: today.toISOString().split('T')[0]
    });
    
    const [selectedMonth, setSelectedMonth] = useState(today.getMonth());
    const [selectedYear, setSelectedYear] = useState(today.getFullYear());
    const [selectedTerm, setSelectedTerm] = useState('');
    
    const [studentId, setStudentId] = useState('');
    const [diagnosis, setDiagnosis] = useState('');
    const [classId, setClassId] = useState('');
    
    const [students, setStudents] = useState<any[]>([]);
    const [classes, setClasses] = useState<any[]>([]);
    const [terms, setTerms] = useState<any[]>([]);
    
    const [reportData, setReportData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [generating, setGenerating] = useState(false);

    useEffect(() => {
        fetchStudents();
        fetchClasses();
        fetchTerms();
    }, []);

    useEffect(() => {
        updateDateRangeFromPeriod();
    }, [periodType, selectedMonth, selectedYear, selectedTerm]);

    const fetchStudents = async () => {
        try {
            const response = await authenticatedFetch('/api/students');
            if (response.ok) {
                const data = await response.json();
                setStudents(data);
            }
        } catch (error) {
            console.error('Error fetching students:', error);
        }
    };

    const fetchClasses = async () => {
        try {
            const response = await authenticatedFetch('/api/academic/years');
            if (response.ok) {
                const years = await response.json();
                const allClasses: any[] = [];
                for (const year of years) {
                    const classResponse = await authenticatedFetch(`/api/academic/years/${year.id}/classes`);
                    if (classResponse.ok) {
                        const yearClasses = await classResponse.json();
                        allClasses.push(...yearClasses.map((c: any) => ({ ...c, yearName: year.name })));
                    }
                }
                setClasses(allClasses);
            }
        } catch (error) {
            console.error('Error fetching classes:', error);
        }
    };

    const fetchTerms = async () => {
        try {
            const response = await authenticatedFetch('/api/terms');
            if (response.ok) {
                const data = await response.json();
                setTerms(data.filter((t: any) => t.isActive));
            }
        } catch (error) {
            console.error('Error fetching terms:', error);
        }
    };

    const updateDateRangeFromPeriod = () => {
        let start: Date, end: Date;

        switch (periodType) {
            case 'monthly':
                start = new Date(selectedYear, selectedMonth, 1);
                end = new Date(selectedYear, selectedMonth + 1, 0);
                break;
            case 'yearly':
                start = new Date(selectedYear, 0, 1);
                end = new Date(selectedYear, 11, 31);
                break;
            case 'term':
                const term = terms.find(t => t.termId.toString() === selectedTerm);
                if (term) {
                    start = new Date(term.startDate);
                    end = new Date(term.endDate);
                } else {
                    return;
                }
                break;
            case 'custom':
            default:
                return;
        }

        setDateRange({
            start: start.toISOString().split('T')[0],
            end: end.toISOString().split('T')[0]
        });
    };

    const handleGenerateReport = async () => {
        setGenerating(true);
        setLoading(true);
        try {
            let url = '';
            const params = new URLSearchParams();
            if (dateRange.start) params.append('startDate', dateRange.start);
            if (dateRange.end) params.append('endDate', dateRange.end);

            switch (reportType) {
                case 'facility':
                    url = `/api/reports?${params.toString()}`;
                    break;
                case 'student':
                    if (!studentId) {
                        alert(t('reports.studentHealthReport.selectStudent'));
                        setGenerating(false);
                        setLoading(false);
                        return;
                    }
                    url = `/api/reports/student/${studentId}?${params.toString()}`;
                    break;
                case 'disease':
                    if (!diagnosis.trim()) {
                        alert(t('reports.diseaseReport.selectDisease'));
                        setGenerating(false);
                        setLoading(false);
                        return;
                    }
                    params.append('diagnosis', diagnosis);
                    url = `/api/reports/disease?${params.toString()}`;
                    break;
                case 'class':
                    if (!classId) {
                        alert(t('reports.classHealthReport.selectClass'));
                        setGenerating(false);
                        setLoading(false);
                        return;
                    }
                    url = `/api/reports/class/${classId}?${params.toString()}`;
                    break;
                case 'inventory':
                    url = `/api/reports/inventory?${params.toString()}`;
                    break;
            }

            const response = await authenticatedFetch(url);
            if (response.ok) {
                const data = await response.json();
                setReportData(data);
            } else {
                alert(t('messages.error.generic'));
            }
        } catch (error) {
            console.error('Error generating report:', error);
            alert(t('messages.error.generic'));
        } finally {
            setGenerating(false);
            setLoading(false);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    const months = [
        t('months.january'), t('months.february'), t('months.march'), t('months.april'),
        t('months.may'), t('months.june'), t('months.july'), t('months.august'),
        t('months.september'), t('months.october'), t('months.november'), t('months.december')
    ];

    const years = Array.from({ length: 10 }, (_, i) => today.getFullYear() - i);

    return (
        <div className="max-w-[1400px] mx-auto pb-10">
            <div className="no-print flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-28px font-extrabold text-slate-900">{t('reports.title')}</h1>
                    <p className="text-14px text-slate-600 mt-1">{t('reports.subtitle')}</p>
                </div>
                <LanguageSwitcher />
            </div>

            <div className="no-print grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                {/* Report Type Selection */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white border-2 border-slate-200 rounded-16 p-6 shadow-sm">
                        <h2 className="text-16px font-extrabold text-slate-900 mb-4 flex items-center gap-2">
                            <FileBarChart size={20} className="text-primary" />
                            {t('reports.reportType')}
                        </h2>
                        <div className="space-y-3">
                            {[
                                { type: 'facility', icon: Activity, label: t('reports.types.visitStatistics') },
                                { type: 'student', icon: User, label: t('reports.types.studentHealth') },
                                { type: 'disease', icon: TrendingUp, label: t('reports.types.diseaseReport') },
                                { type: 'class', icon: Users, label: t('reports.types.classHealth') },
                                { type: 'inventory', icon: Package, label: t('reports.types.inventory') }
                            ].map(({ type, icon: Icon, label }) => (
                                <button
                                    key={type}
                                    onClick={() => setReportType(type as ReportType)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-12 text-left transition-all ${
                                        reportType === type
                                            ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                            : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                                    }`}
                                >
                                    <Icon size={18} />
                                    <span className="text-13px font-bold">{label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Period Selection */}
                    <div className="bg-white border-2 border-slate-200 rounded-16 p-6 shadow-sm">
                        <h2 className="text-16px font-extrabold text-slate-900 mb-4 flex items-center gap-2">
                            <Calendar size={20} className="text-primary" />
                            {t('reports.period')}
                        </h2>
                        <div className="space-y-4">
                            <select
                                value={periodType}
                                onChange={(e) => setPeriodType(e.target.value as PeriodType)}
                                className="w-full px-4 py-3 border-2 border-slate-300 rounded-10 text-14px font-medium outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                            >
                                <option value="monthly">{t('reports.periods.monthly')}</option>
                                <option value="term">{t('reports.periods.term')}</option>
                                <option value="yearly">{t('reports.periods.yearly')}</option>
                                <option value="custom">{t('reports.periods.custom')}</option>
                            </select>

                            {periodType === 'monthly' && (
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-11px font-bold text-slate-600 uppercase mb-2 block">
                                            {t('reports.month')}
                                        </label>
                                        <select
                                            value={selectedMonth}
                                            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                                            className="w-full px-3 py-2 border-2 border-slate-300 rounded-8 text-13px font-medium outline-none focus:border-primary"
                                        >
                                            {months.map((month, idx) => (
                                                <option key={idx} value={idx}>{month}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-11px font-bold text-slate-600 uppercase mb-2 block">
                                            {t('reports.year')}
                                        </label>
                                        <select
                                            value={selectedYear}
                                            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                                            className="w-full px-3 py-2 border-2 border-slate-300 rounded-8 text-13px font-medium outline-none focus:border-primary"
                                        >
                                            {years.map(year => (
                                                <option key={year} value={year}>{year}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            )}

                            {periodType === 'term' && (
                                <div>
                                    <label className="text-11px font-bold text-slate-600 uppercase mb-2 block">
                                        {t('reports.selectTerm')}
                                    </label>
                                    <select
                                        value={selectedTerm}
                                        onChange={(e) => setSelectedTerm(e.target.value)}
                                        className="w-full px-4 py-3 border-2 border-slate-300 rounded-10 text-14px font-medium outline-none focus:border-primary"
                                    >
                                        <option value="">{t('reports.selectTerm')}</option>
                                        {terms.map(term => (
                                            <option key={term.termId} value={term.termId}>
                                                {term.termName} ({term.academicYear})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {periodType === 'yearly' && (
                                <div>
                                    <label className="text-11px font-bold text-slate-600 uppercase mb-2 block">
                                        {t('reports.selectYear')}
                                    </label>
                                    <select
                                        value={selectedYear}
                                        onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                                        className="w-full px-4 py-3 border-2 border-slate-300 rounded-10 text-14px font-medium outline-none focus:border-primary"
                                    >
                                        {years.map(year => (
                                            <option key={year} value={year}>{year}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {periodType === 'custom' && (
                                <div className="space-y-3">
                                    <div>
                                        <label className="text-11px font-bold text-slate-600 uppercase mb-2 block">
                                            {t('reports.startDate')}
                                        </label>
                                        <input
                                            type="date"
                                            value={dateRange.start}
                                            onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                                            className="w-full px-4 py-3 border-2 border-slate-300 rounded-10 text-14px font-medium outline-none focus:border-primary"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-11px font-bold text-slate-600 uppercase mb-2 block">
                                            {t('reports.endDate')}
                                        </label>
                                        <input
                                            type="date"
                                            value={dateRange.end}
                                            onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                                            className="w-full px-4 py-3 border-2 border-slate-300 rounded-10 text-14px font-medium outline-none focus:border-primary"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Report Parameters */}
                <div className="lg:col-span-2">
                    <div className="bg-white border-2 border-slate-200 rounded-16 p-6 shadow-sm">
                        <h2 className="text-16px font-extrabold text-slate-900 mb-6">
                            {t('reports.generateReport')}
                        </h2>

                        {reportType === 'student' && (
                            <div className="mb-6">
                                <label className="text-13px font-bold text-slate-700 mb-2 block">
                                    {t('reports.studentHealthReport.selectStudent')}
                                </label>
                                <select
                                    value={studentId}
                                    onChange={(e) => setStudentId(e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-slate-300 rounded-10 text-14px font-medium outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                                >
                                    <option value="">{t('reports.studentHealthReport.selectStudent')}</option>
                                    {students.map(student => (
                                        <option key={student.studentId} value={student.studentId}>
                                            {student.firstName} {student.lastName} ({student.schoolId})
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {reportType === 'disease' && (
                            <div className="mb-6">
                                <label className="text-13px font-bold text-slate-700 mb-2 block">
                                    {t('reports.diseaseReport.selectDisease')}
                                </label>
                                <input
                                    type="text"
                                    value={diagnosis}
                                    onChange={(e) => setDiagnosis(e.target.value)}
                                    placeholder="e.g., Malaria, Flu, COVID-19"
                                    className="w-full px-4 py-3 border-2 border-slate-300 rounded-10 text-14px font-medium outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                                />
                            </div>
                        )}

                        {reportType === 'class' && (
                            <div className="mb-6">
                                <label className="text-13px font-bold text-slate-700 mb-2 block">
                                    {t('reports.classHealthReport.selectClass')}
                                </label>
                                <select
                                    value={classId}
                                    onChange={(e) => setClassId(e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-slate-300 rounded-10 text-14px font-medium outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                                >
                                    <option value="">{t('reports.classHealthReport.selectClass')}</option>
                                    {classes.map(cls => (
                                        <option key={cls.id} value={cls.id}>
                                            {cls.name} - {cls.yearName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <div className="flex gap-3">
                            <button
                                onClick={handleGenerateReport}
                                disabled={generating}
                                className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-primary text-white rounded-12 text-15px font-bold hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {generating ? (
                                    <>
                                        <BarChart3 size={20} className="animate-pulse" />
                                        {t('reports.generatingReport')}
                                    </>
                                ) : (
                                    <>
                                        <FileText size={20} />
                                        {t('reports.generateReport')}
                                    </>
                                )}
                            </button>
                            {reportData && (
                                <button
                                    onClick={handlePrint}
                                    className="flex items-center gap-2 px-6 py-4 bg-slate-700 text-white rounded-12 text-15px font-bold hover:bg-slate-800 transition-colors shadow-lg"
                                >
                                    <Printer size={20} />
                                    {t('common.print')}
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Report Display Area */}
                    {reportData && (
                        <div className="mt-6 bg-white border-2 border-slate-200 rounded-16 p-8 shadow-sm print-area">
                            <div className="text-center mb-8 border-b-2 border-slate-200 pb-6">
                                <h1 className="text-24px font-extrabold text-slate-900 mb-2">
                                    {t('common.appName')}
                                </h1>
                                <h2 className="text-20px font-bold text-primary">
                                    {reportType === 'student' && t('reports.types.studentHealth')}
                                    {reportType === 'disease' && t('reports.types.diseaseReport')}
                                    {reportType === 'class' && t('reports.types.classHealth')}
                                    {reportType === 'inventory' && t('reports.types.inventory')}
                                    {reportType === 'facility' && t('reports.types.visitStatistics')}
                                </h2>
                                <p className="text-13px text-slate-600 mt-2">
                                    {t('reports.period')}: {new Date(dateRange.start).toLocaleDateString()} - {new Date(dateRange.end).toLocaleDateString()}
                                </p>
                            </div>

                            <div className="space-y-6">
                                <pre className="whitespace-pre-wrap text-13px text-slate-700">
                                    {JSON.stringify(reportData, null, 2)}
                                </pre>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReportsPage;
