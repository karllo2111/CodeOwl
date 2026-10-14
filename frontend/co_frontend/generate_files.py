import os
import json

base_dir = "/home/karllo/Projects/CodeOwl/frontend/co_frontend/src"

files = {
    "types/user.ts": """export interface User {
  id: number;
  name: string;
  email: string;
  username: string | null;
  avatar: string | null;
  bio: string | null;
  total_xp: number;
  current_level: number;
  created_at: string;
}

export interface UserStats {
  total_xp: number;
  current_level: number;
  level_title: string;
  xp_to_next_level: number;
  xp_progress_percent: number;
  challenges_completed: number;
  bugs_fixed: number;
  projects_completed: number;
  lessons_completed: number;
  current_streak: number;
  longest_streak: number;
}

export interface AuthResponse {
  user: User;
  token: string;
}""",
    "types/course.ts": """export type Difficulty = 'beginner' | 'intermediate' | 'advanced';
export type LessonDifficulty = 'easy' | 'normal' | 'hard' | 'expert';
export type LessonType = 'theory' | 'example' | 'playground' | 'practice' | 'debug' | 'fix' | 'quiz' | 'challenge' | 'chapter_review' | 'level_review' | 'project';
export type ProgressStatus = 'not_started' | 'in_progress' | 'completed' | 'mastered';
export type LevelStatus = 'locked' | 'unlocked' | 'in_progress' | 'completed' | 'mastered';

export interface Course {
  id: number;
  title: string;
  slug: string;
  description: string;
  short_description: string | null;
  icon: string | null;
  color: string;
  difficulty: Difficulty;
  levels_count: number;
  chapters_count: number;
  lessons_count: number;
  user_progress?: CourseProgress;
}

export interface CourseProgress {
  completed_lessons: number;
  total_lessons: number;
  percentage: number;
}

export interface CourseLevel {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  sort_order: number;
  chapters: Chapter[];
  is_unlocked: boolean;
}

export interface Chapter {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  sort_order: number;
  lessons_count: number;
  completed_lessons_count: number;
  mastery_percentage: number;
  is_unlocked: boolean;
  lessons?: Lesson[];
}

export interface Lesson {
  id: number;
  title: string;
  slug: string;
  type: LessonType;
  sort_order: number;
  xp_reward: number;
  difficulty: LessonDifficulty;
  estimated_minutes: number | null;
  is_completed: boolean;
  content?: LessonContent[];
  activity?: Activity;
}

export interface LessonContent {
  id: number;
  block_type: 'text' | 'code' | 'callout' | 'image' | 'table' | 'diagram' | 'heading';
  content: Record<string, any>;
  sort_order: number;
}

export interface Activity {
  id: number;
  lesson_id: number;
  instructions: string;
  starter_code: string | null;
  language: string;
  time_limit_seconds: number | null;
  max_attempts: number | null;
  xp_reward: number;
  test_labels: string[];
  hints_available: number;
  hints_used: number;
}
""",
    "api/client.ts": """import axios from 'axios';

export const apiClient = axios.create({
  baseURL: 'http://localhost:8000/api',
  withCredentials: true,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
""",
    "api/auth.ts": """import { apiClient } from './client';
import type { AuthResponse, User, UserStats } from '../types/user';

export const authApi = {
  getCsrfCookie: () => apiClient.get('/sanctum/csrf-cookie', { baseURL: 'http://localhost:8000' }),
  login: async (data: any): Promise<AuthResponse> => {
    await authApi.getCsrfCookie();
    const res = await apiClient.post<AuthResponse>('/login', data);
    return res.data;
  },
  register: async (data: any): Promise<AuthResponse> => {
    await authApi.getCsrfCookie();
    const res = await apiClient.post<AuthResponse>('/register', data);
    return res.data;
  },
  logout: () => apiClient.post('/logout'),
  getUser: async (): Promise<User> => {
    const res = await apiClient.get<User>('/user');
    return res.data;
  },
  updateProfile: async (data: any): Promise<User> => {
    const res = await apiClient.put<User>('/user', data);
    return res.data;
  },
  getUserStats: async (): Promise<UserStats> => {
    const res = await apiClient.get<UserStats>('/user/stats');
    return res.data;
  }
};
""",
    "stores/authStore.ts": """import { create } from 'zustand';
import { authApi } from '../api/auth';
import type { User } from '../types/user';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: any) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  fetchUser: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  isLoading: true,
  login: async (data) => {
    const { user, token } = await authApi.login(data);
    localStorage.setItem('token', token);
    set({ user, token, isAuthenticated: true });
  },
  register: async (data) => {
    const { user, token } = await authApi.register(data);
    localStorage.setItem('token', token);
    set({ user, token, isAuthenticated: true });
  },
  logout: async () => {
    try { await authApi.logout(); } catch (e) {}
    localStorage.removeItem('token');
    set({ user: null, token: null, isAuthenticated: false });
  },
  fetchUser: async () => {
    try {
      const user = await authApi.getUser();
      set({ user, isAuthenticated: true });
    } catch (e) {
      set({ user: null, token: null, isAuthenticated: false });
      localStorage.removeItem('token');
    }
  },
  initialize: async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const user = await authApi.getUser();
        set({ user, token, isAuthenticated: true, isLoading: false });
      } catch (e) {
        localStorage.removeItem('token');
        set({ user: null, token: null, isAuthenticated: false, isLoading: false });
      }
    } else {
      set({ isLoading: false });
    }
  }
}));
""",
    "App.tsx": """import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuthStore } from './stores/authStore';

// Layout
const AppLayout = ({ children }: any) => <div className="layout">{children}</div>;

export default function App() {
  const { initialize } = useAuthStore();
  
  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <Routes>
      <Route path="/" element={<div>Home (WIP)</div>} />
    </Routes>
  );
}
"""
}

for path, content in files.items():
    full_path = os.path.join(base_dir, path)
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    with open(full_path, "w") as f:
        f.write(content)

print("Files generated successfully.")
