"use client";

import React from 'react';
import { Download, TrendingUp, AlertTriangle, Clock, Plus, Minus } from 'lucide-react';
import StatsCards from '@/components/StatsCards';
import Charts from '@/components/Charts';

const AnalyticsPage = () => {
    return (
        <div className="pb-10">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-24px font-semibold text-primary mb-1">Analytics Dashboard</h1>
                    <p className="text-12px text-text-tertiary">Comprehensive insights into student health and system usage</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-5 text-14px font-medium hover:bg-primary-dark transition-all shadow-sm">
                    <Download size={16} />
                    <span>Export Data</span>
                </button>
            </div>

            <div className="space-y-10">
                {/* Stats Section */}
                <StatsCards />

                {/* Main Charts Section */}
                <Charts />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Key Insights */}
                    <div className="bg-bg-card border border-border rounded-10 p-6 shadow-sm">
                        <div className="flex items-center gap-2 mb-6">
                            <TrendingUp size={18} className="text-primary" />
                            <h3 className="text-16px font-bold text-text-primary">Key Health Insights</h3>
                        </div>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-4 p-4 bg-success/5 rounded-10 border border-success/10 group hover:bg-success/10 transition-colors">
                                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-success border border-success/20 shadow-sm">
                                    <TrendingUp size={18} />
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-14px font-bold text-text-primary">Vaccination Compliance Up</h4>
                                    <p className="text-12px text-text-secondary mt-1">98% of students have updated medical records this month.</p>
                                </div>
                                <span className="text-10px font-bold text-success">+4.2%</span>
                            </li>
                            <li className="flex items-start gap-4 p-4 bg-warning/5 rounded-10 border border-warning/10 group hover:bg-warning/10 transition-colors">
                                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-warning-dark border border-warning/20 shadow-sm">
                                    <AlertTriangle size={18} />
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-14px font-bold text-text-primary">Common Cold Peak</h4>
                                    <p className="text-12px text-text-secondary mt-1">Increase in flu-like symptoms reported in S4 and S5 classes.</p>
                                </div>
                                <span className="text-10px font-bold text-warning-dark">Alert</span>
                            </li>
                            <li className="flex items-start gap-4 p-4 bg-primary/5 rounded-10 border border-primary/10 group hover:bg-primary/10 transition-colors">
                                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary border border-primary/20 shadow-sm">
                                    <TrendingUp size={18} />
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-14px font-bold text-text-primary">Medical Supply Stability</h4>
                                    <p className="text-12px text-text-secondary mt-1">Core medications (Paracetamol, Amoxicillin) are at optimal levels.</p>
                                </div>
                                <span className="text-10px font-bold text-primary">Stable</span>
                            </li>
                        </ul>
                    </div>

                    {/* Recent Activity */}
                    <div className="bg-bg-card border border-border rounded-10 p-6 shadow-sm">
                        <div className="flex items-center gap-2 mb-6">
                            <Clock size={18} className="text-primary" />
                            <h3 className="text-16px font-bold text-text-primary">System Activity</h3>
                        </div>
                        <div className="space-y-0 relative before:absolute before:left-5 before:top-2 before:bottom-2 before:w-[2px] before:bg-border-light">
                            <div className="flex items-start gap-5 relative group pb-6">
                                <div className="w-10 h-10 rounded-full bg-white border-2 border-primary flex items-center justify-center z-10 text-primary">
                                    <Plus size={16} strokeWidth={3} />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-center bg-bg-secondary/30 p-3 rounded-8 border border-border group-hover:bg-primary/5 transition-all">
                                        <div>
                                            <h4 className="text-14px font-bold text-text-primary">New Consultation</h4>
                                            <p className="text-12px text-text-tertiary">Student: <strong>Keza Sarah</strong> - Complaint: Headache</p>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-10px text-text-tertiary font-bold block">2 hrs ago</span>
                                            <span className="text-12px font-bold text-success">+ Record</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-start gap-5 relative group pb-6">
                                <div className="w-10 h-10 rounded-full bg-white border-2 border-success flex items-center justify-center z-10 text-success">
                                    <Plus size={16} strokeWidth={3} />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-center bg-bg-secondary/30 p-3 rounded-8 border border-border group-hover:bg-success/5 transition-all">
                                        <div>
                                            <h4 className="text-14px font-bold text-text-primary">Lab Test Completed</h4>
                                            <p className="text-12px text-text-tertiary">Test: <strong>Malaria Screening</strong> - Result: Negative</p>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-10px text-text-tertiary font-bold block">5 hrs ago</span>
                                            <span className="text-12px font-bold text-success">+ Lab Result</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-start gap-5 relative group">
                                <div className="w-10 h-10 rounded-full bg-white border-2 border-primary flex items-center justify-center z-10 text-primary">
                                    <Plus size={16} strokeWidth={3} />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-center bg-bg-secondary/30 p-3 rounded-8 border border-border group-hover:bg-primary/5 transition-all">
                                        <div>
                                            <h4 className="text-14px font-bold text-text-primary">Student Registered</h4>
                                            <p className="text-12px text-text-tertiary">Student: <strong>Manzi David</strong> - Class: S4 MPC</p>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-10px text-text-tertiary font-bold block">1 day ago</span>
                                            <span className="text-12px font-bold text-primary">+ Student</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsPage;
