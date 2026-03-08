"use client";

import React, { useState, useEffect } from 'react';
import { Plus, Calendar, BookOpen, Trash2, Check } from 'lucide-react';
import { useAcademicYear } from '@/context/AcademicYearContext';

const AcademicPage = () => {
    const { academicYears, selectedYearId, setSelectedYearId } = useAcademicYear();
    const [activeTab, setActiveTab] = useState<'years' | 'classes'>('years');
    const [classes, setClasses] = useState<any[]>([]);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    // Form states
    const [newYear, setNewYear] = useState({ name: '', startDate: '', endDate: '', isActive: false });
    const [newClass, setNewClass] = useState({ name: '' });

    const [loading, setLoading] = useState(false);

    // When switching to classes tab, ensure we fetch classes for the global selected year
    useEffect(() => {
        if (activeTab === 'classes' && selectedYearId) {
            fetchClasses(selectedYearId);
        }
    }, [activeTab, selectedYearId, refreshTrigger]);

    const fetchClasses = async (yearId: string) => {
        try {
            const response = await fetch(`http://127.0.0.1:8081/health/api/academic/years/${yearId}/classes`);
            if (response.ok) {
                const data = await response.json();
                setClasses(data);
            }
        } catch (error) {
            console.error('Error fetching classes:', error);
        }
    };

    const handleCreateYear = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch('http://127.0.0.1:8081/health/api/academic/years', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newYear)
            });
            if (response.ok) {
                setNewYear({ name: '', startDate: '', endDate: '', isActive: false });
                setRefreshTrigger(prev => prev + 1); // Trigger a refresh indirectly
            }
        } catch (error) {
            console.error('Error creating year:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateClass = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedYearId) return;
        setLoading(true);
        try {
            const payload = {
                name: newClass.name,
                academicYear: { id: selectedYearId }
            };
            const response = await fetch('http://127.0.0.1:8081/health/api/academic/classes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (response.ok) {
                setNewClass({ name: '' });
                fetchClasses(selectedYearId);
            }
        } catch (error) {
            console.error('Error creating class:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 pb-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-24px font-semibold text-primary">Academic Management</h1>
                    <p className="text-12px text-text-tertiary">Manage academic years and class structures</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-border">
                <button
                    className={`px-6 py-3 text-14px font-medium transition-colors border-b-2 ${activeTab === 'years' ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:text-primary'}`}
                    onClick={() => setActiveTab('years')}
                >
                    Academic Years
                </button>
                <button
                    className={`px-6 py-3 text-14px font-medium transition-colors border-b-2 ${activeTab === 'classes' ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:text-primary'}`}
                    onClick={() => setActiveTab('classes')}
                >
                    Classes
                </button>
            </div>

            {activeTab === 'years' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Create Year Form */}
                    <div className="lg:col-span-1">
                        <div className="bg-bg-card border border-border rounded-10 p-6 shadow-sm">
                            <h3 className="text-16px font-semibold text-primary mb-4">Add New Academic Year</h3>
                            <form onSubmit={handleCreateYear} className="space-y-4">
                                <div>
                                    <label className="text-12px font-medium text-text-secondary block mb-1.5">Year Name</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. 2024-2025"
                                        value={newYear.name}
                                        onChange={(e) => setNewYear({ ...newYear, name: e.target.value })}
                                        className="w-full px-3 py-2 border border-border rounded-5 text-13px outline-none focus:border-primary"
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-12px font-medium text-text-secondary block mb-1.5">Start Date</label>
                                        <input
                                            type="date"
                                            value={newYear.startDate}
                                            onChange={(e) => setNewYear({ ...newYear, startDate: e.target.value })}
                                            className="w-full px-3 py-2 border border-border rounded-5 text-13px outline-none focus:border-primary"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="text-12px font-medium text-text-secondary block mb-1.5">End Date</label>
                                        <input
                                            type="date"
                                            value={newYear.endDate}
                                            onChange={(e) => setNewYear({ ...newYear, endDate: e.target.value })}
                                            className="w-full px-3 py-2 border border-border rounded-5 text-13px outline-none focus:border-primary"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="isActive"
                                        checked={newYear.isActive}
                                        onChange={(e) => setNewYear({ ...newYear, isActive: e.target.checked })}
                                        className="rounded border-border text-primary focus:ring-primary"
                                    />
                                    <label htmlFor="isActive" className="text-13px text-text-secondary">Set as Active Year</label>
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-2 bg-primary text-white rounded-5 text-13px font-medium hover:bg-primary-dark transition-colors disabled:opacity-50"
                                >
                                    {loading ? 'Creating...' : 'Create Year'}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Years List */}
                    <div className="lg:col-span-2">
                        <div className="bg-bg-card border border-border rounded-10 overflow-hidden shadow-sm">
                            <table className="w-full text-left">
                                <thead className="bg-bg-secondary border-b border-border">
                                    <tr>
                                        <th className="px-6 py-3 text-12px font-medium text-text-primary">Name</th>
                                        <th className="px-6 py-3 text-12px font-medium text-text-primary">Start Date</th>
                                        <th className="px-6 py-3 text-12px font-medium text-text-primary">End Date</th>
                                        <th className="px-6 py-3 text-12px font-medium text-text-primary">Status</th>
                                        <th className="px-6 py-3 text-12px font-medium text-text-primary text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border-light">
                                    {academicYears.map((year) => (
                                        <tr key={year.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-3 text-13px font-medium text-text-primary">{year.name}</td>
                                            <td className="px-6 py-3 text-13px text-text-secondary">{year.startDate}</td>
                                            <td className="px-6 py-3 text-13px text-text-secondary">{year.endDate}</td>
                                            <td className="px-6 py-3">
                                                {year.isActive ? (
                                                    <span className="px-2 py-0.5 bg-success/10 text-success text-10px font-bold rounded-full border border-success/20">ACTIVE</span>
                                                ) : (
                                                    <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-10px font-bold rounded-full">INACTIVE</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-3 text-right">
                                                <button className="text-text-tertiary hover:text-error transition-colors">
                                                    <Trash2 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'classes' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Create Class Form */}
                    <div className="lg:col-span-1">
                        <div className="bg-bg-card border border-border rounded-10 p-6 shadow-sm">
                            <h3 className="text-16px font-semibold text-primary mb-4">Add Class to Year</h3>
                            <div className="mb-4">
                                <label className="text-12px font-medium text-text-secondary block mb-1.5">Selected Academic Year</label>
                                <div className="w-full px-3 py-2 border border-border rounded-5 text-13px bg-gray-50 text-text-primary font-medium">
                                    {academicYears.find(y => y.id.toString() === selectedYearId)?.name || 'Select a year in Sidebar'}
                                </div>
                                {!selectedYearId && <p className="text-10px text-error mt-1">Please select an academic year from the sidebar.</p>}
                            </div>
                            <form onSubmit={handleCreateClass} className="space-y-4">
                                <div>
                                    <label className="text-12px font-medium text-text-secondary block mb-1.5">Class Name</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. S4 MPC"
                                        value={newClass.name}
                                        onChange={(e) => setNewClass({ ...newClass, name: e.target.value })}
                                        className="w-full px-3 py-2 border border-border rounded-5 text-13px outline-none focus:border-primary"
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading || !selectedYearId}
                                    className="w-full py-2 bg-primary text-white rounded-5 text-13px font-medium hover:bg-primary-dark transition-colors disabled:opacity-50"
                                >
                                    {loading ? 'Creating...' : 'Add Class'}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Classes List */}
                    <div className="lg:col-span-2">
                        <div className="bg-bg-card border border-border rounded-10 overflow-hidden shadow-sm">
                            <div className="p-4 border-b border-border bg-bg-secondary flex justify-between items-center">
                                <h4 className="text-13px font-semibold text-text-primary">
                                    Classes for {academicYears.find(y => y.id.toString() === selectedYearId)?.name || 'Selected Year'}
                                </h4>
                                <span className="text-12px text-text-tertiary">{classes.length} Classes</span>
                            </div>
                            <div className="p-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                                {classes.length === 0 ? (
                                    <p className="col-span-full text-center text-13px text-text-tertiary py-4">No classes found for this year.</p>
                                ) : (
                                    classes.map((cls) => (
                                        <div key={cls.id} className="flex items-center justify-between p-3 border border-border rounded-5 bg-white hover:border-primary/50 transition-colors group">
                                            <span className="text-13px font-medium text-text-primary">{cls.name}</span>
                                            <button className="text-text-tertiary hover:text-error opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AcademicPage;
