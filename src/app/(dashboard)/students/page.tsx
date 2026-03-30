"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Plus, Trash2, Calendar, BookOpen, Upload, X, FileSpreadsheet } from 'lucide-react';
import { useAcademicYear } from '@/context/AcademicYearContext';
import { apiUrl, authenticatedFetch } from '@/utils/api';

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

    // --- Notifications & UI State ---
    const [isDeleting, setIsDeleting] = useState(false);
    const [studentToDelete, setStudentToDelete] = useState<any | null>(null);
    const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    
    // --- Excel Import State ---
    const [showImportModal, setShowImportModal] = useState(false);
    const [importFile, setImportFile] = useState<File | null>(null);
    const [importClassId, setImportClassId] = useState('');
    const [importing, setImporting] = useState(false);
    const [importResult, setImportResult] = useState<any>(null);

    const showToast = (type: 'success' | 'error', text: string) => {
        setToastMessage({ type, text });
        setTimeout(() => setToastMessage(null), 3000);
    };

    // Fetch Students
    useEffect(() => {
        const fetchStudents = async () => {
            setLoadingStudents(true);
            try {
                const response = await authenticatedFetch('/api/students');
                if (response.ok) {
                    const data = await response.json();
                    console.log('Raw students data:', data);
                    if (Array.isArray(data)) {
                        const mappedStudents = data.map((s: any) => {
                            try {
                                const mapped = {
                                    id: s?.studentId,
                                    name: `${s?.firstName || ''} ${s?.lastName || ''}`.trim() || 'Unknown',
                                    code: s?.schoolId || 'N/A',
                                    class: s?.schoolClass?.name || 'N/A',
                                    classId: s?.schoolClass?.id?.toString() || '',
                                    academicYearId: s?.schoolClass?.academicYear?.id?.toString() || '',
                                    age: s?.dateOfBirth ? calculateAge(s.dateOfBirth) : 'N/A',
                                    gender: s?.gender || 'N/A',
                                    insurance: s?.insuranceProvider || 'N/A',
                                    email: s?.email || 'N/A',
                                    lastVisit: 'N/A'
                                };
                                console.log('Successfully mapped student:', mapped);
                                return mapped;
                            } catch (err) {
                                console.error('Error mapping individual student:', s, err);
                                return null;
                            }
                        }).filter(Boolean); // remove any nulls if mapping completely failed
                        console.log('Mapped students:', mappedStudents);
                        setStudents(mappedStudents);
                    }
                } else {
                    console.error('Failed to fetch students. Status:', response.status);
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
                    const response = await authenticatedFetch(`/api/academic/years/${selectedYearId}/classes`);
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
            const response = await authenticatedFetch('/api/academic/years');
            if (response.ok) {
                const data = await response.json();
                setYearsList(data);
            }
        } catch (error) {
            console.error('Error fetching years:', error);
        }
    };

    const handleDeleteClass = async (classId: number, className: string) => {
        const confirmed = window.confirm(`Delete class "${className}"? This cannot be undone.`);
        if (!confirmed) return;

        setLoadingAction(true);
        try {
            const response = await authenticatedFetch(`/api/academic/classes/${classId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                showToast('success', `Class "${className}" deleted successfully.`);
                fetchClassesForManagement(selectedYearForClasses);
                if (selectedYearId) {
                    const classesResponse = await authenticatedFetch(`/api/academic/years/${selectedYearId}/classes`);
                    if (classesResponse.ok) {
                        const classesData = await classesResponse.json();
                        setClasses(classesData);
                    }
                }
            } else {
                const errorText = await response.text();
                showToast('error', errorText || 'Failed to delete class.');
            }
        } catch (error) {
            console.error('Error deleting class:', error);
            showToast('error', 'An error occurred while deleting class.');
        } finally {
            setLoadingAction(false);
        }
    };

    const handleDeleteYear = async (yearId: number, yearName: string) => {
        const confirmed = window.confirm(`Delete academic year "${yearName}"? This cannot be undone.`);
        if (!confirmed) return;

        setLoadingAction(true);
        try {
            const response = await authenticatedFetch(`/api/academic/years/${yearId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                showToast('success', `Academic year "${yearName}" deleted successfully.`);
                await fetchYearsList();
                if (selectedYearForClasses === yearId.toString()) {
                    setSelectedYearForClasses('');
                    setClassesForManagement([]);
                }
            } else {
                const errorText = await response.text();
                showToast('error', errorText || 'Failed to delete academic year.');
            }
        } catch (error) {
            console.error('Error deleting academic year:', error);
            showToast('error', 'An error occurred while deleting academic year.');
        } finally {
            setLoadingAction(false);
        }
    };

    const fetchClassesForManagement = async (yearId: string) => {
        try {
            const response = await authenticatedFetch(`/api/academic/years/${yearId}/classes`);
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
            const response = await authenticatedFetch('/api/academic/years', {
                method: 'POST',
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
            const response = await authenticatedFetch('/api/academic/classes', {
                method: 'POST',
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

    const handleImportExcel = async () => {
        if (!importFile || !importClassId) {
            showToast('error', 'Please select a file and class');
            return;
        }

        setImporting(true);
        setImportResult(null);

        try {
            const formData = new FormData();
            formData.append('file', importFile);
            formData.append('classId', importClassId);

            const token = localStorage.getItem('authToken');
            const response = await fetch(apiUrl('/api/students/import'), {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (response.ok) {
                const result = await response.json();
                setImportResult(result);
                showToast('success', `Imported ${result.successCount} students successfully`);
                
                // Refresh students list
                const studentsResponse = await authenticatedFetch('/api/students');
                if (studentsResponse.ok) {
                    const data = await studentsResponse.json();
                    if (Array.isArray(data)) {
                        const mappedStudents = data.map((s: any) => ({
                            id: s?.studentId,
                            name: `${s?.firstName || ''} ${s?.lastName || ''}`.trim() || 'Unknown',
                            code: s?.schoolId || 'N/A',
                            class: s?.schoolClass?.name || 'N/A',
                            classId: s?.schoolClass?.id?.toString() || '',
                            academicYearId: s?.schoolClass?.academicYear?.id?.toString() || '',
                            age: s?.dateOfBirth ? calculateAge(s.dateOfBirth) : 'N/A',
                            gender: s?.gender || 'N/A',
                            insurance: s?.insuranceProvider || 'N/A',
                            email: s?.email || 'N/A',
                            lastVisit: 'N/A'
                        }));
                        setStudents(mappedStudents);
                    }
                }
            } else {
                const errorText = await response.text();
                showToast('error', errorText || 'Import failed');
            }
        } catch (error) {
            console.error('Error importing students:', error);
            showToast('error', 'Error importing students');
        } finally {
            setImporting(false);
        }
    };

    const handleDeleteStudent = async (id: number) => {
        if (!studentToDelete) return;
        setIsDeleting(true);
        try {
            const response = await authenticatedFetch(`/api/students/${id}`, { method: 'DELETE' });
            if (response.ok) {
                setStudents(prev => prev.filter(s => s.id !== id));
                showToast('success', 'Student successfully deleted.');

                // Optional: forcefully clear Next.js client-side cache so the Dashboard auto-updates
                router.refresh();
            } else {
                showToast('error', 'Failed to delete student.');
            }
        } catch (error) {
            console.error('Error deleting student:', error);
            showToast('error', 'An error occurred during deletion.');
        } finally {
            setIsDeleting(false);
            setStudentToDelete(null);
        }
    };

    const filteredStudents = students.filter(student => {
        const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.class.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (student.code && student.code.toLowerCase().includes(searchTerm.toLowerCase()));

        // Display students matching the selected year, OR students with NO year assigned at all
        const matchesYear = selectedYearId
            ? (student.academicYearId === selectedYearId || !student.academicYearId)
            : true;

        const matchesClass = selectedClass
            ? student.classId === selectedClass
            : true;

        return matchesSearch && matchesYear && matchesClass;
    });

    return (
        <div className="space-y-6 pb-10 relative">
            {/* Top Right Line Loader */}
            {isDeleting && (
                <div className="absolute top-0 right-0 w-48 h-1 bg-gray-200 rounded overflow-hidden z-50">
                    <div className="h-full bg-primary animate-pulse w-full origin-left scale-x-0 animate-[loading-line_1s_ease-in-out_infinite]"></div>
                </div>
            )}

            {/* Top Right Toast Notification */}
            {toastMessage && (
                <div className={`absolute top-4 right-4 px-4 py-3 rounded-8 shadow-lg z-50 flex items-center gap-3 animate-in slide-in-from-top-2 duration-300 ${toastMessage.type === 'success' ? 'bg-success/10 border border-success/20 text-success' : 'bg-error/10 border border-error/20 text-error'}`}>
                    <span className="text-14px font-medium">{toastMessage.text}</span>
                </div>
            )}

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

                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full sm:w-auto">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" size={18} />
                                <input
                                    type="text"
                                    placeholder="Search students..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="bg-bg-card border border-border rounded-8 pl-10 pr-4 py-2 text-12px focus:ring-1 focus:ring-primary outline-none w-full sm:w-auto sm:min-w-[240px]"
                                />
                            </div>

                            <button
                                className="flex items-center gap-2 px-4 py-2 bg-success text-white rounded-5 hover:bg-success-dark transition-colors"
                                onClick={() => setShowImportModal(true)}
                            >
                                <Upload size={18} />
                                <span className="text-14px font-medium">Import Excel</span>
                            </button>
                            
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
                                        <th className="px-6 py-4 text-12px font-medium text-text-primary">Email</th>
                                        <th className="px-6 py-4 text-12px font-medium text-text-primary">Last Visit</th>
                                        <th className="px-6 py-4 text-12px font-medium text-text-primary">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border-light">
                                    {loadingStudents ? (
                                        <tr><td colSpan={8} className="px-6 py-4 text-center text-text-tertiary">Loading...</td></tr>
                                    ) : filteredStudents.length === 0 ? (
                                        <tr>
                                            <td colSpan={8} className="px-6 py-4 text-center text-text-tertiary">No students found for this academic year. (State length: {students.length})</td>
                                        </tr>
                                    ) : (
                                        filteredStudents.map((student) => {
                                            return (
                                                <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-6 py-4 text-12px font-medium text-text-primary">{student.name}</td>
                                                    <td className="px-6 py-4 text-12px text-text-secondary">{student.class}</td>
                                                    <td className="px-6 py-4 text-12px text-text-secondary">{student.code}</td>
                                                    <td className="px-6 py-4 text-12px text-text-secondary">{student.age} / {student.gender}</td>
                                                    <td className="px-6 py-4 text-12px text-text-secondary">{student.insurance}</td>
                                                    <td className="px-6 py-4 text-12px text-text-secondary">{student.email}</td>
                                                    <td className="px-6 py-4 text-12px text-text-secondary">{student.lastVisit}</td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex gap-3">
                                                            <button
                                                                className="text-primary hover:underline text-12px font-medium"
                                                                onClick={() => router.push(`/students/${student.id}`)}
                                                            >
                                                                View
                                                            </button>
                                                            <button
                                                                className="text-text-tertiary hover:text-error transition-colors"
                                                                onClick={() => setStudentToDelete(student)}
                                                                disabled={isDeleting}
                                                            >
                                                                <Trash2 size={16} />
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
                                            <button
                                                className="text-text-tertiary hover:text-error opacity-0 group-hover:opacity-100 transition-opacity"
                                                onClick={() => handleDeleteClass(cls.id, cls.name)}
                                                disabled={loadingAction}
                                                title="Delete class"
                                            >
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
                                                <button
                                                    className="text-text-tertiary hover:text-error transition-colors"
                                                    onClick={() => handleDeleteYear(year.id, year.name)}
                                                    disabled={loadingAction}
                                                    title="Delete academic year"
                                                >
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

            {/* Delete Confirmation Modal */}
            {studentToDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-bg-card border border-border rounded-10 shadow-xl max-w-[400px] w-full p-6 mx-4 animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-center w-12 h-12 bg-error/10 text-error rounded-full mb-4">
                            <Trash2 size={24} />
                        </div>
                        <h3 className="text-18px font-semibold text-text-primary mb-2">Confirm Deletion</h3>
                        <p className="text-14px text-text-secondary mb-6">
                            Are you absolutely sure you want to delete the student <span className="font-semibold text-text-primary">"{studentToDelete.name}"</span>? This action cannot be undone and will remove all their associated records.
                        </p>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setStudentToDelete(null)}
                                disabled={isDeleting}
                                className="px-4 py-2 text-14px font-medium text-text-secondary hover:bg-gray-100 rounded-5 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDeleteStudent(studentToDelete.id)}
                                disabled={isDeleting}
                                className="px-4 py-2 bg-error text-white text-14px font-medium rounded-5 hover:bg-red-700 transition-colors flex items-center gap-2"
                            >
                                {isDeleting ? 'Deleting...' : 'Delete Student'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Excel Import Modal */}
            {showImportModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-10 shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-border flex justify-between items-center">
                            <div>
                                <h2 className="text-20px font-semibold text-primary">Import Students from Excel</h2>
                                <p className="text-12px text-text-tertiary mt-1">Upload an Excel file to bulk import students</p>
                            </div>
                            <button onClick={() => { setShowImportModal(false); setImportResult(null); setImportFile(null); }} className="text-text-tertiary hover:text-primary">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Excel Format Instructions */}
                            <div className="bg-primary/5 border border-primary/20 rounded-8 p-4">
                                <h3 className="text-14px font-semibold text-primary mb-2 flex items-center gap-2">
                                    <FileSpreadsheet size={16} />
                                    Excel File Format
                                </h3>
                                <p className="text-12px text-text-secondary mb-2">Your Excel file should have the following columns (in order):</p>
                                <ol className="text-12px text-text-secondary space-y-1 ml-4 list-decimal">
                                    <li><strong>School ID</strong> (required) - e.g., RCA-2024-001</li>
                                    <li><strong>First Name</strong> (required)</li>
                                    <li><strong>Last Name</strong> (required)</li>
                                    <li><strong>Gender</strong> (optional) - Male/Female</li>
                                    <li><strong>Date of Birth</strong> (optional) - Date format</li>
                                    <li><strong>Parent Name</strong> (optional)</li>
                                    <li><strong>Parent Phone</strong> (optional)</li>
                                    <li><strong>Insurance Provider</strong> (optional)</li>
                                    <li><strong>Insurance Number</strong> (optional)</li>
                                    <li><strong>Email</strong> (optional)</li>
                                </ol>
                            </div>

                            {/* Class Selection */}
                            <div className="flex flex-col gap-2">
                                <label className="text-13px font-semibold text-text-primary">Select Class <span className="text-error">*</span></label>
                                <select
                                    value={importClassId}
                                    onChange={(e) => setImportClassId(e.target.value)}
                                    className="w-full px-4 py-2.5 bg-white border-2 border-border rounded-10 text-14px font-medium outline-none transition-all hover:border-primary/30 focus:border-primary focus:ring-4 focus:ring-primary/10 appearance-none cursor-pointer"
                                >
                                    <option value="">Select a class</option>
                                    {classes.map(cls => (
                                        <option key={cls.id} value={cls.id}>{cls.name}</option>
                                    ))}
                                </select>
                                <p className="text-11px text-text-tertiary">All imported students will be assigned to this class</p>
                            </div>

                            {/* File Upload */}
                            <div className="flex flex-col gap-2">
                                <label className="text-13px font-semibold text-text-primary">Excel File <span className="text-error">*</span></label>
                                <div className="border-2 border-dashed border-border rounded-10 p-6 text-center hover:border-primary/50 transition-colors">
                                    <input
                                        type="file"
                                        accept=".xlsx"
                                        onChange={(e) => setImportFile(e.target.files?.[0] || null)}
                                        className="hidden"
                                        id="excel-upload"
                                    />
                                    <label htmlFor="excel-upload" className="cursor-pointer">
                                        <FileSpreadsheet size={48} className="mx-auto text-primary mb-3" />
                                        {importFile ? (
                                            <p className="text-14px font-medium text-primary">{importFile.name}</p>
                                        ) : (
                                            <>
                                                <p className="text-14px font-medium text-text-primary mb-1">Click to upload Excel file</p>
                                                <p className="text-12px text-text-tertiary">Only .xlsx files are supported</p>
                                            </>
                                        )}
                                    </label>
                                </div>
                            </div>

                            {/* Import Results */}
                            {importResult && (
                                <div className="bg-bg-secondary rounded-8 p-4 space-y-3">
                                    <h3 className="text-14px font-semibold text-text-primary">Import Results</h3>
                                    <div className="grid grid-cols-3 gap-3">
                                        <div className="bg-success/10 border border-success/20 rounded-8 p-3 text-center">
                                            <p className="text-24px font-bold text-success">{importResult.successCount}</p>
                                            <p className="text-11px text-success">Imported</p>
                                        </div>
                                        <div className="bg-warning/10 border border-warning/20 rounded-8 p-3 text-center">
                                            <p className="text-24px font-bold text-warning">{importResult.skippedCount}</p>
                                            <p className="text-11px text-warning">Skipped</p>
                                        </div>
                                        <div className="bg-error/10 border border-error/20 rounded-8 p-3 text-center">
                                            <p className="text-24px font-bold text-error">{importResult.errorCount}</p>
                                            <p className="text-11px text-error">Errors</p>
                                        </div>
                                    </div>
                                    
                                    {importResult.errors && importResult.errors.length > 0 && (
                                        <div className="mt-3">
                                            <p className="text-12px font-semibold text-error mb-2">Errors:</p>
                                            <div className="max-h-32 overflow-y-auto space-y-1">
                                                {importResult.errors.map((error: string, idx: number) => (
                                                    <p key={idx} className="text-11px text-error bg-error/5 px-2 py-1 rounded">{error}</p>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    
                                    {importResult.skipped && importResult.skipped.length > 0 && (
                                        <div className="mt-3">
                                            <p className="text-12px font-semibold text-warning mb-2">Skipped:</p>
                                            <div className="max-h-32 overflow-y-auto space-y-1">
                                                {importResult.skipped.map((skip: string, idx: number) => (
                                                    <p key={idx} className="text-11px text-warning bg-warning/5 px-2 py-1 rounded">{skip}</p>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="p-6 border-t border-border flex justify-end gap-3">
                            <button
                                onClick={() => { setShowImportModal(false); setImportResult(null); setImportFile(null); }}
                                className="px-6 py-2 border border-border rounded-5 text-14px font-medium text-text-secondary hover:bg-bg-primary transition-colors"
                            >
                                Close
                            </button>
                            <button
                                onClick={handleImportExcel}
                                disabled={importing || !importFile || !importClassId}
                                className="px-6 py-2 bg-primary text-white rounded-5 text-14px font-medium hover:bg-primary-dark transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Upload size={18} />
                                {importing ? 'Importing...' : 'Import Students'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentsPage;
