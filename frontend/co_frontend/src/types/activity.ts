export type SubmissionStatus = 'pending' | 'running' | 'passed' | 'failed' | 'error' | 'timeout';
export type HintType = 'conceptual' | 'direction' | 'syntax_clue' | 'explanation' | 'solution';

export interface Activity {
  id: number;
  lesson_id: number;
  instructions: string;
  starter_code: string | null;
  language: string;
  time_limit_seconds: number | null;
  max_attempts: number | null;
  xp_reward: number;
  test_labels?: string[];
  hints_available?: number;
  hints_used?: number;
}

export interface TestResult {
  label: string;
  passed: boolean;
  expected?: string;
  received?: string;
}

export interface ChallengeSubmission {
  id: number;
  status: SubmissionStatus;
  tests_passed: number;
  tests_total: number;
  execution_time_ms: number | null;
  output: string | null;
  error_output: string | null;
  test_results?: TestResult[];
  created_at?: string;
}

export interface Hint {
  id: number;
  hint_type: HintType;
  content: string;
  xp_penalty: number;
}
