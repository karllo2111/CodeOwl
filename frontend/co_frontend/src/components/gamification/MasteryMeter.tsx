import React from 'react';
import { ProgressBar } from '../ui/ProgressBar';

export const MasteryMeter: React.FC<{ percentage: number; label?: string }> = ({ percentage, label = 'Mastery' }) => {
  const getColor = (val: number) => {
    if (val >= 80) return 'bg-emerald-500';
    if (val >= 50) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs font-medium">
        <span className="text-slate-400">{label}</span>
        <span className={percentage >= 80 ? 'text-emerald-400 font-bold' : 'text-slate-300'}>{percentage}%</span>
      </div>
      <ProgressBar value={percentage} color={getColor(percentage)} size="sm" />
    </div>
  );
};
