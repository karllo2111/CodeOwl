import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Lock } from 'lucide-react';
import type { Chapter } from '../../types/course';
import { MasteryMeter } from '../gamification/MasteryMeter';

export const CourseMap: React.FC<{ chapters: Chapter[] }> = ({ chapters }) => {
  return (
    <div className="relative py-4 max-w-2xl mx-auto space-y-4">
      <div className="absolute left-5 top-6 bottom-6 w-0.5 bg-slate-800 -z-0" />

      {chapters.map((chapter, index) => {
        const isMastered = (chapter.mastery_percentage || 0) >= 80;
        const isUnlocked = chapter.is_unlocked !== false;

        return (
          <div key={chapter.id} className="relative flex items-start gap-5 z-10">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 border ${
                isMastered
                  ? 'bg-emerald-950/60 border-emerald-800 text-emerald-400'
                  : isUnlocked
                  ? 'bg-slate-800 border-slate-700 text-slate-200'
                  : 'bg-slate-900 border-slate-800 text-slate-600'
              }`}
            >
              {isMastered ? (
                <CheckCircle2 className="w-5 h-5" />
              ) : isUnlocked ? (
                index + 1
              ) : (
                <Lock className="w-4 h-4 text-slate-600" />
              )}
            </div>

            <Link
              to={isUnlocked ? `/chapters/${chapter.id}` : '#'}
              className={`flex-1 p-4 rounded-xl border transition-colors ${
                isUnlocked
                  ? 'bg-slate-900 border-slate-800 hover:border-slate-700 cursor-pointer'
                  : 'bg-slate-950 border-slate-900 text-slate-600 cursor-not-allowed opacity-60'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-[var(--text-muted)]">
                  Bab {index + 1}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  {chapter.lessons_count || 0} Lessons
                </span>
              </div>

              <h4 className="text-sm font-bold text-slate-200 mb-1">{chapter.title}</h4>
              <p className="text-xs text-slate-400 line-clamp-2 mb-3 leading-relaxed">
                {chapter.description}
              </p>

              {isUnlocked && (
                <MasteryMeter percentage={chapter.mastery_percentage || 0} label="Chapter Mastery" />
              )}
            </Link>
          </div>
        );
      })}
    </div>
  );
};
