import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { coursesApi } from '../../api/courses';
import type { Chapter, Lesson } from '../../types/course';
import { ChapterRoadmap } from '../../components/course/ChapterRoadmap';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { ArrowLeft, Lock, CheckCircle2 } from 'lucide-react';
import { useProgressStore } from '../../stores/progressStore';

export const ChapterDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const chapterId = Number(id);
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);

  const { fetchProgress, isLessonCompleted } = useProgressStore();

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  useEffect(() => {
    if (!chapterId) return;
    setLoading(true);
    Promise.all([coursesApi.getChapter(chapterId), coursesApi.getChapterLessons(chapterId)])
      .then(([ch, lsns]) => {
        setChapter(ch);
        setLessons(lsns);
      })
      .finally(() => setLoading(false));
  }, [chapterId]);

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-500 text-sm">
        <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        Memuat materi bab...
      </div>
    );
  }

  if (!chapter) return <div className="p-8 text-center text-rose-400">Bab tidak ditemukan.</div>;

  const sortedLessons = [...lessons].sort((a, b) => a.sort_order - b.sort_order);
  const completedLessons = sortedLessons.filter((l) => isLessonCompleted(l.id));
  const isChapterDone = sortedLessons.length > 0 && completedLessons.length === sortedLessons.length;

  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto space-y-6 font-sans">
      <Link
        to="/courses/javascript-fundamentals"
        className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Kembali ke Roadmap Lengkap
      </Link>

      <Card className="p-6 space-y-3 bg-slate-900 border-slate-800">
        <div className="flex items-center justify-between gap-4">
          <Badge variant="default" size="sm">
            BAB {chapter.sort_order || 1}
          </Badge>
          <span className="text-xs text-slate-400 font-mono">
            {completedLessons.length} / {sortedLessons.length} Pelajaran Selesai
          </span>
        </div>

        <h1 className="text-2xl font-bold text-slate-100">{chapter.title}</h1>
        <p className="text-xs text-slate-400 leading-relaxed max-w-2xl">{chapter.description}</p>
      </Card>

      <Card className="p-4 sm:p-6 bg-slate-900/60 border-slate-800">
        <div className="mb-4 pb-3 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-[var(--text)]">
            Roadmap Alur Pelajaran
          </h3>
          <span className="text-[11px] text-slate-500">
            Urut dari nomor 1 ke bawah
          </span>
        </div>

        <ChapterRoadmap
          lessons={sortedLessons}
          isChapterUnlocked={true}
          chapterTitle={chapter.title}
        />
      </Card>
    </div>
  );
};
