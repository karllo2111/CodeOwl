import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { practiceApi, type PracticeKind, type PracticeActivity } from '../../api/practice';
import { PageHeader } from '../../components/ui/PageHeader';
import { Section } from '../../components/ui/Section';
import { Difficulty } from '../../components/ui/Difficulty';
import { Spinner } from '../../components/ui/Spinner';
import { EmptyState } from '../../components/ui/EmptyState';
import { ArrowRight, Dumbbell, Bug, Zap, Code2, Layers, CheckCircle2 } from 'lucide-react';
import { ROUTES, linkTo } from '../../routes';

const KIND_ICONS: Record<string, React.ReactNode> = {
  challenge: <Zap className="w-5 h-5" />,
  debug: <Bug className="w-5 h-5" />,
  debugging: <Bug className="w-5 h-5" />,
  practice: <Code2 className="w-5 h-5" />,
  fix: <Code2 className="w-5 h-5" />,
  project: <Layers className="w-5 h-5" />,
};

const KIND_COLORS: Record<string, string> = {
  challenge: 'var(--accent)',
  debug: 'var(--danger)',
  debugging: 'var(--danger)',
  practice: 'var(--accent)',
  fix: 'var(--warning)',
  project: 'var(--success)',
};

const ROUTE_TO_KIND: Record<string, string> = {
  [ROUTES.PRACTICE_QUESTIONS]: 'practice',
  [ROUTES.PRACTICE_DEBUG]: 'debug',
  [ROUTES.PRACTICE_FIX]: 'fix',
  [ROUTES.PRACTICE_CHALLENGES]: 'challenge',
  [ROUTES.PRACTICE_PROJECTS]: 'project',
};

const KIND_TO_ROUTE: Record<string, string> = {
  practice: ROUTES.PRACTICE_QUESTIONS,
  debug: ROUTES.PRACTICE_DEBUG,
  fix: ROUTES.PRACTICE_FIX,
  challenge: ROUTES.PRACTICE_CHALLENGES,
  project: ROUTES.PRACTICE_PROJECTS,
};

export const PracticeHub: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [kinds, setKinds] = useState<PracticeKind[]>([]);
  const [selectedKind, setSelectedKind] = useState<string>('practice');
  const [activities, setActivities] = useState<PracticeActivity[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingActivities, setLoadingActivities] = useState(false);

  // Filters
  const [difficultyFilter, setDifficultyFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');

  // 1. Determine active kind from current pathname or fallback
  useEffect(() => {
    const matchedKind = ROUTE_TO_KIND[location.pathname];
    if (matchedKind) {
      setSelectedKind(matchedKind);
    }
  }, [location.pathname]);

  // 2. Fetch available practice kinds
  useEffect(() => {
    practiceApi
      .getKinds()
      .then((data) => {
        setKinds(data);
        setLoading(false);
        // If current path is root /latihan and no kind explicitly matched, use first
        if (!ROUTE_TO_KIND[location.pathname] && data.length > 0) {
          setSelectedKind(data[0].kind);
        }
      })
      .catch(() => setLoading(false));
  }, []);

  // 3. Fetch activities when selectedKind or filters change
  useEffect(() => {
    if (!selectedKind) return;
    setLoadingActivities(true);

    const params: { difficulty?: string; status?: string } = {};
    if (difficultyFilter) params.difficulty = difficultyFilter;
    if (statusFilter) params.status = statusFilter;

    practiceApi
      .getByKind(selectedKind, params)
      .then((res) => {
        setActivities(res.data || []);
        setTotal(res.total || 0);
      })
      .catch(() => {
        setActivities([]);
        setTotal(0);
      })
      .finally(() => setLoadingActivities(false));
  }, [selectedKind, difficultyFilter, statusFilter]);

  const handleSelectKind = (kindSlug: string) => {
    setSelectedKind(kindSlug);
    const targetRoute = KIND_TO_ROUTE[kindSlug] || ROUTES.PRACTICE;
    if (location.pathname !== targetRoute) {
      navigate(targetRoute);
    }
  };

  const currentKindInfo = kinds.find((k) => k.kind === selectedKind);

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-8">
      <PageHeader
        title="Pusat Latihan Mandiri"
        description="Asah keterampilan pemrograman secara praktis melalui ragam jenis latihan terstruktur."
      />

      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner size="lg" />
        </div>
      ) : kinds.length === 0 ? (
        <EmptyState
          icon={<Dumbbell className="w-8 h-8" />}
          title="Belum ada jenis latihan"
          description="Jenis latihan belum tersedia di kurikulum ini."
        />
      ) : (
        <>
          {/* Kind Selector Cards */}
          <Section title="Kategori Latihan">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {kinds.map((k) => {
                const isActive = k.kind === selectedKind;
                const icon = KIND_ICONS[k.kind] || <Dumbbell className="w-5 h-5" />;
                const color = KIND_COLORS[k.kind] || 'var(--accent)';

                return (
                  <button
                    key={k.id}
                    type="button"
                    onClick={() => handleSelectKind(k.kind)}
                    className={`text-left rounded-[var(--radius-card)] border p-4 transition-colors focus:outline-none cursor-pointer ${
                      isActive
                        ? 'bg-[var(--surface-2)] border-[var(--border-strong)]'
                        : 'bg-[var(--surface)] border-[var(--border)] hover:border-[var(--border-strong)]'
                    }`}
                    aria-pressed={isActive}
                  >
                    <div style={{ color }}>{icon}</div>
                    <div className="mt-2.5 text-xs font-semibold text-[var(--text)] leading-tight">
                      {k.label}
                    </div>
                    <div className="mt-1 text-[11px] text-[var(--text-muted)] num">
                      {k.total_available} materi tersedia
                    </div>
                  </button>
                );
              })}
            </div>
          </Section>

          {/* Activity List Section */}
          <Section
            title={currentKindInfo?.label ?? 'Daftar Latihan'}
            description={
              currentKindInfo?.description ??
              `${total} soal latihan tersedia untuk kamu kerjakan.`
            }
          >
            {/* Filter controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[var(--border)]">
              <span className="text-xs text-[var(--text-muted)] num">
                Menampilkan {activities.length} dari {total} soal
              </span>

              <div className="flex items-center gap-2">
                {/* Difficulty Filter */}
                <select
                  value={difficultyFilter}
                  onChange={(e) => setDifficultyFilter(e.target.value)}
                  className="text-xs rounded-[var(--radius-control)] border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] px-2.5 py-1.5 focus:outline-none"
                  aria-label="Filter tingkat kesulitan"
                >
                  <option value="">Semua Kesulitan</option>
                  <option value="easy">Mudah</option>
                  <option value="normal">Sedang</option>
                  <option value="hard">Sulit</option>
                </select>

                {/* Status Filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="text-xs rounded-[var(--radius-control)] border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] px-2.5 py-1.5 focus:outline-none"
                  aria-label="Filter status pengerjaan"
                >
                  <option value="">Semua Status</option>
                  <option value="unsolved">Belum Selesai</option>
                  <option value="solved">Sudah Selesai</option>
                </select>
              </div>
            </div>

            {loadingActivities ? (
              <div className="flex justify-center py-12">
                <Spinner size="md" />
              </div>
            ) : activities.length === 0 ? (
              <EmptyState
                icon={<Dumbbell className="w-6 h-6" />}
                title="Tidak ada soal ditemukan"
                description="Coba ubah filter atau pilih kategori latihan lainnya."
              />
            ) : (
              <div className="space-y-2 mt-4">
                {activities.map((act) => {
                  const isSolved = act.status === 'solved';

                  return (
                    <Link
                      key={act.id}
                      to={linkTo.lesson(act.lesson_id)}
                      className="flex items-center gap-4 rounded-[var(--radius-control)] border border-[var(--border)] bg-[var(--surface)] px-4 py-3 transition-colors hover:border-[var(--border-strong)] hover:bg-[var(--surface-2)] group"
                    >
                      <div className="shrink-0">
                        {isSolved ? (
                          <CheckCircle2 className="w-4 h-4 text-[var(--success)]" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border border-[var(--border-strong)]" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-[var(--text)] truncate">
                          {act.title}
                        </div>
                        <div className="text-[11px] text-[var(--text-muted)] mt-0.5 truncate">
                          {act.chapter_title} · {act.language}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <Difficulty level={act.difficulty} />
                        <span className="text-xs font-semibold text-[var(--accent)] num">
                          +{act.xp_reward} XP
                        </span>
                        <ArrowRight className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--text)] transition-colors" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </Section>
        </>
      )}
    </div>
  );
};
