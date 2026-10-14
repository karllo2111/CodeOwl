import { create } from 'zustand';
import { authApi } from '../api/auth';
import { setAuthCookie, getAuthCookie, removeAuthCookie } from '../api/client';
import type { User, UserStats } from '../types/user';

function getCachedUser(): User | null {
  try {
    const raw = localStorage.getItem('codeowl_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

interface AuthState {
  user: User | null;
  stats: UserStats | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { name: string; email: string; username?: string; password: string; password_confirmation: string }) => Promise<void>;
  logout: () => Promise<void>;
  fetchUser: () => Promise<void>;
  initialize: () => Promise<void>;
}

const initialToken = getAuthCookie();
const initialUser = getCachedUser();

export const useAuthStore = create<AuthState>((set, get) => ({
  user: initialUser,
  stats: null,
  token: initialToken,
  isAuthenticated: !!initialToken,
  isLoading: !initialToken,

  initialize: async () => {
    const token = getAuthCookie();
    if (!token) {
      set({ isLoading: false, isAuthenticated: false, user: null });
      return;
    }

    // If user already loaded from cache, don't block UI with loading
    if (get().user) {
      set({ isAuthenticated: true, isLoading: false });
    }

    try {
      const user = await authApi.getUser();
      const stats = await authApi.getStats().catch(() => null);
      try {
        localStorage.setItem('codeowl_user', JSON.stringify(user));
      } catch {}
      set({ user, stats, isAuthenticated: true, isLoading: false });
    } catch (err: any) {
      // Only wipe session if server explicitly returns 401 unauthorized
      if (err.response?.status === 401) {
        removeAuthCookie();
        try { localStorage.removeItem('codeowl_user'); } catch {}
        set({ user: null, stats: null, token: null, isAuthenticated: false, isLoading: false });
      } else {
        // Network error or server glitch, keep existing session
        set({ isLoading: false });
      }
    }
  },

  login: async (email, password) => {
    const res = await authApi.login({ email, password });
    setAuthCookie(res.token);
    try {
      localStorage.setItem('codeowl_user', JSON.stringify(res.user));
    } catch {}
    set({ user: res.user, token: res.token, isAuthenticated: true, isLoading: false });
    try {
      const stats = await authApi.getStats();
      set({ stats });
    } catch {
      // stats optional
    }
  },

  register: async (data) => {
    const res = await authApi.register(data);
    setAuthCookie(res.token);
    try {
      localStorage.setItem('codeowl_user', JSON.stringify(res.user));
    } catch {}
    set({ user: res.user, token: res.token, isAuthenticated: true, isLoading: false });
  },

  logout: async () => {
    try {
      await authApi.logout();
    } catch {
      // ignore network errors
    } finally {
      removeAuthCookie();
      try { localStorage.removeItem('codeowl_user'); } catch {}
      set({ user: null, stats: null, token: null, isAuthenticated: false });
    }
  },

  fetchUser: async () => {
    try {
      const user = await authApi.getUser();
      const stats = await authApi.getStats().catch(() => null);
      try {
        localStorage.setItem('codeowl_user', JSON.stringify(user));
      } catch {}
      set({ user, stats });
    } catch {
      // ignore
    }
  },
}));
