import React from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import type { ChallengeSubmission } from '../../types/activity';

export interface TestResultsProps {
  submission: ChallengeSubmission | null;
}

export const TestResults: React.FC<TestResultsProps> = ({ submission }) => {
  if (!submission) return null;

  const passed = submission.status === 'passed';

  return (
    <div className="border-t border-slate-800 bg-slate-900/90 p-3 space-y-2 text-xs font-sans">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 font-semibold">
          {passed ? (
            <span className="flex items-center gap-1.5 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              Passed ({submission.tests_passed}/{submission.tests_total} Tests)
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-rose-400">
              <XCircle className="w-4 h-4" />
              Failed ({submission.tests_passed}/{submission.tests_total} Tests)
            </span>
          )}
        </div>
        {submission.execution_time_ms && (
          <span className="text-slate-500 font-mono">{submission.execution_time_ms}ms</span>
        )}
      </div>

      {submission.test_results && submission.test_results.length > 0 && (
        <div className="space-y-1.5 pt-1">
          {submission.test_results.map((t, idx) => (
            <div
              key={idx}
              className={`flex items-center gap-2 p-1.5 rounded ${
                t.passed ? 'bg-emerald-950/20 text-emerald-300' : 'bg-rose-950/20 text-rose-300'
              }`}
            >
              {t.passed ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              ) : (
                <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              )}
              <span className="truncate">{t.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
