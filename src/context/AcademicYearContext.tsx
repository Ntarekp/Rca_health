"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

interface AcademicYear {
    id: string;
    name: string;
    isActive: boolean;
}

interface AcademicYearContextType {
    selectedYearId: string;
    setSelectedYearId: (id: string) => void;
    academicYears: AcademicYear[];
    loading: boolean;
}

const AcademicYearContext = createContext<AcademicYearContextType | undefined>(undefined);

export const AcademicYearProvider = ({ children }: { children: React.ReactNode }) => {
    const [selectedYearId, setSelectedYearId] = useState<string>('');
    const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchYears = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8081/health/api/academic/years');
                if (response.ok) {
                    const data = await response.json();
                    setAcademicYears(data);
                    
                    // Default to active year, or first year, or keep existing selection if valid
                    const activeYear = data.find((y: any) => y.isActive);
                    if (activeYear) {
                        setSelectedYearId(activeYear.id);
                    } else if (data.length > 0) {
                        setSelectedYearId(data[0].id);
                    }
                }
            } catch (error) {
                console.error('Error fetching academic years:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchYears();
    }, []);

    return (
        <AcademicYearContext.Provider value={{ selectedYearId, setSelectedYearId, academicYears, loading }}>
            {children}
        </AcademicYearContext.Provider>
    );
};

export const useAcademicYear = () => {
    const context = useContext(AcademicYearContext);
    if (context === undefined) {
        throw new Error('useAcademicYear must be used within an AcademicYearProvider');
    }
    return context;
};
