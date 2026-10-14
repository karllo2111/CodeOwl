import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { dashboardApi, type DashboardData } from '../../api/dashboard';
import { Card } from '../../components/ui/Card';
import { PageHeader } from '../../components/ui/PageHeader';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { Skeleton } from '../../components/ui/Skeleton';
import { Avatar } from '../../components/ui/Avatar';
import { Flame, Shield } from 'lucide-react';

const DAY_LABELS = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];

export const ProfilePage: React.FC = () => {
  const { user } = useAuthStore();
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardApi.get().then(setDashboard).catch(console.error).finally(() => setLoading(false));
  }, []);

  const weekDays = dashboard?.streak.week ?? [];
  const xpLevel = dashboard?.xp.level ?? user?.current_level ?? 1;
  const xpTotal = dashboard?.xp.total ?? user?.total_xp ?? 0;
  const xpPct = dashboard?.xp.progress_pct ?? 0;
  const xpToNext = dashboard?.xp.xp_to_next ?? 0;
  const coins = dashboard?.user.coins ?? user?.coins ?? 0;
  const streak = dashboard?.streak.current ?? 0;
  const streakFreezes = dashboard?.user.streak_freezes ?? 0;
  const bugs = dashboard?.stats.bugs_fixed ?? 0;
  const challenges = dashboard?.stats.challenges_completed ?? 0;
  const lessons = dashboard?.stats.lessons_completed ?? 0;

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-8">
      <PageHeader title="Profil" />

      {/* Profile header */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <Avatar
            name={user?.name ?? ''}
            src={user?.avatar ?? undefined}
            size="xl"
          />
          <div className="flex-1 min-w-0 text-center sm:text-left space-y-1">
            <h2 className="text-lg font-bold" style={{ color: 'var(--text)' }}>
              {user?.name ?? '–'}
            </h2>
            {user?.username && (
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                @{user.username}
              </p>
            )}
            {user?.bio && (
              <p className="text-xs leading-relaxed max-w-lg" style={{ color: 'var(--text-muted)' }}>
                {user.bio}
              </p>
            )}

            {/* XP bar */}
            <div className="pt-3 space-y-1.5">
              <div className="flex items-center justify-between text-xs" style={{ color: 'var(--text-muted)' }}>
                <span>Level {xpLevel}</span>
                <span>{xpTotal} XP</span>
              </div>
              {loading ? (
                <Skeleton className="h-2 w-full" />
              ) : (
                <ProgressBar value={xpPct} max={100} size="sm" />
              )}
              <p className="text-[11px]" style={{ color: 'var(--text-subtle)' }}>
                {xpToNext} XP ke level berikutnya
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Koin', value: loading ? '–' : String(coins) },
          { label: 'Streak', value: loading ? '–' : `${streak} hari` },
          { label: 'Pelajaran', value: loading ? '–' : String(lessons) },
          { label: 'Tantangan', value: loading ? '–' : String(challenges) },
        ].map(({ label, value }) => (
          <Card key={label} className="p-4">
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{label}</p>
            {loading ? (
              <Skeleton className="h-6 w-12 mt-1" />
            ) : (
              <p className="text-xl font-bold mt-0.5" style={{ color: 'var(--text)' }}>{value}</p>
            )}
          </Card>
        ))}
      </div>

      {/* Streak week strip */}
      <Card className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
            Aktivitas Minggu Ini
          </h3>
          {streak > 0 && (
            <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-muted)' }}>
              <Flame className="w-3.5 h-3.5" style={{ color: 'var(--warning)' }} />
              {streak} hari berturut-turut
            </div>
          )}
        </div>

        <div className="grid grid-cols-7 gap-1.5">
          {loading
            ? DAY_LABELS.map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <Skeleton className="w-8 h-8 rounded-full" />
                  <Skeleton className="w-5 h-2.5" />
                </div>
              ))
            : weekDays.length > 0
            ? weekDays.map((day, i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-semibold border"
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
                    className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] border"
                    style={{ borderColor: 'var(--border)', color: 'var(--text-subtle)' }}
                  >
                    {d.slice(0, 1)}
                  </div>
                  <span className="text-[9px]" style={{ color: 'var(--text-subtle)' }}>{d}</span>
                </div>
              ))}
        </div>

        <div
          className="flex items-center justify-between text-xs border-t pt-3"
          style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}
        >
          <span className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5" style={{ color: 'var(--info)' }} />
            Streak Freeze
          </span>
          <span style={{ color: 'var(--text)' }}>{streakFreezes} tersimpan</span>
        </div>
      </Card>
    </div>
  );
};
