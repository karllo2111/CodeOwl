import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  hoverable = false,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-panel)] transition-colors ${
        hoverable ? 'hover:border-[var(--text-muted)]' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
