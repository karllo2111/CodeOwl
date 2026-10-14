import React from 'react';

export interface KbdProps {
  children: React.ReactNode;
  className?: string;
}

export const Kbd: React.FC<KbdProps> = ({ children, className = '' }) => {
  return (
    <kbd
      className={`inline-flex items-center justify-center px-1.5 py-0.5 text-[11px] font-mono font-medium text-[var(--text-muted)] bg-[var(--surface-2)] border border-[var(--border)] rounded-[4px] shadow-2xs select-none ${className}`}
    >
      {children}
    </kbd>
  );
};
