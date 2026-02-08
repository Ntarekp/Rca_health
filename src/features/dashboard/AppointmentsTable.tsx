
import { MoreHorizontal, Eye, Clock } from 'lucide-react';

const appointmentsData = [
    { id: 1, student: 'Keza Sarah', class: 'S4 MPC', time: '08:30 AM', reason: 'Headache', doctor: 'Nurse Jane', status: 'Completed' },
    { id: 2, student: 'Mutesi Joy', class: 'S5 PCB', time: '09:15 AM', reason: 'Stomach Pain', doctor: 'Nurse Jane', status: 'In Progress' },
    { id: 3, student: 'Hirwa Peter', class: 'S6 MEC', time: '10:00 AM', reason: 'Fever', doctor: 'Dr. John', status: 'Scheduled' },
    { id: 4, student: 'Kwizera Paul', class: 'S4 MCB', time: '10:45 AM', reason: 'Injury', doctor: 'Dr. John', status: 'Scheduled' },
    { id: 5, student: 'Uwase Aline', class: 'S5 LKK', time: '11:30 AM', reason: 'Checkup', doctor: 'Nurse Jane', status: 'Scheduled' },
    { id: 6, student: 'Manzi David', class: 'S3 A', time: '02:00 PM', reason: 'Malaria Test', doctor: 'Lab Tech', status: 'Scheduled' },
];

const getStatusStyle = (status: string) => {
    switch (status) {
        case 'Completed': return 'bg-[#e6f4ea] text-[var(--color-success)]';
        case 'In Progress': return 'bg-[#fff7e6] text-[var(--color-warning)]';
        case 'Scheduled': return 'bg-[#e8f0fe] text-[var(--color-primary)]';
        case 'Cancelled': return 'bg-[#fce8e6] text-[var(--color-error)]';
        default: return 'bg-gray-100 text-gray-600';
    }
};

const AppointmentsTable = () => {
    return (
        <div className="bg-[var(--color-bg-card)] rounded-[var(--radius-10)] shadow-sm overflow-hidden h-full">
            <div className="p-6 border-b border-[var(--color-border-light)] flex justify-between items-center">
                <h3 className="text-[14px] font-semibold text-[var(--color-text-secondary)]">Today's Appointments</h3>
                <button className="text-[12px] text-[var(--color-primary)] font-medium hover:underline">View All</button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-[#f8f9fc]">
                        <tr>
                            <th className="px-6 py-4 text-left text-[12px] font-medium text-[var(--color-text-secondary)]">Student Name</th>
                            <th className="px-6 py-4 text-left text-[12px] font-medium text-[var(--color-text-secondary)]">Class</th>
                            <th className="px-6 py-4 text-left text-[12px] font-medium text-[var(--color-text-secondary)]">Time</th>
                            <th className="px-6 py-4 text-left text-[12px] font-medium text-[var(--color-text-secondary)]">Reason</th>
                            <th className="px-6 py-4 text-left text-[12px] font-medium text-[var(--color-text-secondary)]">Attended By</th>
                            <th className="px-6 py-4 text-left text-[12px] font-medium text-[var(--color-text-secondary)]">Status</th>
                            <th className="px-6 py-4 text-left text-[12px] font-medium text-[var(--color-text-secondary)]">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--color-border-light)]">
                        {appointmentsData.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 text-[13px] font-medium text-[var(--color-text-primary)]">{item.student}</td>
                                <td className="px-6 py-4 text-[13px] text-[var(--color-text-secondary)]">{item.class}</td>
                                <td className="px-6 py-4 text-[13px] text-[var(--color-text-secondary)] flex items-center gap-2">
                                    <Clock size={14} className="text-gray-400" /> {item.time}
                                </td>
                                <td className="px-6 py-4 text-[13px] text-[var(--color-text-secondary)]">{item.reason}</td>
                                <td className="px-6 py-4 text-[13px] text-[var(--color-text-secondary)]">{item.doctor}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-medium ${getStatusStyle(item.status)}`}>
                                        {item.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <button className="p-1 hover:bg-gray-200 rounded-full text-gray-500 transition-colors" title="View Details">
                                            <Eye size={16} />
                                        </button>
                                        <button className="p-1 hover:bg-gray-200 rounded-full text-gray-500 transition-colors" title="More Actions">
                                            <MoreHorizontal size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AppointmentsTable;
