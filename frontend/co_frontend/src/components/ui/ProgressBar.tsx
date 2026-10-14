import React from 'react';

export interface ProgressBarProps {
  value: number; // 0 to 100
  max?: number;
  size?: 'sm' | 'md';
  variant?: 'accent' | 'success' | 'warning';
  color?: string;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  size = 'sm',
  variant = 'accent',
  className = '',
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  const sizeClass = size === 'sm' ? 'h-1.5' : 'h-2.5';

  const fillClass = {
    accent: 'bg-[var(--accent)]',
    success: 'bg-[var(--success)]',
    warning: 'bg-[var(--warning)]',
  }[variant];

  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(percentage)}
      aria-valuemin={0}
      aria-valuemax={100}
      className={`w-full bg-[var(--surface-2)] overflow-hidden rounded-full ${sizeClass} ${className}`}
    >
      <div
        className={`h-full transition-all duration-300 rounded-full ${fillClass}`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};
