import React from 'react';
import { Award, CheckCircle2 } from 'lucide-react';
import type { Achievement } from '../../types/gamification';
import { Card } from '../ui/Card';

export const AchievementCard: React.FC<{ achievement: Achievement }> = ({ achievement }) => {
  return (
    <Card className={`relative flex items-start gap-4 transition-all ${achievement.is_earned ? 'border-amber-500/30 bg-amber-950/10' : 'opacity-60 border-slate-800'}`}>
      <div className={`p-3 rounded-xl shrink-0 ${achievement.is_earned ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-800 text-slate-500'}`}>
        <Award className="w-6 h-6" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1">
          <h4 className="font-semibold text-slate-200 truncate">{achievement.title}</h4>
          {achievement.is_earned && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
        </div>
        <p className="text-xs text-slate-400 mb-2 leading-relaxed">{achievement.description}</p>
        <div className="text-xs font-semibold text-amber-400">+{achievement.xp_reward} XP</div>
      </div>
    </Card>
  );
};
