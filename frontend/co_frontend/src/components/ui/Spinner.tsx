import React from 'react';

export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  className = '',
}) => {
  const sizeMap = {
    sm: 'w-3.5 h-3.5 border-2',
    md: 'w-5 h-5 border-2',
    lg: 'w-7 h-7 border-3',
  };

  return (
    <div
      role="status"
      aria-label="Memuat..."
      className={`inline-block rounded-full border-current border-t-transparent animate-spin text-[var(--accent)] ${sizeMap[size]} ${className}`}
    />
  );
};
