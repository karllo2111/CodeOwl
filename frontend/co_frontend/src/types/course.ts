export type Difficulty = 'beginner' | 'intermediate' | 'advanced';
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
  levels_count?: number;
  chapters_count?: number;
  lessons_count?: number;
  user_progress?: {
    completed_lessons: number;
    total_lessons: number;
    percentage: number;
  };
  levels?: CourseLevel[];
}

export interface CourseLevel {
  id: number;
  course_id: number;
  title: string;
  slug: string;
  description: string | null;
  sort_order: number;
  chapters?: Chapter[];
  is_unlocked?: boolean;
}

export interface Chapter {
  id: number;
  course_level_id: number;
  title: string;
  slug: string;
  description: string | null;
  sort_order: number;
  lessons_count?: number;
  mastery_percentage?: number;
  mastery_threshold?: number;
  icon?: string | null;
  is_unlocked?: boolean;
  lessons?: Lesson[];
}

export interface LessonContentItem {
  id: number;
  block_type: 'text' | 'code' | 'callout' | 'image' | 'table' | 'diagram' | 'heading';
  content: Record<string, any>;
  sort_order: number;
}

export interface Lesson {
  id: number;
  chapter_id: number;
  title: string;
  slug: string;
  type: LessonType;
  sort_order: number;
  xp_reward: number;
  difficulty: LessonDifficulty;
  estimated_minutes: number | null;
  is_completed?: boolean;
  contents?: LessonContentItem[];
  activity?: import('./activity').Activity;
}
