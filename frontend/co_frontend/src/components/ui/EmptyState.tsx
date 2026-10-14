import React from 'react';

export interface EmptyStateProps {
  title: string;
  description: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  action,
  icon,
  className = '',
}) => {
  return (
    <div
      className={`p-8 text-center border border-[var(--border)] rounded-[var(--radius-panel)] bg-[var(--surface)] max-w-md mx-auto space-y-4 ${className}`}
    >
      {icon && <div className="text-[var(--text-muted)] flex justify-center">{icon}</div>}
      <div className="space-y-1">
        <h3 className="text-sm font-semibold text-[var(--text)]">{title}</h3>
        <p className="text-xs text-[var(--text-muted)] leading-relaxed">{description}</p>
      </div>
      {action && <div className="pt-2 flex justify-center">{action}</div>}
    </div>
  );
};
