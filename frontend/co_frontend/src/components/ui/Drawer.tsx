import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { IconButton } from './IconButton';

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60">
      {/* Mobile: Bottom sheet, Desktop: Right side panel */}
      <div
        className="w-full sm:w-[440px] h-[85vh] sm:h-full mt-auto sm:mt-0 bg-[var(--surface)] border-t sm:border-t-0 sm:border-l border-[var(--border)] rounded-t-[var(--radius-panel)] sm:rounded-none flex flex-col shadow-xl animate-in slide-in-from-bottom sm:slide-in-from-right duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="p-5 border-b border-[var(--border)] flex items-start justify-between gap-3">
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-[var(--text)]">{title}</h3>
            {description && (
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">{description}</p>
            )}
          </div>
          <IconButton
            icon={<X className="w-4 h-4" />}
            aria-label="Tutup"
            onClick={onClose}
            size="sm"
          />
        </div>

        {/* Content body */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4 text-sm text-[var(--text)]">
          {children}
        </div>

        {/* Footer CTA */}
        {footer && (
          <div className="p-4 border-t border-[var(--border)] bg-[var(--surface)]">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
