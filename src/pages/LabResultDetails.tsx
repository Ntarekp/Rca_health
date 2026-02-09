import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Printer, FlaskConical, User } from 'lucide-react';
import './NewConsultation.css'; // Reusing styles

const LabResultDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    console.log('Viewing lab result:', id);

    // Mock Data
    const labResult = {
        id: '1',
        student: 'Keza Sarah',
        code: 'RCA-2024-001',
        age: '16',
        gender: 'Female',
        type: 'Laboratory',
        testName: 'Malaria Smear',
        date: '2024-02-08',
        time: '10:30 AM',
        status: 'Completed',
        result: 'Negative',
        doctor: 'Lab Tech Jean',
        priority: 'Urgent',
        notes: 'No parasites seen.'
    };

    return (
        <div className="consultation-form-page">
            <div className="flex justify-between items-center mb-6">
                <button
                    onClick={() => navigate('/lab')}
                    className="flex items-center gap-2 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors"
                >
                    <ArrowLeft size={18} />
                    <span>Back to Lab & History</span>
                </button>
                <button className="flex items-center gap-2 text-[var(--color-primary)] bg-blue-50 px-3 py-1.5 rounded-md hover:bg-blue-100 transition-colors">
                    <Printer size={16} />
                    <span className="text-sm font-medium">Print Report</span>
                </button>
            </div>

            <div className="consultation-card">
                <div className="border-b border-gray-100 pb-4 mb-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <span className={`text-xs font-semibold px-2 py-1 rounded-full uppercase tracking-wide ${labResult.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                {labResult.status}
                            </span>
                            <h1 className="text-2xl font-bold text-gray-900 mt-2">Lab Report #{labResult.id}</h1>
                            <p className="text-sm text-gray-500">{labResult.date} at {labResult.time}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">Performed by</p>
                            <p className="text-sm text-gray-600">{labResult.doctor}</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-8">
                    {/* Left Column: Patient Details */}
                    <div className="col-span-1 space-y-6">
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3">
                                <User size={16} className="text-gray-500" />
                                Patient Details
                            </h3>
                            <div className="space-y-2 text-sm">
                                <p><span className="text-gray-500 block text-xs">Name</span> {labResult.student}</p>
                                <p><span className="text-gray-500 block text-xs">ID</span> {labResult.code}</p>
                                <p><span className="text-gray-500 block text-xs">Age/Gender</span> {labResult.age} / {labResult.gender}</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Test Results */}
                    <div className="col-span-2 space-y-6">
                        <div>
                            <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-3 border-b border-gray-100 pb-2">
                                <FlaskConical size={20} className="text-[var(--color-primary)]" />
                                Test Results
                            </h3>

                            <div className="bg-white border border-gray-200 rounded-lg p-5">
                                <div className="flex justify-between items-center mb-4">
                                    <h4 className="font-semibold text-lg text-gray-800">{labResult.testName}</h4>
                                    {labResult.priority === 'Urgent' && (
                                        <span className="text-xs font-bold text-red-600 bg-red-50 border border-red-100 px-2 py-1 rounded uppercase">Urgent</span>
                                    )}
                                </div>

                                <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-md">
                                    <span className="font-medium text-gray-700">Result:</span>
                                    <span className="font-bold text-lg text-gray-900">{labResult.result}</span>
                                </div>

                                <div>
                                    <h5 className="text-sm font-medium text-gray-500 mb-1">Technician Notes</h5>
                                    <p className="text-gray-700 italic">"{labResult.notes}"</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LabResultDetails;
