"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Save, X, ArrowLeft } from 'lucide-react';
import { authenticatedFetch } from '@/utils/api';
import { useLanguage } from '@/contexts/LanguageContext';

const EditStudentPage = () => {
    const router = useRouter();
    const params = useParams();
    const { t } = useLanguage();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        gender: '',
        email: '',
        schoolId: '',
        classId: '',
        insuranceProvider: '',
        insuranceNumber: '',
        parentName: '',
        parentPhone: '',
        bloodGroup: '',
        allergies: '',
        height: '',
        weight: '',
        bmi: ''
    });

    useEffect(() => {
        const fetchStudent = async () => {
            if (!params.id) return;
            try {
                const response = await authenticatedFetch(`/api/students/${params.id}`);
                if (response.ok) {
                    const data = await response.json();
                    setFormData({
                        firstName: data.firstName || '',
                        lastName: data.lastName || '',
                        dateOfBirth: data.dateOfBirth || '',
                        gender: data.gender || '',
                        email: data.email || '',
                        schoolId: data.schoolId || '',
                        classId: data.schoolClass?.id?.toString() || '',
                        insuranceProvider: data.insuranceProvider || '',
                        insuranceNumber: data.insuranceNumber || '',
                        parentName: data.parentName || '',
                        parentPhone: data.parentPhone || '',
                        bloodGroup: data.medicalHistory?.bloodGroup || '',
                        allergies: data.medicalHistory?.allergies || '',
                        height: data.medicalHistory?.height || '',
                        weight: data.medicalHistory?.weight || '',
                        bmi: data.medicalHistory?.bmi || ''
                    });
                }
            } catch (error) {
                console.error('Error fetching student:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchStudent();
    }, [params.id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const payload = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                dateOfBirth: formData.dateOfBirth,
                gender: formData.gender,
                email: formData.email,
                schoolId: formData.schoolId,
                schoolClass: formData.classId ? { id: parseInt(formData.classId) } : null,
                insuranceProvider: formData.insuranceProvider,
                insuranceNumber: formData.insuranceNumber,
                parentName: formData.parentName,
                parentPhone: formData.parentPhone,
                medicalHistory: {
                    bloodGroup: formData.bloodGroup,
                    allergies: formData.allergies,
                    height: formData.height,
                    weight: formData.weight,
                    bmi: formData.bmi,
                    chronicConditions: []
                }
            };

            const response = await authenticatedFetch(`/api/students/${params.id}`, {
                method: 'PUT',
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                router.push(`/students/${params.id}`);
            } else {
                const errorText = await response.text();
                console.error('Failed to update student:', response.status, errorText);
                alert('Failed to update student. Please try again.');
            }
        } catch (error) {
            console.error('Error updating student:', error);
            alert('Error updating student. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="max-w-[800px] mx-auto pb-10 flex items-center justify-center p-20">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="max-w-[800px] mx-auto pb-10">
            <button
                onClick={() => router.push(`/students/${params.id}`)}
                className="flex items-center gap-2 text-text-secondary hover:text-primary mb-6 transition-colors"
            >
                <ArrowLeft size={18} />
                <span>{t('students.profile.backToProfile')}</span>
            </button>

            <div className="mb-8">
                <h1 className="text-24px font-semibold text-primary mb-1">{t('students.profile.editStudentProfile')}</h1>
                <p className="text-12px text-text-tertiary">{t('students.profile.updateInfo')}</p>
            </div>

            <div className="bg-bg-card border border-border rounded-10 shadow-sm p-8">
                <form onSubmit={handleSubmit} className="space-y-8">
                    <div>
                        <h3 className="text-16px font-semibold text-primary mb-5 pb-2 border-b border-border-light">{t('students.profile.personalInformation')}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col gap-1.5">
                                <label htmlFor="firstName" className="text-13px font-semibold text-text-primary">{t('students.firstName')}</label>
                                <input
                                    type="text"
                                    id="firstName"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2.5 bg-white border-2 border-border rounded-10 text-14px font-medium outline-none transition-all hover:border-primary/30 focus:border-primary focus:ring-4 focus:ring-primary/10"
                                />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label htmlFor="lastName" className="text-13px font-semibold text-text-primary">{t('students.lastName')}</label>
                                <input
                                    type="text"
                                    id="lastName"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2.5 bg-white border-2 border-border rounded-10 text-14px font-medium outline-none transition-all hover:border-primary/30 focus:border-primary focus:ring-4 focus:ring-primary/10"
                                />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label htmlFor="gender" className="text-13px font-semibold text-text-primary">{t('students.gender')}</label>
                                <select
                                    id="gender"
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2.5 bg-white border-2 border-border rounded-10 text-14px font-medium outline-none transition-all hover:border-primary/30 focus:border-primary focus:ring-4 focus:ring-primary/10 appearance-none cursor-pointer"
                                >
                                    <option value="">{t('students.profile.selectGender')}</option>
                                    <option value="Male">{t('students.male')}</option>
                                    <option value="Female">{t('students.female')}</option>
                                </select>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label htmlFor="dateOfBirth" className="text-13px font-semibold text-text-primary">{t('students.dateOfBirth')}</label>
                                <input
                                    type="date"
                                    id="dateOfBirth"
                                    name="dateOfBirth"
                                    value={formData.dateOfBirth}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2.5 bg-white border-2 border-border rounded-10 text-14px font-medium outline-none transition-all hover:border-primary/30 focus:border-primary focus:ring-4 focus:ring-primary/10"
                                />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label htmlFor="email" className="text-13px font-semibold text-text-primary">{t('students.registerForm.email')}</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder={t('students.new.emailPlaceholder')}
                                    className="w-full px-4 py-2.5 bg-white border-2 border-border rounded-10 text-14px font-medium outline-none transition-all hover:border-primary/30 focus:border-primary focus:ring-4 focus:ring-primary/10"
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-16px font-semibold text-primary mb-5 pb-2 border-b border-border-light">{t('students.profile.medicalInformation')}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col gap-1.5">
                                <label htmlFor="insuranceProvider" className="text-13px font-semibold text-text-primary">{t('students.profile.insuranceProvider')}</label>
                                <select
                                    id="insuranceProvider"
                                    name="insuranceProvider"
                                    value={formData.insuranceProvider}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 bg-white border-2 border-border rounded-10 text-14px font-medium outline-none transition-all hover:border-primary/30 focus:border-primary focus:ring-4 focus:ring-primary/10 appearance-none cursor-pointer"
                                >
                                    <option value="">{t('students.profile.selectProvider')}</option>
                                    <option value="RAMA">RAMA</option>
                                    <option value="MMI">MMI</option>
                                    <option value="RSSB">RSSB</option>
                                    <option value="Radiant">Radiant</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label htmlFor="insuranceNumber" className="text-13px font-semibold text-text-primary">{t('students.profile.insuranceNumber')}</label>
                                <input
                                    type="text"
                                    id="insuranceNumber"
                                    name="insuranceNumber"
                                    value={formData.insuranceNumber}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 bg-white border-2 border-border rounded-10 text-14px font-medium outline-none transition-all hover:border-primary/30 focus:border-primary focus:ring-4 focus:ring-primary/10"
                                />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label htmlFor="bloodGroup" className="text-13px font-semibold text-text-primary">{t('students.bloodGroup')}</label>
                                <select
                                    id="bloodGroup"
                                    name="bloodGroup"
                                    value={formData.bloodGroup}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 bg-white border-2 border-border rounded-10 text-14px font-medium outline-none transition-all hover:border-primary/30 focus:border-primary focus:ring-4 focus:ring-primary/10 appearance-none cursor-pointer"
                                >
                                    <option value="">{t('students.profile.selectBloodGroup')}</option>
                                    <option value="A+">A+</option>
                                    <option value="A-">A-</option>
                                    <option value="B+">B+</option>
                                    <option value="B-">B-</option>
                                    <option value="AB+">AB+</option>
                                    <option value="AB-">AB-</option>
                                    <option value="O+">O+</option>
                                    <option value="O-">O-</option>
                                </select>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label htmlFor="allergies" className="text-13px font-semibold text-text-primary">{t('students.allergies')}</label>
                                <input
                                    type="text"
                                    id="allergies"
                                    name="allergies"
                                    value={formData.allergies}
                                    onChange={handleChange}
                                    placeholder={t('students.profile.allergiesPlaceholder')}
                                    className="w-full px-4 py-2.5 bg-white border-2 border-border rounded-10 text-14px font-medium outline-none transition-all hover:border-primary/30 focus:border-primary focus:ring-4 focus:ring-primary/10"
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-16px font-semibold text-primary mb-5 pb-2 border-b border-border-light">{t('students.profile.physicalMeasurements')}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="flex flex-col gap-1.5">
                                <label htmlFor="height" className="text-13px font-semibold text-text-primary">{t('students.profile.heightCm')}</label>
                                <input
                                    type="number"
                                    id="height"
                                    name="height"
                                    value={formData.height}
                                    onChange={handleChange}
                                    placeholder="170"
                                    className="w-full px-4 py-2.5 bg-white border-2 border-border rounded-10 text-14px font-medium outline-none transition-all hover:border-primary/30 focus:border-primary focus:ring-4 focus:ring-primary/10"
                                />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label htmlFor="weight" className="text-13px font-semibold text-text-primary">{t('students.profile.weightKg')}</label>
                                <input
                                    type="number"
                                    id="weight"
                                    name="weight"
                                    value={formData.weight}
                                    onChange={handleChange}
                                    placeholder="65"
                                    className="w-full px-4 py-2.5 bg-white border-2 border-border rounded-10 text-14px font-medium outline-none transition-all hover:border-primary/30 focus:border-primary focus:ring-4 focus:ring-primary/10"
                                />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label htmlFor="bmi" className="text-13px font-semibold text-text-primary">{t('students.bmi')}</label>
                                <input
                                    type="number"
                                    id="bmi"
                                    name="bmi"
                                    value={formData.bmi}
                                    onChange={handleChange}
                                    placeholder="22.5"
                                    step="0.1"
                                    className="w-full px-4 py-2.5 bg-white border-2 border-border rounded-10 text-14px font-medium outline-none transition-all hover:border-primary/30 focus:border-primary focus:ring-4 focus:ring-primary/10"
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-16px font-semibold text-primary mb-5 pb-2 border-b border-border-light">{t('students.profile.contactInfo')}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col gap-1.5">
                                <label htmlFor="parentName" className="text-13px font-semibold text-text-primary">{t('students.profile.parentGuardianName')}</label>
                                <input
                                    type="text"
                                    id="parentName"
                                    name="parentName"
                                    value={formData.parentName}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2.5 bg-white border-2 border-border rounded-10 text-14px font-medium outline-none transition-all hover:border-primary/30 focus:border-primary focus:ring-4 focus:ring-primary/10"
                                />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label htmlFor="parentPhone" className="text-13px font-semibold text-text-primary">{t('students.profile.parentGuardianPhone')}</label>
                                <input
                                    type="tel"
                                    id="parentPhone"
                                    name="parentPhone"
                                    value={formData.parentPhone}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2.5 bg-white border-2 border-border rounded-10 text-14px font-medium outline-none transition-all hover:border-primary/30 focus:border-primary focus:ring-4 focus:ring-primary/10"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-6 border-t border-border-light">
                        <button
                            type="button"
                            onClick={() => router.push(`/students/${params.id}`)}
                            className="px-6 py-2 border border-border rounded-5 text-14px font-medium text-text-secondary hover:bg-bg-primary transition-colors flex items-center gap-2"
                        >
                            <X size={18} />
                            {t('common.cancel')}
                        </button>
                        <button 
                            type="submit" 
                            disabled={saving}
                            className="px-6 py-2 bg-primary border border-primary text-white rounded-5 text-14px font-medium hover:bg-primary-dark transition-colors flex items-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Save size={18} />
                            {saving ? t('students.profile.saving') : t('students.profile.saveChanges')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditStudentPage;
