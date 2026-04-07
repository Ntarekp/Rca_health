"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Save, User, Activity, FileText, ClipboardList, X } from 'lucide-react';
import { useAcademicYear } from '@/context/AcademicYearContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { authenticatedFetch } from '@/utils/api';

const NewConsultationPage = () => {
    const router = useRouter();
    const { t, locale } = useLanguage();
    const { academicYears, selectedYearId: globalSelectedYearId } = useAcademicYear();
    const [classes, setClasses] = useState<any[]>([]);
    const [students, setStudents] = useState<any[]>([]);
    const [selectedYearId, setSelectedYearId] = useState('');
    const [selectedClassId, setSelectedClassId] = useState('');
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

    const commonSymptoms = [
        { key: 'headache', label: t('consultation.headache') },
        { key: 'fever', label: t('consultation.fever') },
        { key: 'stomachPain', label: t('consultation.stomachPain') },
        { key: 'cough', label: t('consultation.cough') },
        { key: 'dizziness', label: t('consultation.dizziness') },
        { key: 'nausea', label: t('consultation.nausea') },
        { key: 'fatigue', label: t('consultation.fatigue') }
    ];

    // Default to globally selected year (active year from context)
    useEffect(() => {
        if (globalSelectedYearId) {
            setSelectedYearId(globalSelectedYearId);
            return;
        }

        if (academicYears.length > 0 && !selectedYearId) {
            const activeYear = academicYears.find((year: any) => Boolean(year.isActive ?? year.active));
            setSelectedYearId((activeYear?.id ?? academicYears[0].id).toString());
        }
    }, [globalSelectedYearId, academicYears, selectedYearId]);

    // Fetch classes when academic year is selected
    useEffect(() => {
        if (selectedYearId) {
            const fetchClasses = async () => {
                try {
                    const response = await authenticatedFetch(`/api/academic/years/${selectedYearId}/classes`);
                    if (response.ok) {
                        const data = await response.json();
                        setClasses(data);
                        setSelectedClassId(''); // Reset class selection
                        setStudents([]); // Clear students
                    }
                } catch (error) {
                    console.error('Error fetching classes:', error);
                }
            };
            fetchClasses();
        } else {
            setClasses([]);
            setStudents([]);
            setSelectedClassId('');
        }
    }, [selectedYearId]);

    // Fetch students when class is selected
    useEffect(() => {
        if (selectedClassId) {
            const fetchStudents = async () => {
                try {
                    const response = await authenticatedFetch('/api/students');
                    if (response.ok) {
                        const allStudents = await response.json();
                        // Filter students by selected class
                        const filteredStudents = allStudents.filter(
                            (student: any) => student.schoolClass?.id?.toString() === selectedClassId
                        );
                        setStudents(filteredStudents);
                    }
                } catch (error) {
                    console.error('Error fetching students:', error);
                }
            };
            fetchStudents();
        } else {
            setStudents([]);
        }
    }, [selectedClassId]);

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
            const response = await authenticatedFetch('/api/visits', {
                method: 'POST',
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
                <h1 className="text-24px font-semibold text-primary mb-1">{t('consultation.newConsultation')}</h1>
                <p className="text-12px text-text-tertiary">{t('consultation.subtitle')}</p>
            </div>

            <div className="bg-bg-card border border-border rounded-10 shadow-sm p-8">
                <form onSubmit={handleSubmit} className="space-y-10">
                    {/* Student Selection */}
                    <div>
                        <h3 className="flex items-center gap-2 text-16px font-semibold text-primary mb-6 pb-2 border-b border-border-light">
                            <User size={18} className="text-primary" />
                            {t('consultation.studentInformation')}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="flex flex-col gap-2">
                                <label className="text-13px font-semibold text-text-primary">{t('consultation.academicYear')} <span className="text-error">*</span></label>
                                <select
                                    value={selectedYearId}
                                    onChange={(e) => setSelectedYearId(e.target.value)}
                                    required
                                    className="w-full px-4 py-2.5 bg-white border-2 border-border rounded-10 text-14px font-medium outline-none transition-all hover:border-primary/30 focus:border-primary focus:ring-4 focus:ring-primary/10 appearance-none cursor-pointer"
                                >
                                    <option value="">Select Year</option>
                                    {academicYears.map(year => (
                                        <option key={year.id} value={year.id}>
                                            {year.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-13px font-semibold text-text-primary">{t('consultation.class')} <span className="text-error">*</span></label>
                                <select
                                    value={selectedClassId}
                                    onChange={(e) => setSelectedClassId(e.target.value)}
                                    required
                                    disabled={!selectedYearId}
                                    className="w-full px-4 py-2.5 bg-white border-2 border-border rounded-10 text-14px font-medium outline-none transition-all hover:border-primary/30 focus:border-primary focus:ring-4 focus:ring-primary/10 appearance-none cursor-pointer disabled:bg-bg-secondary disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    <option value="">{t('consultation.selectClass')}</option>
                                    {classes.map(cls => (
                                        <option key={cls.id} value={cls.id}>
                                            {cls.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-13px font-semibold text-text-primary">{t('consultation.student')} <span className="text-error">*</span></label>
                                <select
                                    name="studentId"
                                    value={formData.studentId}
                                    onChange={handleChange}
                                    required
                                    disabled={!selectedClassId}
                                    className="w-full px-4 py-2.5 bg-white border-2 border-border rounded-10 text-14px font-medium outline-none transition-all hover:border-primary/30 focus:border-primary focus:ring-4 focus:ring-primary/10 appearance-none cursor-pointer disabled:bg-bg-secondary disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    <option value="">{t('consultation.selectStudent')}</option>
                                    {students.map(student => (
                                        <option key={student.studentId} value={student.studentId}>
                                            {student.firstName} {student.lastName} - {student.schoolId}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        {!selectedYearId && (
                            <p className="text-12px text-text-tertiary mt-2">Please select an academic year first</p>
                        )}
                        {selectedYearId && !selectedClassId && (
                            <p className="text-12px text-text-tertiary mt-2">{t('consultation.pleaseSelectClass')}</p>
                        )}
                        {selectedClassId && students.length === 0 && (
                            <p className="text-12px text-warning mt-2">No students found in this class</p>
                        )}
                    </div>

                    {/* Vitals */}
                    <div>
                        <h3 className="flex items-center gap-2 text-16px font-semibold text-primary mb-6 pb-2 border-b border-border-light">
                            <Activity size={18} className="text-primary" />
                            {t('consultation.vitalSigns')}
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <div className="flex flex-col gap-2">
                                <label className="text-13px font-semibold text-text-primary">{t('consultation.temperature')}</label>
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
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-6 border-t border-border-light">
                        <button
                            type="button"
                            className="px-6 py-2 border border-border rounded-5 text-14px font-medium text-text-secondary hover:bg-bg-primary transition-colors flex items-center gap-2"
                            onClick={() => router.push('/consultations')}
                        >
                            <X size={18} />
                            {t('common.cancel')}
                        </button>
                        <button type="submit" className="px-6 py-2 bg-primary border border-primary text-white rounded-5 text-14px font-medium hover:bg-primary-dark transition-colors flex items-center gap-2 shadow-sm">
                            <Save size={18} />
                            {t('common.save')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default NewConsultationPage;
