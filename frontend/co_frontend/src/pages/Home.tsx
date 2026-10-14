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
import { Flame, Shield, ArrowRight, BookOpen, Terminal, Coins, Trophy, Sparkles } from 'lucide-react';
import { ROUTES, linkTo } from '../routes';

const DAY_LABELS = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];

const GuestHome: React.FC<{ courses: Course[]; coursesLoading: boolean }> = ({
  courses,
  coursesLoading,
}) => (
  <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-10">
    {/* Hero */}
    <div className="py-10 space-y-4">
      <h1 className="text-3xl font-bold tracking-tight text-[var(--text)]">
        Belajar Pemrograman, Langkah demi Langkah
      </h1>
      <p className="text-sm max-w-xl leading-relaxed text-[var(--text-muted)]">
        Kuasai JavaScript dan fondasi pemrograman melalui materi terstruktur, latihan koding interaktif, dan proyek nyata.
      </p>
      <div className="flex flex-wrap gap-3 pt-2">
        <Link to={ROUTES.REGISTER}>
          <Button variant="primary" size="md">
            Mulai Belajar Gratis
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>
        </Link>
        <Link to={ROUTES.CURRICULUM}>
          <Button variant="secondary" size="md">
            <BookOpen className="w-4 h-4 mr-1.5" />
            Lihat Kurikulum
          </Button>
        </Link>
      </div>
    </div>

    {/* Course catalog */}
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-[var(--text)]">
          Kurikulum Pilihan
        </h2>
        <Link
          to={ROUTES.CURRICULUM}
          className="text-xs font-medium text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
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
  const { user: authUser } = useAuthStore();
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [dashLoading, setDashLoading] = useState(true);

  useEffect(() => {
    dashboardApi
      .get()
      .then(setDashboard)
      .catch((err) => {
        console.error('Failed to load dashboard:', err);
      })
      .finally(() => setDashLoading(false));
  }, []);

  const weekDays = dashboard?.streak?.week ?? [];
  const userName = dashboard?.user?.name ?? authUser?.name ?? '–';
  const userCoins = dashboard?.user?.coins ?? authUser?.coins ?? 0;
  const userXp = dashboard?.xp?.total ?? authUser?.total_xp ?? 0;
  const userLevel = dashboard?.xp?.level ?? authUser?.current_level ?? 1;
  const xpProgressPct = dashboard?.xp?.progress_pct ?? 0;
  const xpToNext = dashboard?.xp?.xp_to_next ?? 0;
  const streakCurrent = dashboard?.streak?.current ?? authUser?.streak ?? 0;
  const streakFreezes = dashboard?.user?.streak_freezes ?? authUser?.streak_freezes ?? 0;

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-8">
      {/* Greeting Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-[var(--text)]">
            {dashLoading && !authUser ? (
              <Skeleton className="h-7 w-48 inline-block" />
            ) : (
              <>Halo, {userName}</>
            )}
          </h1>
          <p className="text-sm text-[var(--text-muted)]">
            Lanjutkan perjalanan belajarmu hari ini.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to={ROUTES.SHOP}
            className="flex items-center gap-2 px-3 py-1.5 rounded-[var(--radius-control)] bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--border-strong)] transition-colors text-xs font-medium text-[var(--text)]"
          >
            <Coins className="w-4 h-4 text-[var(--warning)]" />
            <span className="num font-semibold">{userCoins}</span>
            <span className="text-[var(--text-muted)]">Koin</span>
          </Link>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-[var(--radius-control)] bg-[var(--surface)] border border-[var(--border)] text-xs font-medium text-[var(--text)]">
            <Sparkles className="w-4 h-4 text-[var(--accent)]" />
            <span className="num font-semibold">{userXp}</span>
            <span className="text-[var(--text-muted)]">XP</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Column (Learning & Courses) + Right Rail (Streak, Level, Quick Links) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 cols wide on desktop) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Course / Continue Learning */}
          {dashLoading ? (
            <Skeleton className="h-44 rounded-[var(--radius-card)]" />
          ) : dashboard?.active_course ? (
            <Card className="p-6 space-y-4 border border-[var(--border)]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-xs font-medium text-[var(--text-muted)]">
                    Sedang Dipelajari
                  </span>
                  <h2 className="text-lg font-semibold text-[var(--text)] mt-1">
                    {dashboard.active_course.title}
                  </h2>
                </div>
                <span className="text-sm font-semibold num text-[var(--accent)]">
                  {dashboard.active_course.progress_pct}% Selesai
                </span>
              </div>

              <ProgressBar
                value={dashboard.active_course.progress_pct}
                max={100}
                size="md"
              />

              <div className="pt-2 flex items-center justify-between">
                <span className="text-xs text-[var(--text-muted)]">
                  Tetap konsisten untuk menyelesaikan kursus ini.
                </span>
                {dashboard.active_course.next_lesson_id ? (
                  <Link to={linkTo.lesson(dashboard.active_course.next_lesson_id)}>
                    <Button variant="primary" size="sm">
                      Lanjutkan Belajar
                      <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                    </Button>
                  </Link>
                ) : (
                  <Link to={ROUTES.CURRICULUM}>
                    <Button variant="secondary" size="sm">
                      Buka Kurikulum
                    </Button>
                  </Link>
                )}
              </div>
            </Card>
          ) : (
            <Card className="p-6 space-y-4 border border-[var(--border)]">
              <div className="space-y-1">
                <h2 className="text-base font-semibold text-[var(--text)]">
                  Mulai Belajar Sekarang
                </h2>
                <p className="text-xs text-[var(--text-muted)]">
                  Pilih kursus pemrograman pertama kamu dan bangun fondasi kodingmu.
                </p>
              </div>
              <Link to={ROUTES.CURRICULUM}>
                <Button variant="primary" size="sm">
                  <BookOpen className="w-3.5 h-3.5 mr-1.5" />
                  Pilih Kurikulum
                </Button>
              </Link>
            </Card>
          )}

          {/* Quick Stats Summary */}
          {!dashLoading && dashboard?.stats && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-[var(--radius-card)] bg-[var(--surface)] border border-[var(--border)]">
                <div className="text-[11px] text-[var(--text-muted)]">Materi Selesai</div>
                <div className="text-lg font-bold num text-[var(--text)] mt-0.5">
                  {dashboard.stats.lessons_completed ?? 0}
                </div>
              </div>
              <div className="p-3.5 rounded-[var(--radius-card)] bg-[var(--surface)] border border-[var(--border)]">
                <div className="text-[11px] text-[var(--text-muted)]">Bab Tuntas</div>
                <div className="text-lg font-bold num text-[var(--text)] mt-0.5">
                  {dashboard.stats.chapters_completed ?? 0}
                </div>
              </div>
              <div className="p-3.5 rounded-[var(--radius-card)] bg-[var(--surface)] border border-[var(--border)]">
                <div className="text-[11px] text-[var(--text-muted)]">Bug Diperbaiki</div>
                <div className="text-lg font-bold num text-[var(--text)] mt-0.5">
                  {dashboard.stats.bugs_fixed ?? 0}
                </div>
              </div>
              <div className="p-3.5 rounded-[var(--radius-card)] bg-[var(--surface)] border border-[var(--border)]">
                <div className="text-[11px] text-[var(--text-muted)]">Tantangan</div>
                <div className="text-lg font-bold num text-[var(--text)] mt-0.5">
                  {dashboard.stats.challenges_completed ?? 0}
                </div>
              </div>
            </div>
          )}

          {/* Courses Catalog Section */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-[var(--text)]">
                Daftar Kurikulum
              </h2>
              <Link
                to={ROUTES.CURRICULUM}
                className="text-xs font-medium text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
              >
                Lihat Semua →
              </Link>
            </div>
            {coursesLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[...Array(2)].map((_, i) => (
                  <Skeleton key={i} className="h-36 rounded-[var(--radius-card)]" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {courses.slice(0, 4).map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Rail: Streak, Level, Playground CTA */}
        <div className="space-y-5">
          {/* Streak Card */}
          <Card className="p-5 space-y-4 border border-[var(--border)]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[var(--text-muted)]">
                Aktivitas Belajar
              </span>
              {streakCurrent > 0 && (
                <div className="flex items-center gap-1.5 text-xs text-[var(--warning)] font-semibold">
                  <Flame className="w-3.5 h-3.5" />
                  <span className="num">{streakCurrent} hari streak</span>
                </div>
              )}
            </div>

            {/* Week strip */}
            <div className="grid grid-cols-7 gap-1.5 pt-1">
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
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-semibold border transition-colors ${
                          day.completed
                            ? 'bg-[var(--surface-2)] border-[var(--warning)] text-[var(--warning)]'
                            : 'bg-[var(--surface)] border-[var(--border)] text-[var(--text-muted)]'
                        }`}
                      >
                        {day.completed ? '✓' : day.label.slice(0, 1)}
                      </div>
                      <span className="text-[9px] text-[var(--text-muted)]">
                        {day.label}
                      </span>
                    </div>
                  ))
                : DAY_LABELS.map((d, i) => (
                    <div key={i} className="flex flex-col items-center gap-1">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] border border-[var(--border)] text-[var(--text-muted)] bg-[var(--surface)]">
                        {d.slice(0, 1)}
                      </div>
                      <span className="text-[9px] text-[var(--text-muted)]">{d}</span>
                    </div>
                  ))}
            </div>

            {/* Streak Freeze Info */}
            <div className="flex items-center justify-between text-xs pt-3 border-t border-[var(--border)] text-[var(--text-muted)]">
              <span className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-[var(--accent)]" />
                Streak Freeze
              </span>
              <span className="text-[var(--text)] num font-medium">
                {streakFreezes} tersedia
              </span>
            </div>
          </Card>

          {/* Level & XP Progress Card */}
          <Card className="p-5 space-y-4 border border-[var(--border)]">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[var(--text)]">
                  Level {userLevel}
                </span>
                <span className="text-xs text-[var(--text-muted)] num">
                  {userXp} XP
                </span>
              </div>
              <ProgressBar
                value={xpProgressPct}
                max={100}
                size="sm"
              />
              <p className="text-[11px] text-[var(--text-muted)]">
                <span className="num font-semibold text-[var(--text)]">{xpToNext} XP</span> lagi untuk mencapai Level {userLevel + 1}.
              </p>
            </div>
          </Card>

          {/* Leaderboard Shortcut */}
          <Card className="p-4 border border-[var(--border)] flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-[var(--radius-control)] bg-[var(--surface-2)] flex items-center justify-center text-[var(--accent)] shrink-0">
                <Trophy className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-semibold text-[var(--text)]">Peringkat Mingguan</div>
                <div className="text-[11px] text-[var(--text-muted)]">
                  {dashboard?.rank.weekly ? `Peringkat #${dashboard.rank.weekly}` : 'Belum masuk peringkat'}
                </div>
              </div>
            </div>
            <Link to={ROUTES.LEADERBOARD}>
              <Button variant="secondary" size="sm">
                Lihat
              </Button>
            </Link>
          </Card>

          {/* Playground Shortcut */}
          <div className="rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] p-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold text-[var(--text)]">
                Playground JavaScript
              </p>
              <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
                Uji coba kode bebas tanpa batas materi.
              </p>
            </div>
            <Link to={ROUTES.PLAYGROUND}>
              <Button variant="secondary" size="sm">
                <Terminal className="w-3.5 h-3.5 mr-1" />
                Buka
              </Button>
            </Link>
          </div>
        </div>
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
