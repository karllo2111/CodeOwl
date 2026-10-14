import { apiClient } from './client';

export interface WeekDay {
  date: string;
  label: string;
  completed: boolean;
}

export interface DashboardData {
  user: {
    id: number;
    name: string;
    username: string | null;
    avatar: string | null;
    current_level: number;
    total_xp: number;
    coins: number;
    streak_freezes: number;
  };
  streak: {
    current: number;
    longest: number;
    week: WeekDay[];
  };
  xp: {
    total: number;
    level: number;
    xp_to_next: number;
    progress_pct: number;
  };
  rank: {
    weekly: number | null;
    all_time: number | null;
  };
  stats: {
    lessons_completed: number;
    chapters_completed: number;
    courses_completed: number;
    bugs_fixed: number;
    challenges_completed: number;
  };
  active_course: {
    id: number;
    title: string;
    slug: string;
    progress_pct: number;
    next_lesson_id: number | null;
  } | null;
}

export const dashboardApi = {
  get: async (): Promise<DashboardData> => {
    const res = await apiClient.get('/users/me/dashboard');
    return res.data;
  },
};
