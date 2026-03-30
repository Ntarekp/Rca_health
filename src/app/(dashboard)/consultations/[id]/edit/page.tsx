"use client";

import { useEffect, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';
import { authenticatedFetch } from '@/utils/api';

const EditConsultationPage = () => {
    const router = useRouter();
    const params = useParams();
    const consultationId = params.id as string;

    const [students, setStudents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [visitDateTimeInput, setVisitDateTimeInput] = useState('');
    const [formData, setFormData] = useState({
        studentId: '',
        visitDateTime: '',
        complaint: '',
        symptoms: [] as string[],
        temp: '',
        bp: '',
        pulse: '',
        spo2: '',
        painScore: '',
        weight: '',
        diagnosis: '',
        treatment: '',
        prescription: '',
        disposition: 'Returned to Class',
        notes: '',
        facilityUsed: 'School Infirmary'
    });

    useEffect(() => {
        const fetchData = async () => {
            if (!consultationId) return;

            try {
                const [consultationRes, studentsRes] = await Promise.all([
                    authenticatedFetch(`/api/visits/${consultationId}`),
                    authenticatedFetch('/api/students')
                ]);

                if (!consultationRes.ok) {
                    setLoading(false);
                    return;
                }

                const data = await consultationRes.json();
                if (studentsRes.ok) {
                    const studentsData = await studentsRes.json();
                    setStudents(studentsData);
                }

                let parsedVitals: any = {};
                if (data.vitals) {
                    try {
                        parsedVitals = typeof data.vitals === 'string' ? JSON.parse(data.vitals) : data.vitals;
                    } catch {
                        parsedVitals = {};
                    }
                }

                let complaintText = data.chiefComplaint || '';
                let symptoms: string[] = [];
                const symptomsMatch = complaintText.match(/\((.+?)\)/);
                if (symptomsMatch) {
                    symptoms = symptomsMatch[1].split(',').map((s: string) => s.trim()).filter(Boolean);
                    complaintText = complaintText.replace(/\s*\(.+?\)/, '').trim();
                }

                const treatmentNotes = data.treatmentNotes || '';
                const getField = (label: string) => {
                    const match = treatmentNotes.match(new RegExp(`${label}:\\s*(.+?)(?=\\n|$)`, 'i'));
                    return match ? match[1].trim() : '';
                };

                setFormData({
                    studentId: data.studentId ? String(data.studentId) : '',
                    visitDateTime: data.visitDateTime || '',
                    complaint: complaintText,
                    symptoms,
                    temp: parsedVitals.temp || '',
                    bp: parsedVitals.bp || '',
                    pulse: parsedVitals.pulse || '',
                    spo2: parsedVitals.spo2 || '',
                    painScore: parsedVitals.painScore || '',
                    weight: parsedVitals.weight || '',
                    diagnosis: data.diagnosis || '',
                    treatment: getField('Treatment'),
                    prescription: getField('Prescription'),
                    disposition: getField('Disposition') || 'Returned to Class',
                    notes: getField('Notes'),
                    facilityUsed: data.facilityUsed || 'School Infirmary'
                });

                if (data.visitDateTime) {
                    setVisitDateTimeInput(new Date(data.visitDateTime).toISOString().slice(0, 16));
                }
            } catch (error) {
                console.error('Error loading consultation:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [consultationId]);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSymptomsChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const symptoms = value
            .split(',')
            .map(item => item.trim())
            .filter(Boolean);
        setFormData(prev => ({ ...prev, symptoms }));
    };

    const handleDateTimeChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setVisitDateTimeInput(value);
        setFormData(prev => ({ ...prev, visitDateTime: value }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!consultationId) return;

        setSaving(true);
        try {
            const vitals = {
                temp: formData.temp,
                bp: formData.bp,
                pulse: formData.pulse,
                spo2: formData.spo2,
                painScore: formData.painScore,
                weight: formData.weight
            };

            const payload = {
                studentId: Number(formData.studentId),
                visitDateTime: formData.visitDateTime || new Date().toISOString(),
                chiefComplaint: formData.complaint + (formData.symptoms.length > 0 ? ` (${formData.symptoms.join(', ')})` : ''),
                vitals: JSON.stringify(vitals),
                diagnosis: formData.diagnosis,
                treatmentNotes: `Treatment: ${formData.treatment}\nPrescription: ${formData.prescription}\nNotes: ${formData.notes}\nDisposition: ${formData.disposition}`,
                facilityUsed: formData.facilityUsed || 'School Infirmary'
            };

            const response = await authenticatedFetch(`/api/visits/${consultationId}`, {
                method: 'PUT',
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                router.push(`/consultations/${consultationId}`);
            } else {
                console.error('Failed to update consultation');
            }
        } catch (error) {
            console.error('Error updating consultation:', error);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="max-w-[900px] mx-auto pb-10">Loading consultation...</div>;
    }

    return (
        <div className="max-w-[900px] mx-auto pb-10">
            <div className="flex items-center justify-between mb-6">
                <button
                    onClick={() => router.push('/consultations')}
                    className="flex items-center gap-2 text-text-secondary hover:text-primary"
                >
                    <ArrowLeft size={16} />
                    Back to consultations
                </button>
                <h1 className="text-20px font-semibold text-primary">Edit Consultation</h1>
            </div>

            <form onSubmit={handleSubmit} className="bg-bg-card border border-border rounded-10 p-6 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-13px font-medium text-text-secondary mb-2">Student</label>
                        <select
                            name="studentId"
                            value={formData.studentId}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-border rounded-5"
                            required
                        >
                            <option value="">Select student</option>
                            {students.map((student) => (
                                <option key={student.studentId} value={student.studentId}>
                                    {student.firstName} {student.lastName}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-13px font-medium text-text-secondary mb-2">Date & Time</label>
                        <input
                            type="datetime-local"
                            name="visitDateTime"
                            value={visitDateTimeInput}
                            onChange={handleDateTimeChange}
                            className="w-full px-3 py-2 border border-border rounded-5"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-13px font-medium text-text-secondary mb-2">Chief Complaint</label>
                    <input
                        type="text"
                        name="complaint"
                        value={formData.complaint}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-border rounded-5"
                        required
                    />
                </div>

                <div>
                    <label className="block text-13px font-medium text-text-secondary mb-2">Symptoms (comma separated)</label>
                    <input
                        type="text"
                        value={formData.symptoms.join(', ')}
                        onChange={handleSymptomsChange}
                        className="w-full px-3 py-2 border border-border rounded-5"
                    />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <input type="text" name="temp" value={formData.temp} onChange={handleInputChange} placeholder="Temp" className="px-3 py-2 border border-border rounded-5" />
                    <input type="text" name="bp" value={formData.bp} onChange={handleInputChange} placeholder="BP" className="px-3 py-2 border border-border rounded-5" />
                    <input type="text" name="pulse" value={formData.pulse} onChange={handleInputChange} placeholder="Pulse" className="px-3 py-2 border border-border rounded-5" />
                    <input type="text" name="spo2" value={formData.spo2} onChange={handleInputChange} placeholder="SPO2" className="px-3 py-2 border border-border rounded-5" />
                    <input type="text" name="painScore" value={formData.painScore} onChange={handleInputChange} placeholder="Pain Score" className="px-3 py-2 border border-border rounded-5" />
                    <input type="text" name="weight" value={formData.weight} onChange={handleInputChange} placeholder="Weight" className="px-3 py-2 border border-border rounded-5" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <textarea name="diagnosis" value={formData.diagnosis} onChange={handleInputChange} placeholder="Diagnosis" className="px-3 py-2 border border-border rounded-5 min-h-[96px]" />
                    <textarea name="treatment" value={formData.treatment} onChange={handleInputChange} placeholder="Treatment" className="px-3 py-2 border border-border rounded-5 min-h-[96px]" />
                    <textarea name="prescription" value={formData.prescription} onChange={handleInputChange} placeholder="Prescription" className="px-3 py-2 border border-border rounded-5 min-h-[96px]" />
                    <textarea name="notes" value={formData.notes} onChange={handleInputChange} placeholder="Notes" className="px-3 py-2 border border-border rounded-5 min-h-[96px]" />
                </div>

                <div>
                    <label className="block text-13px font-medium text-text-secondary mb-2">Disposition</label>
                    <select name="disposition" value={formData.disposition} onChange={handleInputChange} className="w-full px-3 py-2 border border-border rounded-5">
                        <option value="Returned to Class">Return to Class</option>
                        <option value="Sent Home">Send Home</option>
                        <option value="Transferred">Transfer to Hospital</option>
                        <option value="Admitted">Admit to Infirmary</option>
                    </select>
                </div>

                <div className="flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={() => router.push(`/consultations/${consultationId}`)}
                        className="px-4 py-2 border border-border rounded-5"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={saving}
                        className="px-4 py-2 bg-primary text-white rounded-5 flex items-center gap-2"
                    >
                        <Save size={16} />
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditConsultationPage;
