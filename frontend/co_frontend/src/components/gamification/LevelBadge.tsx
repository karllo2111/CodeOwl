import React from 'react';
import { Shield } from 'lucide-react';

export interface LevelBadgeProps {
  level: number;
  title?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const LevelBadge: React.FC<LevelBadgeProps> = ({ level, title, size = 'md' }) => {
  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5',
  };

  return (
    <div className={`inline-flex items-center gap-1.5 font-medium rounded-lg bg-slate-800 border border-slate-700 text-slate-300 ${sizeStyles[size]}`}>
      <Shield className="w-3.5 h-3.5 text-slate-400" />
      <span>Level {level}</span>
      {title && <span className="text-slate-500">· {title}</span>}
    </div>
  );
};
