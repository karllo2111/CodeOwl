import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Play, Code, Bug, Wrench, Swords, CheckCircle2, Lock } from 'lucide-react';
import type { Lesson } from '../../types/course';

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

  const typeLabels: Record<string, string> = {
    theory: 'Teori',
    example: 'Contoh',
    practice: 'Latihan',
    debug: 'Debug',
    fix: 'Perbaiki',
    challenge: 'Tantangan',
    chapter_review: 'Review Bab',
    level_review: 'Review Level',
  };

  const Icon = typeIcons[lesson.type] || <Code className="w-4 h-4 text-[var(--text-muted)]" />;

  return (
    <Link
      to={isLocked ? '#' : `/materi/${lesson.id}`}
      className={`flex items-center justify-between p-3.5 rounded-[var(--radius-panel)] border transition-colors ${
        isLocked
          ? 'bg-[var(--surface-2)]/40 border-[var(--border)]/40 text-[var(--text-muted)] cursor-not-allowed opacity-60'
          : 'bg-[var(--surface)] border-[var(--border)] text-[var(--text)] hover:border-[var(--border-strong)] hover:bg-[var(--surface-2)]'
      }`}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="p-2 rounded-[var(--radius-control)] bg-[var(--surface-2)] shrink-0">
          {isLocked ? <Lock className="w-4 h-4 text-[var(--text-muted)]" /> : Icon}
        </div>
        <div className="min-w-0">
          <div className="font-medium text-sm truncate">{lesson.title}</div>
          <div className="text-xs text-[var(--text-muted)]">
            {typeLabels[lesson.type] || lesson.type.replace('_', ' ')}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xs text-[var(--accent)] font-medium num">
          +{lesson.xp_reward} XP
        </span>
      </div>
    </Link>
  );
};
