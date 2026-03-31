"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Printer, FlaskConical, User, AlertCircle, Calendar, Clock, CheckCircle, Edit } from 'lucide-react';
import { authenticatedFetch } from '@/utils/api';

const LabResultDetailsPage = () => {
    const router = useRouter();
    const params = useParams();
    const [labResult, setLabResult] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLabResult = async () => {
            try {
                const response = await authenticatedFetch(`/api/labs/${params.id}`);
                if (response.ok) {
                    const data = await response.json();
                    setLabResult(data);
                }
            } catch (error) {
                console.error('Error fetching lab result:', error);
            } finally {
                setLoading(false);
            }
        };

        if (params.id) {
            fetchLabResult();
        }
    }, [params.id]);

    const handlePrint = () => {
        window.print();
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center space-y-3">
                    <FlaskConical className="animate-pulse mx-auto text-primary" size={40} />
                    <p className="text-14px font-medium text-slate-600">Loading lab result...</p>
                </div>
            </div>
        );
    }

    if (!labResult) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center space-y-3">
                    <AlertCircle className="mx-auto text-danger" size={40} />
                    <p className="text-14px font-medium text-slate-600">Lab result not found</p>
                    <button
                        onClick={() => router.push('/lab')}
                        className="text-primary hover:underline text-12px font-medium"
                    >
                        Return to Lab Tests
                    </button>
                </div>
            </div>
        );
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'COMPLETED': return 'bg-success/10 text-success border-success/20';
            case 'IN_PROGRESS': return 'bg-primary/10 text-primary border-primary/20';
            case 'PENDING': return 'bg-warning/10 text-warning border-warning/20';
            case 'CANCELLED': return 'bg-danger/10 text-danger border-danger/20';
            default: return 'bg-slate-100 text-slate-600 border-slate-200';
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'STAT': return 'bg-danger text-white';
            case 'URGENT': return 'bg-warning text-white';
            case 'ROUTINE': return 'bg-slate-500 text-white';
            default: return 'bg-slate-400 text-white';
        }
    };

    return (
        <div className="max-w-[1000px] mx-auto pb-10">
            <div className="flex justify-between items-center mb-6">
                <button
                    onClick={() => router.push('/lab')}
                    className="flex items-center gap-2 text-slate-600 hover:text-primary transition-colors font-medium"
                >
                    <ArrowLeft size={18} />
                    <span className="text-14px">Back to Laboratory Tests</span>
                </button>
                <div className="flex gap-3">
                    <button 
                        onClick={() => router.push(`/lab/${params.id}/edit`)}
                        className="flex items-center gap-2 text-slate-700 bg-white px-4 py-2 rounded-10 hover:bg-slate-50 transition-colors border-2 border-slate-300 shadow-sm"
                    >
                        <Edit size={16} />
                        <span className="text-14px font-bold">Edit Result</span>
                    </button>
                    <button 
                        onClick={handlePrint}
                        className="flex items-center gap-2 text-white bg-primary px-4 py-2 rounded-10 hover:bg-primary-dark transition-colors shadow-sm"
                    >
                        <Printer size={16} />
                        <span className="text-14px font-bold">Print Report</span>
                    </button>
                </div>
            </div>

            <div className="bg-white border-2 border-slate-200 rounded-16 shadow-lg p-8">
                <div className="border-b-2 border-slate-200 pb-6 mb-8">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                        <div>
                            <div className="flex items-center gap-3 mb-3">
                                <span className={`px-3 py-1.5 text-10px font-bold rounded-full uppercase tracking-wider border-2 ${getStatusColor(labResult.status)}`}>
                                    {labResult.status?.replace('_', ' ')}
                                </span>
                                <span className={`px-3 py-1.5 text-10px font-bold rounded-full uppercase tracking-wider ${getPriorityColor(labResult.priority)}`}>
                                    {labResult.priority}
                                </span>
                            </div>
                            <h1 className="text-32px font-extrabold text-slate-900 leading-tight">Laboratory Report</h1>
                            <p className="text-16px text-slate-600 mt-2 font-medium">Test ID: #{labResult.labId}</p>
                        </div>
                        <div className="md:text-right space-y-2">
                            <div className="flex items-center gap-2 justify-end text-slate-600">
                                <Calendar size={16} />
                                <p className="text-14px font-semibold">{labResult.testDate ? new Date(labResult.testDate).toLocaleDateString() : 'N/A'}</p>
                            </div>
                            <div className="flex items-center gap-2 justify-end text-slate-600">
                                <Clock size={16} />
                                <p className="text-14px font-semibold">{labResult.testDate ? new Date(labResult.testDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-10">
                    {/* Left Column: Patient Details */}
                    <div className="space-y-6">
                        <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-6 rounded-16 border-2 border-slate-200">
                            <h3 className="flex items-center gap-2 text-16px font-extrabold text-slate-900 mb-5 pb-3 border-b-2 border-slate-300">
                                <User size={18} className="text-primary" />
                                Patient Information
                            </h3>
                            <div className="space-y-4">
                                <div className="flex flex-col gap-1.5">
                                    <span className="text-10px text-slate-500 uppercase tracking-wider font-bold">Student Name</span>
                                    <span className="text-16px font-bold text-slate-900">{labResult.studentName || 'Unknown'}</span>
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <span className="text-10px text-slate-500 uppercase tracking-wider font-bold">Student Code</span>
                                    <span className="text-14px font-semibold text-slate-700">{labResult.studentCode || 'N/A'}</span>
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <span className="text-10px text-slate-500 uppercase tracking-wider font-bold">Visit Date</span>
                                    <span className="text-14px font-semibold text-slate-700">{labResult.visitDate ? new Date(labResult.visitDate).toLocaleDateString() : 'N/A'}</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-gradient-to-br from-primary/5 to-primary/10 p-6 rounded-16 border-2 border-primary/20">
                            <h3 className="flex items-center gap-2 text-16px font-extrabold text-primary mb-5 pb-3 border-b-2 border-primary/30">
                                <FlaskConical size={18} className="text-primary" />
                                Test Information
                            </h3>
                            <div className="space-y-4">
                                <div className="flex flex-col gap-1.5">
                                    <span className="text-10px text-primary/70 uppercase tracking-wider font-bold">Test Category</span>
                                    <span className="text-14px font-bold text-primary">{labResult.testCategory || 'General'}</span>
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <span className="text-10px text-primary/70 uppercase tracking-wider font-bold">Technician</span>
                                    <span className="text-14px font-bold text-primary">{labResult.technicianName || 'Not Assigned'}</span>
                                </div>
                                {labResult.resultDate && (
                                    <div className="flex flex-col gap-1.5">
                                        <span className="text-10px text-primary/70 uppercase tracking-wider font-bold">Result Date</span>
                                        <span className="text-14px font-bold text-primary">{new Date(labResult.resultDate).toLocaleDateString()}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Test Results */}
                    <div className="space-y-6">
                        <div className="border-2 border-slate-200 rounded-16 bg-white overflow-hidden shadow-md">
                            <div className="p-6 border-b-2 border-slate-200 flex justify-between items-center bg-gradient-to-r from-slate-50 to-slate-100">
                                <h3 className="flex items-center gap-2 text-20px font-extrabold text-slate-900">
                                    <CheckCircle size={24} className="text-success" />
                                    Test Results
                                </h3>
                            </div>

                            <div className="p-8 space-y-8">
                                <div className="flex flex-col gap-3">
                                    <h4 className="text-12px font-bold text-slate-500 uppercase tracking-wider">Test Name</h4>
                                    <p className="text-28px font-extrabold text-slate-900">{labResult.testName}</p>
                                </div>

                                <div className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary/20 rounded-16">
                                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                                        <div className="flex flex-col gap-2">
                                            <span className="text-11px font-bold text-primary/70 uppercase tracking-wider">Result Value</span>
                                            <span className="text-36px font-extrabold text-primary leading-none">{labResult.resultValue || 'Pending'}</span>
                                            {labResult.unit && (
                                                <span className="text-14px font-semibold text-primary/60">{labResult.unit}</span>
                                            )}
                                        </div>
                                        {labResult.referenceRange && (
                                            <div className="px-5 py-3 bg-white rounded-12 border-2 border-primary/20 shadow-sm">
                                                <p className="text-10px font-bold text-primary/70 uppercase tracking-wider mb-1">Reference Range</p>
                                                <p className="text-14px font-bold text-primary">{labResult.referenceRange}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {labResult.clinicalNotes && (
                                    <div className="pt-4 border-t-2 border-slate-200">
                                        <h5 className="text-12px font-bold text-slate-500 uppercase tracking-wider mb-3">Clinical Notes</h5>
                                        <p className="text-15px text-slate-700 leading-relaxed bg-slate-50 p-5 rounded-12 border-2 border-slate-200">{labResult.clinicalNotes}</p>
                                    </div>
                                )}

                                {labResult.technicianRemarks && (
                                    <div className="pt-4 border-t-2 border-slate-200">
                                        <h5 className="text-12px font-bold text-slate-500 uppercase tracking-wider mb-3">Technician's Remarks</h5>
                                        <p className="text-15px text-slate-700 italic leading-relaxed bg-amber-50 p-5 rounded-12 border-2 border-amber-200">{labResult.technicianRemarks}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LabResultDetailsPage;
