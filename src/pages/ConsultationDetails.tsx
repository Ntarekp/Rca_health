import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Printer, Activity, User, ClipboardList, FileText } from 'lucide-react';
import './NewConsultation.css'; // Reusing styles

const ConsultationDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    console.log('Viewing consultation:', id);

    // Mock Data
    const consultation = {
        id: '101',
        date: '2024-02-08',
        time: '08:30 AM',
        student: 'Keza Sarah',
        code: 'RCA-2024-001',
        class: 'S4 MPC',
        handledBy: 'Nurse Jane',
        vitals: {
            temp: '37.2',
            bp: '110/70',
            pulse: '78',
            weight: '52'
        },
        complaint: 'Severe Headache',
        symptoms: ['Headache', 'Sensitivity to Light'],
        diagnosis: 'Migraine',
        treatment: 'Paracetamol 500mg, Rest in dark room',
        disposition: 'Returned to Class after 1 hr',
        notes: 'Advised to drink water'
    };

    return (
        <div className="consultation-form-page">
            <div className="flex justify-between items-center mb-6">
                <button
                    onClick={() => navigate('/consultations')}
                    className="flex items-center gap-2 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors"
                >
                    <ArrowLeft size={18} />
                    <span>Back to Consultations</span>
                </button>
                <button className="flex items-center gap-2 text-[var(--color-primary)] bg-blue-50 px-3 py-1.5 rounded-md hover:bg-blue-100 transition-colors">
                    <Printer size={16} />
                    <span className="text-sm font-medium">Print Record</span>
                </button>
            </div>

            <div className="consultation-card">
                <div className="border-b border-gray-100 pb-4 mb-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-full uppercase tracking-wide">Completed</span>
                            <h1 className="text-2xl font-bold text-gray-900 mt-2">Consultation #{consultation.id}</h1>
                            <p className="text-sm text-gray-500">{consultation.date} at {consultation.time}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">Attended by</p>
                            <p className="text-sm text-gray-600">{consultation.handledBy}</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-8">
                    {/* Left Column: Vitals & Student */}
                    <div className="col-span-1 space-y-6">
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3">
                                <User size={16} className="text-gray-500" />
                                Student Details
                            </h3>
                            <div className="space-y-2 text-sm">
                                <p><span className="text-gray-500 block text-xs">Name</span> {consultation.student}</p>
                                <p><span className="text-gray-500 block text-xs">Class</span> {consultation.class}</p>
                                <p><span className="text-gray-500 block text-xs">ID</span> {consultation.code}</p>
                            </div>
                        </div>

                        <div className="bg-blue-50 p-4 rounded-lg">
                            <h3 className="flex items-center gap-2 text-sm font-semibold text-blue-900 mb-3">
                                <Activity size={16} className="text-blue-500" />
                                Vitals
                            </h3>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div><span className="text-blue-500 block text-xs">Temp</span> {consultation.vitals.temp}°C</div>
                                <div><span className="text-blue-500 block text-xs">BP</span> {consultation.vitals.bp}</div>
                                <div><span className="text-blue-500 block text-xs">Pulse</span> {consultation.vitals.pulse}</div>
                                <div><span className="text-blue-500 block text-xs">Weight</span> {consultation.vitals.weight}kg</div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Clinical Content */}
                    <div className="col-span-2 space-y-6">
                        <div>
                            <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-3 border-b border-gray-100 pb-2">
                                <ClipboardList size={20} className="text-[var(--color-primary)]" />
                                Clinical Assessment
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500">Chief Complaint</h4>
                                    <p className="text-gray-900">{consultation.complaint}</p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500">Symptoms</h4>
                                    <div className="flex gap-2 mt-1">
                                        {consultation.symptoms.map(s => (
                                            <span key={s} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">{s}</span>
                                        ))}
                                    </div>
                                </div>
                                <div className="bg-yellow-50 p-4 rounded-md border border-yellow-100">
                                    <h4 className="text-sm font-medium text-yellow-800 mb-1">Diagnosis</h4>
                                    <p className="text-lg font-semibold text-yellow-900">{consultation.diagnosis}</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-3 border-b border-gray-100 pb-2">
                                <FileText size={20} className="text-[var(--color-primary)]" />
                                Plan
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500">Treatment Given</h4>
                                    <p className="text-gray-900">{consultation.treatment}</p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500">Disposition</h4>
                                    <p className="text-gray-900 font-medium">{consultation.disposition}</p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500">Notes</h4>
                                    <p className="text-gray-900 italic">"{consultation.notes}"</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConsultationDetails;
