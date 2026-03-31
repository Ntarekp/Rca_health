"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Save, ArrowLeft, FlaskConical, AlertCircle, Loader2 } from 'lucide-react';
import { authenticatedFetch } from '@/utils/api';

const EditLabResultPage = () => {
    const router = useRouter();
    const params = useParams();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        testName: '',
        testCategory: '',
        resultValue: '',
        referenceRange: '',
        unit: '',
        status: 'PENDING',
        priority: 'ROUTINE',
        technicianName: '',
        clinicalNotes: '',
        technicianRemarks: ''
    });

    useEffect(() => {
        const fetchLabResult = async () => {
            try {
                const response = await authenticatedFetch(`/api/labs/${params.id}`);
                if (response.ok) {
                    const data = await response.json();
                    setFormData({
                        testName: data.testName || '',
                        testCategory: data.testCategory || '',
                        resultValue: data.resultValue || '',
                        referenceRange: data.referenceRange || '',
                        unit: data.unit || '',
                        status: data.status || 'PENDING',
                        priority: data.priority || 'ROUTINE',
                        technicianName: data.technicianName || '',
                        clinicalNotes: data.clinicalNotes || '',
                        technicianRemarks: data.technicianRemarks || ''
                    });
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const response = await authenticatedFetch(`/api/labs/${params.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Failed to update lab result');
            }

            router.push(`/lab/${params.id}`);
        } catch (error) {
            console.error('Error updating lab result:', error);
            alert('Failed to update lab result. Please try again.');
        } finally {
            setSubmitting(false);
        }
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

    return (
        <div className="max-w-[900px] mx-auto pb-10">
            <div className="flex items-center gap-3 mb-6">
                <button
                    onClick={() => router.push(`/lab/${params.id}`)}
                    className="flex items-center gap-2 text-slate-600 hover:text-primary transition-colors font-medium"
                >
                    <ArrowLeft size={18} />
                    <span className="text-14px">Back to Result</span>
                </button>
            </div>

            <div className="mb-6">
                <h1 className="text-28px font-extrabold text-slate-900">Edit Lab Result</h1>
                <p className="text-14px text-slate-600 mt-1">Update test results and technician remarks</p>
            </div>

            <div className="bg-white border-2 border-slate-200 rounded-16 shadow-lg p-8">
                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Test Information */}
                    <div>
                        <h3 className="flex items-center gap-2 text-18px font-extrabold text-slate-900 mb-6 pb-3 border-b-2 border-slate-200">
                            <FlaskConical size={20} className="text-primary" />
                            Test Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col gap-2">
                                <label className="text-12px font-bold text-slate-700 uppercase tracking-wider">Test Name</label>
                                <input
                                    type="text"
                                    name="testName"
                                    value={formData.testName}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 border-2 border-slate-300 rounded-10 text-14px font-medium outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 bg-white"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-12px font-bold text-slate-700 uppercase tracking-wider">Test Category</label>
                                <input
                                    type="text"
                                    name="testCategory"
                                    value={formData.testCategory}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border-2 border-slate-300 rounded-10 text-14px font-medium outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 bg-white"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Result Details */}
                    <div>
                        <h3 className="flex items-center gap-2 text-18px font-extrabold text-slate-900 mb-6 pb-3 border-b-2 border-slate-200">
                            Result Details
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="flex flex-col gap-2">
                                <label className="text-12px font-bold text-slate-700 uppercase tracking-wider">Result Value *</label>
                                <input
                                    type="text"
                                    name="resultValue"
                                    value={formData.resultValue}
                                    onChange={handleChange}
                                    required
                                    placeholder="e.g., Negative, 120, Normal"
                                    className="w-full px-4 py-3 border-2 border-slate-300 rounded-10 text-14px font-medium outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 bg-white"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-12px font-bold text-slate-700 uppercase tracking-wider">Reference Range</label>
                                <input
                                    type="text"
                                    name="referenceRange"
                                    value={formData.referenceRange}
                                    onChange={handleChange}
                                    placeholder="e.g., 70-110, Negative"
                                    className="w-full px-4 py-3 border-2 border-slate-300 rounded-10 text-14px font-medium outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 bg-white"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-12px font-bold text-slate-700 uppercase tracking-wider">Unit</label>
                                <input
                                    type="text"
                                    name="unit"
                                    value={formData.unit}
                                    onChange={handleChange}
                                    placeholder="e.g., mg/dL, mmol/L"
                                    className="w-full px-4 py-3 border-2 border-slate-300 rounded-10 text-14px font-medium outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 bg-white"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Status and Priority */}
                    <div>
                        <h3 className="flex items-center gap-2 text-18px font-extrabold text-slate-900 mb-6 pb-3 border-b-2 border-slate-200">
                            Status & Priority
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="flex flex-col gap-2">
                                <label className="text-12px font-bold text-slate-700 uppercase tracking-wider">Status *</label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 border-2 border-slate-300 rounded-10 text-14px font-medium outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 bg-white"
                                >
                                    <option value="PENDING">Pending</option>
                                    <option value="IN_PROGRESS">In Progress</option>
                                    <option value="COMPLETED">Completed</option>
                                    <option value="CANCELLED">Cancelled</option>
                                </select>
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-12px font-bold text-slate-700 uppercase tracking-wider">Priority</label>
                                <select
                                    name="priority"
                                    value={formData.priority}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border-2 border-slate-300 rounded-10 text-14px font-medium outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 bg-white"
                                >
                                    <option value="ROUTINE">Routine</option>
                                    <option value="URGENT">Urgent</option>
                                    <option value="STAT">STAT (Immediate)</option>
                                </select>
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-12px font-bold text-slate-700 uppercase tracking-wider">Technician Name</label>
                                <input
                                    type="text"
                                    name="technicianName"
                                    value={formData.technicianName}
                                    onChange={handleChange}
                                    placeholder="Lab Technician Name"
                                    className="w-full px-4 py-3 border-2 border-slate-300 rounded-10 text-14px font-medium outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 bg-white"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Notes */}
                    <div>
                        <h3 className="flex items-center gap-2 text-18px font-extrabold text-slate-900 mb-6 pb-3 border-b-2 border-slate-200">
                            Additional Information
                        </h3>
                        <div className="space-y-6">
                            <div className="flex flex-col gap-2">
                                <label className="text-12px font-bold text-slate-700 uppercase tracking-wider">Clinical Notes</label>
                                <textarea
                                    name="clinicalNotes"
                                    value={formData.clinicalNotes}
                                    onChange={handleChange}
                                    rows={3}
                                    placeholder="Clinical indication or reason for test..."
                                    className="w-full px-4 py-3 border-2 border-slate-300 rounded-10 text-14px font-medium outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 resize-none"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-12px font-bold text-slate-700 uppercase tracking-wider">Technician's Remarks</label>
                                <textarea
                                    name="technicianRemarks"
                                    value={formData.technicianRemarks}
                                    onChange={handleChange}
                                    rows={3}
                                    placeholder="Technical observations, quality control notes, or interpretation..."
                                    className="w-full px-4 py-3 border-2 border-slate-300 rounded-10 text-14px font-medium outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 resize-none"
                                />
                            </div>
                        </div>
                    </div>

                    {formData.status === 'COMPLETED' && !formData.resultValue && (
                        <div className="p-4 bg-warning/10 border-2 border-warning/30 rounded-12 flex items-start gap-3">
                            <AlertCircle size={20} className="text-warning mt-0.5 flex-shrink-0" />
                            <div className="space-y-1">
                                <p className="text-14px font-bold text-warning">Missing Result Value</p>
                                <p className="text-13px text-warning/80 font-medium">
                                    Please enter a result value before marking this test as completed.
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end gap-3 pt-6 border-t-2 border-slate-200">
                        <button
                            type="button"
                            onClick={() => router.push(`/lab/${params.id}`)}
                            className="px-6 py-3 border-2 border-slate-300 rounded-10 text-14px font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-6 py-3 bg-primary text-white rounded-10 text-14px font-bold hover:bg-primary-dark transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {submitting ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save size={18} />
                                    Save Changes
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditLabResultPage;
