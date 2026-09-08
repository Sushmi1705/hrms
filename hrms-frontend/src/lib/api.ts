import axios from 'axios';

// Resolve API base URL:
// 1. Browser localStorage override (allows dynamic backend switching without rebuilding)
// 2. Vite environment variable (injected during Render build from render.yaml or Render dashboard)
// 3. Fallback: localhost for local development
const getInitialBaseUrl = (): string => {
  if (typeof window !== 'undefined' && window.localStorage?.getItem('VITE_API_URL')) {
    return window.localStorage.getItem('VITE_API_URL')!;
  }
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  return 'http://localhost:5002';
};

const rawUrl = getInitialBaseUrl();
export const API_BASE_URL = rawUrl.startsWith('http')
  ? rawUrl.replace(/\/$/, '')
  : `https://${rawUrl.replace(/\/$/, '')}`;

export const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
});

