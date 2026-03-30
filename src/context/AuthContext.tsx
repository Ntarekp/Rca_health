"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiUrl } from '@/utils/api';

interface User {
    userId: number;
    username: string;
    fullName: string;
    email: string;
    role: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Check for existing token on mount
        const storedToken = localStorage.getItem('authToken');
        const storedUser = localStorage.getItem('currentUser');

        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
        }
        setIsLoading(false);
    }, []);

    const login = async (username: string, password: string) => {
        try {
            const response = await fetch(apiUrl('/api/auth/login'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                throw new Error('Invalid credentials');
            }

            const data = await response.json();
            
            // Store token and user data
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('currentUser', JSON.stringify({
                userId: data.userId,
                username: data.username,
                name: data.fullName,
                email: data.email,
                role: data.role,
            }));

            setToken(data.token);
            setUser({
                userId: data.userId,
                username: data.username,
                fullName: data.fullName,
                email: data.email,
                role: data.role,
            });

            router.push('/dashboard');
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('currentUser');
        setToken(null);
        setUser(null);
        router.push('/login');
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                login,
                logout,
                isAuthenticated: !!token,
                isLoading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
