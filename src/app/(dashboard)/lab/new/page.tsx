"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Save, User, FileText, FlaskConical, AlertCircle, X, Check, Loader2 } from 'lucide-react';
import { authenticatedFetch } from '@/utils/api';

const NewLabRequestPage = () => {
    const router = useRouter();
    const [students, setStudents] = useState<any[]>([]);
    const [visits, setVisits] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        visitId: '',
        priority: 'ROUTINE',
        clinicalNotes: '',
        selectedTests: [] as { testName: string; testCategory: string }[]
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [studentsRes, visitsRes] = await Promise.all([
                    authenticatedFetch('/api/students'),
                    authenticatedFetch('/api/visits')
                ]);
                
                if (studentsRes.ok) {
                    const studentsData = await studentsRes.json();
                    setStudents(studentsData);
                }
                
                if (visitsRes.ok) {
                    const visitsData = await visitsRes.json();
                    setVisits(visitsData);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const labTests = [
        { id: 'malaria', name: 'Malaria Smear', category: 'Microbiology' },
        { id: 'cbc', name: 'Full Blood Count (CBC)', category: 'Hematology' },
        { id: 'urinalysis', name: 'Urinalysis', category: 'Clinical Microscopy' },
        { id: 'stool', name: 'Stool Analysis', category: 'Microbiology' },
        { id: 'pregnancy', name: 'Pregnancy Test', category: 'Serology' },
        { id: 'widal', name: 'Widal Test', category: 'Serology' },
        { id: 'bg', name: 'Blood Glucose', category: 'Chemistry' },
        { id: 'hiv', name: 'HIV Screening', category: 'Serology' },
        { id: 'hbsag', name: 'Hepatitis B Surface Antigen', category: 'Serology' },
        { id: 'creatinine', name: 'Serum Creatinine', category: 'Chemistry' },
        { id: 'lipid', name: 'Lipid Profile', category: 'Chemistry' },
        { id: 'liver', name: 'Liver Function Test', category: 'Chemistry' },
    ];

    const toggleTest = (test: { id: string; name: string; category: string }) => {
        setFormData(prev => {
            const isSelected = prev.selectedTests.some(t => t.testName === test.name);
            return {
                ...prev,
                selectedTests: isSelected
                    ? prev.selectedTests.filter(t => t.testName !== test.name)
                    : [...prev.selectedTests, { testName: test.name, testCategory: test.category }]
            };
        });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const labRequests = formData.selectedTests.map(test => ({
                testName: test.testName,
                testCategory: test.testCategory,
                status: 'PENDING',
                priority: formData.priority,
                clinicalNotes: formData.clinicalNotes
            }));

            for (const labRequest of labRequests) {
                const response = await authenticatedFetch(`/api/visits/${formData.visitId}/labs`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(labRequest),
                });

                if (!response.ok) {
                    throw new Error('Failed to create lab request');
                }
            }

            router.push('/lab');
        } catch (error) {
            console.error('Error submitting lab request:', error);
            alert('Failed to submit lab request. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center space-y-3">
                    <FlaskConical className="animate-pulse mx-auto text-primary" size={40} />
                    <p className="text-14px font-medium text-slate-600">Loading form data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-[900px] mx-auto pb-10">
            <div className="mb-8">
                <h1 className="text-24px font-semibold text-primary mb-1">New Lab Request</h1>
                <p className="text-12px text-text-tertiary">Order laboratory tests for a student</p>
            </div>

            <div className="bg-bg-card border border-border rounded-10 shadow-sm p-8">
                <form onSubmit={handleSubmit} className="space-y-10">
                    {/* Student & Priority */}
                    <div>
                        <h3 className="flex items-center gap-2 text-16px font-semibold text-primary mb-6 pb-2 border-b border-border-light">
                            <User size={18} className="text-primary" />
                            Patient Details
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-13px font-medium text-text-secondary">Select Visit</label>
                                <select
                                    name="visitId"
                                    value={formData.visitId}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-border rounded-5 text-14px outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 bg-white"
                                >
                                    <option value="">Select a visit...</option>
                                    {visits.map((visit) => {
                                        const student = students.find(s => s.studentId === visit.student?.studentId);
                                        const studentName = student ? `${student.firstName} ${student.lastName}` : 'Unknown';
                                        const visitDate = new Date(visit.visitDateTime).toLocaleDateString();
                                        return (
                                            <option key={visit.visitId} value={visit.visitId}>
                                                {studentName} - {visitDate} ({visit.chiefComplaint || 'General Visit'})
                                            </option>
                                        );
                                    })}
                                </select>
                                <p className="text-11px text-slate-500 mt-1">Select the visit for which you want to order lab tests</p>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-13px font-medium text-text-secondary">Priority Level</label>
                                <select
                                    name="priority"
                                    value={formData.priority}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-border rounded-5 text-14px outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 bg-white"
                                >
                                    <option value="ROUTINE">Routine</option>
                                    <option value="URGENT">Urgent</option>
                                    <option value="STAT">STAT (Immediate)</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Test Selection */}
                    <div>
                        <h3 className="flex items-center gap-2 text-16px font-semibold text-primary mb-6 pb-2 border-b border-border-light">
                            <FlaskConical size={18} className="text-primary" />
                            Test Selection
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {labTests.map(test => (
                                <button
                                    key={test.id}
                                    type="button"
                                    onClick={() => toggleTest(test)}
                                    className={`flex flex-col items-start p-4 border rounded-10 text-left transition-all relative overflow-hidden group ${formData.selectedTests.some(t => t.testName === test.name)
                                            ? 'bg-primary/5 border-primary shadow-sm ring-1 ring-primary/20'
                                            : 'bg-white border-border hover:border-primary/30 hover:bg-bg-primary'
                                        }`}
                                >
                                    {formData.selectedTests.some(t => t.testName === test.name) && (
                                        <div className="absolute top-0 right-0 p-1.5 bg-primary text-white rounded-bl-8">
                                            <Check size={12} strokeWidth={4} />
                                        </div>
                                    )}
                                    <h4 className={`text-14px font-bold leading-tight ${formData.selectedTests.some(t => t.testName === test.name) ? 'text-primary' : 'text-text-primary'}`}>
                                        {test.name}
                                    </h4>
                                    <p className="text-11px text-text-tertiary mt-1 font-medium uppercase tracking-wider">{test.category}</p>
                                </button>
                            ))}
                        </div>
                        {formData.selectedTests.length === 0 && (
                            <p className="mt-3 text-12px text-error/70 flex items-center gap-1.5 px-1 font-medium">
                                <AlertCircle size={14} />
                                Please select at least one test to proceed.
                            </p>
                        )}
                    </div>

                    {/* Clinical Info */}
                    <div>
                        <h3 className="flex items-center gap-2 text-16px font-semibold text-primary mb-6 pb-2 border-b border-border-light">
                            <FileText size={18} className="text-primary" />
                            Clinical Information
                        </h3>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-13px font-medium text-text-secondary">Clinical Notes / Diagnosis / History</label>
                            <textarea
                                name="clinicalNotes"
                                value={formData.clinicalNotes}
                                onChange={handleChange}
                                rows={4}
                                placeholder="Reason for test request, relevant medical history, or clinical suspicion..."
                                required
                                className="w-full px-4 py-2 border border-border rounded-5 text-14px outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 min-h-[120px]"
                            />
                        </div>
                    </div>

                    {formData.priority !== 'ROUTINE' && (
                        <div className="p-4 bg-error/5 border border-error/10 rounded-8 flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                            <AlertCircle size={20} className="text-error mt-0.5 flex-shrink-0" />
                            <div className="space-y-1">
                                <p className="text-14px font-bold text-error leading-none">High Priority Request</p>
                                <p className="text-13px text-error/80 leading-relaxed font-medium">
                                    Please ensure the lab technician is notified verbally for urgent/stat cases to prioritize processing.
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end gap-3 pt-6 border-t border-border-light">
                        <button
                            type="button"
                            className="px-6 py-2 border border-border rounded-5 text-14px font-medium text-text-secondary hover:bg-bg-primary transition-colors flex items-center gap-2"
                            onClick={() => router.push('/lab')}
                        >
                            <X size={18} />
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={formData.selectedTests.length === 0 || submitting}
                            className="px-6 py-2 bg-primary border border-primary text-white rounded-5 text-14px font-medium hover:bg-primary-dark transition-colors flex items-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed group"
                        >
                            {submitting ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" />
                                    Submitting...
                                </>
                            ) : (
                                <>
                                    <Save size={18} className="group-hover:scale-110 transition-transform" />
                                    Submit Request
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default NewLabRequestPage;
