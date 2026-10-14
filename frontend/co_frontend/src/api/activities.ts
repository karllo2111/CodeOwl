import { apiClient } from './client';
import type { Activity, ChallengeSubmission, Hint } from '../types/activity';

export const activitiesApi = {
  async getActivity(id: number) {
    const res = await apiClient.get<{ data: Activity }>(`/activities/${id}`);
    return res.data.data;
  },

  async runCode(activityId: number, code: string, language = 'javascript') {
    const res = await apiClient.post<{ data: { success: boolean; output: string; error?: string; executionTimeMs?: number } }>(
      `/activities/${activityId}/run`,
      { code, language }
    );
    return res.data.data;
  },

  async submitCode(activityId: number, code: string, language = 'javascript') {
    const res = await apiClient.post<{ data: ChallengeSubmission }>(
      `/activities/${activityId}/submit`,
      { code, language }
    );
    return res.data.data;
  },

  async requestHint(activityId: number) {
    const res = await apiClient.post<{ data: Hint }>(`/activities/${activityId}/hint`);
    return res.data.data;
  },
};
