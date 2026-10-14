import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import type { Course } from '../../types/course';
import { Card } from '../ui/Card';
import { ProgressBar } from '../ui/ProgressBar';
import { Button } from '../ui/Button';

export const CourseCard: React.FC<{ course: Course }> = ({ course }) => {
  const progressPercent = course.user_progress?.percentage || 0;
  const chaptersCount = course.chapters_count || 6;
  const estimatedHours = Math.round(chaptersCount * 1.5);

  const difficultyMap: Record<string, string> = {
    beginner: 'Pemula',
    intermediate: 'Menengah',
    advanced: 'Mahir',
  };
  const diffLabel = difficultyMap[course.difficulty?.toLowerCase()] || course.difficulty || 'Pemula';

  return (
    <Card className="flex flex-col justify-between h-full p-5 space-y-4">
      <div className="space-y-2">
        <p className="text-xs text-[var(--text-muted)]">
          {diffLabel} · {chaptersCount} bab · ±{estimatedHours} jam
        </p>

        <h3 className="text-base font-semibold text-[var(--text)] transition-colors leading-snug">
          {course.title}
        </h3>
        <p className="text-xs text-[var(--text-muted)] leading-relaxed line-clamp-2">
          {course.description}
        </p>
      </div>

      <div className="space-y-3 pt-3 border-t border-[var(--border)]">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
            <span>Kemajuan</span>
            <span className="font-semibold text-[var(--text)] num">{progressPercent}%</span>
          </div>
          <ProgressBar value={progressPercent} max={100} size="sm" />
        </div>

        <Link to={`/kurikulum/${course.slug}`} className="block w-full">
          <Button variant="secondary" size="sm" className="w-full justify-between">
            <span>Buka Kurikulum</span>
            <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
          </Button>
        </Link>
      </div>
    </Card>
  );
};
