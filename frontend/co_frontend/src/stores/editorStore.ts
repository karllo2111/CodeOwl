import { create } from 'zustand';
import { activitiesApi } from '../api/activities';
import type { ChallengeSubmission, Hint } from '../types/activity';

interface EditorState {
  code: string;
  output: string;
  error: string | null;
  isRunning: boolean;
  isSubmitting: boolean;
  submission: ChallengeSubmission | null;
  hints: Hint[];
  setCode: (code: string) => void;
  runCode: (activityId: number) => Promise<void>;
  submitCode: (activityId: number) => Promise<ChallengeSubmission>;
  requestHint: (activityId: number) => Promise<void>;
  reset: (starterCode?: string) => void;
}

export const useEditorStore = create<EditorState>((set, get) => ({
  code: '',
  output: '',
  error: null,
  isRunning: false,
  isSubmitting: false,
  submission: null,
  hints: [],

  setCode: (code: string) => set({ code }),

  runCode: async (activityId: number) => {
    const { code } = get();
    set({ isRunning: true, error: null, output: '' });
    try {
      const res = await activitiesApi.runCode(activityId, code);
      set({
        output: res.output || (res.success ? 'Program executed successfully with no output.' : ''),
        error: res.error || null,
        isRunning: false,
      });
    } catch (err: any) {
      set({
        error: err.response?.data?.message || err.message || 'Execution failed',
        isRunning: false,
      });
    }
  },

  submitCode: async (activityId: number) => {
    const { code } = get();
    set({ isSubmitting: true, error: null });
    try {
      const submission = await activitiesApi.submitCode(activityId, code);
      set({
        submission,
        output: submission.output || '',
        error: submission.error_output || null,
        isSubmitting: false,
      });
      return submission;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || 'Submission failed';
      set({ error: errorMsg, isSubmitting: false });
      throw err;
    }
  },

  requestHint: async (activityId: number) => {
    try {
      const newHint = await activitiesApi.requestHint(activityId);
      set((state) => ({ hints: [...state.hints, newHint] }));
    } catch (err: any) {
      set({ error: err.response?.data?.message || 'Could not fetch hint' });
    }
  },

  reset: (starterCode = '') => set({
    code: starterCode,
    output: '',
    error: null,
    submission: null,
    hints: [],
  }),
}));
