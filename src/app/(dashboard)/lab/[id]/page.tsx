"use client";

import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Printer, FlaskConical, User, AlertCircle } from 'lucide-react';

const LabResultDetailsPage = () => {
    const router = useRouter();
    const params = useParams();

    // Mock Data - In a real app, fetch based on params.id
    const labResult = {
        id: params.id || '1',
        student: 'Keza Sarah',
        code: 'RCA-2024-001',
        age: '16',
        gender: 'Female',
        type: 'Laboratory',
        testName: 'Malaria Smear',
        date: '2024-02-08',
        time: '10:30 AM',
        status: 'Completed',
        result: 'Negative',
        doctor: 'Lab Tech Jean',
        priority: 'Urgent',
        notes: 'No parasites seen.'
    };

    return (
        <div className="max-w-[1000px] mx-auto pb-10">
            <div className="flex justify-between items-center mb-6">
                <button
                    onClick={() => router.push('/lab')}
                    className="flex items-center gap-2 text-text-secondary hover:text-primary transition-colors"
                >
                    <ArrowLeft size={18} />
                    <span>Back to Lab & History</span>
                </button>
                <button className="flex items-center gap-2 text-primary bg-primary/5 px-4 py-2 rounded-5 hover:bg-primary/10 transition-colors border border-primary/10 shadow-sm">
                    <Printer size={16} />
                    <span className="text-14px font-medium">Print Report</span>
                </button>
            </div>

            <div className="bg-bg-card border border-border rounded-10 shadow-sm p-8">
                <div className="border-b border-border-light pb-6 mb-8">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                        <div>
                            <span className={`px-3 py-1 text-10px font-bold rounded-full uppercase tracking-wider ${labResult.status === 'Completed' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning-dark'}`}>
                                {labResult.status}
                            </span>
                            <h1 className="text-28px font-bold text-text-primary mt-3 leading-tight">Lab Report #{labResult.id}</h1>
                            <p className="text-14px text-text-tertiary mt-1">{labResult.date} at {labResult.time}</p>
                        </div>
                        <div className="md:text-right">
                            <p className="text-12px font-medium text-text-tertiary uppercase tracking-wider mb-1">Performed by</p>
                            <p className="text-16px font-semibold text-text-primary">{labResult.doctor}</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-10">
                    {/* Left Column: Patient Details */}
                    <div className="space-y-6">
                        <div className="bg-bg-secondary p-5 rounded-10 border border-border">
                            <h3 className="flex items-center gap-2 text-14px font-bold text-text-primary mb-4 pb-2 border-b border-border">
                                <User size={16} className="text-text-tertiary" />
                                Patient Details
                            </h3>
                            <div className="space-y-4">
                                <div className="flex flex-col gap-1">
                                    <span className="text-10px text-text-tertiary uppercase tracking-wider font-semibold">Name</span>
                                    <span className="text-14px font-medium text-text-primary">{labResult.student}</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-10px text-text-tertiary uppercase tracking-wider font-semibold">ID Code</span>
                                    <span className="text-14px font-medium text-text-primary">{labResult.code}</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-10px text-text-tertiary uppercase tracking-wider font-semibold">Age / Gender</span>
                                    <span className="text-14px font-medium text-text-primary">{labResult.age} / {labResult.gender}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Test Results */}
                    <div className="space-y-6">
                        <div className="border border-border rounded-10 bg-white overflow-hidden">
                            <div className="p-6 border-b border-border-light flex justify-between items-center bg-bg-secondary/30">
                                <h3 className="flex items-center gap-2 text-18px font-bold text-text-primary">
                                    <FlaskConical size={22} className="text-primary" />
                                    Test Results
                                </h3>
                                {labResult.priority === 'Urgent' && (
                                    <span className="flex items-center gap-1.5 text-10px font-bold text-error bg-error/10 px-2 py-1 rounded uppercase tracking-wider border border-error/10">
                                        <AlertCircle size={12} />
                                        Urgent
                                    </span>
                                )}
                            </div>

                            <div className="p-6 space-y-8">
                                <div className="flex flex-col gap-3">
                                    <h4 className="text-14px font-bold text-text-secondary uppercase tracking-wide">Primary Investigation</h4>
                                    <p className="text-22px font-bold text-text-primary">{labResult.testName}</p>
                                </div>

                                <div className="p-5 bg-primary/5 border border-primary/10 rounded-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-12px font-medium text-primary/70 uppercase tracking-wider">Final Result</span>
                                        <span className="text-24px font-bold text-primary">{labResult.result}</span>
                                    </div>
                                    <div className="px-4 py-2 bg-white rounded-5 border border-primary/10 text-12px font-medium text-primary">
                                        Reference: Negative
                                    </div>
                                </div>

                                <div className="pt-2 border-t border-border-light">
                                    <h5 className="text-12px font-bold text-text-tertiary uppercase tracking-wider mb-3">Technician's Remarks</h5>
                                    <p className="text-15px text-text-secondary italic leading-relaxed bg-bg-secondary p-4 rounded-8 border border-border">"{labResult.notes}"</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LabResultDetailsPage;
