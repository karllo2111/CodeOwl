export interface XpInfo {
  total_xp: number;
  current_level: number;
  level_title: string;
  xp_in_current_level?: number;
  xp_to_next_level?: number;
  progress_percent?: number;
}

export interface XpTransaction {
  id: number;
  source_type: string;
  source_id: number | null;
  amount: number;
  metadata: Record<string, any> | null;
  created_at: string;
}

export interface Achievement {
  id: number;
  slug: string;
  title: string;
  description: string;
  icon: string | null;
  category: string;
  is_earned?: boolean;
  earned_at?: string | null;
  xp_reward: number;
}

export interface StreakData {
  current_streak: number;
  longest_streak: number;
  last_activity_date: string | null;
  streak_data?: boolean[];
}

export interface LeaderboardEntry {
  rank: number;
  user: {
    id: number;
    name: string;
    username: string | null;
    avatar: string | null;
    current_level: number;
  };
  xp_earned: number;
  challenges_completed: number;
  streak_days: number;
}
