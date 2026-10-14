import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { coursesApi } from '../api/courses';
import { dashboardApi, type DashboardData } from '../api/dashboard';
import type { Course } from '../types/course';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Skeleton } from '../components/ui/Skeleton';
import { CourseCard } from '../components/course/CourseCard';
import { Flame, Shield, ArrowRight, BookOpen, Terminal } from 'lucide-react';

// Week strip day labels (Sen-Min)
const DAY_LABELS = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];

const GuestHome: React.FC<{ courses: Course[]; coursesLoading: boolean }> = ({
  courses,
  coursesLoading,
}) => (
  <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-10">
    {/* Hero */}
    <div className="py-10 space-y-4">
      <h1 className="text-3xl font-bold tracking-tight" style={{ color: 'var(--text)' }}>
        Belajar Pemrograman, Langkah demi Langkah
      </h1>
      <p className="text-sm max-w-xl leading-relaxed" style={{ color: 'var(--text-muted)' }}>
        Kuasai JavaScript dan bahasa pemrograman lainnya melalui pelajaran terstruktur, latihan soal, dan proyek nyata.
      </p>
      <div className="flex flex-wrap gap-3 pt-2">
        <Link to="/register">
          <Button variant="primary" size="md">
            Mulai Belajar Gratis
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>
        </Link>
        <Link to="/courses">
          <Button variant="secondary" size="md">
            <BookOpen className="w-4 h-4 mr-1.5" />
            Lihat Kursus
          </Button>
        </Link>
      </div>
    </div>

    {/* Course catalog */}
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold" style={{ color: 'var(--text)' }}>
          Kursus Tersedia
        </h2>
        <Link
          to="/courses"
          className="text-xs font-medium transition-colors"
          style={{ color: 'var(--text-muted)' }}
        >
          Lihat Semua →
        </Link>
      </div>
      {coursesLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-[var(--radius-card)]" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  </div>
);

const AuthHome: React.FC<{ courses: Course[]; coursesLoading: boolean }> = ({
  courses,
  coursesLoading,
}) => {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [dashLoading, setDashLoading] = useState(true);

  useEffect(() => {
    dashboardApi
      .get()
      .then(setDashboard)
      .catch(console.error)
      .finally(() => setDashLoading(false));
  }, []);

  // Build week strip from dashboard data or empty
  const weekDays = dashboard?.streak.week ?? [];

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-8">
      {/* Greeting */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text)' }}>
          {dashLoading ? (
            <Skeleton className="h-7 w-48 inline-block" />
          ) : (
            <>Halo, {dashboard?.user.name ?? '–'}</>
          )}
        </h1>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          Lanjutkan perjalanan belajarmu hari ini.
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Streak card */}
        <Card className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
              Streak
            </span>
            {!dashLoading && (dashboard?.streak.current ?? 0) > 0 && (
              <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                <Flame className="w-3.5 h-3.5" style={{ color: 'var(--warning)' }} />
                <span style={{ color: 'var(--text)' }}>
                  {dashboard!.streak.current} hari
                </span>
              </div>
            )}
          </div>

          {/* Week strip */}
          <div className="grid grid-cols-7 gap-1.5">
            {dashLoading
              ? DAY_LABELS.map((d, i) => (
                  <div key={i} className="flex flex-col items-center gap-1">
                    <Skeleton className="w-7 h-7 rounded-full" />
                    <Skeleton className="w-4 h-2.5" />
                  </div>
                ))
              : weekDays.length > 0
              ? weekDays.map((day, i) => (
                  <div key={i} className="flex flex-col items-center gap-1">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-semibold border transition-colors"
                      style={{
                        background: day.completed
                          ? 'color-mix(in srgb, var(--warning) 20%, transparent)'
                          : 'var(--surface-raised)',
                        borderColor: day.completed ? 'var(--warning)' : 'var(--border)',
                        color: day.completed ? 'var(--warning)' : 'var(--text-subtle)',
                      }}
                    >
                      {day.completed ? '✓' : day.label.slice(0, 1)}
                    </div>
                    <span className="text-[9px]" style={{ color: 'var(--text-subtle)' }}>
                      {day.label}
                    </span>
                  </div>
                ))
              : DAY_LABELS.map((d, i) => (
                  <div key={i} className="flex flex-col items-center gap-1">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] border"
                      style={{ borderColor: 'var(--border)', color: 'var(--text-subtle)' }}
                    >
                      {d.slice(0, 1)}
                    </div>
                    <span className="text-[9px]" style={{ color: 'var(--text-subtle)' }}>{d}</span>
                  </div>
                ))}
          </div>

          {/* Streak freeze count */}
          {!dashLoading && (
            <div
              className="flex items-center justify-between text-xs pt-1 border-t"
              style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}
            >
              <span className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5" style={{ color: 'var(--info)' }} />
                Streak Freeze
              </span>
              <span style={{ color: 'var(--text)' }}>
                {dashboard?.user.streak_freezes ?? 0} tersimpan
              </span>
            </div>
          )}
        </Card>

        {/* XP & active course card */}
        <Card className="p-5 space-y-4">
          {dashLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-2 w-full" />
              <Skeleton className="h-3 w-32" />
            </div>
          ) : (
            <>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                    Level {dashboard?.xp.level ?? 1}
                  </span>
                  <span className="text-xs" style={{ color: 'var(--text-subtle)' }}>
                    {dashboard?.xp.total ?? 0} XP
                  </span>
                </div>
                <ProgressBar
                  value={dashboard?.xp.progress_pct ?? 0}
                  max={100}
                  size="sm"
                />
                <p className="text-[11px]" style={{ color: 'var(--text-subtle)' }}>
                  {dashboard?.xp.xp_to_next ?? 0} XP ke level berikutnya
                </p>
              </div>

              {dashboard?.active_course ? (
                <div
                  className="rounded-[var(--radius-control)] border p-3 space-y-2"
                  style={{ borderColor: 'var(--border)' }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium" style={{ color: 'var(--text)' }}>
                      {dashboard.active_course.title}
                    </span>
                    <span className="text-[11px]" style={{ color: 'var(--text-subtle)' }}>
                      {dashboard.active_course.progress_pct}%
                    </span>
                  </div>
                  <ProgressBar
                    value={dashboard.active_course.progress_pct}
                    max={100}
                    size="sm"
                  />
                  {dashboard.active_course.next_lesson_id && (
                    <Link
                      to={`/lessons/${dashboard.active_course.next_lesson_id}`}
                      className="inline-flex items-center gap-1 text-[11px] font-medium transition-colors"
                      style={{ color: 'var(--accent)' }}
                    >
                      Lanjutkan <ArrowRight className="w-3 h-3" />
                    </Link>
                  )}
                </div>
              ) : (
                <Link to="/courses">
                  <Button variant="secondary" size="sm" className="w-full justify-center">
                    <BookOpen className="w-3.5 h-3.5 mr-1.5" />
                    Mulai Kursus
                  </Button>
                </Link>
              )}
            </>
          )}
        </Card>
      </div>

      {/* Courses section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold" style={{ color: 'var(--text)' }}>
            Semua Kursus
          </h2>
          <Link
            to="/courses"
            className="text-xs font-medium"
            style={{ color: 'var(--text-muted)' }}
          >
            Lihat Semua →
          </Link>
        </div>
        {coursesLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-40 rounded-[var(--radius-card)]" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}
      </div>

      {/* Playground CTA */}
      <div
        className="rounded-[var(--radius-card)] border p-5 flex items-center justify-between gap-4"
        style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}
      >
        <div>
          <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>
            Playground
          </p>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
            Eksperimen bebas dengan kode JavaScript kamu.
          </p>
        </div>
        <Link to="/playground">
          <Button variant="secondary" size="sm">
            <Terminal className="w-3.5 h-3.5 mr-1.5" />
            Buka
          </Button>
        </Link>
      </div>
    </div>
  );
};

export const Home: React.FC = () => {
  const { isAuthenticated } = useAuthStore();
  const [courses, setCourses] = useState<Course[]>([]);
  const [coursesLoading, setCoursesLoading] = useState(true);

  useEffect(() => {
    coursesApi
      .getCourses()
      .then(setCourses)
      .catch(console.error)
      .finally(() => setCoursesLoading(false));
  }, []);

  return isAuthenticated ? (
    <AuthHome courses={courses} coursesLoading={coursesLoading} />
  ) : (
    <GuestHome courses={courses} coursesLoading={coursesLoading} />
  );
};
