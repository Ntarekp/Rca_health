"use client";

import React, { useState, useEffect } from 'react';
import { FileText, Download, User, Activity, Users, TrendingUp, Search, Calendar, Printer, FileBarChart, Package, AlertTriangle, BarChart3 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { authenticatedFetch } from '@/utils/api';
import './print.css';

type ReportType = 'facility' | 'student' | 'disease' | 'class' | 'inventory';

const ReportsPage = () => {
    const { t, locale } = useLanguage();
    const [reportType, setReportType] = useState<ReportType>('facility');
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const [dateRange, setDateRange] = useState({
        start: firstDayOfMonth.toISOString().split('T')[0],
        end: today.toISOString().split('T')[0]
    });
    
    const [studentId, setStudentId] = useState('');
    const [diagnosis, setDiagnosis] = useState('');
    const [classId, setClassId] = useState('');
    
    const [students, setStudents] = useState<any[]>([]);
    const [classes, setClasses] = useState<any[]>([]);
    
    const [reportData, setReportData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [generating, setGenerating] = useState(false);

    useEffect(() => {
        fetchStudents();
        fetchClasses();
    }, []);

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
                        alert(t('reports.selectStudent'));
                        setGenerating(false);
                        setLoading(false);
                        return;
                    }
                    url = `/api/reports/student/${studentId}?${params.toString()}`;
                    break;
                case 'disease':
                    if (!diagnosis.trim()) {
                        alert(t('reports.enterDiagnosis'));
                        setGenerating(false);
                        setLoading(false);
                        return;
                    }
                    params.append('diagnosis', diagnosis);
                    url = `/api/reports/disease?${params.toString()}`;
                    break;
                case 'class':
                    if (!classId) {
                        alert(t('reports.selectClass'));
                        setGenerating(false);
                        setLoading(false);
                        return;
                    }
                    url = `/api/reports/class/${classId}?${params.toString()}`;
                    break;
                case 'inventory':
                    url = '/api/reports/inventory';
                    break;
            }

            const response = await authenticatedFetch(url);
            if (response.ok) {
                const data = await response.json();
                setReportData(data);
            } else {
                alert(t('reports.noData'));
            }
        } catch (error) {
            console.error('Error generating report:', error);
            alert(t('reports.noData'));
        } finally {
            setLoading(false);
            setGenerating(false);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="space-y-6 pb-10">
            {/* Print Header - Hidden on screen, shown on print */}
            <div className="print-header hidden">
                <h1 className="text-24px font-bold">RCA Health Facility Report</h1>
                <p className="text-14px">Generated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}</p>
                <p className="text-14px">Period: {dateRange.start} to {dateRange.end}</p>
            </div>

            {/* Screen Header - Hidden on print */}
            <div className="no-print">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                    <div className="space-y-1.5">
                        <h1 className="text-32px font-extrabold text-slate-900 tracking-tight">{t('reports.title')}</h1>
                        <p className="text-slate-500 text-15px font-medium">{t('reports.subtitle')}</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-12 px-3 py-2 shadow-sm">
                            <Calendar size={16} className="text-slate-400" />
                            <input
                                type="date"
                                className="px-2 py-1 text-13px font-semibold text-slate-700 border-none bg-transparent outline-none"
                                value={dateRange.start}
                                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                            />
                            <span className="text-slate-400 text-11px font-bold">{t('reports.to')}</span>
                            <input
                                type="date"
                                className="px-2 py-1 text-13px font-semibold text-slate-700 border-none bg-transparent outline-none"
                                value={dateRange.end}
                                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                            />
                        </div>
                        <button 
                            onClick={handleGenerateReport}
                            disabled={generating}
                            className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-12 text-14px font-bold hover:bg-primary-dark transition-all shadow-md shadow-primary/20 disabled:opacity-50"
                        >
                            <TrendingUp size={18} />
                            <span>{generating ? t('reports.generating') : t('reports.generateReport')}</span>
                        </button>
                        {reportData && (
                            <button 
                                onClick={handlePrint}
                                className="flex items-center gap-2 px-5 py-2.5 border border-slate-200 bg-white text-slate-700 rounded-12 text-14px font-bold hover:bg-slate-50 transition-all"
                            >
                                <Printer size={18} />
                                <span>{t('reports.print')}</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* Report Type Selection */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <button
                        onClick={() => { setReportType('facility'); setReportData(null); }}
                        className={`p-5 rounded-16 border-2 transition-all text-left ${
                            reportType === 'facility'
                                ? 'border-primary bg-primary/5'
                                : 'border-slate-200 bg-white hover:border-primary/50'
                        }`}
                    >
                        <Activity size={24} className={reportType === 'facility' ? 'text-primary' : 'text-slate-400'} />
                        <h3 className="text-16px font-bold text-slate-900 mt-3">{t('reports.types.facilityOverview.title')}</h3>
                        <p className="text-13px text-slate-600 mt-1">{t('reports.types.facilityOverview.description')}</p>
                    </button>

                    <button
                        onClick={() => { setReportType('student'); setReportData(null); }}
                        className={`p-5 rounded-16 border-2 transition-all text-left ${
                            reportType === 'student'
                                ? 'border-primary bg-primary/5'
                                : 'border-slate-200 bg-white hover:border-primary/50'
                        }`}
                    >
                        <User size={24} className={reportType === 'student' ? 'text-primary' : 'text-slate-400'} />
                        <h3 className="text-16px font-bold text-slate-900 mt-3">{t('reports.types.studentHealth.title')}</h3>
                        <p className="text-13px text-slate-600 mt-1">{t('reports.types.studentHealth.description')}</p>
                    </button>

                    <button
                        onClick={() => { setReportType('disease'); setReportData(null); }}
                        className={`p-5 rounded-16 border-2 transition-all text-left ${
                            reportType === 'disease'
                                ? 'border-primary bg-primary/5'
                                : 'border-slate-200 bg-white hover:border-primary/50'
                        }`}
                    >
                        <FileBarChart size={24} className={reportType === 'disease' ? 'text-primary' : 'text-slate-400'} />
                        <h3 className="text-16px font-bold text-slate-900 mt-3">{t('reports.types.disease.title')}</h3>
                        <p className="text-13px text-slate-600 mt-1">{t('reports.types.disease.description')}</p>
                    </button>

                    <button
                        onClick={() => { setReportType('class'); setReportData(null); }}
                        className={`p-5 rounded-16 border-2 transition-all text-left ${
                            reportType === 'class'
                                ? 'border-primary bg-primary/5'
                                : 'border-slate-200 bg-white hover:border-primary/50'
                        }`}
                    >
                        <Users size={24} className={reportType === 'class' ? 'text-primary' : 'text-slate-400'} />
                        <h3 className="text-16px font-bold text-slate-900 mt-3">{t('reports.types.classHealth.title')}</h3>
                        <p className="text-13px text-slate-600 mt-1">{t('reports.types.classHealth.description')}</p>
                    </button>

                    <button
                        onClick={() => { setReportType('inventory'); setReportData(null); }}
                        className={`p-5 rounded-16 border-2 transition-all text-left ${
                            reportType === 'inventory'
                                ? 'border-primary bg-primary/5'
                                : 'border-slate-200 bg-white hover:border-primary/50'
                        }`}
                    >
                        <Package size={24} className={reportType === 'inventory' ? 'text-primary' : 'text-slate-400'} />
                        <h3 className="text-16px font-bold text-slate-900 mt-3">{t('reports.types.inventory.title')}</h3>
                        <p className="text-13px text-slate-600 mt-1">{t('reports.types.inventory.description')}</p>
                    </button>
                </div>

                {/* Report Parameters */}
                <div className="mt-6 bg-white border border-slate-200 rounded-16 p-6">
                    <h3 className="text-16px font-bold text-slate-900 mb-4">{t('reports.reportParameters')}</h3>
                    
                    {reportType === 'student' && (
                        <div className="space-y-2">
                            <label className="text-13px font-bold text-slate-700">{t('reports.selectStudent')}</label>
                            <select
                                value={studentId}
                                onChange={(e) => setStudentId(e.target.value)}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-12 text-14px font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            >
                                <option value="">{t('reports.selectStudent')}</option>
                                {students.map((student) => (
                                    <option key={student.studentId} value={student.studentId}>
                                        {student.firstName} {student.lastName} - {student.schoolId}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {reportType === 'disease' && (
                        <div className="space-y-2">
                            <label className="text-13px font-bold text-slate-700">{t('reports.diagnosisLabel')}</label>
                            <input
                                type="text"
                                value={diagnosis}
                                onChange={(e) => setDiagnosis(e.target.value)}
                                placeholder={t('reports.diagnosisPlaceholder')}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-12 text-14px font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            />
                        </div>
                    )}

                    {reportType === 'class' && (
                        <div className="space-y-2">
                            <label className="text-13px font-bold text-slate-700">{t('reports.selectClass')}</label>
                            <select
                                value={classId}
                                onChange={(e) => setClassId(e.target.value)}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-12 text-14px font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            >
                                <option value="">{t('reports.selectClass')}</option>
                                {classes.map((cls) => (
                                    <option key={cls.classId} value={cls.classId}>
                                        {cls.name} ({cls.yearName})
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {reportType === 'facility' && (
                        <p className="text-14px text-slate-600">
                            {t('reports.reportParametersDesc')}
                        </p>
                    )}

                    {reportType === 'inventory' && (
                        <p className="text-14px text-slate-600">
                            This report provides a comprehensive overview of all inventory items, stock levels, category breakdowns, and critical alerts for items requiring immediate attention.
                        </p>
                    )}
                </div>
            </div>

            {/* Report Display */}
            {loading && (
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center space-y-3">
                        <Activity className="animate-spin mx-auto text-primary" size={32} />
                        <p className="text-14px font-medium text-slate-600">Generating report...</p>
                    </div>
                </div>
            )}

            {!loading && reportData && reportType === 'facility' && (
                <FacilityReport data={reportData} dateRange={dateRange} />
            )}

            {!loading && reportData && reportType === 'student' && (
                <StudentReport data={reportData} dateRange={dateRange} />
            )}

            {!loading && reportData && reportType === 'disease' && (
                <DiseaseReport data={reportData} dateRange={dateRange} />
            )}

            {!loading && reportData && reportType === 'class' && (
                <ClassReport data={reportData} dateRange={dateRange} />
            )}

            {!loading && reportData && reportType === 'inventory' && (
                <InventoryReport data={reportData} />
            )}

            {/* Print Footer */}
            <div className="print-footer hidden">
                <p>RCA Health Facility Management System</p>
                <p>This is a confidential medical document</p>
            </div>
        </div>
    );
};

// Facility Report Component
const FacilityReport = ({ data, dateRange }: any) => (
    <div className="space-y-6 print-section">
        <div className="bg-white border border-slate-200 rounded-20 p-8 shadow-sm">
            <h2 className="text-22px font-bold text-slate-900 mb-6">Facility Overview Report</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                <div className="stat-box p-4 bg-slate-50 rounded-12 border border-slate-200">
                    <p className="text-11px font-bold text-slate-500 uppercase mb-1">Consultations</p>
                    <p className="text-28px font-extrabold text-slate-900">{data.summary.consultations}</p>
                </div>
                <div className="stat-box p-4 bg-danger/5 rounded-12 border border-danger/20">
                    <p className="text-11px font-bold text-danger uppercase mb-1">Critical Cases</p>
                    <p className="text-28px font-extrabold text-danger">{data.summary.criticalCases}</p>
                </div>
                <div className="stat-box p-4 bg-warning/5 rounded-12 border border-warning/20">
                    <p className="text-11px font-bold text-warning uppercase mb-1">Referrals</p>
                    <p className="text-28px font-extrabold text-warning">{data.summary.referrals}</p>
                </div>
                <div className="stat-box p-4 bg-slate-50 rounded-12 border border-slate-200">
                    <p className="text-11px font-bold text-slate-500 uppercase mb-1">Prescriptions</p>
                    <p className="text-28px font-extrabold text-slate-900">{data.summary.prescriptions}</p>
                </div>
                <div className="stat-box p-4 bg-success/5 rounded-12 border border-success/20">
                    <p className="text-11px font-bold text-success uppercase mb-1">Admissions</p>
                    <p className="text-28px font-extrabold text-success">{data.summary.newAdmissions}</p>
                </div>
                <div className="stat-box p-4 bg-slate-50 rounded-12 border border-slate-200">
                    <p className="text-11px font-bold text-slate-500 uppercase mb-1">Discharges</p>
                    <p className="text-28px font-extrabold text-slate-900">{data.summary.discharges}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="print-section">
                    <h3 className="text-18px font-bold text-slate-900 mb-4">Top 5 Diagnoses</h3>
                    <table className="w-full border-collapse border border-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-11px font-bold text-slate-600 uppercase border border-slate-200">Diagnosis</th>
                                <th className="px-4 py-3 text-center text-11px font-bold text-slate-600 uppercase border border-slate-200">Cases</th>
                                <th className="px-4 py-3 text-right text-11px font-bold text-slate-600 uppercase border border-slate-200">%</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.topDiagnoses.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="px-4 py-3 text-center text-slate-500 border border-slate-200">No data</td>
                                </tr>
                            ) : (
                                data.topDiagnoses.map((item: any, index: number) => (
                                    <tr key={index}>
                                        <td className="px-4 py-3 text-slate-900 border border-slate-200">{item.name}</td>
                                        <td className="px-4 py-3 text-center font-bold text-slate-900 border border-slate-200">{item.cases}</td>
                                        <td className="px-4 py-3 text-right text-primary font-bold border border-slate-200">{item.percentage}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="print-section">
                    <h3 className="text-18px font-bold text-slate-900 mb-4">Monthly Trends</h3>
                    <table className="w-full border-collapse border border-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-11px font-bold text-slate-600 uppercase border border-slate-200">Month</th>
                                <th className="px-4 py-3 text-center text-11px font-bold text-slate-600 uppercase border border-slate-200">Visits</th>
                                <th className="px-4 py-3 text-right text-11px font-bold text-slate-600 uppercase border border-slate-200">Referrals</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.trends.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="px-4 py-3 text-center text-slate-500 border border-slate-200">No data</td>
                                </tr>
                            ) : (
                                data.trends.map((trend: any, index: number) => (
                                    <tr key={index}>
                                        <td className="px-4 py-3 text-slate-900 border border-slate-200">{trend.month}</td>
                                        <td className="px-4 py-3 text-center font-bold text-primary border border-slate-200">{trend.consultations}</td>
                                        <td className="px-4 py-3 text-right font-bold border border-slate-200">
                                            <span className={trend.referrals > 2 ? 'text-danger' : 'text-success'}>{trend.referrals}</span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {data.inventoryStats && data.inventoryStats.length > 0 && (
                <div className="mt-6 print-section">
                    <h3 className="text-18px font-bold text-slate-900 mb-4">Inventory Status</h3>
                    <div className="grid grid-cols-4 gap-4 mb-4">
                        <div className="stat-box p-3 bg-slate-50 rounded-10 border border-slate-200 text-center">
                            <p className="text-10px font-bold text-slate-500 uppercase">Total Items</p>
                            <p className="text-20px font-extrabold text-slate-900">{data.inventoryStats.length}</p>
                        </div>
                        <div className="stat-box p-3 bg-danger/5 rounded-10 border border-danger/20 text-center">
                            <p className="text-10px font-bold text-danger uppercase">Out of Stock</p>
                            <p className="text-20px font-extrabold text-danger">
                                {data.inventoryStats.filter((i: any) => i.status === 'Out of Stock').length}
                            </p>
                        </div>
                        <div className="stat-box p-3 bg-warning/5 rounded-10 border border-warning/20 text-center">
                            <p className="text-10px font-bold text-warning uppercase">Low Stock</p>
                            <p className="text-20px font-extrabold text-warning">
                                {data.inventoryStats.filter((i: any) => i.status === 'Low Stock').length}
                            </p>
                        </div>
                        <div className="stat-box p-3 bg-success/5 rounded-10 border border-success/20 text-center">
                            <p className="text-10px font-bold text-success uppercase">In Stock</p>
                            <p className="text-20px font-extrabold text-success">
                                {data.inventoryStats.filter((i: any) => i.status === 'In Stock').length}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    </div>
);

// Student Report Component
const StudentReport = ({ data, dateRange }: any) => (
    <div className="space-y-6 print-section">
        <div className="bg-white border border-slate-200 rounded-20 p-8 shadow-sm">
            <h2 className="text-22px font-bold text-slate-900 mb-6">Student Health History Report</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 p-6 bg-slate-50 rounded-12 border border-slate-200">
                <div>
                    <p className="text-12px font-bold text-slate-500 uppercase mb-1">Student Name</p>
                    <p className="text-16px font-bold text-slate-900">{data.student.fullName}</p>
                </div>
                <div>
                    <p className="text-12px font-bold text-slate-500 uppercase mb-1">Age / Gender</p>
                    <p className="text-16px font-bold text-slate-900">{data.student.age} years / {data.student.gender}</p>
                </div>
                <div>
                    <p className="text-12px font-bold text-slate-500 uppercase mb-1">Class</p>
                    <p className="text-16px font-bold text-slate-900">{data.student.className}</p>
                </div>
                <div>
                    <p className="text-12px font-bold text-slate-500 uppercase mb-1">Insurance</p>
                    <p className="text-16px font-bold text-slate-900">{data.student.insuranceProvider}</p>
                    <p className="text-13px text-slate-600">{data.student.insuranceNumber}</p>
                </div>
                <div>
                    <p className="text-12px font-bold text-slate-500 uppercase mb-1">Parent/Guardian</p>
                    <p className="text-16px font-bold text-slate-900">{data.student.parentName}</p>
                    <p className="text-13px text-slate-600">{data.student.parentPhone}</p>
                </div>
                <div>
                    <p className="text-12px font-bold text-slate-500 uppercase mb-1">Date of Birth</p>
                    <p className="text-16px font-bold text-slate-900">{new Date(data.student.dateOfBirth).toLocaleDateString()}</p>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="stat-box p-4 bg-primary/5 rounded-12 border border-primary/20 text-center">
                    <p className="text-11px font-bold text-primary uppercase mb-1">Total Visits</p>
                    <p className="text-28px font-extrabold text-primary">{data.summary.totalVisits}</p>
                </div>
                <div className="stat-box p-4 bg-slate-50 rounded-12 border border-slate-200 text-center">
                    <p className="text-11px font-bold text-slate-500 uppercase mb-1">Last Visit</p>
                    <p className="text-16px font-bold text-slate-900">
                        {data.summary.lastVisit ? new Date(data.summary.lastVisit).toLocaleDateString() : 'N/A'}
                    </p>
                </div>
                <div className="stat-box p-4 bg-warning/5 rounded-12 border border-warning/20 text-center">
                    <p className="text-11px font-bold text-warning uppercase mb-1">Chronic Conditions</p>
                    <p className="text-28px font-extrabold text-warning">{data.summary.chronicConditions.length}</p>
                </div>
            </div>

            {data.summary.commonDiagnoses.length > 0 && (
                <div className="mb-6 print-section">
                    <h3 className="text-16px font-bold text-slate-900 mb-3">Common Diagnoses</h3>
                    <ul className="list-disc list-inside space-y-1">
                        {data.summary.commonDiagnoses.map((diagnosis: string, index: number) => (
                            <li key={index} className="text-14px text-slate-700">{diagnosis}</li>
                        ))}
                    </ul>
                </div>
            )}

            {data.summary.chronicConditions.length > 0 && (
                <div className="mb-6 print-section">
                    <h3 className="text-16px font-bold text-slate-900 mb-3">Chronic Conditions (3+ visits)</h3>
                    <ul className="list-disc list-inside space-y-1">
                        {data.summary.chronicConditions.map((condition: string, index: number) => (
                            <li key={index} className="text-14px text-danger font-semibold">{condition}</li>
                        ))}
                    </ul>
                </div>
            )}

            <div className="print-section">
                <h3 className="text-18px font-bold text-slate-900 mb-4">Visit History</h3>
                {data.visits.length === 0 ? (
                    <p className="text-slate-500">No visits recorded for this period.</p>
                ) : (
                    <table className="w-full border-collapse border border-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-11px font-bold text-slate-600 uppercase border border-slate-200">Date</th>
                                <th className="px-4 py-3 text-left text-11px font-bold text-slate-600 uppercase border border-slate-200">Complaint</th>
                                <th className="px-4 py-3 text-left text-11px font-bold text-slate-600 uppercase border border-slate-200">Diagnosis</th>
                                <th className="px-4 py-3 text-left text-11px font-bold text-slate-600 uppercase border border-slate-200">Treatment</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.visits.map((visit: any) => (
                                <tr key={visit.visitId}>
                                    <td className="px-4 py-3 text-slate-900 border border-slate-200">
                                        {new Date(visit.visitDateTime).toLocaleDateString()}
                                    </td>
                                    <td className="px-4 py-3 text-slate-700 border border-slate-200">{visit.chiefComplaint || 'N/A'}</td>
                                    <td className="px-4 py-3 text-slate-900 font-semibold border border-slate-200">{visit.diagnosis || 'N/A'}</td>
                                    <td className="px-4 py-3 text-slate-700 border border-slate-200">{visit.treatmentNotes || 'N/A'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    </div>
);

// Disease Report Component
const DiseaseReport = ({ data, dateRange }: any) => (
    <div className="space-y-6 print-section">
        <div className="bg-white border border-slate-200 rounded-20 p-8 shadow-sm">
            <h2 className="text-22px font-bold text-slate-900 mb-2">Disease Report: {data.diseaseName}</h2>
            <p className="text-14px text-slate-600 mb-6">Period: {dateRange.start} to {dateRange.end}</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="stat-box p-4 bg-danger/5 rounded-12 border border-danger/20 text-center">
                    <p className="text-11px font-bold text-danger uppercase mb-1">Total Cases</p>
                    <p className="text-28px font-extrabold text-danger">{data.totalCases}</p>
                </div>
                <div className="stat-box p-4 bg-blue-50 rounded-12 border border-blue-200 text-center">
                    <p className="text-11px font-bold text-blue-600 uppercase mb-1">Male</p>
                    <p className="text-28px font-extrabold text-blue-600">{data.demographics.maleCount}</p>
                </div>
                <div className="stat-box p-4 bg-pink-50 rounded-12 border border-pink-200 text-center">
                    <p className="text-11px font-bold text-pink-600 uppercase mb-1">Female</p>
                    <p className="text-28px font-extrabold text-pink-600">{data.demographics.femaleCount}</p>
                </div>
                <div className="stat-box p-4 bg-slate-50 rounded-12 border border-slate-200 text-center">
                    <p className="text-11px font-bold text-slate-500 uppercase mb-1">Avg Age</p>
                    <p className="text-28px font-extrabold text-slate-900">
                        {data.cases.length > 0 
                            ? Math.round(data.cases.reduce((sum: number, c: any) => sum + c.age, 0) / data.cases.length)
                            : 0}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="print-section">
                    <h3 className="text-16px font-bold text-slate-900 mb-3">Age Distribution</h3>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center p-3 bg-slate-50 rounded-10 border border-slate-200">
                            <span className="text-14px font-semibold text-slate-700">Under 10</span>
                            <span className="text-16px font-bold text-slate-900">{data.demographics.ageDistribution.under10}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-slate-50 rounded-10 border border-slate-200">
                            <span className="text-14px font-semibold text-slate-700">10-15 years</span>
                            <span className="text-16px font-bold text-slate-900">{data.demographics.ageDistribution.age10to15}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-slate-50 rounded-10 border border-slate-200">
                            <span className="text-14px font-semibold text-slate-700">16-20 years</span>
                            <span className="text-16px font-bold text-slate-900">{data.demographics.ageDistribution.age16to20}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-slate-50 rounded-10 border border-slate-200">
                            <span className="text-14px font-semibold text-slate-700">Over 20</span>
                            <span className="text-16px font-bold text-slate-900">{data.demographics.ageDistribution.over20}</span>
                        </div>
                    </div>
                </div>

                <div className="print-section">
                    <h3 className="text-16px font-bold text-slate-900 mb-3">Monthly Trend</h3>
                    {data.timeline.monthlyCounts.length === 0 ? (
                        <p className="text-slate-500">No monthly data available</p>
                    ) : (
                        <div className="space-y-2">
                            {data.timeline.monthlyCounts.map((month: any, index: number) => (
                                <div key={index} className="flex justify-between items-center p-3 bg-slate-50 rounded-10 border border-slate-200">
                                    <span className="text-14px font-semibold text-slate-700">{month.month}</span>
                                    <span className="text-16px font-bold text-primary">{month.count} cases</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="print-section">
                <h3 className="text-18px font-bold text-slate-900 mb-4">Case Details</h3>
                {data.cases.length === 0 ? (
                    <p className="text-slate-500">No cases found for this diagnosis.</p>
                ) : (
                    <table className="w-full border-collapse border border-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-11px font-bold text-slate-600 uppercase border border-slate-200">Date</th>
                                <th className="px-4 py-3 text-left text-11px font-bold text-slate-600 uppercase border border-slate-200">Student</th>
                                <th className="px-4 py-3 text-left text-11px font-bold text-slate-600 uppercase border border-slate-200">Class</th>
                                <th className="px-4 py-3 text-center text-11px font-bold text-slate-600 uppercase border border-slate-200">Age</th>
                                <th className="px-4 py-3 text-center text-11px font-bold text-slate-600 uppercase border border-slate-200">Gender</th>
                                <th className="px-4 py-3 text-left text-11px font-bold text-slate-600 uppercase border border-slate-200">Treatment</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.cases.map((caseDetail: any) => (
                                <tr key={caseDetail.visitId}>
                                    <td className="px-4 py-3 text-slate-900 border border-slate-200">
                                        {new Date(caseDetail.visitDate).toLocaleDateString()}
                                    </td>
                                    <td className="px-4 py-3 text-slate-900 font-semibold border border-slate-200">{caseDetail.studentName}</td>
                                    <td className="px-4 py-3 text-slate-700 border border-slate-200">{caseDetail.className}</td>
                                    <td className="px-4 py-3 text-center text-slate-900 border border-slate-200">{caseDetail.age}</td>
                                    <td className="px-4 py-3 text-center text-slate-700 border border-slate-200">{caseDetail.gender}</td>
                                    <td className="px-4 py-3 text-slate-700 border border-slate-200">{caseDetail.treatmentGiven || 'N/A'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    </div>
);

// Class Report Component
const ClassReport = ({ data, dateRange }: any) => (
    <div className="space-y-6 print-section">
        <div className="bg-white border border-slate-200 rounded-20 p-8 shadow-sm">
            <h2 className="text-22px font-bold text-slate-900 mb-2">Class Health Report: {data.className}</h2>
            <p className="text-14px text-slate-600 mb-6">Academic Year: {data.academicYear} | Total Students: {data.totalStudents}</p>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                <div className="stat-box p-4 bg-primary/5 rounded-12 border border-primary/20 text-center">
                    <p className="text-11px font-bold text-primary uppercase mb-1">Total Visits</p>
                    <p className="text-28px font-extrabold text-primary">{data.statistics.totalVisits}</p>
                </div>
                <div className="stat-box p-4 bg-slate-50 rounded-12 border border-slate-200 text-center">
                    <p className="text-11px font-bold text-slate-500 uppercase mb-1">Students Visited</p>
                    <p className="text-28px font-extrabold text-slate-900">{data.statistics.uniqueStudentsVisited}</p>
                </div>
                <div className="stat-box p-4 bg-slate-50 rounded-12 border border-slate-200 text-center">
                    <p className="text-11px font-bold text-slate-500 uppercase mb-1">Avg Visits/Student</p>
                    <p className="text-28px font-extrabold text-slate-900">{data.statistics.averageVisitsPerStudent.toFixed(1)}</p>
                </div>
                <div className="stat-box p-4 bg-danger/5 rounded-12 border border-danger/20 text-center">
                    <p className="text-11px font-bold text-danger uppercase mb-1">Critical Cases</p>
                    <p className="text-28px font-extrabold text-danger">{data.statistics.criticalCases}</p>
                </div>
                <div className="stat-box p-4 bg-warning/5 rounded-12 border border-warning/20 text-center">
                    <p className="text-11px font-bold text-warning uppercase mb-1">Referrals</p>
                    <p className="text-28px font-extrabold text-warning">{data.statistics.referrals}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="print-section">
                    <h3 className="text-18px font-bold text-slate-900 mb-4">Common Conditions</h3>
                    {data.commonConditions.length === 0 ? (
                        <p className="text-slate-500">No conditions recorded</p>
                    ) : (
                        <table className="w-full border-collapse border border-slate-200">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-11px font-bold text-slate-600 uppercase border border-slate-200">Diagnosis</th>
                                    <th className="px-4 py-3 text-center text-11px font-bold text-slate-600 uppercase border border-slate-200">Cases</th>
                                    <th className="px-4 py-3 text-right text-11px font-bold text-slate-600 uppercase border border-slate-200">%</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.commonConditions.map((condition: any, index: number) => (
                                    <tr key={index}>
                                        <td className="px-4 py-3 text-slate-900 border border-slate-200">{condition.diagnosis}</td>
                                        <td className="px-4 py-3 text-center font-bold text-slate-900 border border-slate-200">{condition.cases}</td>
                                        <td className="px-4 py-3 text-right text-primary font-bold border border-slate-200">{condition.percentage.toFixed(1)}%</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                <div className="print-section">
                    <h3 className="text-18px font-bold text-slate-900 mb-4">At-Risk Students</h3>
                    {data.atRiskStudents.length === 0 ? (
                        <p className="text-slate-500">No at-risk students identified</p>
                    ) : (
                        <table className="w-full border-collapse border border-slate-200">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-11px font-bold text-slate-600 uppercase border border-slate-200">Student</th>
                                    <th className="px-4 py-3 text-center text-11px font-bold text-slate-600 uppercase border border-slate-200">Visits</th>
                                    <th className="px-4 py-3 text-left text-11px font-bold text-slate-600 uppercase border border-slate-200">Common Issue</th>
                                    <th className="px-4 py-3 text-center text-11px font-bold text-slate-600 uppercase border border-slate-200">Risk</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.atRiskStudents.map((student: any, index: number) => (
                                    <tr key={index}>
                                        <td className="px-4 py-3 text-slate-900 font-semibold border border-slate-200">{student.studentName}</td>
                                        <td className="px-4 py-3 text-center font-bold text-slate-900 border border-slate-200">{student.visitCount}</td>
                                        <td className="px-4 py-3 text-slate-700 border border-slate-200">{student.mostCommonDiagnosis}</td>
                                        <td className="px-4 py-3 text-center border border-slate-200">
                                            <span className={`px-2 py-1 rounded-full text-11px font-bold ${
                                                student.riskLevel === 'High' ? 'bg-danger/10 text-danger' :
                                                student.riskLevel === 'Medium' ? 'bg-warning/10 text-warning' :
                                                'bg-success/10 text-success'
                                            }`}>
                                                {student.riskLevel}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    </div>
);

// Inventory Report Component
const InventoryReport = ({ data }: any) => (
    <div className="space-y-6 print-section">
        <div className="bg-white border border-slate-200 rounded-20 p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-22px font-bold text-slate-900">Inventory & Stock Management Report</h2>
                    <p className="text-14px text-slate-600 mt-1">Generated on {new Date(data.summary.reportDate).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-primary/5 rounded-12 border border-primary/20">
                    <Package size={20} className="text-primary" />
                    <span className="text-14px font-bold text-primary">{data.summary.totalItems} Total Items</span>
                </div>
            </div>
            
            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                <div className="stat-box p-5 bg-gradient-to-br from-slate-50 to-slate-100 rounded-16 border-2 border-slate-200 text-center">
                    <div className="flex justify-center mb-2">
                        <div className="p-2 bg-white rounded-10 shadow-sm">
                            <Package size={20} className="text-slate-600" />
                        </div>
                    </div>
                    <p className="text-11px font-bold text-slate-500 uppercase mb-1">Total Items</p>
                    <p className="text-32px font-extrabold text-slate-900">{data.summary.totalItems}</p>
                </div>
                <div className="stat-box p-5 bg-gradient-to-br from-red-50 to-red-100 rounded-16 border-2 border-red-200 text-center">
                    <div className="flex justify-center mb-2">
                        <div className="p-2 bg-white rounded-10 shadow-sm">
                            <AlertTriangle size={20} className="text-danger" />
                        </div>
                    </div>
                    <p className="text-11px font-bold text-danger uppercase mb-1">Out of Stock</p>
                    <p className="text-32px font-extrabold text-danger">{data.summary.outOfStock}</p>
                    <p className="text-11px text-danger/70 font-semibold mt-1">CRITICAL</p>
                </div>
                <div className="stat-box p-5 bg-gradient-to-br from-orange-50 to-orange-100 rounded-16 border-2 border-orange-200 text-center">
                    <div className="flex justify-center mb-2">
                        <div className="p-2 bg-white rounded-10 shadow-sm">
                            <TrendingUp size={20} className="text-warning" />
                        </div>
                    </div>
                    <p className="text-11px font-bold text-warning uppercase mb-1">Low Stock</p>
                    <p className="text-32px font-extrabold text-warning">{data.summary.lowStock}</p>
                    <p className="text-11px text-warning/70 font-semibold mt-1">RESTOCK SOON</p>
                </div>
                <div className="stat-box p-5 bg-gradient-to-br from-amber-50 to-amber-100 rounded-16 border-2 border-amber-200 text-center">
                    <div className="flex justify-center mb-2">
                        <div className="p-2 bg-white rounded-10 shadow-sm">
                            <BarChart3 size={20} className="text-amber-600" />
                        </div>
                    </div>
                    <p className="text-11px font-bold text-amber-700 uppercase mb-1">Watch Level</p>
                    <p className="text-32px font-extrabold text-amber-700">{data.summary.watchLevel}</p>
                    <p className="text-11px text-amber-600 font-semibold mt-1">MONITOR</p>
                </div>
                <div className="stat-box p-5 bg-gradient-to-br from-green-50 to-green-100 rounded-16 border-2 border-green-200 text-center">
                    <div className="flex justify-center mb-2">
                        <div className="p-2 bg-white rounded-10 shadow-sm">
                            <Activity size={20} className="text-success" />
                        </div>
                    </div>
                    <p className="text-11px font-bold text-success uppercase mb-1">In Stock</p>
                    <p className="text-32px font-extrabold text-success">{data.summary.inStock}</p>
                    <p className="text-11px text-success/70 font-semibold mt-1">ADEQUATE</p>
                </div>
            </div>

            {/* Critical Alerts */}
            {data.criticalAlerts && data.criticalAlerts.length > 0 && (
                <div className="mb-8 print-section">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-danger/10 rounded-10">
                            <AlertTriangle size={20} className="text-danger" />
                        </div>
                        <h3 className="text-18px font-bold text-slate-900">Critical Alerts & Recommendations</h3>
                    </div>
                    <div className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-16 p-6">
                        <div className="space-y-3">
                            {data.criticalAlerts.slice(0, 5).map((alert: any, index: number) => (
                                <div key={index} className="flex items-start gap-4 p-4 bg-white rounded-12 border border-red-100 shadow-sm">
                                    <div className={`p-2 rounded-10 ${
                                        alert.alertLevel === 'CRITICAL' ? 'bg-danger/10' :
                                        alert.alertLevel === 'HIGH' ? 'bg-warning/10' :
                                        'bg-amber-100'
                                    }`}>
                                        <AlertTriangle size={18} className={`${
                                            alert.alertLevel === 'CRITICAL' ? 'text-danger' :
                                            alert.alertLevel === 'HIGH' ? 'text-warning' :
                                            'text-amber-600'
                                        }`} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-1">
                                            <h4 className="text-15px font-bold text-slate-900">{alert.name}</h4>
                                            <span className={`px-3 py-1 rounded-full text-10px font-bold uppercase ${
                                                alert.alertLevel === 'CRITICAL' ? 'bg-danger/10 text-danger' :
                                                alert.alertLevel === 'HIGH' ? 'bg-warning/10 text-warning' :
                                                'bg-amber-100 text-amber-700'
                                            }`}>
                                                {alert.alertLevel}
                                            </span>
                                        </div>
                                        <p className="text-13px text-slate-600 mb-2">
                                            <span className="font-semibold">{alert.category}</span> • Current Stock: <span className="font-bold text-slate-900">{alert.currentStock} {alert.unit}</span>
                                        </p>
                                        <div className="flex items-center gap-2 text-12px">
                                            <span className="text-slate-500">📋 Action:</span>
                                            <span className="font-semibold text-slate-700">{alert.recommendation}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Category Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="print-section">
                    <h3 className="text-18px font-bold text-slate-900 mb-4">Category Breakdown</h3>
                    <div className="bg-slate-50 border border-slate-200 rounded-16 p-5">
                        {data.categoryBreakdown.length === 0 ? (
                            <p className="text-slate-500 text-center py-4">No categories found</p>
                        ) : (
                            <div className="space-y-3">
                                {data.categoryBreakdown.map((category: any, index: number) => (
                                    <div key={index} className="p-4 bg-white rounded-12 border border-slate-200">
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className="text-15px font-bold text-slate-900">{category.category}</h4>
                                            <span className="text-13px font-bold text-primary">{category.percentage.toFixed(1)}%</span>
                                        </div>
                                        <div className="grid grid-cols-3 gap-3 text-center">
                                            <div>
                                                <p className="text-10px text-slate-500 uppercase font-bold mb-1">Total</p>
                                                <p className="text-18px font-extrabold text-slate-900">{category.totalItems}</p>
                                            </div>
                                            <div>
                                                <p className="text-10px text-danger uppercase font-bold mb-1">Out</p>
                                                <p className="text-18px font-extrabold text-danger">{category.outOfStock}</p>
                                            </div>
                                            <div>
                                                <p className="text-10px text-warning uppercase font-bold mb-1">Low</p>
                                                <p className="text-18px font-extrabold text-warning">{category.lowStock}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="print-section">
                    <h3 className="text-18px font-bold text-slate-900 mb-4">Stock Status Distribution</h3>
                    <div className="bg-slate-50 border border-slate-200 rounded-16 p-5">
                        <div className="space-y-4">
                            <div className="p-4 bg-white rounded-12 border-l-4 border-success">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-12px font-bold text-slate-600 uppercase">In Stock</p>
                                        <p className="text-24px font-extrabold text-success mt-1">{data.summary.inStock} items</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-28px font-extrabold text-success">
                                            {((data.summary.inStock / data.summary.totalItems) * 100).toFixed(0)}%
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 bg-white rounded-12 border-l-4 border-amber-500">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-12px font-bold text-slate-600 uppercase">Watch Level</p>
                                        <p className="text-24px font-extrabold text-amber-600 mt-1">{data.summary.watchLevel} items</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-28px font-extrabold text-amber-600">
                                            {((data.summary.watchLevel / data.summary.totalItems) * 100).toFixed(0)}%
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 bg-white rounded-12 border-l-4 border-warning">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-12px font-bold text-slate-600 uppercase">Low Stock</p>
                                        <p className="text-24px font-extrabold text-warning mt-1">{data.summary.lowStock} items</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-28px font-extrabold text-warning">
                                            {((data.summary.lowStock / data.summary.totalItems) * 100).toFixed(0)}%
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 bg-white rounded-12 border-l-4 border-danger">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-12px font-bold text-slate-600 uppercase">Out of Stock</p>
                                        <p className="text-24px font-extrabold text-danger mt-1">{data.summary.outOfStock} items</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-28px font-extrabold text-danger">
                                            {((data.summary.outOfStock / data.summary.totalItems) * 100).toFixed(0)}%
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Full Inventory Table */}
            <div className="print-section">
                <h3 className="text-18px font-bold text-slate-900 mb-4">Complete Inventory List</h3>
                {data.items.length === 0 ? (
                    <p className="text-slate-500 text-center py-8">No inventory items found</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-slate-200 rounded-12">
                            <thead className="bg-gradient-to-r from-slate-100 to-slate-50">
                                <tr>
                                    <th className="px-5 py-4 text-left text-11px font-bold text-slate-700 uppercase border border-slate-200">Item Name</th>
                                    <th className="px-5 py-4 text-left text-11px font-bold text-slate-700 uppercase border border-slate-200">Category</th>
                                    <th className="px-5 py-4 text-center text-11px font-bold text-slate-700 uppercase border border-slate-200">Stock</th>
                                    <th className="px-5 py-4 text-left text-11px font-bold text-slate-700 uppercase border border-slate-200">Unit</th>
                                    <th className="px-5 py-4 text-center text-11px font-bold text-slate-700 uppercase border border-slate-200">Status</th>
                                    <th className="px-5 py-4 text-left text-11px font-bold text-slate-700 uppercase border border-slate-200">Last Restocked</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.items.map((item: any, index: number) => (
                                    <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-5 py-4 text-slate-900 font-semibold border border-slate-200">{item.name}</td>
                                        <td className="px-5 py-4 border border-slate-200">
                                            <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-12px font-bold">
                                                {item.category}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-center text-slate-900 font-bold text-16px border border-slate-200">{item.currentStock}</td>
                                        <td className="px-5 py-4 text-slate-600 font-medium border border-slate-200">{item.unit}</td>
                                        <td className="px-5 py-4 text-center border border-slate-200">
                                            <span className={`px-3 py-1.5 rounded-full text-11px font-bold uppercase ${
                                                item.status === 'Out of Stock' ? 'bg-danger/10 text-danger border border-danger/20' :
                                                item.status === 'Low Stock' ? 'bg-warning/10 text-warning border border-warning/20' :
                                                item.status === 'Watch' ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                                                'bg-success/10 text-success border border-success/20'
                                            }`}>
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-slate-600 border border-slate-200">
                                            {item.lastRestocked ? new Date(item.lastRestocked).toLocaleDateString() : 'N/A'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Report Footer */}
            <div className="mt-8 pt-6 border-t-2 border-slate-200">
                <div className="flex items-center justify-between">
                    <div className="text-12px text-slate-600">
                        <p className="font-bold">Report Generated: {new Date().toLocaleString()}</p>
                        <p className="mt-1">RCA Health Facility Management System</p>
                    </div>
                    <div className="text-right text-12px text-slate-600">
                        <p className="font-bold">Inventory Management</p>
                        <p className="mt-1">Confidential Medical Document</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export default ReportsPage;
