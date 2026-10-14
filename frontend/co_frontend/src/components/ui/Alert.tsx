import React from 'react';
import { Info, CheckCircle2, AlertTriangle, AlertCircle } from 'lucide-react';

export interface AlertProps {
  variant?: 'info' | 'success' | 'warning' | 'danger' | 'error';
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({
  variant = 'info',
  title,
  children,
  className = '',
}) => {
  const normVariant = variant === 'error' ? 'danger' : variant;
  const styles = {
    info: {
      border: 'border-[var(--border)]',
      icon: <Info className="w-4 h-4 text-[var(--accent)] shrink-0" strokeWidth={1.5} />,
    },
    success: {
      border: 'border-[var(--success)]/30',
      icon: <CheckCircle2 className="w-4 h-4 text-[var(--success)] shrink-0" strokeWidth={1.5} />,
    },
    warning: {
      border: 'border-[var(--warning)]/30',
      icon: <AlertTriangle className="w-4 h-4 text-[var(--warning)] shrink-0" strokeWidth={1.5} />,
    },
    danger: {
      border: 'border-[var(--danger)]/30',
      icon: <AlertCircle className="w-4 h-4 text-[var(--danger)] shrink-0" strokeWidth={1.5} />,
    },
  }[normVariant];

  return (
    <div
      className={`border rounded-[var(--radius-control)] bg-[var(--surface-2)] text-[var(--text)] p-3.5 flex gap-2.5 text-xs leading-relaxed ${styles.border} ${className}`}
    >
      {styles.icon}
      <div className="flex-1 space-y-0.5">
        {title && <h5 className="font-semibold text-[var(--text)]">{title}</h5>}
        <div className="text-[var(--text-muted)]">{children}</div>
      </div>
    </div>
  );
};
