"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Printer, Activity, User, ClipboardList, FileText } from 'lucide-react';
import { authenticatedFetch } from '@/utils/api';
import { useLanguage } from '@/contexts/LanguageContext';

const ConsultationDetailsPage = () => {
    const router = useRouter();
    const params = useParams();
    const { t } = useLanguage();
    const [consultation, setConsultation] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchConsultation = async () => {
            if (!params.id) return;
            try {
                const response = await authenticatedFetch(`/api/visits/${params.id}`);
                if (response.ok) {
                    const data = await response.json();
                    
                    // Parse vitals from JSON string
                    let vitals = { temp: 'N/A', bp: 'N/A', pulse: 'N/A', weight: 'N/A', spo2: 'N/A', painScore: 'N/A' };
                    try {
                        if (data.vitals) {
                            const parsedVitals = typeof data.vitals === 'string' ? JSON.parse(data.vitals) : data.vitals;
                            // Merge parsed vitals with defaults, keeping N/A for empty values
                            vitals = {
                                temp: parsedVitals.temp || 'N/A',
                                bp: parsedVitals.bp || 'N/A',
                                pulse: parsedVitals.pulse || 'N/A',
                                weight: parsedVitals.weight || 'N/A',
                                spo2: parsedVitals.spo2 || 'N/A',
                                painScore: parsedVitals.painScore || 'N/A'
                            };
                        }
                    } catch (e) {
                        console.error('Error parsing vitals:', e, data.vitals);
                    }

                    // Extract symptoms from chief complaint if in parentheses
                    let complaint = data.chiefComplaint || t('common.na');
                    let symptoms: string[] = [];
                    const symptomsMatch = complaint.match(/\((.+?)\)/);
                    if (symptomsMatch) {
                        symptoms = symptomsMatch[1].split(',').map((s) => s.trim());
                        complaint = complaint.replace(/\s*\(.+?\)/, '');
                    }

                    // Parse treatment notes to extract disposition and notes
                    let treatment = t('common.na');
                    let prescription = t('common.na');
                    let disposition = t('common.na');
                    let notes = t('common.na');
                    
                    if (data.treatmentNotes) {
                        const treatmentMatch = data.treatmentNotes.match(/Treatment:\s*(.+?)(?=\n|$)/i);
                        const prescriptionMatch = data.treatmentNotes.match(/Prescription:\s*(.+?)(?=\n|$)/i);
                        const dispositionMatch = data.treatmentNotes.match(/Disposition:\s*(.+?)(?=\n|$)/i);
                        const notesMatch = data.treatmentNotes.match(/Notes:\s*(.+?)(?=\n|$)/i);
                        
                        treatment = treatmentMatch ? treatmentMatch[1].trim() : t('common.na');
                        prescription = prescriptionMatch ? prescriptionMatch[1].trim() : t('common.na');
                        disposition = dispositionMatch ? dispositionMatch[1].trim() : t('common.na');
                        notes = notesMatch ? notesMatch[1].trim() : t('common.na');
                    }

                    setConsultation({
                        id: data.visitId,
                        date: new Date(data.visitDateTime).toLocaleDateString(),
                        time: new Date(data.visitDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        student: data.studentName,
                        class: data.studentClass || 'N/A',
                        code: 'N/A', // Not in DTO
                        handledBy: 'Nurse', // Placeholder
                        vitals: vitals,
                        complaint: complaint,
                        symptoms: symptoms.length > 0 ? symptoms : [t('visits.noneReported')],
                        diagnosis: data.diagnosis || t('common.na'),
                        treatment: treatment,
                        prescription: prescription,
                        disposition: disposition,
                        notes: notes
                    });
                }
            } catch (error) {
                console.error('Error fetching consultation:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchConsultation();
    }, [params.id]);

    if (loading) {
        return (
            <div className="max-w-[1000px] mx-auto pb-10 flex items-center justify-center p-20">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!consultation) {
        return (
            <div className="max-w-[1000px] mx-auto pb-10 flex flex-col items-center justify-center py-20">
                <h3 className="text-18px font-semibold mb-2">Consultation Not Found</h3>
                <button
                    onClick={() => router.push('/consultations')}
                    className="text-primary hover:underline text-14px flex items-center gap-2 mt-4"
                >
                    <ArrowLeft size={16} /> Return to Consultations
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-[1000px] mx-auto pb-10">
            <div className="flex justify-between items-center mb-6">
                <button
                    onClick={() => router.push('/consultations')}
                    className="flex items-center gap-2 text-text-secondary hover:text-primary transition-colors"
                >
                    <ArrowLeft size={18} />
                    <span>{t('visits.backToConsultations')}</span>
                </button>
                <button className="flex items-center gap-2 text-primary bg-primary/5 px-4 py-2 rounded-5 hover:bg-primary/10 transition-colors border border-primary/10 shadow-sm">
                    <Printer size={16} />
                    <span className="text-14px font-medium">{t('visits.printRecord')}</span>
                </button>
            </div>

            <div className="bg-bg-card border border-border rounded-10 shadow-sm p-8">
                <div className="border-b border-border-light pb-6 mb-8">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                        <div>
                            <span className="px-3 py-1 bg-success/10 text-success text-10px font-bold rounded-full uppercase tracking-wider">Completed</span>
                            <h1 className="text-28px font-bold text-text-primary mt-3 leading-tight">{t('visits.consultationNumber', { number: consultation.id })}</h1>
                            <p className="text-14px text-text-tertiary mt-1">{consultation.date} at {consultation.time}</p>
                        </div>
                        <div className="md:text-right">
                            <p className="text-12px font-medium text-text-tertiary uppercase tracking-wider mb-1">{t('visits.attendedBy')}</p>
                            <p className="text-16px font-semibold text-text-primary">{consultation.handledBy}</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-10">
                    {/* Left Column: Vitals & Student */}
                    <div className="space-y-8">
                        <div className="bg-bg-secondary p-5 rounded-10 border border-border">
                            <h3 className="flex items-center gap-2 text-14px font-bold text-text-primary mb-4 pb-2 border-b border-border">
                                <User size={16} className="text-text-tertiary" />
                                {t('visits.studentDetails')}
                            </h3>
                            <div className="space-y-4">
                                <div className="flex flex-col gap-1">
                                    <p className="text-10px text-text-tertiary uppercase tracking-wider font-medium">{t('visits.name')}</p>
                                    <span className="text-14px font-medium text-text-primary">{consultation.student}</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <p className="text-10px text-text-tertiary uppercase tracking-wider font-medium">{t('visits.class')}</p>
                                    <span className="text-14px font-medium text-text-primary">{consultation.class}</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <p className="text-10px text-text-tertiary uppercase tracking-wider font-medium">{t('visits.idCode')}</p>
                                    <span className="text-14px font-medium text-text-primary">{consultation.code}</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-primary/5 p-5 rounded-10 border border-primary/10">
                            <h3 className="flex items-center gap-2 text-14px font-bold text-primary mb-4 pb-2 border-b border-primary/10">
                                <Activity size={16} />
                                {t('visits.vitalSigns')}
                            </h3>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="flex flex-col gap-1">
                                    <p className="text-10px text-primary uppercase tracking-wider font-medium mb-1">{t('visits.temp')}</p>
                                    <span className="text-16px font-bold text-primary">{consultation.vitals.temp}°C</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <p className="text-10px text-primary uppercase tracking-wider font-medium mb-1">{t('visits.bloodPressure')}</p>
                                    <span className="text-16px font-bold text-primary">{consultation.vitals.bp} <span className="text-10px font-normal">mmHg</span></span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <p className="text-10px text-primary uppercase tracking-wider font-medium mb-1">{t('visits.pulse')}</p>
                                    <span className="text-16px font-bold text-primary">{consultation.vitals.pulse} <span className="text-10px font-normal">bpm</span></span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <p className="text-10px text-primary uppercase tracking-wider font-medium mb-1">{t('visits.weight')}</p>
                                    <span className="text-16px font-bold text-primary">{consultation.vitals.weight} <span className="text-10px font-normal">kg</span></span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Clinical Content */}
                    <div className="space-y-10">
                        <div>
                            <h3 className="flex items-center gap-3 text-18px font-bold text-text-primary mb-6 pb-2 border-b border-border-light">
                                <ClipboardList size={22} className="text-primary" />
                                {t('visits.clinicalAssessment')}
                            </h3>
                            <div className="space-y-6">
                                <div className="bg-white/50 p-4 rounded-8 border border-border-light">
                                    <h4 className="text-10px text-text-tertiary uppercase tracking-wider font-bold mb-2">{t('visits.chiefComplaint')}</h4>
                                    <p className="text-15px text-text-primary font-medium leading-relaxed">{consultation.complaint}</p>
                                </div>

                                <div>
                                    <h4 className="text-10px text-text-tertiary uppercase tracking-wider font-bold mb-3">{t('visits.symptomsReported')}</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {consultation.symptoms.map(s => (
                                            <span key={s} className="px-3 py-1.5 bg-bg-secondary text-text-primary rounded-5 text-12px font-medium border border-border">
                                                {s}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-warning/5 p-6 rounded-10 border border-warning/20">
                                    <h4 className="text-10px text-warning-dark uppercase tracking-wider font-bold mb-2">{t('visits.finalDiagnosis')}</h4>
                                    <p className="text-20px font-bold text-text-primary">{consultation.diagnosis}</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="flex items-center gap-3 text-18px font-bold text-text-primary mb-6 pb-2 border-b border-border-light">
                                <FileText size={22} className="text-primary" />
                                {t('visits.treatmentPlan')}
                            </h3>
                            <div className="space-y-6">
                                <div className="bg-white/50 p-4 rounded-8 border border-border-light">
                                    <h4 className="text-10px text-text-tertiary uppercase tracking-wider font-bold mb-2">{t('visits.treatmentGiven')}</h4>
                                    <p className="text-15px text-text-primary leading-relaxed">{consultation.treatment}</p>
                                </div>
                                {consultation.prescription && consultation.prescription !== 'N/A' && (
                                    <div className="bg-white/50 p-4 rounded-8 border border-border-light">
                                        <h4 className="text-10px text-text-tertiary uppercase tracking-wider font-bold mb-2">{t('visits.prescription')}</h4>
                                        <p className="text-15px text-text-primary leading-relaxed">{consultation.prescription}</p>
                                    </div>
                                )}
                                <div className="bg-white/50 p-4 rounded-8 border border-border-light">
                                    <h4 className="text-10px text-text-tertiary uppercase tracking-wider font-bold mb-2">{t('visits.disposition')}</h4>
                                    <p className="text-15px font-semibold text-primary">{consultation.disposition}</p>
                                </div>
                                {consultation.notes && (
                                    <div className="p-4 bg-bg-secondary rounded-8 border border-border">
                                        <h4 className="text-10px text-text-tertiary uppercase tracking-wider font-bold mb-2">{t('visits.handoverNotes')}</h4>
                                        <p className="text-14px text-text-secondary italic">"{consultation.notes}"</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConsultationDetailsPage;
