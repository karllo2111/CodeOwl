import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { practiceApi, type PracticeKind, type PracticeActivity } from '../../api/practice';
import { PageHeader } from '../../components/ui/PageHeader';
import { Section } from '../../components/ui/Section';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { DifficultyLabel } from '../../components/ui/DifficultyLabel';
import { Spinner } from '../../components/ui/Spinner';
import { EmptyState } from '../../components/ui/EmptyState';
import { ArrowRight, Dumbbell, BookOpen, Bug, Zap, Code2, Layers } from 'lucide-react';

const KIND_ICONS: Record<string, React.ReactNode> = {
  challenge: <Zap className="w-5 h-5" />,
  debugging: <Bug className="w-5 h-5" />,
  review: <BookOpen className="w-5 h-5" />,
  project: <Layers className="w-5 h-5" />,
  sandbox: <Code2 className="w-5 h-5" />,
};

const KIND_COLOR_VARS: Record<string, string> = {
  challenge: 'var(--accent)',
  debugging: 'var(--danger)',
  review: 'var(--info)',
  project: 'var(--success)',
  sandbox: 'var(--warning)',
};

export const PracticeHub: React.FC = () => {
  const [kinds, setKinds] = useState<PracticeKind[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [activities, setActivities] = useState<PracticeActivity[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingActivities, setLoadingActivities] = useState(false);

  useEffect(() => {
    practiceApi.getKinds()
      .then((data) => {
        setKinds(data);
        setLoading(false);
        if (data.length > 0) {
          setSelected(data[0].slug);
        }
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selected) return;
    setLoadingActivities(true);
    practiceApi.getByKind(selected)
      .then((res) => {
        setActivities(res.activities);
        setTotal(res.total);
      })
      .catch(() => {
        setActivities([]);
        setTotal(0);
      })
      .finally(() => setLoadingActivities(false));
  }, [selected]);

  const selectedKind = kinds.find((k) => k.slug === selected);

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-8">
      <PageHeader
        title="Pusat Latihan"
        description="Pilih jenis latihan dan asah kemampuan kamu dengan soal-soal nyata."
      />

      {loading ? (
        <div className="flex justify-center py-16"><Spinner size="lg" /></div>
      ) : kinds.length === 0 ? (
        <EmptyState
          icon={<Dumbbell className="w-8 h-8" />}
          title="Belum ada jenis latihan"
          description="Jenis latihan belum tersedia. Coba lagi nanti."
        />
      ) : (
        <>
          {/* Kind selector cards */}
          <Section title="Pilih Jenis Latihan">

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {kinds.map((kind) => {
                const isActive = kind.slug === selected;
                const color = KIND_COLOR_VARS[kind.slug] || 'var(--accent)';
                const icon = KIND_ICONS[kind.slug] || <Dumbbell className="w-5 h-5" />;
                return (
                  <button
                    key={kind.id}
                    onClick={() => setSelected(kind.slug)}
                    className="text-left rounded-[var(--radius-card)] border p-4 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
                    style={{
                      background: isActive ? 'var(--surface-raised)' : 'var(--surface)',
                      borderColor: isActive ? color : 'var(--border)',
                      color: isActive ? color : 'var(--text-muted)',
                    }}
                    aria-pressed={isActive}
                  >
                    <div style={{ color }}>{icon}</div>
                    <div
                      className="mt-2 text-sm font-semibold leading-tight"
                      style={{ color: isActive ? 'var(--text)' : 'var(--text-muted)' }}
                    >
                      {kind.label}
                    </div>
                    {kind.description && (
                      <div className="mt-0.5 text-[11px] line-clamp-2" style={{ color: 'var(--text-subtle)' }}>
                        {kind.description}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </Section>

          {/* Activity list */}
          <Section
            title={selectedKind?.label ?? 'Latihan'}
            description={`${total} soal tersedia`}
          >
            {loadingActivities ? (
              <div className="flex justify-center py-12"><Spinner size="md" /></div>
            ) : activities.length === 0 ? (
              <EmptyState
                icon={<Dumbbell className="w-6 h-6" />}
                title="Belum ada soal"
                description="Soal untuk kategori ini belum tersedia."
              />
            ) : (
              <div className="space-y-2">
                {activities.map((act) => (
                  <Link
                    key={act.id}
                    to={`/lessons/${act.id}`}
                    className="flex items-center gap-4 rounded-[var(--radius-control)] border px-4 py-3 transition-colors hover:bg-[var(--surface-raised)] group"
                    style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}
                  >
                    <div className="flex-1 min-w-0">
                      <div
                        className="text-sm font-medium truncate"
                        style={{ color: 'var(--text)' }}
                      >
                        {act.title}
                      </div>
                      {act.course && (
                        <div className="text-[11px] mt-0.5" style={{ color: 'var(--text-subtle)' }}>
                          {act.course.title}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {act.difficulty_level && (
                        <DifficultyLabel difficulty={act.difficulty_level ?? 'easy'} />
                      )}
                      <Badge variant="xp" size="sm">+{act.xp_reward} XP</Badge>
                    </div>
                    <ArrowRight
                      className="w-4 h-4 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ color: 'var(--text-muted)' }}
                    />
                  </Link>
                ))}
              </div>
            )}
          </Section>
        </>
      )}
    </div>
  );
};
