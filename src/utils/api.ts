export const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8081/health").replace(/\/+$/, "");

export function apiUrl(path: string) {
    const p = path.startsWith("/") ? path : `/${path}`;
    return `${API_BASE_URL}${p}`;
}
