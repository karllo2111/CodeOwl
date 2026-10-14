import React, { useEffect, useState } from 'react';
import { achievementsApi } from '../api/achievements';
import type { LeaderboardEntry } from '../types/gamification';
import { PageHeader } from '../components/ui/PageHeader';
import { SegmentedControl } from '../components/ui/SegmentedControl';
import { Skeleton } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { Trophy } from 'lucide-react';

type Period = 'weekly' | 'challenges' | 'streak';

const PERIOD_OPTIONS = [
  { value: 'weekly', label: 'XP Mingguan' },
  { value: 'challenges', label: 'Tantangan' },
  { value: 'streak', label: 'Streak' },
];

function metricValue(entry: LeaderboardEntry, period: Period): string {
  if (period === 'weekly') return `${entry.xp_earned} XP`;
  if (period === 'challenges') return `${entry.challenges_completed}`;
  return `${entry.streak_days} hari`;
}

function metricLabel(period: Period): string {
  if (period === 'weekly') return 'XP';
  if (period === 'challenges') return 'Selesai';
  return 'Streak';
}

const RANK_STYLES: Record<number, { bg: string; border: string; color: string }> = {
  1: { bg: 'color-mix(in srgb, var(--warning) 15%, transparent)', border: 'var(--warning)', color: 'var(--warning)' },
  2: { bg: 'color-mix(in srgb, var(--text-muted) 10%, transparent)', border: 'var(--border)', color: 'var(--text-muted)' },
  3: { bg: 'color-mix(in srgb, var(--warning) 8%, transparent)', border: 'var(--border)', color: 'var(--text-muted)' },
};

export const LeaderboardPage: React.FC = () => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<Period>('weekly');

  useEffect(() => {
    setLoading(true);
    achievementsApi
      .getLeaderboard(period)
      .then((data) => setEntries(Array.isArray(data) ? data : []))
      .catch(() => setEntries([]))
      .finally(() => setLoading(false));
  }, [period]);

  return (
    <div className="p-6 md:p-8 max-w-3xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <PageHeader title="Papan Peringkat" description="Peringkat berdasarkan XP, tantangan, dan konsistensi streak." />
        <SegmentedControl
          options={PERIOD_OPTIONS}
          value={period}
          onChange={(v) => setPeriod(v as Period)}
        />
      </div>

      {loading ? (
        <div className="space-y-2">
          {[...Array(10)].map((_, i) => (
            <Skeleton key={i} className="h-14 rounded-[var(--radius-control)]" />
          ))}
        </div>
      ) : entries.length === 0 ? (
        <EmptyState
          icon={<Trophy className="w-7 h-7" />}
          title="Belum ada data"
          description="Papan peringkat akan terisi setelah ada pengguna yang aktif."
        />
      ) : (
        <div
          className="rounded-[var(--radius-card)] border overflow-hidden"
          style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}
        >
          <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
            {entries.map((entry) => {
              const style = RANK_STYLES[entry.rank] ?? {};
              return (
                <div
                  key={entry.rank}
                  className="flex items-center gap-4 px-4 py-3 sm:px-5 transition-colors"
                  style={{ borderColor: 'var(--border)' }}
                >
                  {/* Rank badge */}
                  <div
                    className="w-9 h-9 shrink-0 rounded-lg flex items-center justify-center text-xs font-bold border"
                    style={{
                      background: style.bg ?? 'var(--surface-raised)',
                      borderColor: style.border ?? 'var(--border)',
                      color: style.color ?? 'var(--text-muted)',
                    }}
                  >
                    #{entry.rank}
                  </div>

                  {/* Name */}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate" style={{ color: 'var(--text)' }}>
                      {entry.user.name}
                    </div>
                    <div className="text-[11px]" style={{ color: 'var(--text-subtle)' }}>
                      Level {entry.user.current_level}
                    </div>
                  </div>

                  {/* Metric */}
                  <div className="text-right shrink-0">
                    <div className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
                      {metricValue(entry, period)}
                    </div>
                    <div className="text-[10px]" style={{ color: 'var(--text-subtle)' }}>
                      {metricLabel(period)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
