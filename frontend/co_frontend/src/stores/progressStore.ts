import { create } from 'zustand';
import { progressApi } from '../api/progress';

function getCachedCompletedLessons(): number[] {
  try {
    const raw = localStorage.getItem('codeowl_completed_lessons');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

interface ProgressState {
  completedLessonIds: number[];
  isLoading: boolean;
  fetchProgress: () => Promise<void>;
  completeLesson: (lessonId: number) => Promise<void>;
  isLessonCompleted: (lessonId: number) => boolean;
  isLessonUnlocked: (lessonId: number, previousLessonId: number | null) => boolean;
  isChapterCompleted: (chapterLessons: { id: number }[]) => boolean;
  isChapterUnlocked: (chapterIndex: number, allChaptersWithLessons: { lessons?: { id: number }[] }[]) => boolean;
}

export const useProgressStore = create<ProgressState>((set, get) => ({
  completedLessonIds: getCachedCompletedLessons(),
  isLoading: false,

  fetchProgress: async () => {
    try {
      const resData = await progressApi.getProgress();
      const list = Array.isArray(resData?.data) ? resData.data : Array.isArray(resData) ? resData : [];
      const serverIds = list
        .filter((p: any) => p.status === 'completed' || p.status === 'mastered')
        .map((p: any) => Number(p.lesson_id));
      
      const localIds = getCachedCompletedLessons();
      const merged = Array.from(new Set([...localIds, ...serverIds]));

      localStorage.setItem('codeowl_completed_lessons', JSON.stringify(merged));
      set({ completedLessonIds: merged });
    } catch {
      // Keep cached if network fails
    }
  },

  completeLesson: async (lessonId: number) => {
    const current = get().completedLessonIds;
    if (!current.includes(lessonId)) {
      const updated = [...current, lessonId];
      localStorage.setItem('codeowl_completed_lessons', JSON.stringify(updated));
      set({ completedLessonIds: updated });
    }

    try {
      await progressApi.completeLesson(lessonId);
    } catch {
      // Local state is already updated
    }
  },

  isLessonCompleted: (lessonId: number) => {
    return get().completedLessonIds.includes(lessonId);
  },

  isLessonUnlocked: (lessonId: number, previousLessonId: number | null) => {
    // If it's the very first lesson, it is always unlocked
    if (!previousLessonId) return true;
    // Otherwise, it is unlocked only if previous lesson is completed
    return get().completedLessonIds.includes(previousLessonId);
  },

  isChapterCompleted: (chapterLessons: { id: number }[]) => {
    if (!chapterLessons || chapterLessons.length === 0) return false;
    const completed = get().completedLessonIds;
    return chapterLessons.every((l) => completed.includes(l.id));
  },

  isChapterUnlocked: (chapterIndex: number, allChaptersWithLessons: { lessons?: { id: number }[] }[]) => {
    // Chapter 1 is always unlocked
    if (chapterIndex === 0) return true;
    // Chapter N is unlocked if Chapter N-1 is completed
    const prevChapter = allChaptersWithLessons[chapterIndex - 1];
    if (!prevChapter || !prevChapter.lessons || prevChapter.lessons.length === 0) return true;
    
    const completed = get().completedLessonIds;
    return prevChapter.lessons.every((l) => completed.includes(l.id));
  },
}));
