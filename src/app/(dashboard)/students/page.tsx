"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LayoutGrid, List as ListIcon, Search, Plus } from 'lucide-react';

const StudentsPage = () => {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    const students = [
        {
            id: '1',
            name: 'Keza Sarah',
            code: 'RCA-2024-001',
            class: 'S4 MPC',
            age: 16,
            gender: 'Female',
            insurance: 'RAMA',
            status: 'active',
            lastVisit: '2 days ago'
        },
        {
            id: '2',
            name: 'Manzi David',
            code: 'RCA-2024-002',
            class: 'S5 PCB',
            age: 17,
            gender: 'Male',
            insurance: 'MMI',
            status: 'critical',
            lastVisit: 'Today'
        },
        {
            id: '3',
            name: 'Mutesi Joy',
            code: 'RCA-2024-003',
            class: 'S6 MEC',
            age: 18,
            gender: 'Female',
            insurance: 'RSSB',
            status: 'active',
            lastVisit: '1 week ago'
        },
        {
            id: '4',
            name: 'Hirwa Peter',
            code: 'RCA-2024-004',
            class: 'S4 MCB',
            age: 16,
            gender: 'Male',
            insurance: 'Radiant',
            status: 'follow-up',
            lastVisit: 'Yesterday'
        },
        {
            id: '5',
            name: 'Uwase Aline',
            code: 'RCA-2024-005',
            class: 'S5 LKK',
            age: 17,
            gender: 'Female',
            insurance: 'RAMA',
            status: 'active',
            lastVisit: '3 days ago'
        }
    ];

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'active':
                return { text: 'Active', className: 'bg-success/20 text-success' };
            case 'critical':
                return { text: 'Critical Alert', className: 'bg-error/20 text-error' };
            case 'follow-up':
                return { text: 'Follow Up', className: 'bg-warning/20 text-warning' };
            default:
                return { text: 'Active', className: 'bg-bg-secondary text-text-tertiary' };
        }
    };

    const filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.class.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-24px font-semibold text-primary">Students</h1>
                    <p className="text-12px text-text-tertiary">Manage student medical profiles</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" size={18} />
                        <input
                            type="text"
                            placeholder="Search students..."
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
                        onClick={() => router.push('/students/new')}
                    >
                        <Plus size={18} />
                        <span className="text-14px font-medium">Register Student</span>
                    </button>
                </div>
            </div>

            {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredStudents.map((student) => {
                        const statusBadge = getStatusBadge(student.status);
                        return (
                            <div key={student.id} className="bg-bg-card border border-border rounded-10 p-5 flex flex-col gap-4 hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start gap-3">
                                    <div>
                                        <h3 className="text-18px font-medium text-text-primary leading-tight">{student.name}</h3>
                                        <span className="text-8px text-text-tertiary uppercase tracking-wider">{student.class}</span>
                                    </div>
                                    <span className={`px-2 py-0.5 rounded-full text-8px font-medium whitespace-nowrap ${statusBadge.className}`}>
                                        {statusBadge.text}
                                    </span>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between items-center py-1.5 border-b border-border-light last:border-0">
                                        <span className="text-12px text-text-tertiary">Student ID</span>
                                        <span className="text-12px font-semibold text-text-primary">{student.code}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-1.5 border-b border-border-light last:border-0">
                                        <span className="text-12px text-text-tertiary">Age/Gender</span>
                                        <span className="text-12px font-semibold text-text-primary">{student.age} / {student.gender}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-1.5 border-b border-border-light last:border-0">
                                        <span className="text-12px text-text-tertiary">Insurance</span>
                                        <span className="text-12px font-semibold text-text-primary">{student.insurance}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-1.5 border-b border-border-light last:border-0">
                                        <span className="text-12px text-text-tertiary">Last Visit</span>
                                        <span className="text-12px font-semibold text-text-primary">{student.lastVisit}</span>
                                    </div>
                                </div>

                                <div className="flex gap-2 mt-auto">
                                    <button
                                        className="flex-1 py-2 bg-primary text-white rounded-5 text-12px font-medium hover:bg-primary-dark transition-colors"
                                        onClick={() => router.push(`/students/${student.id}`)}
                                    >
                                        View Profile
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
                                    <th className="px-6 py-4 text-12px font-medium text-text-primary">Student Name</th>
                                    <th className="px-6 py-4 text-12px font-medium text-text-primary">Class</th>
                                    <th className="px-6 py-4 text-12px font-medium text-text-primary">ID Code</th>
                                    <th className="px-6 py-4 text-12px font-medium text-text-primary">Age / Gender</th>
                                    <th className="px-6 py-4 text-12px font-medium text-text-primary">Insurance</th>
                                    <th className="px-6 py-4 text-12px font-medium text-text-primary">Status</th>
                                    <th className="px-6 py-4 text-12px font-medium text-text-primary">Last Visit</th>
                                    <th className="px-6 py-4 text-12px font-medium text-text-primary">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border-light">
                                {filteredStudents.map((student) => {
                                    const statusBadge = getStatusBadge(student.status);
                                    return (
                                        <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 text-12px font-medium text-text-primary">{student.name}</td>
                                            <td className="px-6 py-4 text-12px text-text-secondary">{student.class}</td>
                                            <td className="px-6 py-4 text-12px text-text-secondary">{student.code}</td>
                                            <td className="px-6 py-4 text-12px text-text-secondary">{student.age} / {student.gender}</td>
                                            <td className="px-6 py-4 text-12px text-text-secondary">{student.insurance}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-0.5 rounded-full text-8px font-medium inline-block ${statusBadge.className}`}>
                                                    {statusBadge.text}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-12px text-text-secondary">{student.lastVisit}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex gap-3">
                                                    <button
                                                        className="text-primary hover:underline text-12px font-medium"
                                                        onClick={() => router.push(`/students/${student.id}`)}
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

export default StudentsPage;
