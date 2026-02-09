import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, User, FileText, FlaskConical, AlertCircle } from 'lucide-react';
import './NewConsultation.css'; // Reusing base form styles
import './NewLabRequest.css';

const NewLabRequest = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        studentId: '',
        priority: 'Routine',
        clinicalNotes: '',
        selectedTests: [] as string[]
    });

    const labTests = [
        { id: 'malaria', name: 'Malaria Smear', category: 'Microbiology' },
        { id: 'cbc', name: 'Full Blood Count (CBC)', category: 'Hematology' },
        { id: 'urinalysis', name: 'Urinalysis', category: 'Clinical Microscopy' },
        { id: 'stool', name: 'Stool Analysis', category: 'Microbiology' },
        { id: 'pregnancy', name: 'Pregnancy Test', category: 'Serology' },
        { id: 'widal', name: 'Widal Test', category: 'Serology' },
        { id: 'bg', name: 'Blood Glucose', category: 'Chemistry' },
    ];

    const toggleTest = (testId: string) => {
        setFormData(prev => ({
            ...prev,
            selectedTests: prev.selectedTests.includes(testId)
                ? prev.selectedTests.filter(id => id !== testId)
                : [...prev.selectedTests, testId]
        }));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Submitting lab request:', formData);
        navigate('/lab');
    };

    return (
        <div className="consultation-form-page">
            <div className="consultation-header">
                <h1 className="consultation-title">New Lab Request</h1>
                <p className="consultation-subtitle">Order laboratory tests for a student</p>
            </div>

            <div className="consultation-card">
                <form onSubmit={handleSubmit}>
                    {/* Student & Priority */}
                    <div className="mb-8">
                        <h3 className="section-title">
                            <User size={18} className="section-icon" />
                            Patient Details
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
                            <div className="form-group">
                                <label>Priority Level</label>
                                <select
                                    name="priority"
                                    value={formData.priority}
                                    onChange={handleChange}
                                >
                                    <option value="Routine">Routine</option>
                                    <option value="Urgent">Urgent</option>
                                    <option value="Stat">Stat (Immediate)</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Test Selection */}
                    <div className="mb-8">
                        <h3 className="section-title">
                            <FlaskConical size={18} className="section-icon" />
                            Test Selection
                        </h3>
                        <div className="lab-test-grid">
                            {labTests.map(test => (
                                <div
                                    key={test.id}
                                    className={`lab-test-option ${formData.selectedTests.includes(test.id) ? 'selected' : ''}`}
                                    onClick={() => toggleTest(test.id)}
                                >
                                    <input
                                        type="checkbox"
                                        checked={formData.selectedTests.includes(test.id)}
                                        onChange={() => { }} // Handled by div click
                                        className="lab-test-checkbox"
                                    />
                                    <div className="lab-test-info">
                                        <h4>{test.name}</h4>
                                        <p>{test.category}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Clinical Info */}
                    <div>
                        <h3 className="section-title">
                            <FileText size={18} className="section-icon" />
                            Clinical Information
                        </h3>
                        <div className="form-group">
                            <label>Clinical Notes / Diagnosis / History</label>
                            <textarea
                                name="clinicalNotes"
                                value={formData.clinicalNotes}
                                onChange={handleChange}
                                rows={3}
                                placeholder="Reason for test request..."
                                required
                            />
                        </div>
                    </div>

                    {formData.priority !== 'Routine' && (
                        <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-md flex items-start gap-3">
                            <AlertCircle size={18} className="text-red-500 mt-0.5" />
                            <p className="text-sm text-red-700">
                                <strong>High Priority Request:</strong> Please contact the lab technician directly after submitting for urgent cases.
                            </p>
                        </div>
                    )}

                    <div className="action-buttons">
                        <button
                            type="button"
                            className="btn-secondary"
                            onClick={() => navigate('/lab')}
                        >
                            Cancel
                        </button>
                        <button type="submit" className="btn-primary">
                            <Save size={18} />
                            Submit Request
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default NewLabRequest;
