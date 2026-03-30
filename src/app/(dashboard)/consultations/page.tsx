"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LayoutGrid, List as ListIcon, Plus, Eye, Edit2 } from 'lucide-react';
import { apiUrl } from '@/utils/api';

const ConsultationsPage = () => {
    const router = useRouter();
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
    const [consultations, setConsultations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchConsultations = async () => {
            try {
                const response = await fetch(apiUrl('/api/visits'));
                if (response.ok) {
                    const data = await response.json();
                    const mappedData = data.map((item: any) => ({
                        id: item.visitId,
                        date: new Date(item.visitDateTime).toLocaleDateString(),
                        time: new Date(item.visitDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        student: item.studentName,
                        complaint: item.chiefComplaint,
                        diagnosis: item.diagnosis,
                        treatment: 'N/A', // Not in DTO yet
                        disposition: 'N/A', // Not in DTO yet
                        handledBy: 'Nurse', // Placeholder
                        status: 'completed' // Placeholder
                    }));
                    setConsultations(mappedData);
                }
            } catch (error) {
                console.error('Error fetching consultations:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchConsultations();
    }, []);

    if (loading) {
        return <div>Loading consultations...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-24px font-semibold text-primary">Consultations</h1>
                    <p className="text-12px text-text-tertiary">View and manage all student consultations</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
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
                        onClick={() => router.push('/consultations/new')}
                    >
                        <Plus size={18} />
                        <span className="text-14px font-medium">New Consultation</span>
                    </button>
                </div>
            </div>

            {viewMode === 'list' ? (
                <div className="bg-bg-card border border-border rounded-10 overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-bg-secondary border-b border-border">
                                    <th className="px-6 py-4 text-12px font-medium text-text-primary">Date & Time</th>
                                    <th className="px-6 py-4 text-12px font-medium text-text-primary">Student</th>
                                    <th className="px-6 py-4 text-12px font-medium text-text-primary">Complaint</th>
                                    <th className="px-6 py-4 text-12px font-medium text-text-primary">Diagnosis</th>
                                    <th className="px-6 py-4 text-12px font-medium text-text-primary">Disposition</th>
                                    <th className="px-6 py-4 text-12px font-medium text-text-primary">Handled By</th>
                                    <th className="px-6 py-4 text-12px font-medium text-text-primary">Status</th>
                                    <th className="px-6 py-4 text-12px font-medium text-text-primary">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border-light">
                                {consultations.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="px-6 py-4 text-center text-12px text-text-tertiary">No consultations found.</td>
                                    </tr>
                                ) : (
                                    consultations.map((consultation) => (
                                        <tr key={consultation.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="text-12px font-medium text-text-primary">{consultation.date}</span>
                                                    <span className="text-8px text-text-tertiary">{consultation.time}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-12px font-medium text-primary">{consultation.student}</td>
                                            <td className="px-6 py-4 text-12px text-text-secondary">{consultation.complaint}</td>
                                            <td className="px-6 py-4 text-12px text-text-secondary">{consultation.diagnosis}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-0.5 rounded-full text-8px font-medium inline-block bg-gray-100 text-gray-600`}>
                                                    {consultation.disposition}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-12px text-text-secondary">{consultation.handledBy}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-0.5 rounded-full text-8px font-medium inline-block bg-success/20 text-success`}>
                                                    {consultation.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex gap-2">
                                                    <button
                                                        className="p-1.5 border border-border rounded-5 text-text-secondary hover:text-primary hover:border-primary transition-all"
                                                        onClick={() => router.push(`/consultations/${consultation.id}`)}
                                                    >
                                                        <Eye size={16} />
                                                    </button>
                                                    <button className="p-1.5 border border-border rounded-5 text-text-secondary hover:text-primary hover:border-primary transition-all">
                                                        <Edit2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {consultations.map((consultation) => (
                        <div key={consultation.id} className="bg-bg-card border border-border rounded-10 p-5 flex flex-col gap-4 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start gap-3">
                                <div>
                                    <h3 className="text-18px font-medium text-text-primary leading-tight">{consultation.student}</h3>
                                    <span className="text-8px text-text-tertiary uppercase tracking-wider">{consultation.date} {consultation.time}</span>
                                </div>
                                <span className={`px-2 py-0.5 rounded-full text-8px font-medium bg-success/20 text-success`}>
                                    {consultation.status}
                                </span>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center py-1.5 border-b border-border-light last:border-0">
                                    <span className="text-12px text-text-tertiary">Complaint</span>
                                    <span className="text-12px font-semibold text-text-primary text-right">{consultation.complaint}</span>
                                </div>
                                <div className="flex justify-between items-center py-1.5 border-b border-border-light last:border-0">
                                    <span className="text-12px text-text-tertiary">Diagnosis</span>
                                    <span className="text-12px font-semibold text-text-primary text-right">{consultation.diagnosis}</span>
                                </div>
                                <div className="flex justify-between items-center py-1.5 border-b border-border-light last:border-0">
                                    <span className="text-12px text-text-tertiary">Disposition</span>
                                    <span className={`text-12px font-semibold text-right text-gray-600`}>
                                        {consultation.disposition}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center py-1.5 border-b border-border-light last:border-0">
                                    <span className="text-12px text-text-tertiary">Handled By</span>
                                    <span className="text-12px font-semibold text-text-primary text-right">{consultation.handledBy}</span>
                                </div>
                            </div>

                            <div className="flex gap-2 mt-auto">
                                <button
                                    className="flex-1 py-2 bg-primary text-white rounded-5 text-12px font-medium hover:bg-primary-dark transition-colors"
                                    onClick={() => router.push(`/consultations/${consultation.id}`)}
                                >
                                    View Details
                                </button>
                                <button className="flex-1 py-2 border border-border text-primary rounded-5 text-12px font-medium hover:bg-gray-50 transition-colors">
                                    Edit
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ConsultationsPage;
