export interface User {
  id: number;
  name: string;
  email: string;
  username: string | null;
  avatar: string | null;
  bio: string | null;
  total_xp: number;
  current_level: number;
  created_at: string;
  coins?: number;
  streak_freezes?: number;
  streak?: number;
  equipped_frame_id?: number | null;
  equipped_title_id?: number | null;
  equipped_accent_id?: number | null;
  roles?: { name: string }[];
}

export interface UserStats {
  total_xp: number;
  current_level: number;
  level_title?: string;
  xp_to_next_level?: number;
  xp_progress_percent?: number;
  challenges_completed?: number;
  bugs_fixed?: number;
  projects_completed?: number;
  lessons_completed?: number;
  current_streak?: number;
  longest_streak?: number;
}

export interface AuthResponse {
  user: User;
  token: string;
}
