import React from 'react';
import { Flame } from 'lucide-react';

export interface StreakDisplayProps {
  streak: number;
  compact?: boolean;
}

export const StreakDisplay: React.FC<StreakDisplayProps> = ({ streak, compact = false }) => {
  if (compact) {
    return (
      <div className="flex items-center gap-1 px-2.5 py-1 bg-slate-800 border border-slate-700 text-slate-300 rounded-lg text-xs font-medium">
        <Flame className="w-3.5 h-3.5 text-orange-400" />
        <span>{streak}d</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 p-3 bg-slate-900 border border-slate-800 rounded-xl">
      <div className="p-2 bg-slate-800 text-orange-400 rounded-lg border border-slate-700">
        <Flame className="w-5 h-5" />
      </div>
      <div>
        <div className="text-base font-bold text-slate-200">{streak} Days</div>
        <div className="text-xs text-slate-400">Daily learning streak</div>
      </div>
    </div>
  );
};
