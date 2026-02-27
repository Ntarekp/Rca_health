"use client";

import { MoreHorizontal, Eye, Clock } from 'lucide-react';

interface AppointmentsTableProps {
    data?: any[];
}

const AppointmentsTable = ({ data = [] }: AppointmentsTableProps) => {
    // Helper to format time
    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="bg-bg-card rounded-10 shadow-sm overflow-hidden h-full">
            <div className="p-6 border-b border-border-light flex justify-between items-center">
                <h3 className="text-14px font-semibold text-text-secondary">Today's Appointments</h3>
                <button className="text-12px text-primary font-medium hover:underline">View All</button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-[#f8f9fc]">
                        <tr>
                            <th className="px-6 py-4 text-left text-12px font-medium text-text-secondary">Student Name</th>
                            <th className="px-6 py-4 text-left text-12px font-medium text-text-secondary">Class</th>
                            <th className="px-6 py-4 text-left text-12px font-medium text-text-secondary">Time</th>
                            <th className="px-6 py-4 text-left text-12px font-medium text-text-secondary">Reason</th>
                            <th className="px-6 py-4 text-left text-12px font-medium text-text-secondary">Attended By</th>
                            <th className="px-6 py-4 text-left text-12px font-medium text-text-secondary">Status</th>
                            <th className="px-6 py-4 text-left text-12px font-medium text-text-secondary">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border-light">
                        {data.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="px-6 py-4 text-center text-12px text-text-tertiary">No appointments for today.</td>
                            </tr>
                        ) : (
                            data.map((item) => (
                                <tr key={item.visitId} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 text-13px font-medium text-text-primary">{item.studentName}</td>
                                    <td className="px-6 py-4 text-13px text-text-secondary">{item.studentClass}</td>
                                    <td className="px-6 py-4 text-13px text-text-secondary flex items-center gap-2">
                                        <Clock size={14} className="text-gray-400" /> {formatTime(item.visitDateTime)}
                                    </td>
                                    <td className="px-6 py-4 text-13px text-text-secondary">{item.chiefComplaint}</td>
                                    <td className="px-6 py-4 text-13px text-text-secondary">Nurse</td> {/* Placeholder for now */}
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-10px font-medium bg-[#e6f4ea] text-success`}>
                                            Completed
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
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AppointmentsTable;
