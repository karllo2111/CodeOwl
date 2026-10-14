import React, { useEffect, useState } from 'react';
import { achievementsApi } from '../../api/achievements';
import type { Achievement } from '../../types/gamification';
import { AchievementCard } from '../../components/gamification/AchievementCard';
import { PageHeader } from '../../components/ui/PageHeader';
import { Skeleton } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { Trophy } from 'lucide-react';

export const AchievementsPage: React.FC = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    achievementsApi
      .getAllAchievements()
      .then(setAchievements)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-8">
      <PageHeader
        title="Pencapaian"
        description="Raih trofi saat kamu menyelesaikan bab, menjaga streak, dan memecahkan tantangan."
      />

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-[var(--radius-card)]" />
          ))}
        </div>
      ) : achievements.length === 0 ? (
        <EmptyState
          icon={<Trophy className="w-7 h-7" />}
          title="Belum ada pencapaian"
          description="Selesaikan pelajaran dan pertahankan streakmu untuk mendapatkan trofi."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((a) => (
            <AchievementCard key={a.id} achievement={a} />
          ))}
        </div>
      )}
    </div>
  );
};
