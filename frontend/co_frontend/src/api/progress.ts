import { apiClient } from './client';
import type { ChapterMastery } from '../types/progress';

export const progressApi = {
  async getProgress() {
    const res = await apiClient.get('/user/progress');
    return res.data;
  },

  async getCourseProgress(slug: string) {
    const res = await apiClient.get(`/user/progress/course/${slug}`);
    return res.data;
  },

  async completeLesson(lessonId: number) {
    const res = await apiClient.post(`/lessons/${lessonId}/complete`);
    return res.data;
  },

  async getChapterMastery(chapterId: number) {
    const res = await apiClient.get<{ data: ChapterMastery }>(`/chapters/${chapterId}/mastery`);
    return res.data.data;
  },
};
