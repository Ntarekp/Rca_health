"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiUrl, authenticatedFetch } from '@/utils/api';

interface AcademicYear {
    id: string;
    name: string;
    isActive: boolean;
    startDate: string;
    endDate: string;
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
                const response = await authenticatedFetch('/api/academic/years');
                if (response.ok) {
                    const data = await response.json();

                    // The backend returns 'id' as a number, but TypeScript expects a string.
                    // Map over the data to explicitly convert ids to strings to fix strict equality '===' bugs in React.
                    const formattedData = data.map((y: any) => ({
                        ...y,
                        id: y.id ? y.id.toString() : ''
                    }));

                    setAcademicYears(formattedData);

                    // Default to active year, or first year, or keep existing selection if valid
                    const activeYear = formattedData.find((y: any) => y.isActive);
                    if (activeYear) {
                        setSelectedYearId(activeYear.id);
                    } else if (formattedData.length > 0) {
                        setSelectedYearId(formattedData[0].id);
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
