import React from 'react';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, className = '', id, ...props }, ref) => {
    const checkId = id || label.toLowerCase().replace(/\s+/g, '-');

    return (
      <label htmlFor={checkId} className={`inline-flex items-center gap-2 cursor-pointer select-none text-sm text-[var(--text)] ${className}`}>
        <input
          id={checkId}
          type="checkbox"
          ref={ref}
          className="w-4 h-4 rounded-[4px] border border-[var(--border)] bg-[var(--surface)] text-[var(--accent)] accent-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] cursor-pointer"
          {...props}
        />
        <span>{label}</span>
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';
