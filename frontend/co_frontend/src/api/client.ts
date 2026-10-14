import axios from 'axios';

// Cookie helper utilities
export function setAuthCookie(token: string) {
  document.cookie = `codeowl_token=${encodeURIComponent(token)}; path=/; max-age=2592000; SameSite=Lax`;
  try {
    localStorage.setItem('codeowl_token', token);
  } catch {}
}

export function getAuthCookie(): string | null {
  try {
    const local = localStorage.getItem('codeowl_token');
    if (local) return local;
  } catch {}

  if (typeof document !== 'undefined') {
    const match = document.cookie.match(new RegExp('(^|;\\s*)codeowl_token=([^;]+)'));
    if (match) return decodeURIComponent(match[2]);
  }
  return null;
}

export function removeAuthCookie() {
  if (typeof document !== 'undefined') {
    document.cookie = 'codeowl_token=; path=/; max-age=0; SameSite=Lax';
  }
  try {
    localStorage.removeItem('codeowl_token');
  } catch {}
}

export const apiClient = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Attach Bearer token from Cookie or LocalStorage
apiClient.interceptors.request.use((config) => {
  const token = getAuthCookie();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Global error handling - Only clear token if explicit auth endpoint fails with 401
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthRoute = error.config?.url?.includes('/user') || error.config?.url?.includes('/logout');
    if (error.response?.status === 401 && isAuthRoute) {
      removeAuthCookie();
    }
    return Promise.reject(error);
  }
);
