import { apiClient } from './client';
import type { Course, CourseLevel, Chapter, Lesson } from '../types/course';

export const coursesApi = {
  async getCourses() {
    const res = await apiClient.get<{ data: Course[] }>('/courses');
    return res.data.data;
  },

  async getCourse(slug: string) {
    const res = await apiClient.get<{ data: Course }>(`/courses/${slug}`);
    return res.data.data;
  },

  async getCourseLevels(slug: string) {
    const res = await apiClient.get<{ data: CourseLevel[] }>(`/courses/${slug}/levels`);
    return res.data.data;
  },

  async getChapter(id: number) {
    const res = await apiClient.get<{ data: Chapter }>(`/chapters/${id}`);
    return res.data.data;
  },

  async getChapterLessons(chapterId: number) {
    const res = await apiClient.get<{ data: Lesson[] }>(`/chapters/${chapterId}/lessons`);
    return res.data.data;
  },

  async getLesson(id: number) {
    const res = await apiClient.get<{ data: Lesson }>(`/lessons/${id}`);
    return res.data.data;
  },

  async getLessonContent(lessonId: number) {
    const res = await apiClient.get<{ data: any[] }>(`/lessons/${lessonId}/content`);
    return res.data.data;
  },

  async getSkillTree(slug: string) {
    const res = await apiClient.get<{ data: any }>(`/courses/${slug}/skill-tree`);
    return res.data.data;
  },
};
