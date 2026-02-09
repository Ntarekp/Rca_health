"use client";

import React, { useState } from 'react';
import { FileText, Download, Calendar, Filter, ArrowRight, Activity, AlertCircle, CheckCircle2 } from 'lucide-react';

const ReportsPage = () => {
    const [reportType, setReportType] = useState('monthly');
    const [dateRange, setDateRange] = useState({
        start: '2024-01-01',
        end: '2024-01-31'
    });

    // Mock Data for Health System
    const reportData = {
        summary: {
            totalStudents: 1245,
            criticalCases: 12,
            referrals: 8,
            consultations: 450,
            prescriptions: 320,
            newAdmissions: 45,
            discharges: 42
        },
        topDiagnoses: [
            { name: 'Malaria', cases: 145, percentage: '32%' },
            { name: 'Flu/Cold', cases: 120, percentage: '26%' },
            { name: 'Headache', cases: 85, percentage: '18%' },
            { name: 'Sports Injury', cases: 45, percentage: '10%' }
        ],
        trends: [
            { month: 'Jan', consultations: 180, referrals: 2 },
            { month: 'Feb', consultations: 250, referrals: 5 },
            { month: 'Mar', consultations: 160, referrals: 1 }
        ]
    };

    return (
        <div className="pb-10">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-10">
                <div className="space-y-1">
                    <h1 className="text-24px font-semibold text-primary">Health & System Reports</h1>
                    <p className="text-12px text-text-tertiary font-medium">Generate, analyze and export medical facility data</p>
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                    <div className="relative flex-1 lg:flex-none">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" size={14} />
                        <select
                            className="w-full lg:w-auto pl-9 pr-6 py-2 bg-white border border-border rounded-8 text-13px font-bold text-text-primary outline-none focus:border-primary transition-colors appearance-none"
                            value={reportType}
                            onChange={(e) => setReportType(e.target.value)}
                        >
                            <option value="daily">Daily Report</option>
                            <option value="weekly">Weekly Report</option>
                            <option value="monthly">Monthly Report</option>
                            <option value="quarterly">3 Month Report</option>
                            <option value="yearly">Annual Report</option>
                        </select>
                    </div>
                    <div className="flex items-center gap-2 bg-white border border-border rounded-8 p-1 shadow-sm">
                        <input
                            type="date"
                            className="px-2 py-1 text-12px font-bold text-text-secondary border-none bg-transparent outline-none"
                            value={dateRange.start}
                            onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                        />
                        <span className="text-text-tertiary text-10px font-black">TO</span>
                        <input
                            type="date"
                            className="px-2 py-1 text-12px font-bold text-text-secondary border-none bg-transparent outline-none"
                            value={dateRange.end}
                            onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                        />
                    </div>
                    <button className="flex items-center gap-2 px-5 py-2 bg-primary text-white rounded-8 text-14px font-bold hover:bg-primary-dark transition-all shadow-md shadow-primary/20">
                        <ArrowRight size={18} className="rotate-[-45deg]" />
                        <span>Generate</span>
                    </button>
                    <button className="flex items-center gap-2 px-5 py-2 border border-border bg-white text-text-primary rounded-8 text-14px font-bold hover:bg-bg-primary transition-all">
                        <Download size={18} />
                        <span>PDF</span>
                    </button>
                </div>
            </div>

            <div className="space-y-8">
                {/* Summary Dashboard */}
                <div className="bg-bg-card border border-border rounded-12 p-8 shadow-sm">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-2 bg-primary/5 rounded-6">
                            <Activity size={20} className="text-primary" />
                        </div>
                        <h3 className="text-18px font-bold text-text-primary">Executive Summary</h3>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
                        <div className="space-y-2">
                            <span className="text-10px font-extrabold text-text-tertiary uppercase tracking-widest block">Consultations</span>
                            <span className="text-28px font-black text-text-primary block leading-none">{reportData.summary.consultations}</span>
                            <div className="text-[10px] font-bold text-success flex items-center gap-1">↑ 12% increase</div>
                        </div>
                        <div className="space-y-2">
                            <span className="text-10px font-extrabold text-text-tertiary uppercase tracking-widest block">Critical Cases</span>
                            <span className="text-28px font-black text-warning-dark block leading-none">{reportData.summary.criticalCases}</span>
                            <div className="text-[10px] font-bold text-error flex items-center gap-1">⚠ High Priority</div>
                        </div>
                        <div className="space-y-2">
                            <span className="text-10px font-extrabold text-text-tertiary uppercase tracking-widest block">System Referrals</span>
                            <span className="text-28px font-black text-error block leading-none">{reportData.summary.referrals}</span>
                            <div className="text-[10px] font-bold text-text-tertiary">To External Facilities</div>
                        </div>
                        <div className="space-y-2">
                            <span className="text-10px font-extrabold text-text-tertiary uppercase tracking-widest block">Prescriptions</span>
                            <span className="text-28px font-black text-text-primary block leading-none">{reportData.summary.prescriptions}</span>
                            <div className="text-[10px] font-bold text-primary">Medication Handled</div>
                        </div>
                        <div className="space-y-2">
                            <span className="text-10px font-extrabold text-text-tertiary uppercase tracking-widest block">Admissions</span>
                            <span className="text-28px font-black text-success block leading-none">{reportData.summary.newAdmissions}</span>
                            <div className="text-[10px] font-bold text-success">New Infirmary Stays</div>
                        </div>
                        <div className="space-y-2">
                            <span className="text-10px font-extrabold text-text-tertiary uppercase tracking-widest block">Discharges</span>
                            <span className="text-28px font-black text-text-primary block leading-none">{reportData.summary.discharges}</span>
                            <div className="text-[10px] font-bold text-text-tertiary">Cleared Patients</div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Top Diagnoses Section */}
                    <div className="bg-bg-card border border-border rounded-12 p-6 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-16px font-bold text-text-primary flex items-center gap-2">
                                <AlertCircle size={18} className="text-warning-dark" />
                                Morbidity Analysis
                            </h3>
                            <span className="text-10px font-black text-text-tertiary uppercase bg-bg-secondary px-2 py-1 rounded">Top 5 Diagnoses</span>
                        </div>
                        <div className="overflow-hidden border border-border rounded-8">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-bg-secondary/50">
                                    <tr>
                                        <th className="px-5 py-3 text-10px font-black text-text-tertiary uppercase tracking-wider border-b border-border">Common Diagnosis</th>
                                        <th className="px-5 py-3 text-10px font-black text-text-tertiary uppercase tracking-wider border-b border-border text-center">Cases</th>
                                        <th className="px-5 py-3 text-10px font-black text-text-tertiary uppercase tracking-wider border-b border-border text-right">% Distribution</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border-light text-13px font-bold">
                                    {reportData.topDiagnoses.map((item, index) => (
                                        <tr key={index} className="hover:bg-bg-primary/50 transition-colors">
                                            <td className="px-5 py-3 text-text-primary">{item.name}</td>
                                            <td className="px-5 py-3 text-text-secondary text-center font-black">{item.cases}</td>
                                            <td className="px-5 py-3 text-right">
                                                <span className="inline-block px-2 py-0.5 bg-primary/5 text-primary rounded-4 min-w-[50px]">{item.percentage}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Trends Section */}
                    <div className="bg-bg-card border border-border rounded-12 p-6 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-16px font-bold text-text-primary flex items-center gap-2">
                                <FileText size={18} className="text-primary" />
                                Comparative Trends
                            </h3>
                            <span className="text-10px font-black text-text-tertiary uppercase bg-bg-secondary px-2 py-1 rounded">Q1 Comparison</span>
                        </div>
                        <div className="overflow-hidden border border-border rounded-8">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-bg-secondary/50">
                                    <tr>
                                        <th className="px-5 py-3 text-10px font-black text-text-tertiary uppercase tracking-wider border-b border-border">Reporting Period</th>
                                        <th className="px-5 py-3 text-10px font-black text-text-tertiary uppercase tracking-wider border-b border-border">Volume</th>
                                        <th className="px-5 py-3 text-10px font-black text-text-tertiary uppercase tracking-wider border-b border-border text-right">Medical Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border-light text-13px font-bold">
                                    {reportData.trends.map((trend, index) => (
                                        <tr key={index} className="hover:bg-bg-primary/50 transition-colors">
                                            <td className="px-5 py-3 text-text-primary flex items-center gap-3">
                                                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                                {trend.month} 2024
                                            </td>
                                            <td className="px-5 py-3 text-success font-black">{trend.consultations} Visits</td>
                                            <td className="px-5 py-3 text-right">
                                                <span className={`px-2 py-0.5 rounded-4 text-10px ${trend.referrals > 2 ? 'bg-error/10 text-error' : 'bg-success/10 text-success'}`}>
                                                    {trend.referrals} Referrals
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="mt-6 pt-6 border-t border-border-light flex items-center gap-3">
                            <CheckCircle2 size={16} className="text-success" />
                            <p className="text-11px font-bold text-text-secondary leading-tight italic">
                                Data integrity verified. System generated report as of {new Date().toLocaleDateString()}.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReportsPage;
