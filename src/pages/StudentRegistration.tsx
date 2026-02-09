import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save } from 'lucide-react';
import './StudentRegistration.css';

const StudentRegistration = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        gender: '',
        studentId: '',
        class: '',
        insuranceProvider: '',
        insuranceNumber: '',
        parentName: '',
        parentPhone: '',
        allergies: '',
        medicalConditions: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, this would be an API call
        console.log('Submitting student data:', formData);
        // Simulate success and redirect
        setTimeout(() => {
            navigate('/students');
        }, 500);
    };

    return (
        <div className="registration-page">
            <div className="page-header">
                <div className="page-title-section">
                    <h1 className="page-title">Register New Student</h1>
                    <p className="page-subtitle">Enter student details to create a medical profile</p>
                </div>
            </div>

            <div className="registration-form-card">
                <form onSubmit={handleSubmit}>
                    {/* Personal Information */}
                    <div className="form-section">
                        <h3>Personal Information</h3>
                        <div className="form-grid">
                            <div className="form-group">
                                <label htmlFor="firstName">First Name</label>
                                <input
                                    type="text"
                                    id="firstName"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="lastName">Last Name</label>
                                <input
                                    type="text"
                                    id="lastName"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="dateOfBirth">Date of Birth</label>
                                <input
                                    type="date"
                                    id="dateOfBirth"
                                    name="dateOfBirth"
                                    value={formData.dateOfBirth}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="gender">Gender</label>
                                <select
                                    id="gender"
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Academic Information */}
                    <div className="form-section">
                        <h3>Academic Information</h3>
                        <div className="form-grid">
                            <div className="form-group">
                                <label htmlFor="studentId">Student ID</label>
                                <input
                                    type="text"
                                    id="studentId"
                                    name="studentId"
                                    value={formData.studentId}
                                    onChange={handleChange}
                                    placeholder="e.g., RCA-2024-XXX"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="class">Class</label>
                                <select
                                    id="class"
                                    name="class"
                                    value={formData.class}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select Class</option>
                                    <option value="S4 MPC">S4 MPC</option>
                                    <option value="S4 MCB">S4 MCB</option>
                                    <option value="S4 PCB">S4 PCB</option>
                                    <option value="S5 MPC">S5 MPC</option>
                                    <option value="S5 MCB">S5 MCB</option>
                                    <option value="S5 PCB">S5 PCB</option>
                                    <option value="S6 MPC">S6 MPC</option>
                                    <option value="S6 MCB">S6 MCB</option>
                                    <option value="S6 PCB">S6 PCB</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Medical & Emergency Info */}
                    <div className="form-section">
                        <h3>Medical & Emergency Details</h3>
                        <div className="form-grid">
                            <div className="form-group">
                                <label htmlFor="insuranceProvider">Insurance Provider</label>
                                <select
                                    id="insuranceProvider"
                                    name="insuranceProvider"
                                    value={formData.insuranceProvider}
                                    onChange={handleChange}
                                >
                                    <option value="">Select Provider</option>
                                    <option value="RAMA">RAMA</option>
                                    <option value="MMI">MMI</option>
                                    <option value="RSSB">RSSB</option>
                                    <option value="Radiant">Radiant</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="insuranceNumber">Insurance Number</label>
                                <input
                                    type="text"
                                    id="insuranceNumber"
                                    name="insuranceNumber"
                                    value={formData.insuranceNumber}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="parentName">Parent/Guardian Name</label>
                                <input
                                    type="text"
                                    id="parentName"
                                    name="parentName"
                                    value={formData.parentName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="parentPhone">Parent/Guardian Phone</label>
                                <input
                                    type="tel"
                                    id="parentPhone"
                                    name="parentPhone"
                                    value={formData.parentPhone}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group full-width">
                                <label htmlFor="allergies">Allergies (Optional)</label>
                                <textarea
                                    id="allergies"
                                    name="allergies"
                                    value={formData.allergies}
                                    onChange={handleChange}
                                    placeholder="List any known allergies..."
                                    rows={2}
                                />
                            </div>
                            <div className="form-group full-width">
                                <label htmlFor="medicalConditions">Chronic Medical Conditions (Optional)</label>
                                <textarea
                                    id="medicalConditions"
                                    name="medicalConditions"
                                    value={formData.medicalConditions}
                                    onChange={handleChange}
                                    placeholder="List any chronic conditions (e.g., Asthma, Diabetes)..."
                                    rows={2}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="form-actions">
                        <button
                            type="button"
                            className="btn-cancel"
                            onClick={() => navigate('/students')}
                        >
                            Cancel
                        </button>
                        <button type="submit" className="btn-save">
                            <Save size={18} />
                            Save Student Profile
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default StudentRegistration;
