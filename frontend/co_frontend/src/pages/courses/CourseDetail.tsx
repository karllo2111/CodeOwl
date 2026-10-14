import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { coursesApi } from '../../api/courses';
import type { Course, CourseLevel } from '../../types/course';
import { RoadmapView } from '../../components/roadmap/RoadmapView';
import { SkillTree } from '../../components/course/SkillTree';
import { PageHeader } from '../../components/ui/PageHeader';
import { Tabs } from '../../components/ui/Tabs';
import { Card } from '../../components/ui/Card';
import { Breadcrumb } from '../../components/ui/Breadcrumb';
import { DifficultyLabel } from '../../components/ui/DifficultyLabel';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { Skeleton } from '../../components/ui/Skeleton';
import { useProgressStore } from '../../stores/progressStore';

export const CourseDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [levels, setLevels] = useState<CourseLevel[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'roadmap' | 'skills' | 'overview'>('roadmap');

  const { fetchProgress, isLessonCompleted } = useProgressStore();

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    Promise.all([coursesApi.getCourse(slug), coursesApi.getCourseLevels(slug)])
      .then(([c, lvls]) => {
        setCourse(c);
        setLevels(lvls);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-6">
        <Skeleton height={32} className="w-1/3" />
        <Skeleton height={20} className="w-2/3" />
        <div className="py-10 flex flex-col items-center space-y-8">
          <Skeleton height={80} className="w-32" />
          <Skeleton height={80} className="w-32" />
          <Skeleton height={80} className="w-32" />
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="p-8 text-center text-[var(--danger)]">
        Kurikulum kursus tidak ditemukan.
      </div>
    );
  }

  const allLevels = levels.length > 0 ? levels : (course.levels || []);
  const allChapters = allLevels.flatMap((lvl) => lvl.chapters || []).sort((a, b) => a.sort_order - b.sort_order);
  const allLessons = allChapters.flatMap((ch) => ch.lessons || []);
  const totalCompleted = allLessons.filter((l) => isLessonCompleted(l.id)).length;
  const progressPercent = allLessons.length > 0 ? Math.round((totalCompleted / allLessons.length) * 100) : 0;
  const totalXp = allLessons.reduce((sum, l) => sum + (l.xp_reward || 0), 0);

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-6">
      <Breadcrumb
        items={[
          { label: 'Beranda', to: '/' },
          { label: 'Kurikulum', to: '/courses' },
          { label: course.title },
        ]}
      />

      <PageHeader
        title={course.title}
        description={course.description}
        actions={
          <div className="flex items-center gap-3">
            <DifficultyLabel difficulty={course.difficulty} />
            <span className="text-xs text-[var(--text-muted)]">
              {totalCompleted} dari {allLessons.length} selesai ({progressPercent}%)
            </span>
          </div>
        }
      />

      {/* Course Overall Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
          <span>Progres Keseluruhan</span>
          <span>+{totalXp} Total XP Tersedia</span>
        </div>
        <ProgressBar value={progressPercent} variant="accent" />
      </div>

      {/* Main Tabs: Roadmap (Default), Skill Tree, Overview */}
      <Tabs
        tabs={[
          { id: 'roadmap', label: 'Roadmap Jalur Belajar', count: allChapters.length },
          { id: 'skills', label: 'Pohon Keterampilan' },
          { id: 'overview', label: 'Tentang Kursus' },
        ]}
        activeTab={activeTab}
        onChange={(id) => setActiveTab(id as any)}
      />

      {/* Tab 1: Isometric Roadmap View */}
      {activeTab === 'roadmap' && (
        <div className="pt-2">
          <RoadmapView chapters={allChapters} />
        </div>
      )}

      {/* Tab 2: Skill Tree View */}
      {activeTab === 'skills' && (
        <div className="pt-2">
          <SkillTree courseSlug={course.slug} />
        </div>
      )}

      {/* Tab 3: Overview Card */}
      {activeTab === 'overview' && (
        <div className="pt-2 space-y-6">
          <Card className="p-6 space-y-4">
            <h3 className="text-base font-semibold text-[var(--text)]">Tentang Kurikulum Ini</h3>
            <p className="text-sm text-[var(--text-muted)] leading-relaxed">
              {course.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[var(--border)]">
              <div>
                <div className="text-xs text-[var(--text-muted)]">Tingkat Kesulitan</div>
                <div className="mt-0.5"><DifficultyLabel difficulty={course.difficulty} /></div>
              </div>
              <div>
                <div className="text-xs text-[var(--text-muted)]">Total Bab</div>
                <div className="text-sm font-semibold text-[var(--text)] mt-0.5">{allChapters.length} Bab</div>
              </div>
              <div>
                <div className="text-xs text-[var(--text-muted)]">Total Materi & Latihan</div>
                <div className="text-sm font-semibold text-[var(--text)] mt-0.5">{allLessons.length} Pelajaran</div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
