export interface UserProgress {
  lesson_id: number;
  status: 'not_started' | 'in_progress' | 'completed' | 'mastered';
  score: number | null;
  attempts: number;
  hints_used: number;
  started_at: string | null;
  completed_at: string | null;
}

export interface ChapterMastery {
  chapter_id: number;
  mastery_percentage: number;
  theory_score: number;
  coding_score: number;
  debugging_score: number;
  problem_solving_score: number;
  status: string;
  weak_areas: string[];
}
