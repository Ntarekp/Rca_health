"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, User, Activity, FileText, ClipboardList, X } from 'lucide-react';

const NewConsultationPage = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        studentId: '',
        temp: '',
        bp: '',
        pulse: '',
        spo2: '',
        painScore: '',
        weight: '',
        complaint: '',
        symptoms: [] as string[],
        diagnosis: '',
        treatment: '',
        prescription: '',
        disposition: 'Returned to Class',
        notes: ''
    });

    const commonSymptoms = ['Headache', 'Fever', 'Stomach Pain', 'Cough', 'Dizziness', 'Nausea', 'Fatigue'];

    const toggleSymptom = (symptom: string) => {
        setFormData(prev => ({
            ...prev,
            symptoms: prev.symptoms.includes(symptom)
                ? prev.symptoms.filter(s => s !== symptom)
                : [...prev.symptoms, symptom]
        }));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Submitting consultation:', formData);
        router.push('/consultations');
    };

    return (
        <div className="max-w-[900px] mx-auto pb-10">
            <div className="mb-8">
                <h1 className="text-24px font-semibold text-primary mb-1">New Consultation</h1>
                <p className="text-12px text-text-tertiary">Record clinical notes and treatment details</p>
            </div>

            <div className="bg-bg-card border border-border rounded-10 shadow-sm p-8">
                <form onSubmit={handleSubmit} className="space-y-10">
                    {/* Student Selection */}
                    <div>
                        <h3 className="flex items-center gap-2 text-16px font-semibold text-primary mb-6 pb-2 border-b border-border-light">
                            <User size={18} className="text-primary" />
                            Student Information
                        </h3>
                        <div className="flex flex-col gap-1.5 max-w-[400px]">
                            <label className="text-13px font-medium text-text-secondary">Select Student</label>
                            <select
                                name="studentId"
                                value={formData.studentId}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-border rounded-5 text-14px outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 bg-white"
                            >
                                <option value="">Search or select student...</option>
                                <option value="1">Keza Sarah (S4 MPC)</option>
                                <option value="2">Manzi David (S5 PCB)</option>
                                <option value="3">Mutesi Joy (S6 MEC)</option>
                            </select>
                        </div>
                    </div>

                    {/* Vitals */}
                    <div>
                        <h3 className="flex items-center gap-2 text-16px font-semibold text-primary mb-6 pb-2 border-b border-border-light">
                            <Activity size={18} className="text-primary" />
                            Vital Signs
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-13px font-medium text-text-secondary">Temperature</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        name="temp"
                                        value={formData.temp}
                                        onChange={handleChange}
                                        placeholder="36.5"
                                        step="0.1"
                                        className="w-full pl-4 pr-10 py-2 border border-border rounded-5 text-14px outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                                    />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-12px text-text-tertiary">°C</span>
                                </div>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-13px font-medium text-text-secondary">Blood Pressure</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="bp"
                                        value={formData.bp}
                                        onChange={handleChange}
                                        placeholder="120/80"
                                        className="w-full pl-4 pr-14 py-2 border border-border rounded-5 text-14px outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                                    />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-10px text-text-tertiary">mmHg</span>
                                </div>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-13px font-medium text-text-secondary">Pulse Rate</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        name="pulse"
                                        value={formData.pulse}
                                        onChange={handleChange}
                                        placeholder="72"
                                        className="w-full pl-4 pr-12 py-2 border border-border rounded-5 text-14px outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                                    />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-10px text-text-tertiary">bpm</span>
                                </div>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-13px font-medium text-text-secondary">SPO2</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        name="spo2"
                                        value={formData.spo2}
                                        onChange={handleChange}
                                        placeholder="98"
                                        className="w-full pl-4 pr-10 py-2 border border-border rounded-5 text-14px outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                                    />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-12px text-text-tertiary">%</span>
                                </div>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-13px font-medium text-text-secondary">Pain Score</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        name="painScore"
                                        value={formData.painScore}
                                        onChange={handleChange}
                                        placeholder="0"
                                        min="0"
                                        max="10"
                                        className="w-full pl-4 pr-14 py-2 border border-border rounded-5 text-14px outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                                    />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-10px text-text-tertiary">/10</span>
                                </div>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-13px font-medium text-text-secondary">Weight</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        name="weight"
                                        value={formData.weight}
                                        onChange={handleChange}
                                        placeholder="50"
                                        className="w-full pl-4 pr-10 py-2 border border-border rounded-5 text-14px outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                                    />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-12px text-text-tertiary">kg</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Clinical Assessment */}
                    <div>
                        <h3 className="flex items-center gap-2 text-16px font-semibold text-primary mb-6 pb-2 border-b border-border-light">
                            <ClipboardList size={18} className="text-primary" />
                            Clinical Assessment
                        </h3>
                        <div className="space-y-6">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-13px font-medium text-text-secondary">Chief Complaint</label>
                                <input
                                    type="text"
                                    name="complaint"
                                    value={formData.complaint}
                                    onChange={handleChange}
                                    placeholder="Main reason for visit..."
                                    required
                                    className="w-full px-4 py-2 border border-border rounded-5 text-14px outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-13px font-medium text-text-secondary">Common Symptoms</label>
                                <div className="flex flex-wrap gap-2">
                                    {commonSymptoms.map(symptom => (
                                        <button
                                            key={symptom}
                                            type="button"
                                            onClick={() => toggleSymptom(symptom)}
                                            className={`px-3 py-1.5 rounded-5 text-12px font-medium border transition-all ${formData.symptoms.includes(symptom)
                                                ? 'bg-primary text-white border-primary shadow-sm'
                                                : 'bg-bg-secondary text-text-secondary border-border hover:border-primary/30'
                                                }`}
                                        >
                                            {symptom}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-13px font-medium text-text-secondary">Provisional Diagnosis</label>
                                    <textarea
                                        name="diagnosis"
                                        value={formData.diagnosis}
                                        onChange={handleChange}
                                        rows={3}
                                        placeholder="Clinical impression..."
                                        className="w-full px-4 py-2 border border-border rounded-5 text-14px outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 min-h-[100px]"
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-13px font-medium text-text-secondary">Treatment / Procedures</label>
                                    <textarea
                                        name="treatment"
                                        value={formData.treatment}
                                        onChange={handleChange}
                                        rows={3}
                                        placeholder="Immediate care given..."
                                        className="w-full px-4 py-2 border border-border rounded-5 text-14px outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 min-h-[100px]"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Disposition */}
                    <div>
                        <h3 className="flex items-center gap-2 text-16px font-semibold text-primary mb-6 pb-2 border-b border-border-light">
                            <FileText size={18} className="text-primary" />
                            Disposition & Plan
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-13px font-medium text-text-secondary">Prescription</label>
                                <textarea
                                    name="prescription"
                                    value={formData.prescription}
                                    onChange={handleChange}
                                    rows={4}
                                    placeholder="Medications prescribed..."
                                    className="w-full px-4 py-2 border border-border rounded-5 text-14px outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 min-h-[120px]"
                                />
                            </div>
                            <div className="space-y-5">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-13px font-medium text-text-secondary">Disposition</label>
                                    <select
                                        name="disposition"
                                        value={formData.disposition}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-border rounded-5 text-14px outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 bg-white"
                                    >
                                        <option value="Returned to Class">Return to Class</option>
                                        <option value="Sent Home">Send Home</option>
                                        <option value="Transferred">Transfer to Hospital</option>
                                        <option value="Admitted">Admit to Infirmary</option>
                                    </select>
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-13px font-medium text-text-secondary">Additional Notes</label>
                                    <textarea
                                        name="notes"
                                        value={formData.notes}
                                        onChange={handleChange}
                                        rows={3}
                                        placeholder="Any other remarks..."
                                        className="w-full px-4 py-2 border border-border rounded-5 text-14px outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 min-h-[80px]"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-6 border-t border-border-light">
                        <button
                            type="button"
                            className="px-6 py-2 border border-border rounded-5 text-14px font-medium text-text-secondary hover:bg-bg-primary transition-colors flex items-center gap-2"
                            onClick={() => router.push('/consultations')}
                        >
                            <X size={18} />
                            Cancel
                        </button>
                        <button type="submit" className="px-6 py-2 bg-primary border border-primary text-white rounded-5 text-14px font-medium hover:bg-primary-dark transition-colors flex items-center gap-2 shadow-sm">
                            <Save size={18} />
                            Save Record
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default NewConsultationPage;
