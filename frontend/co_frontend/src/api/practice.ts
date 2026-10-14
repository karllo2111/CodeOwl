import { apiClient } from './client';

export interface PracticeKind {
  id: number;
  slug: string;
  label: string;
  description: string | null;
  icon: string | null;
  color: string | null;
}

export interface PracticeActivity {
  id: number;
  title: string;
  slug: string;
  activity_type: string;
  xp_reward: number;
  difficulty_level: string | null;
  course?: { id: number; title: string; slug: string } | null;
}

export interface PracticeKindResponse {
  kind: PracticeKind;
  total: number;
  activities: PracticeActivity[];
}

export const practiceApi = {
  getKinds: async (): Promise<PracticeKind[]> => {
    const res = await apiClient.get('/practice/kinds');
    return res.data.data ?? res.data;
  },

  getByKind: async (slug: string, page = 1): Promise<PracticeKindResponse> => {
    const res = await apiClient.get(`/practice/${slug}`, { params: { page } });
    return res.data;
  },
};
