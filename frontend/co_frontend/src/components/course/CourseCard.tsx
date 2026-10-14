import React from 'react';
import { Link } from 'react-router-dom';
import { Layers, ArrowRight } from 'lucide-react';
import type { Course } from '../../types/course';
import { Badge } from '../ui/Badge';
import { ProgressBar } from '../ui/ProgressBar';

export const CourseCard: React.FC<{ course: Course }> = ({ course }) => {
  const progressPercent = course.user_progress?.percentage || 0;

  return (
    <div className="bezel-shell bezel-shell-hover flex flex-col justify-between h-full">
      <div className="bezel-core p-6 flex flex-col justify-between h-full space-y-5">
        <div>
          <div className="flex items-center justify-between gap-2 mb-3">
            <Badge variant="eyebrow">
              {course.difficulty} Track
            </Badge>
            <span className="text-[11px] font-mono text-slate-500 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" strokeWidth={1.5} />
              {course.chapters_count || 6} Chapters
            </span>
          </div>

          <h3 className="text-lg font-bold text-white transition-colors mb-2 tracking-tight">
            {course.title}
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
            {course.description}
          </p>
        </div>

        <div className="space-y-4 pt-4 border-t border-white/[0.08]">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span>Overall Progress</span>
              <span className="font-semibold text-white">{progressPercent}%</span>
            </div>
            <div className="w-full bg-white/[0.06] rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-white h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <Link
            to={`/courses/${course.slug}`}
            className="island-btn group flex items-center justify-between w-full px-5 py-2.5 bg-white text-slate-950 rounded-full text-xs font-semibold hover:bg-slate-200 transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)]"
          >
            <span>Open Curriculum</span>
            <span className="w-6 h-6 rounded-full bg-black/10 flex items-center justify-center transition-transform group-hover:translate-x-0.5">
              <ArrowRight className="w-3.5 h-3.5 text-slate-950" strokeWidth={2} />
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};
