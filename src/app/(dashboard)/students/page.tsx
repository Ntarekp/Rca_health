"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Plus, Trash2, Calendar, BookOpen } from 'lucide-react';
import { useAcademicYear } from '@/context/AcademicYearContext';

const StudentsPage = () => {
    const router = useRouter();
    const { selectedYearId, academicYears } = useAcademicYear();
    const [activeTab, setActiveTab] = useState<'students' | 'classes' | 'years'>('students');

    // --- Students Tab State ---
    const [searchTerm, setSearchTerm] = useState('');
    const [students, setStudents] = useState<any[]>([]);
    const [loadingStudents, setLoadingStudents] = useState(true);
    const [classes, setClasses] = useState<any[]>([]);
    const [selectedClass, setSelectedClass] = useState<string>('');

    // --- Academic Management State ---
    const [yearsList, setYearsList] = useState<any[]>([]);
    const [newYear, setNewYear] = useState({ name: '', startDate: '', endDate: '', isActive: false });
    const [newClass, setNewClass] = useState({ name: '' });
    const [loadingAction, setLoadingAction] = useState(false);
    const [selectedYearForClasses, setSelectedYearForClasses] = useState<string>('');
    const [classesForManagement, setClassesForManagement] = useState<any[]>([]);

    // Fetch Students
    useEffect(() => {
        const fetchStudents = async () => {
            setLoadingStudents(true);
            try {
                const response = await fetch('http://127.0.0.1:8081/health/api/students');
                if (response.ok) {
                    const data = await response.json();
                    console.log('Raw students data:', data);
                    if (Array.isArray(data)) {
                        const mappedStudents = data.map((s: any) => ({
                            id: s.studentId,
                            name: `${s.firstName} ${s.lastName}`,
                            code: s.schoolId,
                            class: s.schoolClass ? s.schoolClass.name : 'N/A',
                            classId: s.schoolClass ? s.schoolClass.id.toString() : '',
                            academicYearId: s.schoolClass && s.schoolClass.academicYear ? s.schoolClass.academicYear.id.toString() : '',
                            age: calculateAge(s.dateOfBirth),
                            gender: s.gender,
                            insurance: s.insuranceProvider,
                            status: 'active',
                            lastVisit: 'N/A'
                        }));
                        console.log('Mapped students:', mappedStudents);
                        setStudents(mappedStudents);
                    }
                }
            } catch (error) {
                console.error('Error fetching students:', error);
            } finally {
                setLoadingStudents(false);
            }
        };
        fetchStudents();
    }, []);

    // Fetch Classes for Filter (based on global selectedYearId)
    useEffect(() => {
        if (selectedYearId) {
            const fetchClasses = async () => {
                try {
                    const response = await fetch(`http://127.0.0.1:8081/health/api/academic/years/${selectedYearId}/classes`);
                    if (response.ok) {
                        const data = await response.json();
                        setClasses(data);
                        setSelectedClass('');
                    }
                } catch (error) {
                    console.error('Error fetching classes:', error);
                }
            };
            fetchClasses();
        } else {
            setClasses([]);
        }
    }, [selectedYearId]);

    // Fetch Years List for Management Tab
    useEffect(() => {
        if (activeTab === 'years' || activeTab === 'classes') {
            fetchYearsList();
        }
    }, [activeTab]);

    // Fetch Classes for Management Tab
    useEffect(() => {
        if (activeTab === 'classes' && selectedYearForClasses) {
            fetchClassesForManagement(selectedYearForClasses);
        } else if (activeTab === 'classes' && yearsList.length > 0 && !selectedYearForClasses) {
             setSelectedYearForClasses(yearsList[0].id);
        }
    }, [activeTab, selectedYearForClasses, yearsList]);

    const fetchYearsList = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8081/health/api/academic/years');
            if (response.ok) {
                const data = await response.json();
                setYearsList(data);
            }
        } catch (error) {
            console.error('Error fetching years:', error);
        }
    };

    const fetchClassesForManagement = async (yearId: string) => {
        try {
            const response = await fetch(`http://127.0.0.1:8081/health/api/academic/years/${yearId}/classes`);
            if (response.ok) {
                const data = await response.json();
                setClassesForManagement(data);
            }
        } catch (error) {
            console.error('Error fetching classes:', error);
        }
    };

    const handleCreateYear = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoadingAction(true);
        try {
            const response = await fetch('http://127.0.0.1:8081/health/api/academic/years', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newYear)
            });
            if (response.ok) {
                setNewYear({ name: '', startDate: '', endDate: '', isActive: false });
                fetchYearsList();
                window.location.reload();
            }
        } catch (error) {
            console.error('Error creating year:', error);
        } finally {
            setLoadingAction(false);
        }
    };

    const handleCreateClass = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedYearForClasses) return;
        setLoadingAction(true);
        try {
            const payload = {
                name: newClass.name,
                academicYearId: selectedYearForClasses
            };
            const response = await fetch('http://127.0.0.1:8081/health/api/academic/classes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (response.ok) {
                setNewClass({ name: '' });
                fetchClassesForManagement(selectedYearForClasses);
            }
        } catch (error) {
            console.error('Error creating class:', error);
        } finally {
            setLoadingAction(false);
        }
    };

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
            case 'active': return { text: 'Active', className: 'bg-success/20 text-success' };
            case 'critical': return { text: 'Critical Alert', className: 'bg-error/20 text-error' };
            case 'follow-up': return { text: 'Follow Up', className: 'bg-warning/20 text-warning' };
            default: return { text: 'Active', className: 'bg-bg-secondary text-text-tertiary' };
        }
    };

    const filteredStudents = students.filter(student => {
        const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              student.class.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesYear = selectedYearId ? student.academicYearId === selectedYearId : true;
        const matchesClass = selectedClass ? student.classId === selectedClass : true;
        return matchesSearch && matchesYear && matchesClass;
    });

    return (
        <div className="space-y-6 pb-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-24px font-semibold text-primary">Students & Academic</h1>
                    <p className="text-12px text-text-tertiary">Manage students, classes, and academic years</p>
                </div>
            </div>

            <div className="flex border-b border-border">
                <button
                    className={`px-6 py-3 text-14px font-medium transition-colors border-b-2 ${activeTab === 'students' ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:text-primary'}`}
                    onClick={() => setActiveTab('students')}
                >
                    Student List
                </button>
                <button
                    className={`px-6 py-3 text-14px font-medium transition-colors border-b-2 ${activeTab === 'classes' ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:text-primary'}`}
                    onClick={() => setActiveTab('classes')}
                >
                    Manage Classes
                </button>
                <button
                    className={`px-6 py-3 text-14px font-medium transition-colors border-b-2 ${activeTab === 'years' ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:text-primary'}`}
                    onClick={() => setActiveTab('years')}
                >
                    Manage Years
                </button>
            </div>

            {activeTab === 'students' && (
                <div className="space-y-6 animate-in fade-in duration-300">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                            <select
                                value={selectedClass}
                                onChange={(e) => setSelectedClass(e.target.value)}
                                className="bg-white border border-border rounded-8 px-3 py-2 text-12px outline-none focus:border-primary"
                            >
                                <option value="">All Classes</option>
                                {classes.map(cls => (
                                    <option key={cls.id} value={cls.id}>{cls.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex items-center gap-3">
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
                                <thead className="bg-bg-secondary border-b border-border">
                                    <tr>
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
                                    {loadingStudents ? (
                                        <tr><td colSpan={8} className="px-6 py-4 text-center text-text-tertiary">Loading...</td></tr>
                                    ) : filteredStudents.length === 0 ? (
                                        <tr>
                                            <td colSpan={8} className="px-6 py-4 text-center text-text-tertiary">No students found for this academic year.</td>
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
            )}

            {activeTab === 'classes' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-300">
                    <div className="lg:col-span-1">
                        <div className="bg-bg-card border border-border rounded-10 p-6 shadow-sm">
                            <h3 className="text-16px font-semibold text-primary mb-4">Add Class to Year</h3>
                            <div className="mb-4">
                                <label className="text-12px font-medium text-text-secondary block mb-1.5">Select Academic Year</label>
                                <select
                                    value={selectedYearForClasses}
                                    onChange={(e) => setSelectedYearForClasses(e.target.value)}
                                    className="w-full px-3 py-2 border border-border rounded-5 text-13px outline-none focus:border-primary bg-white"
                                >
                                    {yearsList.map(year => (
                                        <option key={year.id} value={year.id}>{year.name}</option>
                                    ))}
                                </select>
                            </div>
                            <form onSubmit={handleCreateClass} className="space-y-4">
                                <div>
                                    <label className="text-12px font-medium text-text-secondary block mb-1.5">Class Name</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. S4 MPC"
                                        value={newClass.name}
                                        onChange={(e) => setNewClass({ ...newClass, name: e.target.value })}
                                        className="w-full px-3 py-2 border border-border rounded-5 text-13px outline-none focus:border-primary"
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={loadingAction || !selectedYearForClasses}
                                    className="w-full py-2 bg-primary text-white rounded-5 text-13px font-medium hover:bg-primary-dark transition-colors disabled:opacity-50"
                                >
                                    {loadingAction ? 'Creating...' : 'Add Class'}
                                </button>
                            </form>
                        </div>
                    </div>

                    <div className="lg:col-span-2">
                        <div className="bg-bg-card border border-border rounded-10 overflow-hidden shadow-sm">
                            <div className="p-4 border-b border-border bg-bg-secondary flex justify-between items-center">
                                <h4 className="text-13px font-semibold text-text-primary">
                                    Classes for {yearsList.find(y => y.id.toString() === selectedYearForClasses)?.name || 'Selected Year'}
                                </h4>
                                <span className="text-12px text-text-tertiary">{classesForManagement.length} Classes</span>
                            </div>
                            <div className="p-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                                {classesForManagement.length === 0 ? (
                                    <p className="col-span-full text-center text-13px text-text-tertiary py-4">No classes found for this year.</p>
                                ) : (
                                    classesForManagement.map((cls) => (
                                        <div key={cls.id} className="flex items-center justify-between p-3 border border-border rounded-5 bg-white hover:border-primary/50 transition-colors group">
                                            <span className="text-13px font-medium text-text-primary">{cls.name}</span>
                                            <button className="text-text-tertiary hover:text-error opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'years' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-300">
                    <div className="lg:col-span-1">
                        <div className="bg-bg-card border border-border rounded-10 p-6 shadow-sm">
                            <h3 className="text-16px font-semibold text-primary mb-4">Add New Academic Year</h3>
                            <form onSubmit={handleCreateYear} className="space-y-4">
                                <div>
                                    <label className="text-12px font-medium text-text-secondary block mb-1.5">Year Name</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. 2024-2025"
                                        value={newYear.name}
                                        onChange={(e) => setNewYear({ ...newYear, name: e.target.value })}
                                        className="w-full px-3 py-2 border border-border rounded-5 text-13px outline-none focus:border-primary"
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-12px font-medium text-text-secondary block mb-1.5">Start Date</label>
                                        <input
                                            type="date"
                                            value={newYear.startDate}
                                            onChange={(e) => setNewYear({ ...newYear, startDate: e.target.value })}
                                            className="w-full px-3 py-2 border border-border rounded-5 text-13px outline-none focus:border-primary"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="text-12px font-medium text-text-secondary block mb-1.5">End Date</label>
                                        <input
                                            type="date"
                                            value={newYear.endDate}
                                            onChange={(e) => setNewYear({ ...newYear, endDate: e.target.value })}
                                            className="w-full px-3 py-2 border border-border rounded-5 text-13px outline-none focus:border-primary"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="isActive"
                                        checked={newYear.isActive}
                                        onChange={(e) => setNewYear({ ...newYear, isActive: e.target.checked })}
                                        className="rounded border-border text-primary focus:ring-primary"
                                    />
                                    <label htmlFor="isActive" className="text-13px text-text-secondary">Set as Active Year</label>
                                </div>
                                <button
                                    type="submit"
                                    disabled={loadingAction}
                                    className="w-full py-2 bg-primary text-white rounded-5 text-13px font-medium hover:bg-primary-dark transition-colors disabled:opacity-50"
                                >
                                    {loadingAction ? 'Creating...' : 'Create Year'}
                                </button>
                            </form>
                        </div>
                    </div>

                    <div className="lg:col-span-2">
                        <div className="bg-bg-card border border-border rounded-10 overflow-hidden shadow-sm">
                            <table className="w-full text-left">
                                <thead className="bg-bg-secondary border-b border-border">
                                    <tr>
                                        <th className="px-6 py-3 text-12px font-medium text-text-primary">Name</th>
                                        <th className="px-6 py-3 text-12px font-medium text-text-primary">Start Date</th>
                                        <th className="px-6 py-3 text-12px font-medium text-text-primary">End Date</th>
                                        <th className="px-6 py-3 text-12px font-medium text-text-primary">Status</th>
                                        <th className="px-6 py-3 text-12px font-medium text-text-primary text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border-light">
                                    {yearsList.map((year) => (
                                        <tr key={year.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-3 text-13px font-medium text-text-primary">{year.name}</td>
                                            <td className="px-6 py-3 text-13px text-text-secondary">{year.startDate}</td>
                                            <td className="px-6 py-3 text-13px text-text-secondary">{year.endDate}</td>
                                            <td className="px-6 py-3">
                                                {year.isActive ? (
                                                    <span className="px-2 py-0.5 bg-success/10 text-success text-10px font-bold rounded-full border border-success/20">ACTIVE</span>
                                                ) : (
                                                    <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-10px font-bold rounded-full">INACTIVE</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-3 text-right">
                                                <button className="text-text-tertiary hover:text-error transition-colors">
                                                    <Trash2 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentsPage;
