import { create } from 'zustand';
import { apiClient } from '../api/client';

export type ThemeMode = 'system' | 'light' | 'dark';

interface ThemeState {
  theme: ThemeMode;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
}

function getStoredTheme(): ThemeMode {
  try {
    const saved = localStorage.getItem('codequest_theme');
    if (saved === 'light' || saved === 'dark' || saved === 'system') {
      return saved;
    }
  } catch {}
  return 'system';
}

function resolveTheme(theme: ThemeMode): 'light' | 'dark' {
  if (theme === 'system') {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }
  return theme;
}

function applyTheme(theme: ThemeMode): 'light' | 'dark' {
  const resolved = resolveTheme(theme);
  document.documentElement.setAttribute('data-theme', resolved);
  try {
    localStorage.setItem('codequest_theme', theme);
  } catch {}
  return resolved;
}

const initialTheme = getStoredTheme();
const initialResolved = applyTheme(initialTheme);

export const useThemeStore = create<ThemeState>((set, get) => {
  // Listen to system OS theme changes
  if (typeof window !== 'undefined' && window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      if (get().theme === 'system') {
        const resolved = applyTheme('system');
        set({ resolvedTheme: resolved });
      }
    });
  }

  return {
    theme: initialTheme,
    resolvedTheme: initialResolved,

    setTheme: (theme: ThemeMode) => {
      const resolved = applyTheme(theme);
      set({ theme, resolvedTheme: resolved });

      // Save preference to backend if authenticated
      apiClient.patch('/users/me/preferences', { theme }).catch(() => {});
    },

    toggleTheme: () => {
      const current = get().resolvedTheme;
      const next: ThemeMode = current === 'dark' ? 'light' : 'dark';
      get().setTheme(next);
    },
  };
});
