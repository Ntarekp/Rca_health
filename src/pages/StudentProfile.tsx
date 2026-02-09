import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Calendar, Phone, Edit, ArrowLeft, Activity, FileText } from 'lucide-react';
import './StudentProfile.css';

const StudentProfile = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');

    // Mock Data - In a real app, fetch based on ID
    const student = {
        id: '1',
        name: 'Keza Sarah',
        code: 'RCA-2024-001',
        class: 'S4 MPC',
        age: 16,
        gender: 'Female',
        dob: '2008-05-15',
        insurance: 'RAMA',
        insuranceNumber: '1029384756',
        parentName: 'Mukamanzi Jane',
        parentPhone: '+250 788 123 456',
        bloodGroup: 'O+',
        allergies: ['Peanuts', 'Penicillin'],
        chronicConditions: ['None'],
        vitals: {
            height: '165 cm',
            weight: '52 kg',
            bmi: '19.1'
        }
    };

    const consultations = [
        { id: 101, date: '2024-02-08', diagnosis: 'Migraine', doctor: 'Nurse Jane', type: 'Outpatient' },
        { id: 98, date: '2023-11-20', diagnosis: 'Malaria', doctor: 'Dr. John', type: 'Inpatient' },
    ];

    return (
        <div className="profile-page">
            <button
                onClick={() => navigate('/students')}
                className="flex items-center gap-2 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] mb-6 transition-colors"
            >
                <ArrowLeft size={18} />
                <span>Back to Students</span>
            </button>

            {/* Header Card */}
            <div className="profile-header-card">
                <div className="profile-info">
                    <div className="profile-avatar">
                        {student.name.charAt(0)}
                    </div>
                    <div className="profile-details">
                        <h1>{student.name}</h1>
                        <div className="profile-meta">
                            <span><User size={16} /> {student.code}</span>
                            <span><Calendar size={16} /> {student.age} Years</span>
                            <span>{student.class}</span>
                        </div>
                    </div>
                </div>
                <div className="profile-actions">
                    <button className="action-button">
                        <Edit size={16} />
                        <span>Edit Profile</span>
                    </button>
                    <button className="action-button primary">
                        <Activity size={16} />
                        <span>New Consultation</span>
                    </button>
                </div>
            </div>

            <div className="profile-content">
                {/* Left Sidebar */}
                <div className="profile-sidebar">
                    <div className="info-card">
                        <h3>Contact Information</h3>
                        <div className="space-y-3">
                            <div className="info-row">
                                <span className="label">Parent</span>
                                <span className="value">{student.parentName}</span>
                            </div>
                            <div className="info-row">
                                <span className="label">Phone</span>
                                <span className="value flex items-center gap-2">
                                    <Phone size={14} />
                                    {student.parentPhone}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="info-card">
                        <h3>Medical Details</h3>
                        <div className="space-y-3">
                            <div className="info-row">
                                <span className="label">Insurance</span>
                                <span className="value">{student.insurance}</span>
                            </div>
                            <div className="info-row">
                                <span className="label">Blood Group</span>
                                <span className="value">{student.bloodGroup}</span>
                            </div>
                            <div className="mt-4">
                                <p className="text-xs text-[var(--color-text-tertiary)] mb-1">Allergies</p>
                                <div className="flex flex-wrap gap-2">
                                    {student.allergies.map(alg => (
                                        <span key={alg} className="bg-red-50 text-red-600 px-2 py-1 rounded text-xs font-medium border border-red-100">
                                            {alg}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="profile-main">
                    <div className="profile-tabs">
                        <button
                            className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
                            onClick={() => setActiveTab('overview')}
                        >
                            Overview
                        </button>
                        <button
                            className={`tab-btn ${activeTab === 'consultations' ? 'active' : ''}`}
                            onClick={() => setActiveTab('consultations')}
                        >
                            Consultation History
                        </button>
                    </div>

                    {activeTab === 'overview' && (
                        <div className="animate-fade-in">
                            <div className="grid grid-cols-3 gap-6 mb-8">
                                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 text-center">
                                    <span className="block text-sm text-blue-600 mb-1">Height</span>
                                    <span className="text-xl font-bold text-blue-900">{student.vitals.height}</span>
                                </div>
                                <div className="bg-green-50 p-4 rounded-lg border border-green-100 text-center">
                                    <span className="block text-sm text-green-600 mb-1">Weight</span>
                                    <span className="text-xl font-bold text-green-900">{student.vitals.weight}</span>
                                </div>
                                <div className="bg-purple-50 p-4 rounded-lg border border-purple-100 text-center">
                                    <span className="block text-sm text-purple-600 mb-1">BMI</span>
                                    <span className="text-xl font-bold text-purple-900">{student.vitals.bmi}</span>
                                </div>
                            </div>

                            <h3 className="text-md font-semibold mb-4">Recent Activity</h3>
                            <div className="space-y-0">
                                <div className="timeline-item">
                                    <div className="timeline-icon">
                                        <FileText size={18} />
                                    </div>
                                    <div className="timeline-content">
                                        <div className="timeline-header">
                                            <span className="timeline-title">Consultation</span>
                                            <span className="timeline-date">2 days ago</span>
                                        </div>
                                        <p className="timeline-details">Complained of severe headache. Prescribed Paracetamol.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'consultations' && (
                        <div className="space-y-4 animate-fade-in">
                            {consultations.map(consult => (
                                <div key={consult.id} className="border border-gray-100 rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer flex justify-between items-center">
                                    <div className="flex gap-4">
                                        <div className="bg-blue-100 text-blue-600 w-12 h-12 rounded-lg flex flex-col items-center justify-center">
                                            <span className="text-xs font-bold uppercase">{new Date(consult.date).toLocaleString('default', { month: 'short' })}</span>
                                            <span className="text-lg font-bold leading-none">{new Date(consult.date).getDate()}</span>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900">{consult.diagnosis}</h4>
                                            <p className="text-sm text-gray-500">{consult.doctor} • {consult.type}</p>
                                        </div>
                                    </div>
                                    <button className="text-blue-600 text-sm font-medium hover:underline">View Details</button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudentProfile;
