import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  variant?: 'neutral' | 'success' | 'warning' | 'danger' | 'default' | 'eyebrow' | 'info' | 'xp' | 'coins' | 'streak';
  size?: 'sm' | 'md' | 'eyebrow';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  className = '',
  ...props
}) => {
  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    eyebrow: 'text-xs px-2.5 py-1',
  };

  const variantStyles = {
    neutral: 'bg-[var(--surface-2)] text-[var(--text-muted)] border border-[var(--border)]',
    default: 'bg-[var(--surface-2)] text-[var(--text-muted)] border border-[var(--border)]',
    eyebrow: 'bg-[var(--surface-2)] text-[var(--text)] border border-[var(--border)] font-medium',
    info: 'bg-[var(--surface-2)] text-[var(--accent)] border border-[var(--accent)]/30',
    xp: 'bg-[var(--surface-2)] text-[var(--warning)] border border-[var(--warning)]/30 font-medium',
    coins: 'bg-[var(--surface-2)] text-[var(--warning)] border border-[var(--warning)]/30 font-medium',
    streak: 'bg-[var(--surface-2)] text-[var(--warning)] border border-[var(--warning)]/30 font-medium',
    success: 'bg-[var(--surface-2)] text-[var(--success)] border border-[var(--success)]/30',
    warning: 'bg-[var(--surface-2)] text-[var(--warning)] border border-[var(--warning)]/30',
    danger: 'bg-[var(--surface-2)] text-[var(--danger)] border border-[var(--danger)]/30',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 font-medium select-none rounded-[var(--radius-control)] ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};
