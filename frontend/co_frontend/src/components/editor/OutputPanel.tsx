import React from 'react';
import { Terminal, AlertCircle } from 'lucide-react';

export interface OutputPanelProps {
  output: string;
  error?: string | null;
}

export const OutputPanel: React.FC<OutputPanelProps> = ({ output, error }) => {
  return (
    <div className="h-full flex flex-col bg-slate-950 font-mono text-xs text-slate-300 overflow-hidden">
      <div className="flex items-center gap-2 px-3 py-2 bg-slate-900/80 border-b border-slate-800 text-slate-400 font-sans text-xs">
        <Terminal className="w-3.5 h-3.5 text-slate-400" />
        <span>Console & Output</span>
      </div>

      <div className="flex-1 p-3 overflow-y-auto space-y-2 whitespace-pre-wrap">
        {error && (
          <div className="p-2.5 rounded bg-rose-950/40 border border-rose-800/60 text-rose-300 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold">Runtime / Syntax Error:</div>
              <div>{error}</div>
            </div>
          </div>
        )}

        {output ? (
          <div className="text-emerald-400 leading-relaxed">{output}</div>
        ) : (
          !error && <div className="text-slate-600 italic">No output yet. Click 'Run Code' or 'Submit'.</div>
        )}
      </div>
    </div>
  );
};
