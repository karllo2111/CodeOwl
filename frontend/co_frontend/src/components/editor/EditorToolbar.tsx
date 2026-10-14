import React from 'react';
import { Play, Check, RotateCcw } from 'lucide-react';
import { Button } from '../ui/Button';

export interface EditorToolbarProps {
  onRun: () => void;
  onSubmit?: () => void;
  onReset: () => void;
  isRunning?: boolean;
  isSubmitting?: boolean;
  canSubmit?: boolean;
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({
  onRun,
  onSubmit,
  onReset,
  isRunning = false,
  isSubmitting = false,
  canSubmit = true,
}) => {
  return (
    <div className="flex items-center justify-between p-2.5 bg-slate-900 border-b border-slate-800">
      <div className="flex items-center gap-2">
        <Button variant="secondary" size="sm" onClick={onRun} isLoading={isRunning}>
          <Play className="w-3.5 h-3.5 fill-emerald-500 text-emerald-500" />
          Run Code
        </Button>

        {onSubmit && canSubmit && (
          <Button variant="success" size="sm" onClick={onSubmit} isLoading={isSubmitting}>
            <Check className="w-3.5 h-3.5" />
            Submit Solution
          </Button>
        )}
      </div>

      <Button variant="ghost" size="sm" onClick={onReset} className="text-slate-400 hover:text-slate-200">
        <RotateCcw className="w-3.5 h-3.5" />
        Reset
      </Button>
    </div>
  );
};
