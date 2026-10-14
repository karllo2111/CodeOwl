import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Play, Code, Bug, Wrench, Swords, CheckCircle2, Lock } from 'lucide-react';
import type { Lesson } from '../../types/course';
import { Badge } from '../ui/Badge';

export const LessonItem: React.FC<{ lesson: Lesson; isLocked?: boolean }> = ({ lesson, isLocked = false }) => {
  const typeIcons: Record<string, React.ReactNode> = {
    theory: <BookOpen className="w-4 h-4 text-sky-400" />,
    example: <Play className="w-4 h-4 text-emerald-400" />,
    practice: <Code className="w-4 h-4 text-indigo-400" />,
    debug: <Bug className="w-4 h-4 text-rose-400" />,
    fix: <Wrench className="w-4 h-4 text-amber-400" />,
    challenge: <Swords className="w-4 h-4 text-purple-400" />,
    chapter_review: <CheckCircle2 className="w-4 h-4 text-teal-400" />,
    level_review: <CheckCircle2 className="w-4 h-4 text-amber-400" />,
  };

  const Icon = typeIcons[lesson.type] || <Code className="w-4 h-4 text-slate-400" />;

  return (
    <Link
      to={isLocked ? '#' : `/lessons/${lesson.id}`}
      className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
        isLocked
          ? 'bg-slate-900/40 border-slate-800/40 text-slate-600 cursor-not-allowed'
          : 'bg-slate-900 border-slate-800 text-slate-200 hover:border-slate-700 hover:bg-slate-850'
      }`}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="p-2 rounded-lg bg-slate-800/80 shrink-0">
          {isLocked ? <Lock className="w-4 h-4 text-slate-600" /> : Icon}
        </div>
        <div className="min-w-0">
          <div className="font-semibold text-sm truncate">{lesson.title}</div>
          <div className="text-xs text-slate-500 capitalize">{lesson.type.replace('_', ' ')}</div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Badge variant="xp" size="sm">
          +{lesson.xp_reward} XP
        </Badge>
      </div>
    </Link>
  );
};
