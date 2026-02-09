import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, User, Activity, FileText, ClipboardList } from 'lucide-react';
import './NewConsultation.css';

const NewConsultation = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        studentId: '',
        temp: '',
        bp: '',
        pulse: '',
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

    // Add type for event or simpler symptom string
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
        navigate('/consultations');
    };

    return (
        <div className="consultation-form-page">
            <div className="consultation-header">
                <h1 className="consultation-title">New Consultation</h1>
                <p className="consultation-subtitle">Record clinical notes and treatment details</p>
            </div>

            <div className="consultation-card">
                <form onSubmit={handleSubmit}>
                    {/* Student Selection */}
                    <div className="mb-8">
                        <h3 className="section-title">
                            <User size={18} className="section-icon" />
                            Student Information
                        </h3>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Select Student</label>
                                <select
                                    name="studentId"
                                    value={formData.studentId}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Search or select student...</option>
                                    <option value="1">Keza Sarah (S4 MPC)</option>
                                    <option value="2">Manzi David (S5 PCB)</option>
                                    <option value="3">Mutesi Joy (S6 MEC)</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Vitals */}
                    <div className="mb-8">
                        <h3 className="section-title">
                            <Activity size={18} className="section-icon" />
                            Vitals Signs
                        </h3>
                        <div className="vitals-grid">
                            <div className="form-group">
                                <label>Temperature</label>
                                <div className="vital-input">
                                    <input
                                        type="number"
                                        name="temp"
                                        value={formData.temp}
                                        onChange={handleChange}
                                        placeholder="36.5"
                                        step="0.1"
                                    />
                                    <span className="vital-unit">°C</span>
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Blood Pressure</label>
                                <div className="vital-input">
                                    <input
                                        type="text"
                                        name="bp"
                                        value={formData.bp}
                                        onChange={handleChange}
                                        placeholder="120/80"
                                    />
                                    <span className="vital-unit">mmHg</span>
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Pulse Rate</label>
                                <div className="vital-input">
                                    <input
                                        type="number"
                                        name="pulse"
                                        value={formData.pulse}
                                        onChange={handleChange}
                                        placeholder="72"
                                    />
                                    <span className="vital-unit">bpm</span>
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Weight</label>
                                <div className="vital-input">
                                    <input
                                        type="number"
                                        name="weight"
                                        value={formData.weight}
                                        onChange={handleChange}
                                        placeholder="50"
                                    />
                                    <span className="vital-unit">kg</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Clinical Assessment */}
                    <div className="mb-8">
                        <h3 className="section-title">
                            <ClipboardList size={18} className="section-icon" />
                            Clinical Assessment
                        </h3>
                        <div className="form-group mb-4">
                            <label>Chief Complaint</label>
                            <input
                                type="text"
                                name="complaint"
                                value={formData.complaint}
                                onChange={handleChange}
                                placeholder="Main reason for visit..."
                                required
                            />
                        </div>

                        <div className="form-group mb-4">
                            <label>Symptoms</label>
                            <div className="symptom-tags">
                                {commonSymptoms.map(symptom => (
                                    <button
                                        key={symptom}
                                        type="button"
                                        className={`symptom-tag ${formData.symptoms.includes(symptom) ? 'selected' : ''}`}
                                        onClick={() => toggleSymptom(symptom)}
                                    >
                                        {symptom}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Provisional Diagnosis</label>
                                <textarea
                                    name="diagnosis"
                                    value={formData.diagnosis}
                                    onChange={handleChange}
                                    rows={2}
                                    placeholder="Clinical impression..."
                                />
                            </div>
                            <div className="form-group">
                                <label>Treatment / Procedures</label>
                                <textarea
                                    name="treatment"
                                    value={formData.treatment}
                                    onChange={handleChange}
                                    rows={2}
                                    placeholder="Immediate care given..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Disposition */}
                    <div>
                        <h3 className="section-title">
                            <FileText size={18} className="section-icon" />
                            Disposition & Plan
                        </h3>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Prescription</label>
                                <textarea
                                    name="prescription"
                                    value={formData.prescription}
                                    onChange={handleChange}
                                    rows={3}
                                    placeholder="Medications prescribed..."
                                />
                            </div>
                            <div className="form-group">
                                <label>Disposition</label>
                                <select
                                    name="disposition"
                                    value={formData.disposition}
                                    onChange={handleChange}
                                >
                                    <option value="Returned to Class">Return to Class</option>
                                    <option value="Sent Home">Send Home</option>
                                    <option value="Transferred">Transfer to Hospital</option>
                                    <option value="Admitted">Admit to Infirmary</option>
                                </select>

                                <label className="mt-3">Additional Notes</label>
                                <textarea
                                    name="notes"
                                    value={formData.notes}
                                    onChange={handleChange}
                                    rows={2}
                                    placeholder="Any other remarks..."
                                />
                            </div>
                        </div>
                    </div>

                    <div className="action-buttons">
                        <button
                            type="button"
                            className="btn-secondary"
                            onClick={() => navigate('/consultations')}
                        >
                            Cancel
                        </button>
                        <button type="submit" className="btn-primary">
                            <Save size={18} />
                            Save Record
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default NewConsultation;
