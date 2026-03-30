export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8081/health';

export function apiUrl(path: string): string {
    // Remove leading slash if present to avoid double slashes
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    return `${API_BASE_URL}/${cleanPath}`;
}

export function getAuthHeaders(): HeadersInit {
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
    return {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
    };
}

export async function authenticatedFetch(path: string, options: RequestInit = {}) {
    const url = apiUrl(path);
    const headers = getAuthHeaders();
    
    const response = await fetch(url, {
        ...options,
        headers: {
            ...headers,
            ...options.headers,
        },
    });

    if (response.status === 401) {
        // Token expired or invalid, redirect to login
        if (typeof window !== 'undefined') {
            localStorage.removeItem('authToken');
            localStorage.removeItem('currentUser');
            window.location.href = '/login';
        }
    }

    return response;
}
