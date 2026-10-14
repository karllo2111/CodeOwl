import axios, { AxiosError } from 'axios';
import toast from 'react-hot-toast';

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
  baseURL: '/api',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  withXSRFToken: true,
});

// Attach Bearer token from Cookie or LocalStorage if present
apiClient.interceptors.request.use((config) => {
  const token = getAuthCookie();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshingCsrf = false;
let isCheckingMe = false;

// Interceptor for 419 (CSRF retry) and 401 (re-check /me before session expiration)
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;
    if (!originalRequest) return Promise.reject(error);

    // 1. If 419 (CSRF token mismatch), refresh cookie and retry once
    if (error.response?.status === 419 && !originalRequest._retryCsrf) {
      originalRequest._retryCsrf = true;
      if (!isRefreshingCsrf) {
        isRefreshingCsrf = true;
        try {
          await axios.get('/sanctum/csrf-cookie', { withCredentials: true });
        } catch {
          // ignore
        } finally {
          isRefreshingCsrf = false;
        }
      }
      return apiClient(originalRequest);
    }

    // 2. If 401 from a protected endpoint
    if (error.response?.status === 401) {
      const isAuthCheck = originalRequest.url?.includes('/users/me') || originalRequest.url?.includes('/user');
      const isLoginOrRegister = originalRequest.url?.includes('/login') || originalRequest.url?.includes('/register');

      if (!isLoginOrRegister) {
        if (isAuthCheck) {
          // Explicit /me returned 401: user is definitely a guest / signed out
          removeAuthCookie();
        } else if (!isCheckingMe) {
          // Another endpoint failed with 401. Re-check /users/me before treating as signed out!
          isCheckingMe = true;
          try {
            await apiClient.get('/users/me');
            // If /users/me succeeded, session is actually still valid! Just reject this specific endpoint call
          } catch (meError: any) {
            if (meError.response?.status === 401) {
              removeAuthCookie();
              toast.error('Sesi berakhir, silakan masuk lagi');
              const currentPath = window.location.pathname + window.location.search;
              if (!window.location.pathname.includes('/masuk') && !window.location.pathname.includes('/login')) {
                window.location.href = `/masuk?next=${encodeURIComponent(currentPath)}`;
              }
            }
          } finally {
            isCheckingMe = false;
          }
        }
      }
    }

    return Promise.reject(error);
  }
);
