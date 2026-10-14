import { apiClient } from './client';

export interface PracticeKind {
  id: number;
  kind: string;
  label: string;
  description: string | null;
  total_available: number;
  solved_count: number;
}

export interface PracticeActivity {
  id: number;
  lesson_id: number;
  title: string;
  difficulty: 'easy' | 'normal' | 'hard' | 'expert' | string;
  chapter_title: string;
  xp_reward: number;
  status: 'solved' | 'unsolved';
  language: string;
}

export interface PracticeListResponse {
  data: PracticeActivity[];
  total: number;
  current_page: number;
  last_page: number;
}

export const practiceApi = {
  getKinds: async (): Promise<PracticeKind[]> => {
    const res = await apiClient.get('/practice/kinds');
    return res.data.kinds ?? res.data.data ?? (Array.isArray(res.data) ? res.data : []);
  },

  getByKind: async (
    kind: string,
    params?: { difficulty?: string; status?: string; q?: string; page?: number }
  ): Promise<PracticeListResponse> => {
    const res = await apiClient.get(`/practice/${kind}`, { params });
    return res.data;
  },
};
