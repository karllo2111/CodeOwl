import React from 'react';
import { Lightbulb, Code2, BookOpen, KeyRound, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import type { Hint } from '../../types/activity';

export interface HintPanelProps {
  hints: Hint[];
  onRequestHint: () => void;
  availableHintsCount?: number;
}

const tierLabels: Record<string, { label: string; icon: React.ElementType; color: string; penalty: string }> = {
  conceptual: { label: 'Conceptual Hint', icon: Lightbulb, color: 'text-amber-400', penalty: '-10% XP' },
  direction: { label: 'Directional Clue', icon: Sparkles, color: 'text-sky-400', penalty: '-25% XP' },
  syntax_clue: { label: 'Syntax You May Use', icon: Code2, color: 'text-purple-400', penalty: '-40% XP' },
  explanation: { label: 'Step-by-Step Logic', icon: BookOpen, color: 'text-emerald-400', penalty: '-60% XP' },
  solution: { label: 'Complete Solution', icon: KeyRound, color: 'text-rose-400', penalty: '-75% XP' },
};

export const HintPanel: React.FC<HintPanelProps> = ({
  hints,
  onRequestHint,
  availableHintsCount = 4,
}) => {
  const canRequestMore = hints.length < availableHintsCount;
  const nextTierIndex = hints.length;
  const tiers = ['conceptual', 'direction', 'syntax_clue', 'explanation', 'solution'];
  const nextTierKey = tiers[nextTierIndex] || 'conceptual';
  const nextTierMeta = tierLabels[nextTierKey] || tierLabels.conceptual;

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.025] border border-white/[0.08] space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-amber-400" strokeWidth={1.5} />
          <span className="text-xs font-semibold text-slate-200">Progressive Hint Tiers</span>
        </div>
        {canRequestMore && (
          <Button variant="secondary" size="sm" onClick={onRequestHint} className="text-xs">
            Unlock {nextTierMeta.label} ({nextTierMeta.penalty})
          </Button>
        )}
      </div>

      {hints.length === 0 ? (
        <p className="text-xs text-slate-500 italic p-3 rounded-xl bg-white/[0.015] border border-white/[0.04]">
          No hints unlocked yet. Solve without hints for 100% XP reward and the &quot;No Hint&quot; badge!
        </p>
      ) : (
        <div className="space-y-3">
          {hints.map((hint, idx) => {
            const meta = tierLabels[hint.hint_type] || tierLabels.conceptual;
            const Icon = meta.icon;
            return (
              <div key={idx} className="p-3.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-[var(--text)] flex items-center gap-1.5">
                    <Icon className={`w-3.5 h-3.5 ${meta.color}`} strokeWidth={1.5} />
                    Petunjuk {idx + 1}: {meta.label}
                  </span>
                  <Badge variant="warning" size="sm">
                    {meta.penalty}
                  </Badge>
                </div>
                <div className="text-slate-300 whitespace-pre-wrap leading-relaxed font-sans pt-1">
                  {hint.content}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
