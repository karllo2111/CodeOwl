import React from 'react';

export interface DifficultyProps {
  level: 'easy' | 'normal' | 'medium' | 'hard' | 'expert' | string;
  className?: string;
}

export const Difficulty: React.FC<DifficultyProps> = ({
  level,
  className = '',
}) => {
  const norm = (level || 'easy').toLowerCase();

  let label = 'Mudah';
  let colorClass = 'text-[var(--success)]';

  if (norm === 'medium' || norm === 'normal') {
    label = 'Sedang';
    colorClass = 'text-[var(--warning)]';
  } else if (norm === 'hard') {
    label = 'Sulit';
    colorClass = 'text-[var(--danger)]';
  } else if (norm === 'expert') {
    label = 'Ahli';
    colorClass = 'text-[var(--danger)]';
  }

  return (
    <span className={`text-xs font-medium ${colorClass} ${className}`}>
      {label}
    </span>
  );
};
