import React from 'react';

export interface StatProps {
  value: React.ReactNode;
  label: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Stat: React.FC<StatProps> = ({
  value,
  label,
  size = 'md',
  className = '',
}) => {
  const valueSize = {
    sm: 'text-base font-semibold',
    md: 'text-xl font-bold',
    lg: 'text-3xl font-extrabold',
  }[size];

  return (
    <div className={`space-y-0.5 select-none ${className}`}>
      <div className={`text-[var(--text)] tracking-tight ${valueSize}`}>{value}</div>
      <div className="text-xs text-[var(--text-muted)]">{label}</div>
    </div>
  );
};
