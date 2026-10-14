import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Check, 
  Lock, 
  Play, 
  BookOpen, 
  Code2, 
  Bug, 
  Wrench, 
  Swords, 
  Trophy,
  Clock,
  Sparkles
} from 'lucide-react';
import type { Lesson } from '../../types/course';
import { useProgressStore } from '../../stores/progressStore';
import toast from 'react-hot-toast';

export interface ChapterRoadmapProps {
  lessons: Lesson[];
  isChapterUnlocked: boolean;
  chapterTitle?: string;
}

const typeIcons: Record<string, React.ElementType> = {
  theory: BookOpen,
  example: Play,
  practice: Code2,
  debug: Bug,
  fix: Wrench,
  challenge: Swords,
  chapter_review: Trophy,
  level_review: Trophy,
  project: Trophy,
};

const typeLabels: Record<string, string> = {
  theory: 'Teori',
  example: 'Contoh',
  practice: 'Latihan',
  debug: 'Debugging',
  fix: 'Perbaikan Kode',
  challenge: 'Tantangan',
  chapter_review: 'Review Bab',
  level_review: 'Review Level',
  project: 'Proyek Akhir',
};

export const ChapterRoadmap: React.FC<ChapterRoadmapProps> = ({
  lessons,
  isChapterUnlocked,
}) => {
  const { isLessonCompleted } = useProgressStore();

  const sortedLessons = [...lessons].sort((a, b) => a.sort_order - b.sort_order);

  // Determine unlocked status sequentially
  // Lesson 0 is unlocked only if Chapter is unlocked.
  // Lesson N is unlocked only if Chapter is unlocked AND Lesson N-1 is completed.
  const lessonStates = sortedLessons.map((lesson, idx) => {
    const completed = isLessonCompleted(lesson.id);

    let unlocked = false;
    if (isChapterUnlocked) {
      if (idx === 0) {
        unlocked = true;
      } else {
        const prevLesson = sortedLessons[idx - 1];
        unlocked = isLessonCompleted(prevLesson.id);
      }
    }

    return {
      lesson,
      completed,
      unlocked,
      isCurrent: unlocked && !completed,
      previousLesson: idx > 0 ? sortedLessons[idx - 1] : null,
    };
  });

  const handleLockedClick = (e: React.MouseEvent, prevLessonTitle?: string) => {
    e.preventDefault();
    if (!isChapterUnlocked) {
      toast.error('Bab ini masih terkunci! Selesaikan semua bab sebelumnya terlebih dahulu.');
    } else if (prevLessonTitle) {
      toast.error(`Pelajaran ini terkunci! Selesaikan "${prevLessonTitle}" terlebih dahulu.`);
    } else {
      toast.error('Pelajaran ini masih terkunci.');
    }
  };

  return (
    <div className="relative py-4 px-2 sm:px-6">
      {lessonStates.map((item, index) => {
        const { lesson, completed, unlocked, isCurrent, previousLesson } = item;
        const IconComponent = typeIcons[lesson.type] || Code2;
        const isLast = index === lessonStates.length - 1;

        return (
          <div key={lesson.id} className="relative flex items-start gap-4 sm:gap-6 group">
            {/* Left Column: TryHackMe style circular node & vertical connecting line */}
            <div className="flex flex-col items-center shrink-0 relative">
              {/* Vertical connecting line */}
              {!isLast && (
                <div
                  className={`absolute top-12 bottom-0 w-[2px] z-0 transition-colors duration-500 ${
                    completed
                      ? 'bg-emerald-500/40'
                      : 'bg-white/[0.08]'
                  }`}
                  style={{ height: 'calc(100% + 1rem)' }}
                />
              )}

              {/* Node Circle */}
              <div
                className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] border ${
                  completed
                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]'
                    : isCurrent
                    ? 'bg-white text-slate-950 border-white shadow-[0_0_25px_rgba(255,255,255,0.2)] ring-4 ring-white/10'
                    : 'bg-white/[0.03] border-white/[0.08] text-slate-600'
                }`}
              >
                {completed ? (
                  <Check className="w-5 h-5 stroke-[2]" strokeWidth={2} />
                ) : isCurrent ? (
                  <Play className="w-5 h-5 fill-current ml-0.5 text-slate-950" />
                ) : (
                  <Lock className="w-4 h-4 text-slate-600" strokeWidth={1.5} />
                )}
              </div>

              {/* Step indicator under circle */}
              <span className="text-[10px] font-mono text-slate-500 mt-1 font-semibold">
                #{index + 1}
              </span>
            </div>

            {/* Right Column: Node Details Row / Card */}
            <div className="flex-1 pb-8 min-w-0">
              <Link
                to={unlocked ? `/lessons/${lesson.id}` : '#'}
                onClick={(e) => {
                  if (!unlocked) {
                    handleLockedClick(e, previousLesson?.title);
                  }
                }}
                className={`block p-4 sm:p-5 rounded-2xl border transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                  completed
                    ? 'bg-white/[0.03] border-white/[0.08] hover:border-white/20 hover:bg-white/[0.05] cursor-pointer'
                    : isCurrent
                    ? 'bg-white/[0.06] border-white/20 hover:border-white/30 cursor-pointer shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]'
                    : 'bg-white/[0.015] border-white/[0.04] opacity-50 cursor-not-allowed select-none'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/[0.06] text-slate-300 border border-white/10">
                      <IconComponent className="w-3 h-3 text-slate-400" strokeWidth={1.5} />
                      {typeLabels[lesson.type] || lesson.type}
                    </span>

                    <span className="inline-flex items-center gap-1 text-[11px] text-amber-300/90 font-medium">
                      <Sparkles className="w-3 h-3 text-amber-400" strokeWidth={1.5} />
                      +{lesson.xp_reward || 20} XP
                    </span>

                    {lesson.estimated_minutes && (
                      <span className="inline-flex items-center gap-1 text-[11px] text-slate-500">
                        <Clock className="w-3 h-3" strokeWidth={1.5} />
                        {lesson.estimated_minutes} min
                      </span>
                    )}
                  </div>

                  {/* Status Pill */}
                  <div>
                    {completed ? (
                      <span className="inline-flex items-center gap-1 text-xs text-emerald-400 font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                        <Check className="w-3 h-3" strokeWidth={1.5} />
                        Selesai
                      </span>
                    ) : isCurrent ? (
                      <span className="inline-flex items-center gap-1 text-xs text-white font-semibold px-2.5 py-0.5 rounded-full bg-white/15 border border-white/20">
                        Mulai Sekarang
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs text-slate-500 font-medium px-2.5 py-0.5 rounded-full bg-white/[0.02] border border-white/[0.06]">
                        <Lock className="w-3 h-3" strokeWidth={1.5} />
                        Terkunci
                      </span>
                    )}
                  </div>
                </div>

                <h4
                  className={`text-sm sm:text-base font-bold truncate ${
                    completed
                      ? 'text-slate-200'
                      : isCurrent
                      ? 'text-white'
                      : 'text-slate-500'
                  }`}
                >
                  {lesson.title}
                </h4>

                {!unlocked && previousLesson && (
                  <p className="text-[11px] text-slate-500 mt-1.5 flex items-center gap-1">
                    <Lock className="w-3 h-3 inline shrink-0 text-slate-600" strokeWidth={1.5} />
                    Buka setelah menyelesaikan: <span className="text-slate-400 font-medium">{previousLesson.title}</span>
                  </p>
                )}
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
};
