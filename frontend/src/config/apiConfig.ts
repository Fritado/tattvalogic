const isServer = typeof window === 'undefined';
export const API_BASE = isServer 
    ? `http://127.0.0.1:4200/api`
    : (process.env.NEXT_PUBLIC_API_URL || "/api").replace(/\/+$/, "");
