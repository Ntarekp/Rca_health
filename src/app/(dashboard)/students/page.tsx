"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Plus } from 'lucide-react';

const StudentsPage = () => {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');
    const [students, setStudents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8081/health/api/students');
                if (response.ok) {
                    const data = await response.json();
                    if (Array.isArray(data)) {
                        const mappedStudents = data.map((s: any) => ({
                            id: s.studentId,
                            name: `${s.firstName} ${s.lastName}`,
                            code: s.schoolId,
                            class: s.studentClass,
                            age: calculateAge(s.dateOfBirth),
                            gender: s.gender,
                            insurance: s.insuranceProvider,
                            status: 'active', // Default for now
                            lastVisit: 'N/A' // Default for now
                        }));
                        setStudents(mappedStudents);
                    } else {
                        console.error('API response is not an array:', data);
                    }
                } else {
                    console.error('Failed to fetch students:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching students:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStudents();
    }, []);

    const calculateAge = (dob: string) => {
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

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

    if (loading) {
        return <div>Loading...</div>;
    }

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

                    <button
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-5 hover:bg-primary-dark transition-colors"
                        onClick={() => router.push('/students/new')}
                    >
                        <Plus size={18} />
                        <span className="text-14px font-medium">Register Student</span>
                    </button>
                </div>
            </div>

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
                            {filteredStudents.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="px-6 py-4 text-center text-text-tertiary">No students found.</td>
                                </tr>
                            ) : (
                                filteredStudents.map((student) => {
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
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default StudentsPage;
