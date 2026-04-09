"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { User, Calendar, Phone, Edit, ArrowLeft, Activity, FileText } from 'lucide-react';
import { apiUrl, authenticatedFetch } from '@/utils/api';
import { useLanguage } from '@/contexts/LanguageContext';

const StudentProfilePage = () => {
    const router = useRouter();
    const params = useParams();
    const { t } = useLanguage();
    const [activeTab, setActiveTab] = useState('overview');

    const [student, setStudent] = useState<any>(null);
    const [consultations, setConsultations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStudent = async () => {
            if (!params.id) return;
            try {
                const response = await authenticatedFetch(`/api/students/${params.id}`);
                if (response.ok) {
                    const data = await response.json();
                    // Parse medical history
                    let allergies = [t('common.none')];
                    let chronicConditions = [t('common.none')];
                    if (data.medicalHistory) {
                        if (data.medicalHistory.allergies && data.medicalHistory.allergies.trim()) {
                            allergies = [data.medicalHistory.allergies];
                        }
                        if (data.medicalHistory.chronicConditions && data.medicalHistory.chronicConditions.length > 0) {
                            chronicConditions = data.medicalHistory.chronicConditions;
                        }
                    }

                    setStudent({
                        id: data.studentId?.toString(),
                        name: `${data.firstName || ''} ${data.lastName || ''}`.trim() || t('common.unknown'),
                        code: data.schoolId || t('common.na'),
                        class: data.schoolClass?.name || t('common.na'),
                        age: data.dateOfBirth ? new Date().getFullYear() - new Date(data.dateOfBirth).getFullYear() : t('common.na'),
                        gender: data.gender || t('common.na'),
                        dob: data.dateOfBirth || t('common.na'),
                        insurance: data.insuranceProvider || t('common.na'),
                        insuranceNumber: data.insuranceNumber || t('common.na'),
                        parentName: data.parentName || t('common.na'),
                        parentPhone: data.parentPhone || t('common.na'),
                        bloodGroup: data.medicalHistory?.bloodGroup || t('common.unknown'),
                        allergies: allergies,
                        chronicConditions: chronicConditions,
                        vitals: { 
                            height: data.medicalHistory?.height || t('common.na'), 
                            weight: data.medicalHistory?.weight || t('common.na'), 
                            bmi: data.medicalHistory?.bmi || t('common.na') 
                        }
                    });

                    // Fetch student's consultations
                    const visitsResponse = await authenticatedFetch('/api/visits');
                    if (visitsResponse.ok) {
                        const allVisits = await visitsResponse.json();
                        // Filter visits for this student
                        const studentVisits = allVisits.filter((visit: any) => 
                            visit.studentName === `${data.firstName} ${data.lastName}`
                        ).map((visit: any) => ({
                            id: visit.visitId,
                            date: visit.visitDateTime,
                            diagnosis: visit.diagnosis || 'N/A',
                            complaint: visit.chiefComplaint || 'N/A',
                            doctor: 'Nurse',
                            type: 'Outpatient'
                        }));
                        setConsultations(studentVisits);
                    }
                }
            } catch (error) {
                console.error('Error fetching student:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchStudent();
    }, [params.id]);


    if (loading) {
        return (
            <div className="max-w-[1200px] mx-auto pb-10 flex items-center justify-center p-20">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!student) {
        return (
            <div className="max-w-[1200px] mx-auto pb-10 flex flex-col items-center justify-center py-20">
                <h3 className="text-18px font-semibold mb-2">{t('students.profile.notFound')}</h3>
                <button
                    onClick={() => router.push('/students')}
                    className="text-primary hover:underline text-14px flex items-center gap-2 mt-4"
                >
                    <ArrowLeft size={16} /> {t('students.profile.returnToStudents')}
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-[1200px] mx-auto pb-10">
            <button
                onClick={() => router.push('/students')}
                className="flex items-center gap-2 text-text-secondary hover:text-primary mb-6 transition-colors"
            >
                <ArrowLeft size={18} />
                <span>{t('students.profile.backToStudents')}</span>
            </button>

            {/* Header Card */}
            <div className="bg-bg-card border border-border rounded-10 p-6 shadow-sm mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex items-center gap-5">
                    <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center text-32px font-semibold">
                        {student.name.charAt(0)}
                    </div>
                    <div>
                        <h1 className="text-24px font-semibold text-text-primary">{student.name}</h1>
                        <div className="flex flex-wrap gap-4 mt-2 text-14px text-text-secondary">
                            <span className="flex items-center gap-1.5"><User size={16} /> {student.code}</span>
                            <span className="flex items-center gap-1.5"><Calendar size={16} /> {student.age} {t('students.profile.years')}</span>
                            <span className="flex items-center gap-1.5 capitalize"><User size={16} /> {student.gender}</span>
                            <span className="bg-bg-secondary px-3 py-0.5 rounded-full text-12px">{student.class}</span>
                        </div>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button 
                        onClick={() => router.push(`/students/${params.id}/edit`)}
                        className="flex items-center gap-2 px-4 py-2 border border-border rounded-5 text-14px font-medium text-text-secondary hover:bg-gray-50 transition-colors"
                    >
                        <Edit size={16} />
                        <span>{t('students.profile.editProfile')}</span>
                    </button>
                    <button
                        onClick={() => router.push('/consultations/new')}
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-5 text-14px font-medium hover:bg-primary-dark transition-colors shadow-sm"
                    >
                        <Activity size={16} />
                        <span>{t('students.profile.newConsultation')}</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
                {/* Left Sidebar */}
                <div className="flex flex-col gap-6">
                    <div className="bg-bg-card border border-border rounded-10 p-5 shadow-sm">
                        <h3 className="text-16px font-semibold text-text-primary mb-4 pb-3 border-b border-border-light">{t('students.profile.contactInformation')}</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-14px">
                                <span className="text-text-secondary">{t('students.profile.parent')}</span>
                                <span className="font-medium text-text-primary">{student.parentName}</span>
                            </div>
                            <div className="flex justify-between items-center text-14px">
                                <span className="text-text-secondary">{t('students.profile.phone')}</span>
                                <span className="font-medium text-text-primary flex items-center gap-1.5">
                                    <Phone size={14} className="text-text-tertiary" />
                                    {student.parentPhone}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-bg-card border border-border rounded-10 p-5 shadow-sm">
                        <h3 className="text-16px font-semibold text-text-primary mb-4 pb-3 border-b border-border-light">{t('students.profile.medicalDetails')}</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-14px">
                                <span className="text-text-secondary">{t('students.profile.insurance')}</span>
                                <span className="font-medium text-text-primary">{student.insurance}</span>
                            </div>
                            <div className="flex justify-between items-center text-14px">
                                <span className="text-text-secondary">{t('students.profile.bloodGroup')}</span>
                                <span className="font-medium text-text-primary px-2 py-0.5 bg-error/10 text-error rounded-5">{student.bloodGroup}</span>
                            </div>
                            <div className="pt-2">
                                <p className="text-10px text-text-tertiary uppercase tracking-wider mb-2">{t('students.profile.allergies')}</p>
                                <div className="flex flex-wrap gap-2">
                                    {student.allergies.map(alg => (
                                        <span key={alg} className="bg-error-bg text-error px-2 py-1 rounded-5 text-10px font-medium border border-error/10">
                                            {alg}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="pt-2">
                                <p className="text-10px text-text-tertiary uppercase tracking-wider mb-2">Chronic Conditions</p>
                                <div className="flex flex-wrap gap-2">
                                    {student.chronicConditions.map(cond => (
                                        <span key={cond} className="bg-bg-secondary text-text-secondary px-2 py-1 rounded-5 text-10px font-medium border border-border">
                                            {cond}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="bg-bg-card border border-border rounded-10 p-6 shadow-sm min-h-[500px]">
                    <div className="flex gap-8 border-b border-border-light mb-6">
                        <button
                            className={`pb-4 text-14px font-medium transition-all relative ${activeTab === 'overview' ? 'text-primary' : 'text-text-secondary hover:text-primary'}`}
                            onClick={() => setActiveTab('overview')}
                        >
                            Overview
                            {activeTab === 'overview' && <div className="absolute bottom-[-1px] left-0 w-full h-[2px] bg-primary rounded-full" />}
                        </button>
                        <button
                            className={`pb-4 text-14px font-medium transition-all relative ${activeTab === 'consultations' ? 'text-primary' : 'text-text-secondary hover:text-primary'}`}
                            onClick={() => setActiveTab('consultations')}
                        >
                            Consultation History
                            {activeTab === 'consultations' && <div className="absolute bottom-[-1px] left-0 w-full h-[2px] bg-primary rounded-full" />}
                        </button>
                    </div>

                    {activeTab === 'overview' && (
                        <div className="animate-in fade-in duration-500">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                                <div className="bg-primary/5 p-4 rounded-lg border border-primary/10 text-center">
                                    <span className="block text-12px text-primary opacity-70 mb-1 font-medium">{t('students.profile.height')}</span>
                                    <span className="text-20px font-bold text-primary">{student.vitals.height}</span>
                                </div>
                                <div className="bg-success/5 p-4 rounded-lg border border-success/10 text-center">
                                    <span className="block text-12px text-success opacity-70 mb-1 font-medium">{t('students.profile.weight')}</span>
                                    <span className="text-20px font-bold text-success-dark">{student.vitals.weight}</span>
                                </div>
                                <div className="bg-warning/5 p-4 rounded-lg border border-warning/10 text-center">
                                    <span className="block text-12px text-warning opacity-70 mb-1 font-medium">{t('students.profile.bmi')}</span>
                                    <span className="text-20px font-bold text-warning-dark">{student.vitals.bmi}</span>
                                </div>
                            </div>

                            <h3 className="text-14px font-semibold text-text-primary mb-6">Recent Activity</h3>
                            <div className="relative pl-8 space-y-8 before:absolute before:left-[11px] before:top-2 before:bottom-0 before:w-[2px] before:bg-border-light">
                                {consultations.slice(0, 3).map((consult, index) => {
                                    const daysAgo = Math.floor((new Date().getTime() - new Date(consult.date).getTime()) / (1000 * 60 * 60 * 24));
                                    const timeAgo = daysAgo === 0 ? 'Today' : daysAgo === 1 ? '1 day ago' : `${daysAgo} days ago`;
                                    
                                    return (
                                        <div key={consult.id} className="relative">
                                            <div className="absolute -left-[30px] top-0 w-6 h-6 rounded-full bg-white border-2 border-primary flex items-center justify-center z-10">
                                                <FileText size={12} className="text-primary" />
                                            </div>
                                            <div className="flex justify-between items-start mb-1">
                                                <span className="text-14px font-bold text-text-primary">Consultation</span>
                                                <span className="text-12px text-text-tertiary">{timeAgo}</span>
                                            </div>
                                            <p className="text-14px text-text-secondary leading-relaxed">
                                                {consult.complaint}. Diagnosis: {consult.diagnosis}
                                            </p>
                                        </div>
                                    );
                                })}
                                {consultations.length === 0 && (
                                    <div className="text-center py-8">
                                        <Activity size={32} className="mx-auto text-text-tertiary mb-2 opacity-50" />
                                        <p className="text-text-secondary text-14px">No recent activity</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'consultations' && (
                        <div className="space-y-4 animate-in fade-in duration-500">
                            {consultations.map(consult => (
                                <div
                                    key={consult.id}
                                    onClick={() => router.push(`/consultations/${consult.id}`)}
                                    className="border border-border-light rounded-10 p-5 hover:bg-gray-50 transition-all cursor-pointer flex justify-between items-center group shadow-sm bg-white"
                                >
                                    <div className="flex gap-5">
                                        <div className="bg-primary/5 text-primary w-14 h-14 rounded-10 flex flex-col items-center justify-center border border-primary/10">
                                            <span className="text-10px font-bold uppercase tracking-wider">{new Date(consult.date).toLocaleString('default', { month: 'short' })}</span>
                                            <span className="text-20px font-bold leading-none mt-1">{new Date(consult.date).getDate()}</span>
                                        </div>
                                        <div>
                                            <h4 className="text-16px font-semibold text-text-primary group-hover:text-primary transition-colors">{consult.diagnosis}</h4>
                                            <div className="flex items-center gap-3 mt-1.5 text-12px text-text-tertiary">
                                                <span className="font-medium text-text-secondary">{consult.doctor}</span>
                                                <span className="w-1 h-1 rounded-full bg-border" />
                                                <span>{consult.type}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <button className="text-primary text-13px font-semibold group-hover:underline flex items-center gap-1">
                                        Details
                                        <FileText size={14} />
                                    </button>
                                </div>
                            ))}
                            {consultations.length === 0 && (
                                <div className="text-center py-20 bg-bg-secondary rounded-10 border border-dashed border-border">
                                    <Activity size={48} className="mx-auto text-text-tertiary mb-4 opacity-50" />
                                    <p className="text-text-secondary font-medium">No consultation history found</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudentProfilePage;
