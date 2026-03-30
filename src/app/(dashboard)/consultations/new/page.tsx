"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Save, User, Activity, FileText, ClipboardList, X } from 'lucide-react';
import { apiUrl } from '@/utils/api';

const NewConsultationPage = () => {
    const router = useRouter();
    const [students, setStudents] = useState<any[]>([]);
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

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await fetch(apiUrl('/api/students'));
                if (response.ok) {
                    const data = await response.json();
                    setStudents(data);
                }
            } catch (error) {
                console.error('Error fetching students:', error);
            }
        };
        fetchStudents();
    }, []);

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const vitals = {
            temp: formData.temp,
            bp: formData.bp,
            pulse: formData.pulse,
            spo2: formData.spo2,
            painScore: formData.painScore,
            weight: formData.weight
        };

        const payload = {
            studentId: parseInt(formData.studentId),
            visitDateTime: new Date().toISOString(),
            chiefComplaint: formData.complaint + (formData.symptoms.length > 0 ? " (" + formData.symptoms.join(", ") + ")" : ""),
            vitals: JSON.stringify(vitals),
            diagnosis: formData.diagnosis,
            treatmentNotes: `Treatment: ${formData.treatment}\nPrescription: ${formData.prescription}\nNotes: ${formData.notes}\nDisposition: ${formData.disposition}`,
            facilityUsed: 'School Infirmary'
        };

        try {
            const response = await fetch(apiUrl('/api/visits'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                router.push('/consultations');
            } else {
                console.error('Failed to create consultation');
            }
        } catch (error) {
            console.error('Error creating consultation:', error);
        }
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
                        <div className="flex flex-col gap-2 max-w-[400px]">
                            <label className="text-13px font-semibold text-text-primary">Select Student <span className="text-error">*</span></label>
                            <select
                                name="studentId"
                                value={formData.studentId}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2.5 bg-white border-3 border-border rounded-10 text-14px font-medium outline-none transition-all hover:border-primary/30 focus:border-primary focus:ring-4 focus:ring-primary/10 appearance-none cursor-pointer"
                            >
                                <option value="">Search or select student...</option>
                                {students.map(student => (
                                    <option key={student.studentId} value={student.studentId}>
                                        {student.firstName} {student.lastName} ({student.schoolClass ? student.schoolClass.name : 'No Class'})
                                    </option>
                                ))}
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
                            <div className="flex flex-col gap-2">
                                <label className="text-13px font-semibold text-text-primary">Temperature</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        name="temp"
                                        value={formData.temp}
                                        onChange={handleChange}
                                        placeholder="36.5"
                                        step="0.1"
                                        className="w-full pl-4 pr-12 py-2.5 bg-white border-2 border-border rounded-10 text-14px font-medium outline-none transition-all hover:border-primary/30 focus:border-primary focus:ring-4 focus:ring-primary/10"
                                    />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-12px font-bold text-text-tertiary">°C</span>
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
                            <div className="flex flex-col gap-2">
                                <label className="text-13px font-semibold text-text-primary">Chief Complaint <span className="text-error">*</span></label>
                                <input
                                    type="text"
                                    name="complaint"
                                    value={formData.complaint}
                                    onChange={handleChange}
                                    placeholder="Main reason for visit..."
                                    required
                                    className="w-full px-4 py-2.5 bg-white border-2 border-border rounded-10 text-14px font-medium outline-none transition-all hover:border-primary/30 focus:border-primary focus:ring-4 focus:ring-primary/10"
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
                                <div className="flex flex-col gap-2">
                                    <label className="text-13px font-semibold text-text-primary">Provisional Diagnosis</label>
                                    <textarea
                                        name="diagnosis"
                                        value={formData.diagnosis}
                                        onChange={handleChange}
                                        rows={3}
                                        placeholder="Clinical impression..."
                                        className="w-full px-4 py-3 bg-white border-2 border-border rounded-10 text-14px font-medium outline-none transition-all hover:border-primary/30 focus:border-primary focus:ring-4 focus:ring-primary/10 resize-none min-h-[100px]"
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-13px font-semibold text-text-primary">Treatment / Procedures</label>
                                    <textarea
                                        name="treatment"
                                        value={formData.treatment}
                                        onChange={handleChange}
                                        rows={3}
                                        placeholder="Immediate care given..."
                                        className="w-full px-4 py-3 bg-white border-2 border-border rounded-10 text-14px font-medium outline-none transition-all hover:border-primary/30 focus:border-primary focus:ring-4 focus:ring-primary/10 resize-none min-h-[100px]"
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
                            <div className="flex flex-col gap-2">
                                <label className="text-13px font-semibold text-text-primary">Prescription</label>
                                <textarea
                                    name="prescription"
                                    value={formData.prescription}
                                    onChange={handleChange}
                                    rows={4}
                                    placeholder="Medications prescribed..."
                                    className="w-full px-4 py-3 bg-white border-2 border-border rounded-10 text-14px font-medium outline-none transition-all hover:border-primary/30 focus:border-primary focus:ring-4 focus:ring-primary/10 resize-none min-h-[120px]"
                                />
                            </div>
                            <div className="space-y-5">
                                <div className="flex flex-col gap-2">
                                    <label className="text-13px font-semibold text-text-primary">Disposition</label>
                                    <select
                                        name="disposition"
                                        value={formData.disposition}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 bg-white border-2 border-border rounded-10 text-14px font-medium outline-none transition-all hover:border-primary/30 focus:border-primary focus:ring-4 focus:ring-primary/10 appearance-none cursor-pointer"
                                    >
                                        <option value="Returned to Class">Return to Class</option>
                                        <option value="Sent Home">Send Home</option>
                                        <option value="Transferred">Transfer to Hospital</option>
                                        <option value="Admitted">Admit to Infirmary</option>
                                    </select>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-13px font-semibold text-text-primary">Additional Notes</label>
                                    <textarea
                                        name="notes"
                                        value={formData.notes}
                                        onChange={handleChange}
                                        rows={3}
                                        placeholder="Any other remarks..."
                                        className="w-full px-4 py-3 bg-white border-2 border-border rounded-10 text-14px font-medium outline-none transition-all hover:border-primary/30 focus:border-primary focus:ring-4 focus:ring-primary/10 resize-none min-h-[80px]"
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
