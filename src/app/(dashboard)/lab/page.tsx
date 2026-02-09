"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LayoutGrid, List as ListIcon, Search, Plus } from 'lucide-react';

const LabPage = () => {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    const records = [
        {
            id: '1',
            student: 'Keza Sarah',
            type: 'Laboratory',
            date: '2024-02-08',
            result: 'Malaria Test: Negative',
            doctor: 'Lab Tech Jean',
            tags: ['Malaria', 'Blood Test'],
            status: 'completed',
            priority: 'high'
        },
        {
            id: '2',
            student: 'Manzi David',
            type: 'Medical History',
            date: '2024-01-15',
            result: 'Asthma Attack History',
            doctor: 'Dr. John',
            tags: ['Chronic', 'Respiratory'],
            status: 'active',
            priority: 'medium'
        },
        {
            id: '3',
            student: 'Mutesi Joy',
            type: 'Laboratory',
            date: '2024-02-07',
            result: 'Stool Analysis: Pending',
            doctor: 'Lab Tech Jean',
            tags: ['Stool', 'Infection'],
            status: 'pending',
            priority: 'medium'
        },
        {
            id: '4',
            student: 'Hirwa Peter',
            type: 'Medical History',
            date: '2023-11-20',
            result: 'Allergy: Penicillin',
            doctor: 'Dr. John',
            tags: ['Allergy', 'Critical'],
            status: 'active',
            priority: 'high'
        }
    ];

    const filteredRecords = records.filter(record =>
        record.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.result.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'completed': return 'bg-success/20 text-success';
            case 'active': return 'bg-primary/20 text-primary';
            case 'pending': return 'bg-warning/20 text-warning';
            default: return 'bg-bg-secondary text-text-tertiary';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-24px font-semibold text-primary">Medical History & Lab</h1>
                    <p className="text-12px text-text-tertiary">Manage laboratory requests and patient history</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" size={18} />
                        <input
                            type="text"
                            placeholder="Search records..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-bg-card border border-border rounded-8 pl-10 pr-4 py-2 text-12px focus:ring-1 focus:ring-primary outline-none min-w-[240px]"
                        />
                    </div>

                    <div className="flex bg-bg-secondary rounded-lg p-1 h-[40px] items-center border border-border">
                        <button
                            className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-primary' : 'text-text-tertiary hover:text-text-secondary'}`}
                            onClick={() => setViewMode('grid')}
                        >
                            <LayoutGrid size={18} />
                        </button>
                        <button
                            className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-primary' : 'text-text-tertiary hover:text-text-secondary'}`}
                            onClick={() => setViewMode('list')}
                        >
                            <ListIcon size={18} />
                        </button>
                    </div>

                    <button
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-5 hover:bg-primary-dark transition-colors"
                        onClick={() => router.push('/lab/new')}
                    >
                        <Plus size={18} />
                        <span className="text-14px font-medium">New Lab Request</span>
                    </button>
                </div>
            </div>

            {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredRecords.map((record) => {
                        const statusBadge = getStatusBadge(record.status);
                        return (
                            <div key={record.id} className="bg-bg-card border border-border rounded-10 p-5 flex flex-col gap-4 hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start gap-3">
                                    <h3 className="text-18px font-medium text-text-primary leading-tight">{record.student}</h3>
                                    <span className={`px-2 py-0.5 rounded-full text-8px font-medium whitespace-nowrap capitalize ${statusBadge}`}>
                                        {record.status}
                                    </span>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex flex-col gap-1 py-1 border-b border-border-light last:border-0">
                                        <span className="text-8px text-text-tertiary uppercase tracking-wider">Type</span>
                                        <span className="text-12px font-medium text-text-primary">{record.type}</span>
                                    </div>
                                    <div className="flex flex-col gap-1 py-1 border-b border-border-light last:border-0">
                                        <span className="text-8px text-text-tertiary uppercase tracking-wider">Result/Condition</span>
                                        <span className="text-12px font-medium text-text-primary">{record.result}</span>
                                    </div>
                                    <div className="flex flex-col gap-1 py-1 border-b border-border-light last:border-0">
                                        <span className="text-8px text-text-tertiary uppercase tracking-wider">Doctor/Tech</span>
                                        <span className="text-12px font-medium text-text-primary">{record.doctor}</span>
                                    </div>
                                    <div className="flex flex-col gap-1 py-1 border-b border-border-light last:border-0">
                                        <span className="text-8px text-text-tertiary uppercase tracking-wider text-right">Date</span>
                                        <span className="text-12px font-medium text-text-primary text-right">{record.date}</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2 pt-2">
                                        {record.tags.map((tag, index) => (
                                            <span key={index} className="px-2 py-1 rounded-5 bg-info-bg text-primary text-8px">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex gap-2 mt-auto">
                                    <button
                                        className="flex-1 py-2 bg-primary text-white rounded-5 text-12px font-medium hover:bg-primary-dark transition-colors"
                                        onClick={() => router.push(`/lab/${record.id}`)}
                                    >
                                        View Report
                                    </button>
                                    <button className="flex-1 py-2 border border-border text-primary rounded-5 text-12px font-medium hover:bg-gray-50 transition-colors">
                                        Edit
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="bg-bg-card border border-border rounded-10 overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-bg-secondary border-b border-border">
                                    <th className="px-6 py-4 text-12px font-medium text-text-primary">Student</th>
                                    <th className="px-6 py-4 text-12px font-medium text-text-primary">Type</th>
                                    <th className="px-6 py-4 text-12px font-medium text-text-primary">Result/Condition</th>
                                    <th className="px-6 py-4 text-12px font-medium text-text-primary">Doctor/Tech</th>
                                    <th className="px-6 py-4 text-12px font-medium text-text-primary">Date</th>
                                    <th className="px-6 py-4 text-12px font-medium text-text-primary">Status</th>
                                    <th className="px-6 py-4 text-12px font-medium text-text-primary">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border-light">
                                {filteredRecords.map((record) => {
                                    const statusBadge = getStatusBadge(record.status);
                                    return (
                                        <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 text-12px font-medium text-text-primary">{record.student}</td>
                                            <td className="px-6 py-4 text-12px text-text-secondary">{record.type}</td>
                                            <td className="px-6 py-4 text-12px text-text-secondary">{record.result}</td>
                                            <td className="px-6 py-4 text-12px text-text-secondary">{record.doctor}</td>
                                            <td className="px-6 py-4 text-12px text-text-secondary">{record.date}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-0.5 rounded-full text-8px font-medium inline-block capitalize ${statusBadge}`}>
                                                    {record.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex gap-3">
                                                    <button
                                                        className="text-primary hover:underline text-12px font-medium"
                                                        onClick={() => router.push(`/lab/${record.id}`)}
                                                    >
                                                        View
                                                    </button>
                                                    <button className="text-text-tertiary hover:text-text-secondary text-12px font-medium">
                                                        Edit
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LabPage;
