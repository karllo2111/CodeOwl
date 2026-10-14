import { create } from 'zustand';
import { authApi } from '../api/auth';
import { setAuthCookie, removeAuthCookie } from '../api/client';
import type { User, UserStats } from '../types/user';

export type AuthStatus = 'loading' | 'authed' | 'guest';

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
  status: AuthStatus;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, remember?: boolean) => Promise<void>;
  register: (data: { name: string; email: string; username?: string; password: string; password_confirmation: string }) => Promise<void>;
  logout: () => Promise<void>;
  fetchUser: () => Promise<void>;
  refreshUser: () => Promise<void>;
  initialize: () => Promise<void>;
}

// BroadcastChannel for cross-tab auth state sync
const authChannel = typeof window !== 'undefined' && 'BroadcastChannel' in window
  ? new BroadcastChannel('codequest_auth_channel')
  : null;

const initialUser = getCachedUser();

export const useAuthStore = create<AuthState>((set, get) => {
  // Listen for logout events from other tabs
  if (authChannel) {
    authChannel.onmessage = (event) => {
      if (event.data?.type === 'LOGOUT') {
        removeAuthCookie();
        try { localStorage.removeItem('codeowl_user'); } catch {}
        set({
          user: null,
          stats: null,
          status: 'guest',
          isAuthenticated: false,
          isLoading: false,
        });
      }
    };
  }

  return {
    user: initialUser,
    stats: null,
    status: 'loading',
    isAuthenticated: !!initialUser,
    isLoading: true,

    initialize: async () => {
      set({ status: 'loading', isLoading: true });

      try {
        const user = await authApi.getUser();
        if (user && user.id) {
          try {
            localStorage.setItem('codeowl_user', JSON.stringify(user));
          } catch {}
          set({
            user,
            status: 'authed',
            isAuthenticated: true,
            isLoading: false,
          });
          // Non-blocking stats fetch
          authApi.getStats()
            .then((stats) => set({ stats }))
            .catch(() => {});
        } else {
          // Empty user payload
          set({
            user: null,
            stats: null,
            status: 'guest',
            isAuthenticated: false,
            isLoading: false,
          });
        }
      } catch (err: any) {
        if (err.response?.status === 401) {
          // Definitively unauthenticated
          removeAuthCookie();
          try { localStorage.removeItem('codeowl_user'); } catch {}
          set({
            user: null,
            stats: null,
            status: 'guest',
            isAuthenticated: false,
            isLoading: false,
          });
        } else {
          // Network error or 5xx: DO NOT sign the user out!
          const cached = get().user;
          set({
            status: cached ? 'authed' : 'guest',
            isAuthenticated: !!cached,
            isLoading: false,
          });
        }
      }
    },

    login: async (email: string, password: string, remember = true) => {
      const res = await authApi.login({ email, password, remember });
      if (res.token) {
        setAuthCookie(res.token);
      }
      try {
        localStorage.setItem('codeowl_user', JSON.stringify(res.user));
      } catch {}
      set({
        user: res.user,
        status: 'authed',
        isAuthenticated: true,
        isLoading: false,
      });

      authApi.getStats()
        .then((stats) => set({ stats }))
        .catch(() => {});
    },

    register: async (data) => {
      const res = await authApi.register(data);
      if (res.token) {
        setAuthCookie(res.token);
      }
      try {
        localStorage.setItem('codeowl_user', JSON.stringify(res.user));
      } catch {}
      set({
        user: res.user,
        status: 'authed',
        isAuthenticated: true,
        isLoading: false,
      });
    },

    logout: async () => {
      try {
        await authApi.logout();
      } catch {
        // ignore network error
      } finally {
        removeAuthCookie();
        try { localStorage.removeItem('codeowl_user'); } catch {}
        set({
          user: null,
          stats: null,
          status: 'guest',
          isAuthenticated: false,
          isLoading: false,
        });
        if (authChannel) {
          authChannel.postMessage({ type: 'LOGOUT' });
        }
      }
    },

    fetchUser: async () => {
      try {
        const user = await authApi.getUser();
        if (user && user.id) {
          try {
            localStorage.setItem('codeowl_user', JSON.stringify(user));
          } catch {}
          set({ user, status: 'authed', isAuthenticated: true });
        }
      } catch {
        // preserve current state on error
      }
    },

    refreshUser: async () => {
      await get().fetchUser();
    },
  };
});
