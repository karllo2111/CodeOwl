import React from 'react';

export interface DifficultyLabelProps {
  difficulty: 'easy' | 'normal' | 'medium' | 'hard' | string;
  className?: string;
}

export const DifficultyLabel: React.FC<DifficultyLabelProps> = ({
  difficulty,
  className = '',
}) => {
  const norm = difficulty.toLowerCase();

  let label = 'Mudah';
  let colorClass = 'text-[var(--success)]';

  if (norm === 'medium' || norm === 'normal') {
    label = 'Sedang';
    colorClass = 'text-[var(--warning)]';
  } else if (norm === 'hard') {
    label = 'Sulit';
    colorClass = 'text-[var(--danger)]';
  }

  return (
    <span className={`text-xs font-medium ${colorClass} ${className}`}>
      {label}
    </span>
  );
};
