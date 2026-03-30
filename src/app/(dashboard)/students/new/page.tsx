"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Save, X } from 'lucide-react';
import { useAcademicYear } from '@/context/AcademicYearContext';
import { apiUrl } from '@/utils/api';

const StudentRegistrationPage = () => {
    const router = useRouter();
    const { selectedYearId, academicYears } = useAcademicYear();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        gender: '',
        studentId: '',
        classId: '',
        insuranceProvider: '',
        insuranceNumber: '',
        parentName: '',
        parentPhone: '',
        allergies: '',
        medicalConditions: '',
    });

    const [selectedYear, setSelectedYear] = useState<string>('');
    const [classes, setClasses] = useState<any[]>([]);

    useEffect(() => {
        if (selectedYearId) {
            setSelectedYear(selectedYearId);
        } else if (academicYears.length > 0) {
            setSelectedYear(academicYears[0].id);
        }
    }, [selectedYearId, academicYears]);

    useEffect(() => {
        if (selectedYear) {
            const fetchClasses = async () => {
                try {
                    const response = await fetch(apiUrl(`/api/academic/years/${selectedYear}/classes`));
                    if (response.ok) {
                        const data = await response.json();
                        setClasses(data);
                    }
                } catch (error) {
                    console.error('Error fetching classes:', error);
                }
            };
            fetchClasses();
        } else {
            setClasses([]);
        }
    }, [selectedYear]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Send simplified schoolClass object with just ID
            const schoolClassPayload = formData.classId ? { id: parseInt(formData.classId) } : null;

            const payload = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                dateOfBirth: formData.dateOfBirth,
                gender: formData.gender,
                schoolId: formData.studentId,
                schoolClass: schoolClassPayload,
                insuranceProvider: formData.insuranceProvider,
                insuranceNumber: formData.insuranceNumber,
                parentName: formData.parentName,
                parentPhone: formData.parentPhone,
                medicalHistory: {
                    allergies: formData.allergies,
                    chronicConditions: formData.medicalConditions ? formData.medicalConditions.split(',').map(s => s.trim()) : []
                }
            };

            console.log('Sending payload:', payload);

            const response = await fetch(apiUrl('/api/students'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                router.push('/students');
            } else {
                const errorText = await response.text();
                console.error('Failed to create student:', response.status, errorText);
            }
        } catch (error) {
            console.error('Error creating student:', error);
        }
    };

    return (
        <div className="max-w-[800px] mx-auto pb-10">
            <div className="mb-8">
                <h1 className="text-24px font-semibold text-primary mb-1">Register New Student</h1>
                <p className="text-12px text-text-tertiary">Enter student details to create a medical profile</p>
            </div>

            <div className="bg-bg-card border border-border rounded-10 shadow-sm p-8">
                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Personal Information */}
                    <div>
                        <h3 className="text-16px font-semibold text-primary mb-5 pb-2 border-b border-border-light">Personal Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col gap-1.5">
                                <label htmlFor="firstName" className="text-13px font-medium text-text-secondary">First Name</label>
                                <input
                                    type="text"
                                    id="firstName"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-border rounded-5 text-14px outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                                />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label htmlFor="lastName" className="text-13px font-medium text-text-secondary">Last Name</label>
                                <input
                                    type="text"
                                    id="lastName"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-border rounded-5 text-14px outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                                />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label htmlFor="dateOfBirth" className="text-13px font-medium text-text-secondary">Date of Birth</label>
                                <input
                                    type="date"
                                    id="dateOfBirth"
                                    name="dateOfBirth"
                                    value={formData.dateOfBirth}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-border rounded-5 text-14px outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                                />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label htmlFor="gender" className="text-13px font-medium text-text-secondary">Gender</label>
                                <select
                                    id="gender"
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-border rounded-5 text-14px outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 bg-white"
                                >
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Academic Information */}
                    <div>
                        <h3 className="text-16px font-semibold text-primary mb-5 pb-2 border-b border-border-light">Academic Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col gap-1.5">
                                <label htmlFor="academicYear" className="text-13px font-medium text-text-secondary">Academic Year</label>
                                <select
                                    id="academicYear"
                                    value={selectedYear}
                                    onChange={(e) => setSelectedYear(e.target.value)}
                                    className="w-full px-4 py-2 border border-border rounded-5 text-14px outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 bg-white"
                                >
                                    <option value="">Select Year</option>
                                    {academicYears.map(year => (
                                        <option key={year.id} value={year.id}>{year.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label htmlFor="classId" className="text-13px font-medium text-text-secondary">Class</label>
                                <select
                                    id="classId"
                                    name="classId"
                                    value={formData.classId}
                                    onChange={handleChange}
                                    required
                                    disabled={!selectedYear}
                                    className="w-full px-4 py-2 border border-border rounded-5 text-14px outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 bg-white disabled:bg-gray-100"
                                >
                                    <option value="">Select Class</option>
                                    {classes.map(cls => (
                                        <option key={cls.id} value={cls.id}>{cls.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label htmlFor="studentId" className="text-13px font-medium text-text-secondary">Student ID</label>
                                <input
                                    type="text"
                                    id="studentId"
                                    name="studentId"
                                    value={formData.studentId}
                                    onChange={handleChange}
                                    placeholder="e.g., RCA-2024-XXX"
                                    required
                                    className="w-full px-4 py-2 border border-border rounded-5 text-14px outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Medical & Emergency Info */}
                    <div>
                        <h3 className="text-16px font-semibold text-primary mb-5 pb-2 border-b border-border-light">Medical & Emergency Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col gap-1.5">
                                <label htmlFor="insuranceProvider" className="text-13px font-medium text-text-secondary">Insurance Provider</label>
                                <select
                                    id="insuranceProvider"
                                    name="insuranceProvider"
                                    value={formData.insuranceProvider}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-border rounded-5 text-14px outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 bg-white"
                                >
                                    <option value="">Select Provider</option>
                                    <option value="RAMA">RAMA</option>
                                    <option value="MMI">MMI</option>
                                    <option value="RSSB">RSSB</option>
                                    <option value="Radiant">Radiant</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label htmlFor="insuranceNumber" className="text-13px font-medium text-text-secondary">Insurance Number</label>
                                <input
                                    type="text"
                                    id="insuranceNumber"
                                    name="insuranceNumber"
                                    value={formData.insuranceNumber}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-border rounded-5 text-14px outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                                />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label htmlFor="parentName" className="text-13px font-medium text-text-secondary">Parent/Guardian Name</label>
                                <input
                                    type="text"
                                    id="parentName"
                                    name="parentName"
                                    value={formData.parentName}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-border rounded-5 text-14px outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                                />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label htmlFor="parentPhone" className="text-13px font-medium text-text-secondary">Parent/Guardian Phone</label>
                                <input
                                    type="tel"
                                    id="parentPhone"
                                    name="parentPhone"
                                    value={formData.parentPhone}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-border rounded-5 text-14px outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                                />
                            </div>
                            <div className="flex flex-col gap-1.5 md:col-span-2">
                                <label htmlFor="allergies" className="text-13px font-medium text-text-secondary">Allergies (Optional)</label>
                                <textarea
                                    id="allergies"
                                    name="allergies"
                                    value={formData.allergies}
                                    onChange={handleChange}
                                    placeholder="List any known allergies..."
                                    rows={2}
                                    className="w-full px-4 py-2 border border-border rounded-5 text-14px outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 min-h-[80px]"
                                />
                            </div>
                            <div className="flex flex-col gap-1.5 md:col-span-2">
                                <label htmlFor="medicalConditions" className="text-13px font-medium text-text-secondary">Chronic Medical Conditions (Optional)</label>
                                <textarea
                                    id="medicalConditions"
                                    name="medicalConditions"
                                    value={formData.medicalConditions}
                                    onChange={handleChange}
                                    placeholder="List any chronic conditions (e.g., Asthma, Diabetes)..."
                                    rows={2}
                                    className="w-full px-4 py-2 border border-border rounded-5 text-14px outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 min-h-[80px]"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-6 border-t border-border-light">
                        <button
                            type="button"
                            className="px-6 py-2 border border-border rounded-5 text-14px font-medium text-text-secondary hover:bg-bg-primary transition-colors flex items-center gap-2"
                            onClick={() => router.push('/students')}
                        >
                            <X size={18} />
                            Cancel
                        </button>
                        <button type="submit" className="px-6 py-2 bg-primary border border-primary text-white rounded-5 text-14px font-medium hover:bg-primary-dark transition-colors flex items-center gap-2 shadow-sm">
                            <Save size={18} />
                            Save Student Profile
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default StudentRegistrationPage;
